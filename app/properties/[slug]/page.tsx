import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getPropertyBySlug, getRelatedProperties } from '@/lib/queries/properties';
import { createClient } from '@/lib/supabase/server';
import { ImageGallery } from './components/ImageGallery';
import { PropertyHeader } from './components/PropertyHeader';
import { PropertyPrice } from './components/PropertyPrice';
import { QuickStats } from './components/QuickStats';
import { PropertyDescription } from './components/PropertyDescription';
import { PropertyFacts } from './components/PropertyFacts';
import { NearbyAttractions } from './components/NearbyAttractions';
import { PropertyDocuments } from './components/PropertyDocuments';
import { PropertyMap } from './components/PropertyMap';
import { ContactPanel } from './components/ContactPanel';
import { RelatedProperties } from './components/RelatedProperties';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return { title: 'Property Not Found' };
  }

  const description = `${property.title} - ${String(property.description ?? '').substring(0, 150)}...`;

  // attempt to resolve a cover image URL
  let ogImage: string | undefined = undefined
  try {
    const supabase = (await createClient()) as any
    const imgs = property.property_images || []
    const cover = imgs.find((i: any) => i.is_cover) || imgs[0]
    if (cover) {
      const { data } = await supabase.storage.from('property-images').getPublicUrl(cover.storage_path)
      ogImage = data?.publicUrl
    }
  } catch {}

  return {
    title: property.title,
    description,
    openGraph: {
      title: `${property.title} | Key Motion Real Estate`,
      description,
      images: ogImage ? [ogImage] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${property.title} | Key Motion Real Estate`,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: {params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  // increment views via RPC (non-blocking)
  try {
    const supabase = (await createClient()) as any
    await supabase.rpc('increment_property_views', { p_slug: slug })
  } catch {}

  // map server property to client Property shape expected by components
  const supabase = (await createClient()) as any
  const p: any = property

  // resolve images to public urls
  const images = [] as any[]
  for (const img of p.property_images || []) {
    let url: string | null = null
    try {
      const { data } = await supabase.storage.from('property-images').getPublicUrl(img.storage_path)
      url = data?.publicUrl ?? null
    } catch {
      url = null
    }
    images.push({ id: img.id, url: url ?? '', alt: img.alt_text ?? '', isCover: img.is_cover })
  }

  // facts
  const facts = (p.property_facts || []).map((f: any) => ({ id: f.id, icon: f.icon ?? '', label: f.label, value: f.value }))

  // attractions
  const attractions = (p.nearby_attractions || []).map((a: any) => ({ id: a.id, name: a.name, category: a.category, distance: a.distance_km ? `${a.distance_km} km` : '' }))

  // documents (getPropertyBySlug already attached signed urls when possible)
  const documents = (p.property_documents || []).map((d: any) => ({ id: d.id, name: d.label, url: d.url ?? d.storage_path, isPublic: d.is_public }))

  const clientProperty: any = {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description ?? '',
    propertyType: p.property_type,
    listingType: p.listing_type,
    status: p.status,
    featured: p.featured,
    price: p.price_lkr,
    pricePeriod: p.price_period ?? undefined,
    landArea: p.land_area_perches ?? undefined,
    landAreaUnit: 'perches',
    floorArea: p.floor_area_sqft ?? undefined,
    bedrooms: p.bedrooms ?? undefined,
    bathrooms: p.bathrooms ?? undefined,
    district: p.district,
    city: p.city,
    address: p.address ?? undefined,
    latitude: p.latitude ?? undefined,
    longitude: p.longitude ?? undefined,
    images,
    documents,
    facts,
    nearbyAttractions: attractions,
    views: p.views_count ?? 0,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }

  // related
  const relatedCards = await getRelatedProperties(property.id, property.district, property.property_type)
  // map related cards to client properties (minimal)
  const relatedProperties = relatedCards.map((c: any) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: '',
    propertyType: c.property_type,
    listingType: c.listing_type,
    status: c.status,
    featured: c.featured ?? false,
    price: c.price_lkr,
    pricePeriod: c.price_period ?? undefined,
    landArea: c.land_area_perches ?? undefined,
    landAreaUnit: 'perches',
    floorArea: undefined,
    bedrooms: c.bedrooms ?? undefined,
    bathrooms: c.bathrooms ?? undefined,
    district: c.district,
    city: c.city,
    address: undefined,
    latitude: undefined,
    longitude: undefined,
    images: c.cover_image ? [{ id: `${c.id}-cover`, url: c.cover_image, alt: c.cover_alt ?? '', isCover: true }] : [],
    documents: [],
    facts: [],
    nearbyAttractions: [],
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: clientProperty.title,
    description: clientProperty.description,
    url: `https://keymotionrealestate.com/properties/${clientProperty.slug}`,
  image: clientProperty.images.map((img: any) => img.url),
    offers: {
      '@type': 'Offer',
      price: clientProperty.price,
      priceCurrency: 'LKR',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: clientProperty.city,
      addressRegion: clientProperty.district,
      addressCountry: 'Sri Lanka',
    },
    geo: clientProperty.latitude && clientProperty.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: clientProperty.latitude,
      longitude: clientProperty.longitude,
    } : undefined,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Image Gallery */}
        <ImageGallery images={clientProperty.images} title={clientProperty.title} />

        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <PropertyHeader property={clientProperty} />
              <PropertyPrice property={clientProperty} />
              <QuickStats property={clientProperty} />
              <PropertyDescription description={clientProperty.description} />
              <PropertyFacts facts={clientProperty.facts} />
              <NearbyAttractions attractions={clientProperty.nearbyAttractions} />
              <PropertyDocuments documents={clientProperty.documents} />
              <PropertyMap 
                latitude={clientProperty.latitude} 
                longitude={clientProperty.longitude} 
                title={clientProperty.title}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ContactPanel property={clientProperty} />
            </div>
          </div>

          {/* Related Properties */}
          {relatedProperties.length > 0 && (
            <RelatedProperties properties={relatedProperties as any} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

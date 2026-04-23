"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/PropertyCard';
import type { PropertyCard as TCard } from '../../types/property'
import type { Property as ClientProperty } from '@/lib/types'

interface FeaturedListingsProps {
  featuredProperties: TCard[];
  exchangeRates?: { usd_rate: number; eur_rate: number } | null;
}

function mapCardToClientProperty(card: TCard): ClientProperty {
  return {
    id: card.id,
    slug: card.slug,
    title: card.title,
    description: '',
    propertyType: card.property_type,
    listingType: card.listing_type,
    status: card.status as any,
    featured: false,
    price: card.price_lkr,
    pricePeriod: card.price_period ?? undefined,
    landArea: card.land_area_perches ?? undefined,
    landAreaUnit: 'perches',
    floorArea: undefined,
    bedrooms: card.bedrooms ?? undefined,
    bathrooms: card.bathrooms ?? undefined,
    district: card.district,
    city: card.city,
    address: undefined,
    latitude: undefined,
    longitude: undefined,
    images: card.cover_image ? [{ id: `${card.id}-cover`, url: card.cover_image, alt: card.cover_alt ?? '', isCover: true }] : [],
    documents: [],
    facts: [],
    nearbyAttractions: [],
  views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function FeaturedListings({ featuredProperties = [], exchangeRates }: FeaturedListingsProps) {
  const list = featuredProperties || [];

  return (
    <section className="bg-secondary/30 py-16">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Featured Properties
            </h2>
            <p className="mt-2 text-muted-foreground">
              Hand-picked properties for you
            </p>
          </div>
          <Link href="/properties">
            <Button variant="outline">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={mapCardToClientProperty(property)} />
          ))}
        </div>
      </div>
    </section>
  );
}

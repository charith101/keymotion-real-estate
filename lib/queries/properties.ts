import { createClient } from '../supabase/server'
import type {
  PropertyCard,
  PropertyDetail,
  PropertyFilters,
  PropertyImage as TPropertyImage,
  PropertyFact as TPropertyFact,
  NearbyAttraction as TNearbyAttraction,
  PropertyDocument as TPropertyDocument,
  Lawyer as TLawyer,
} from '../../types/property'

const PER_PAGE = 12

/** Resolve cover images for a list of property rows into PropertyCard[] */
export async function resolvePropertyCards(rows: any[]): Promise<PropertyCard[]> {
  if (!rows || rows.length === 0) return []

  try {
  const supabase = (await createClient()) as any

    const ids = rows.map((r) => r.id)

    const { data: imagesData, error: imagesError } = await supabase
      .from('property_images')
      .select('property_id,storage_path,alt_text,is_cover,display_order')
      .in('property_id', ids)
      .order('is_cover', { ascending: false })
      .order('display_order', { ascending: true })

    if (imagesError) {
      // proceed without images
      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        property_type: r.property_type,
        listing_type: r.listing_type,
        status: r.status,
        price_lkr: r.price_lkr,
        price_period: r.price_period,
        land_area_perches: r.land_area_perches ?? null,
        bedrooms: r.bedrooms ?? null,
        bathrooms: r.bathrooms ?? null,
        district: r.district,
        city: r.city,
        cover_image: null,
        cover_alt: null,
      }))
    }

    const coverByProperty: Record<string, { storage_path: string; alt_text: string | null } | null> = {}

    // pick first image per property (is_cover prioritized by ordering)
    for (const img of imagesData || []) {
      if (!coverByProperty[img.property_id]) {
        coverByProperty[img.property_id] = {
          storage_path: img.storage_path,
          alt_text: img.alt_text ?? null,
        }
      }
    }

    // build public urls
    const result: PropertyCard[] = []

    for (const r of rows) {
      const cover = coverByProperty[r.id]
      let publicUrl: string | null = null

      if (cover && cover.storage_path) {
        try {
          const { data } = await supabase.storage.from('property-images').getPublicUrl(cover.storage_path)
          publicUrl = data?.publicUrl ?? null
        } catch {
          publicUrl = null
        }
      }

      result.push({
        id: r.id,
        slug: r.slug,
        title: r.title,
        property_type: r.property_type,
        listing_type: r.listing_type,
        status: r.status,
        price_lkr: r.price_lkr,
        price_period: r.price_period,
        land_area_perches: r.land_area_perches ?? null,
        bedrooms: r.bedrooms ?? null,
        bathrooms: r.bathrooms ?? null,
        district: r.district,
        city: r.city,
        cover_image: publicUrl,
        cover_alt: cover?.alt_text ?? null,
      })
    }

    return result
  } catch (err) {
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      property_type: r.property_type,
      listing_type: r.listing_type,
      status: r.status,
      price_lkr: r.price_lkr,
      price_period: r.price_period,
      land_area_perches: r.land_area_perches ?? null,
      bedrooms: r.bedrooms ?? null,
      bathrooms: r.bathrooms ?? null,
      district: r.district,
      city: r.city,
      cover_image: null,
      cover_alt: null,
    }))
  }
}

export async function getProperties(filters: PropertyFilters): Promise<{ properties: PropertyCard[]; count: number }> {
  try {
  const supabase = (await createClient()) as any

    const page = Number(filters.page ?? '1') || 1
    const from = (page - 1) * PER_PAGE
    const to = page * PER_PAGE - 1

    let query = supabase
      .from('properties')
      .select(
        `id,slug,title,property_type,listing_type,status,price_lkr,price_period,land_area_perches,bedrooms,bathrooms,district,city,featured,views_count`,
        { count: 'exact' }
      )
      .eq('status', 'active')
      .is('deleted_at', null)

    if (filters.search) {
      // websearch handles user-friendly queries
      query = query.textSearch('search_vector', filters.search, { type: 'websearch' })
    }

    // Support comma-separated property types (e.g. "house,land,apartment")
    if (filters.type) {
      const types = filters.type.split(',').map(t => t.trim()).filter(Boolean)
      if (types.length === 1) {
        query = query.eq('property_type', types[0])
      } else if (types.length > 1) {
        query = query.in('property_type', types)
      }
    }

    if (filters.listing) query = query.eq('listing_type', filters.listing)
    if (filters.district) query = query.eq('district', filters.district)

    if (filters.min_price) query = query.gte('price_lkr', Number(filters.min_price))
    if (filters.max_price) query = query.lte('price_lkr', Number(filters.max_price))

    if (filters.min_area) query = query.gte('land_area_perches', Number(filters.min_area))
    if (filters.max_area) query = query.lte('land_area_perches', Number(filters.max_area))

    // beds = minimum bedroom count (X+)
    if (filters.beds) query = query.gte('bedrooms', Number(filters.beds))

    // sorting
    switch (filters.sort) {
      case 'price_asc':
        query = query.order('price_lkr', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price_lkr', { ascending: false })
        break
      case 'most_viewed':
        query = query.order('views_count', { ascending: false })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    const { data, error, count } = await query.range(from, to)

    if (error) return { properties: [], count: 0 }

    const properties = await resolvePropertyCards(data || [])

    return { properties, count: count ?? 0 }
  } catch (err) {
    return { properties: [], count: 0 }
  }
}

export async function getPropertyBySlug(slug: string): Promise<PropertyDetail | null> {
  try {
  const supabase = (await createClient()) as any

    const { data: propData, error: propError } = await supabase
      .from('properties')
      .select(
        `id,slug,title,description,property_type,listing_type,status,price_lkr,price_period,land_area_perches,land_area_acres,floor_area_sqft,bedrooms,bathrooms,district,city,address,latitude,longitude,featured,views_count,lawyer_id,link,created_at,updated_at`
      )
      .eq('slug', slug)
      .eq('status', 'active')
      .is('deleted_at', null)
      .limit(1)

    if (propError || !propData || (Array.isArray(propData) && propData.length === 0)) return null

    const property = Array.isArray(propData) ? propData[0] : propData

    // images
    const { data: images, error: imagesError } = await supabase
      .from('property_images')
      .select('id,property_id,storage_path,alt_text,is_cover,display_order,blur_data_url')
      .eq('property_id', property.id)
      .order('display_order', { ascending: true })

    // facts
    const { data: facts, error: factsError } = await supabase
      .from('property_facts')
      .select('id,property_id,label,value,icon,display_order')
      .eq('property_id', property.id)
      .order('display_order', { ascending: true })

    // attractions
    const { data: attractions, error: attractionsError } = await supabase
      .from('nearby_attractions')
      .select('id,property_id,name,category,distance_km,display_order')
      .eq('property_id', property.id)
      .order('display_order', { ascending: true })

    // documents
    const { data: documents, error: documentsError } = await supabase
      .from('property_documents')
      .select('id,property_id,storage_path,label,is_public')
      .eq('property_id', property.id)

    // lawyer
    let lawyer: TLawyer | null = null
    if (property.lawyer_id) {
      const { data: lawyerData } = await supabase
        .from('lawyers')
        .select('id,full_name,firm_name,phone,email,address,notes,active')
        .eq('id', property.lawyer_id)
        .limit(1)

      lawyer = Array.isArray(lawyerData) ? lawyerData[0] ?? null : lawyerData ?? null
    }

    // determine if user is authenticated
    const { data: userData } = await supabase.auth.getUser()
    const isAuthed = !!userData?.user

    // build documents with signed urls when appropriate
    const docsWithUrls: Array<TPropertyDocument & { url?: string | null }> = []
    for (const doc of documents || []) {
      let url: string | null = null
      try {
        if (doc.is_public) {
          // create signed url even for public docs (bucket may be private)
          const { data } = await supabase.storage.from('property-docs').createSignedUrl(doc.storage_path, 3600)
          url = data?.signedUrl ?? null
        } else if (isAuthed) {
          const { data } = await supabase.storage.from('property-docs').createSignedUrl(doc.storage_path, 3600)
          url = data?.signedUrl ?? null
        } else {
          url = null
        }
      } catch {
        url = null
      }

      docsWithUrls.push({ ...doc, url })
    }

    const detail: PropertyDetail = {
      id: property.id,
      slug: property.slug,
      title: property.title,
      description: property.description ?? null,
      property_type: property.property_type,
      listing_type: property.listing_type,
      status: property.status,
      price_lkr: property.price_lkr,
      price_period: property.price_period,
      land_area_perches: property.land_area_perches,
      land_area_acres: property.land_area_acres,
      floor_area_sqft: property.floor_area_sqft,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      district: property.district,
      city: property.city,
      featured: property.featured,
      views_count: property.views_count,
      lawyer_id: property.lawyer_id,
      link: property.link ?? null,
      created_at: property.created_at,
      updated_at: property.updated_at,
      property_images: (imagesError || !images) ? [] : (images as TPropertyImage[]),
      property_facts: (factsError || !facts) ? [] : (facts as TPropertyFact[]),
      nearby_attractions: (attractionsError || !attractions) ? [] : (attractions as TNearbyAttraction[]),
      property_documents: docsWithUrls,
      lawyers: lawyer,
    }

    return detail
  } catch (err) {
    return null
  }
}

export async function getFeaturedProperties(): Promise<PropertyCard[]> {
  try {
  const supabase = (await createClient()) as any

    const { data, error } = await supabase
      .from('properties')
      .select('id,slug,title,property_type,listing_type,status,price_lkr,price_period,land_area_perches,bedrooms,bathrooms,district,city,featured,views_count')
      .eq('featured', true)
      .eq('status', 'active')
      .is('deleted_at', null)
      .limit(6)

    if (error || !data) return []

    return await resolvePropertyCards(data)
  } catch (err) {
    return []
  }
}

export async function getRelatedProperties(propertyId: string, district?: string, propertyType?: string): Promise<PropertyCard[]> {
  try {
  const supabase = (await createClient()) as any

    const related: any[] = []

    if (district) {
      const { data } = await supabase
        .from('properties')
        .select('id,slug,title,property_type,listing_type,status,price_lkr,price_period,land_area_perches,bedrooms,bathrooms,district,city,featured,views_count')
        .eq('district', district)
        .neq('id', propertyId)
        .eq('status', 'active')
        .is('deleted_at', null)
        .limit(4)

      if (data && data.length > 0) related.push(...data)
    }

    if (related.length < 4 && propertyType) {
      const excludeIds = [propertyId, ...related.map((r) => r.id)]
      const { data } = await supabase
        .from('properties')
        .select('id,slug,title,property_type,listing_type,status,price_lkr,price_period,land_area_perches,bedrooms,bathrooms,district,city,featured,views_count')
        .eq('property_type', propertyType)
        .not('id', 'in', `(${excludeIds.map((i) => `'${i}'`).join(',')})`)
        .eq('status', 'active')
        .is('deleted_at', null)
        .limit(4 - related.length)

      if (data && data.length > 0) related.push(...data)
    }

    // trim to 4
    const unique = related.slice(0, 4)

    return await resolvePropertyCards(unique)
  } catch (err) {
    return []
  }
}

export default {
  getProperties,
  getPropertyBySlug,
  getFeaturedProperties,
  getRelatedProperties,
  resolvePropertyCards,
}

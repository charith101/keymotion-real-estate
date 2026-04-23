export interface Property {
  id: string
  slug: string
  title: string
  description: string | null
  property_type: 'land' | 'house' | 'apartment' | 'commercial' | 'agricultural'
  listing_type: 'sale' | 'rent' | 'lease'
  status: 'active' | 'draft' | 'sold' | 'rented'
  price_lkr: number
  price_period: 'monthly' | 'yearly' | null
  land_area_perches: number | null
  land_area_acres: number | null
  floor_area_sqft: number | null
  bedrooms: number | null
  bathrooms: number | null
  district: string
  city: string
  featured: boolean
  views_count: number
  lawyer_id: string | null
  created_at: string
  updated_at: string
}

export interface PropertyImage {
  id: string
  property_id: string
  storage_path: string
  alt_text: string | null
  is_cover: boolean
  display_order: number
  blur_data_url: string | null
}

export interface PropertyDocument {
  id: string
  property_id: string
  storage_path: string
  label: string
  is_public: boolean
}

export interface PropertyFact {
  id: string
  property_id: string
  label: string
  value: string
  icon: string | null
  display_order: number
}

export interface NearbyAttraction {
  id: string
  property_id: string
  name: string
  category: 'beach' | 'supermarket' | 'hospital' | 'school' | 'restaurant' | 'airport' | 'transport' | 'other'
  distance_km: number | null
  display_order: number
}

export interface Lawyer {
  id: string
  full_name: string
  firm_name: string | null
  phone: string | null
  email: string | null
  address: string | null
  notes: string | null
  active: boolean
}

export interface Inquiry {
  id: string
  property_id: string | null
  user_id: string | null
  name: string
  email: string
  phone: string | null
  country: string | null
  message: string | null
  inquiry_type: 'general' | 'site_visit' | 'document_request'
  status: 'new' | 'read' | 'replied'
  admin_notes: string | null
  created_at: string
}

// Full property detail (joined)
export interface PropertyDetail extends Property {
  property_images: PropertyImage[]
  property_facts: PropertyFact[]
  nearby_attractions: NearbyAttraction[]
  property_documents: PropertyDocument[]
  lawyers: Lawyer | null
}

// Card variant (minimal fields for listing grid)
export interface PropertyCard {
  id: string
  slug: string
  title: string
  property_type: Property['property_type']
  listing_type: Property['listing_type']
  status: Property['status']
  price_lkr: number
  price_period: Property['price_period']
  land_area_perches: number | null
  bedrooms: number | null
  bathrooms: number | null
  district: string
  city: string
  cover_image: string | null
  cover_alt: string | null
}

// Filter params from URL search params
export interface PropertyFilters {
  search?: string
  type?: string
  listing?: string
  district?: string
  min_price?: string
  max_price?: string
  min_area?: string
  max_area?: string
  beds?: string
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'most_viewed'
  page?: string
}

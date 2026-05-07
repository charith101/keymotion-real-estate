// Property Types
export type PropertyType = 'land' | 'house' | 'apartment' | 'commercial' | 'agricultural';
export type ListingType = 'sale' | 'rent' | 'lease';
export type PropertyStatus = 'active' | 'draft' | 'sold' | 'rented';
export type PricePeriod = 'monthly' | 'yearly';
export type Currency = 'LKR' | 'USD' | 'EUR';

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isCover: boolean;
}

export interface PropertyDocument {
  id: string;
  name: string;
  url: string;
  isPublic: boolean;
}

export interface PropertyFact {
  id: string;
  icon: string;
  label: string;
  value: string;
}

export interface NearbyAttraction {
  id: string;
  name: string;
  category: string;
  distance: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  featured: boolean;
  price: number;
  pricePeriod?: PricePeriod;
  landArea?: number;
  landAreaUnit?: 'perches' | 'acres';
  floorArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  district: string;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  link?: string;
  lawyers?: {
    id: string;
    full_name: string;
    firm_name: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    active: boolean;
  } | null;
  images: PropertyImage[];
  documents: PropertyDocument[];
  facts: PropertyFact[];
  nearbyAttractions: NearbyAttraction[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

// User & Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  phone?: string;
  createdAt?: string;
}

// Inquiry Types
export type InquiryStatus = 'new' | 'read' | 'replied';
export type InquiryType = 'general' | 'site_visit';

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertySlug: string;
  type: InquiryType;
  name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
  status: InquiryStatus;
  adminNotes?: string;
  createdAt: string;
}

// Filter Types
export interface PropertyFilters {
  search?: string;
  listingType?: ListingType;
  propertyTypes?: PropertyType[];
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  minLandArea?: number;
  maxLandArea?: number;
  bedrooms?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'most_viewed';
}

// Admin Stats
export interface AdminStats {
  activeListings: number;
  soldListings: number;
  rentedListings: number;
  draftListings: number;
  unreadInquiries: number;
}

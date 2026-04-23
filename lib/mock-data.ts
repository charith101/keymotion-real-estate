import type { Property, Inquiry, User, AdminStats } from './types';

// Sri Lanka Districts
export const districts = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Mullaitivu', 'Vavuniya', 'Trincomalee', 'Batticaloa', 'Ampara',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

// Exchange Rates (mock)
export const exchangeRates = {
  LKR: 1,
  USD: 0.0031,
  EUR: 0.0029,
};

// Mock Properties
export const mockProperties: Property[] = [
  {
    id: '1',
    slug: '3-bedroom-house-colombo-7',
    title: '3-Bedroom House for Sale in Colombo 7',
    description: 'Beautiful 3-bedroom house located in the prestigious Colombo 7 area. This property features modern amenities, a spacious garden, and is close to international schools and shopping centers. The house has been recently renovated with high-quality finishes throughout. Perfect for a family looking for a comfortable home in a prime location.',
    propertyType: 'house',
    listingType: 'sale',
    status: 'active',
    featured: true,
    price: 85000000,
    landArea: 15,
    landAreaUnit: 'perches',
    floorArea: 3200,
    bedrooms: 3,
    bathrooms: 2,
    district: 'Colombo',
    city: 'Colombo 7',
    address: '45 Rosmead Place, Colombo 7',
    latitude: 6.9037,
    longitude: 79.8612,
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', alt: 'Front view of the house', isCover: true },
      { id: '2', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', alt: 'Living room', isCover: false },
      { id: '3', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', alt: 'Kitchen', isCover: false },
    ],
    documents: [
      { id: '1', name: 'Survey Plan', url: '/documents/survey-plan.pdf', isPublic: true },
      { id: '2', name: 'Title Deed', url: '/documents/title-deed.pdf', isPublic: false },
    ],
    facts: [
      { id: '1', icon: 'car', label: 'Parking', value: '2 Car Garage' },
      { id: '2', icon: 'trees', label: 'Garden', value: 'Front & Back' },
      { id: '3', icon: 'zap', label: 'Power', value: '3-Phase Electricity' },
      { id: '4', icon: 'droplets', label: 'Water', value: 'Municipal + Well' },
    ],
    nearbyAttractions: [
      { id: '1', name: 'Royal College', category: 'Education', distance: '0.5 km' },
      { id: '2', name: 'Arpico Supermarket', category: 'Shopping', distance: '0.8 km' },
      { id: '3', name: 'National Hospital', category: 'Healthcare', distance: '2 km' },
    ],
    views: 245,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
  },
  {
    id: '2',
    slug: 'beachfront-land-negombo-20-perches',
    title: 'Beachfront Land in Negombo - 20 Perches',
    description: 'Prime beachfront land in Negombo, perfect for a boutique hotel or luxury villa development. Direct beach access with stunning ocean views. All utilities available at the boundary. Clear title with no encumbrances.',
    propertyType: 'land',
    listingType: 'sale',
    status: 'active',
    featured: true,
    price: 45000000,
    landArea: 20,
    landAreaUnit: 'perches',
    district: 'Gampaha',
    city: 'Negombo',
    latitude: 7.2094,
    longitude: 79.8358,
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop', alt: 'Beachfront view', isCover: true },
      { id: '2', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', alt: 'Beach access', isCover: false },
    ],
    documents: [
      { id: '1', name: 'Survey Plan', url: '/documents/survey-plan.pdf', isPublic: true },
    ],
    facts: [
      { id: '1', icon: 'waves', label: 'Beach Access', value: 'Direct' },
      { id: '2', icon: 'route', label: 'Road Type', value: 'Tarmac' },
      { id: '3', icon: 'zap', label: 'Electricity', value: 'At Boundary' },
    ],
    nearbyAttractions: [
      { id: '1', name: 'Negombo Beach', category: 'Beach', distance: '0 km' },
      { id: '2', name: 'Bandaranaike Airport', category: 'Transport', distance: '8 km' },
    ],
    views: 189,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
  },
  {
    id: '3',
    slug: 'luxury-apartment-colombo-3',
    title: 'Luxury Apartment for Rent in Colombo 3',
    description: 'Modern luxury apartment with sea views in Colombo 3. Features include a fully equipped kitchen, swimming pool, gym, and 24/7 security. Walking distance to Galle Face Green and major commercial areas.',
    propertyType: 'apartment',
    listingType: 'rent',
    status: 'active',
    featured: true,
    price: 350000,
    pricePeriod: 'monthly',
    floorArea: 1800,
    bedrooms: 2,
    bathrooms: 2,
    district: 'Colombo',
    city: 'Colombo 3',
    latitude: 6.9271,
    longitude: 79.8428,
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', alt: 'Living room with sea view', isCover: true },
      { id: '2', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', alt: 'Master bedroom', isCover: false },
    ],
    documents: [],
    facts: [
      { id: '1', icon: 'building', label: 'Floor', value: '15th Floor' },
      { id: '2', icon: 'car', label: 'Parking', value: '1 Dedicated Spot' },
      { id: '3', icon: 'shield', label: 'Security', value: '24/7' },
    ],
    nearbyAttractions: [
      { id: '1', name: 'Galle Face Green', category: 'Recreation', distance: '0.3 km' },
      { id: '2', name: 'World Trade Center', category: 'Business', distance: '0.5 km' },
    ],
    views: 312,
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-01-19T16:00:00Z',
  },
  {
    id: '4',
    slug: 'commercial-building-kandy',
    title: 'Commercial Building for Sale in Kandy',
    description: 'Prime commercial building in Kandy city center. 3 floors with ground floor retail space and upper floors suitable for offices. High foot traffic location near the main bus stand.',
    propertyType: 'commercial',
    listingType: 'sale',
    status: 'active',
    featured: false,
    price: 120000000,
    landArea: 8,
    landAreaUnit: 'perches',
    floorArea: 4500,
    district: 'Kandy',
    city: 'Kandy',
    latitude: 7.2906,
    longitude: 80.6337,
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop', alt: 'Building exterior', isCover: true },
    ],
    documents: [],
    facts: [
      { id: '1', icon: 'building', label: 'Floors', value: '3 Floors' },
      { id: '2', icon: 'car', label: 'Parking', value: '5 Spaces' },
    ],
    nearbyAttractions: [
      { id: '1', name: 'Kandy Bus Stand', category: 'Transport', distance: '0.2 km' },
      { id: '2', name: 'Temple of the Tooth', category: 'Tourism', distance: '1 km' },
    ],
    views: 156,
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    id: '5',
    slug: 'tea-estate-nuwara-eliya',
    title: 'Tea Estate with Bungalow in Nuwara Eliya',
    description: 'Stunning 5-acre tea estate with a colonial-era bungalow in the heart of Nuwara Eliya. The property includes a working tea plantation, worker quarters, and breathtaking mountain views. Ideal for eco-tourism or private retreat.',
    propertyType: 'agricultural',
    listingType: 'sale',
    status: 'active',
    featured: true,
    price: 250000000,
    landArea: 5,
    landAreaUnit: 'acres',
    floorArea: 5000,
    bedrooms: 5,
    bathrooms: 3,
    district: 'Nuwara Eliya',
    city: 'Nuwara Eliya',
    latitude: 6.9497,
    longitude: 80.7891,
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop', alt: 'Tea estate panorama', isCover: true },
      { id: '2', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop', alt: 'Bungalow exterior', isCover: false },
    ],
    documents: [
      { id: '1', name: 'Land Survey', url: '/documents/land-survey.pdf', isPublic: true },
    ],
    facts: [
      { id: '1', icon: 'leaf', label: 'Tea Production', value: 'Active Estate' },
      { id: '2', icon: 'home', label: 'Worker Housing', value: '4 Units' },
      { id: '3', icon: 'mountain', label: 'Altitude', value: '1,800m' },
    ],
    nearbyAttractions: [
      { id: '1', name: 'Gregory Lake', category: 'Recreation', distance: '3 km' },
      { id: '2', name: 'Victoria Park', category: 'Recreation', distance: '4 km' },
    ],
    views: 423,
    createdAt: '2024-01-01T07:00:00Z',
    updatedAt: '2024-01-21T09:00:00Z',
  },
  {
    id: '6',
    slug: '4-bedroom-villa-galle',
    title: '4-Bedroom Villa for Rent in Galle Fort',
    description: 'Beautifully restored Dutch colonial villa inside Galle Fort. Features 4 bedrooms, a private courtyard, and rooftop terrace with ocean views. Fully furnished with antique furniture and modern amenities.',
    propertyType: 'house',
    listingType: 'rent',
    status: 'active',
    featured: true,
    price: 500000,
    pricePeriod: 'monthly',
    landArea: 12,
    landAreaUnit: 'perches',
    floorArea: 4200,
    bedrooms: 4,
    bathrooms: 3,
    district: 'Galle',
    city: 'Galle Fort',
    latitude: 6.0269,
    longitude: 80.2170,
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop', alt: 'Villa courtyard', isCover: true },
      { id: '2', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop', alt: 'Living area', isCover: false },
    ],
    documents: [],
    facts: [
      { id: '1', icon: 'history', label: 'Built', value: 'Dutch Colonial Era' },
      { id: '2', icon: 'paintbrush', label: 'Condition', value: 'Fully Restored' },
      { id: '3', icon: 'sofa', label: 'Furnishing', value: 'Fully Furnished' },
    ],
    nearbyAttractions: [
      { id: '1', name: 'Galle Fort Lighthouse', category: 'Tourism', distance: '0.3 km' },
      { id: '2', name: 'Dutch Reformed Church', category: 'Tourism', distance: '0.2 km' },
    ],
    views: 287,
    createdAt: '2024-01-12T13:00:00Z',
    updatedAt: '2024-01-22T11:00:00Z',
  },
  {
    id: '7',
    slug: 'commercial-space-lease-colombo-2',
    title: 'Commercial Space for Lease in Colombo 2',
    description: 'Prime commercial space available for long-term lease in the heart of Colombo 2. Ideal for offices, showrooms, or retail outlets. Modern building with excellent facilities including high-speed elevators, backup power, and 24/7 security.',
    propertyType: 'commercial',
    listingType: 'lease',
    status: 'active',
    featured: true,
    price: 750000,
    pricePeriod: 'monthly',
    floorArea: 3500,
    district: 'Colombo',
    city: 'Colombo 2',
    latitude: 6.9344,
    longitude: 79.8428,
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', alt: 'Modern office space', isCover: true },
      { id: '2', url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop', alt: 'Open floor plan', isCover: false },
    ],
    documents: [],
    facts: [
      { id: '1', icon: 'building', label: 'Floor', value: '8th Floor' },
      { id: '2', icon: 'car', label: 'Parking', value: '5 Dedicated Spots' },
      { id: '3', icon: 'shield', label: 'Security', value: '24/7' },
      { id: '4', icon: 'zap', label: 'Backup Power', value: 'Generator' },
    ],
    nearbyAttractions: [
      { id: '1', name: 'Bank of Ceylon', category: 'Banking', distance: '0.2 km' },
      { id: '2', name: 'Cargills Food City', category: 'Shopping', distance: '0.3 km' },
    ],
    views: 178,
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-23T08:00:00Z',
  },
];

// Mock Inquiries
export const mockInquiries: Inquiry[] = [
  {
    id: '1',
    propertyId: '1',
    propertyTitle: '3-Bedroom House for Sale in Colombo 7',
    propertySlug: '3-bedroom-house-colombo-7',
    type: 'general',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 555 123 4567',
    country: 'United States',
    message: 'I am interested in this property. Could you please provide more details about the neighborhood and nearby schools?',
    status: 'new',
    createdAt: '2024-01-20T10:30:00Z',
  },
  {
    id: '2',
    propertyId: '3',
    propertyTitle: 'Luxury Apartment for Rent in Colombo 3',
    propertySlug: 'luxury-apartment-colombo-3',
    type: 'site_visit',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+44 20 1234 5678',
    country: 'United Kingdom',
    message: 'Would like to schedule a viewing for next week. I will be in Colombo from the 25th to 30th.',
    status: 'read',
    createdAt: '2024-01-19T15:00:00Z',
  },
  {
    id: '3',
    propertyId: '5',
    propertyTitle: 'Tea Estate with Bungalow in Nuwara Eliya',
    propertySlug: 'tea-estate-nuwara-eliya',
    type: 'general',
    name: 'Michael Chen',
    email: 'michael@example.com',
    phone: '+65 9123 4567',
    country: 'Singapore',
    message: 'Is the tea estate still producing? What is the annual yield?',
    status: 'replied',
    adminNotes: 'Sent detailed production report via email',
    createdAt: '2024-01-18T09:00:00Z',
  },
];

// Mock User
export const mockUser: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  role: 'user',
  savedProperties: ['1', '3'],
};

// Additional mock users for admin pages / testing
export const mockUsers: User[] = [
  mockUser,
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    role: 'admin',
    savedProperties: [],
  },
];

// Mock Admin Stats
export const mockAdminStats: AdminStats = {
  activeListings: 6,
  soldListings: 12,
  rentedListings: 8,
  draftListings: 3,
  unreadInquiries: 2,
};

// Helper functions
export function getPropertyBySlug(slug: string): Property | undefined {
  return mockProperties.find(p => p.slug === slug);
}

export function getFeaturedProperties(): Property[] {
  return mockProperties.filter(p => p.featured && p.status === 'active');
}

export function getRelatedProperties(property: Property, limit = 4): Property[] {
  return mockProperties
    .filter(p => p.id !== property.id && (p.district === property.district || p.propertyType === property.propertyType))
    .slice(0, limit);
}

export function filterProperties(filters: import('./types').PropertyFilters): Property[] {
  let results = mockProperties.filter(p => p.status === 'active');
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    results = results.filter(p => 
      p.title.toLowerCase().includes(search) || 
      p.city.toLowerCase().includes(search) ||
      p.district.toLowerCase().includes(search)
    );
  }
  
  if (filters.listingType) {
    results = results.filter(p => p.listingType === filters.listingType);
  }
  
  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    results = results.filter(p => filters.propertyTypes!.includes(p.propertyType));
  }
  
  if (filters.district) {
    results = results.filter(p => p.district === filters.district);
  }
  
  if (filters.minPrice) {
    results = results.filter(p => p.price >= filters.minPrice!);
  }
  
  if (filters.maxPrice) {
    results = results.filter(p => p.price <= filters.maxPrice!);
  }
  
  if (filters.bedrooms) {
    results = results.filter(p => p.bedrooms === filters.bedrooms);
  }
  
  // Sorting
  switch (filters.sort) {
    case 'price_asc':
      results.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      results.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'most_viewed':
      results.sort((a, b) => b.views - a.views);
      break;
  }
  
  return results;
}

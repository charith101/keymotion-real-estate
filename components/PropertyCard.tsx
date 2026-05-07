"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/lib/currency-context';
// Import the PropertyCard type from your shared types
import type { PropertyCard as PropertyCardType } from '@/types/property'; 
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: PropertyCardType;
  className?: string;
}

const propertyTypeLabels: Record<string, string> = {
  land: 'Land',
  house: 'House',
  apartment: 'Apartment',
  commercial: 'Commercial',
  agricultural: 'Agricultural',
};

export function PropertyCard({ property, className }: PropertyCardProps) {
  const { formatPrice } = useCurrency();

  return (
    <Card className={cn("group overflow-hidden transition-shadow hover:shadow-lg", className)}>
      <Link href={`/properties/${property.slug}`}>
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden -mt-6 bg-muted">
          {property.cover_image && (
            <Image
              src={property.cover_image}
              alt={property.cover_alt || property.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <Badge variant={property.listing_type === 'sale' ? 'default' : 'secondary'}>
              For {property.listing_type === 'sale' ? 'Sale' : property.listing_type === 'rent' ? 'Rent' : 'Lease'}
            </Badge>
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              {propertyTypeLabels[property.property_type]}
            </Badge>
          </div>

        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="line-clamp-2 font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{property.city}, {property.district}</span>
          </div>

          {/* Stats */}
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
            {property.property_type !== 'land' && property.bedrooms !== null && property.bedrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.property_type !== 'land' && property.bathrooms !== null && property.bathrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            {property.land_area_perches !== null && property.land_area_perches !== undefined && (
              <div className="flex items-center gap-1">
                <Maximize className="h-4 w-4" />
                <span>{property.land_area_perches} Perches</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-lg font-bold text-primary">
              {formatPrice(property.price_lkr)}
              {property.price_period && (
                <span className="text-sm font-normal text-muted-foreground">
                  /{property.price_period === 'monthly' ? 'mo' : 'yr'}
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
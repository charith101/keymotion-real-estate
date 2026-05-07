"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bath, Maximize, MapPin, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/lib/currency-context';
import type { PropertyCard as PropertyCardType } from '@/types/property'; 
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ProfilePropertyCardProps {
  property: PropertyCardType;
  onRemove: (propertyId: string) => void;
  className?: string;
}

const propertyTypeLabels: Record<string, string> = {
  land: 'Land',
  house: 'House',
  apartment: 'Apartment',
  commercial: 'Commercial',
  agricultural: 'Agricultural',
};

export function ProfilePropertyCard({ property, onRemove, className }: ProfilePropertyCardProps) {
  const { formatPrice } = useCurrency();
  const [isRemoving, setIsRemoving] = useState(false);
  
  const handleRemoveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(true);
    await onRemove(property.id);
    setIsRemoving(false);
  };

  return (
    <Card className={cn("group overflow-hidden transition-shadow hover:shadow-md", className)}>
      <Link href={`/properties/${property.slug}`} className="flex flex-col sm:flex-row h-full">
        {/* Image Container */}
        <div className="relative h-48 sm:h-full sm:w-1/3 min-w-[200px] overflow-hidden bg-muted">
          {property.cover_image && (
            <Image
              src={property.cover_image}
              alt={property.cover_alt || property.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
          
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <Badge variant={property.listing_type === 'sale' ? 'default' : 'secondary'}>
              For {property.listing_type === 'sale' ? 'Sale' : property.listing_type === 'rent' ? 'Rent' : 'Lease'}
            </Badge>
          </div>
        </div>

        <CardContent className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4">
              <h3 className="line-clamp-2 font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                onClick={handleRemoveClick}
                disabled={isRemoving}
                aria-label="Remove from saved properties"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Location */}
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{property.city}, {property.district}</span>
            </div>

            {/* Stats */}
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {property.property_type !== 'land' && property.bedrooms !== null && property.bedrooms !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Bed className="h-4 w-4" />
                  <span>{property.bedrooms} Beds</span>
                </div>
              )}
              {property.property_type !== 'land' && property.bathrooms !== null && property.bathrooms !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Bath className="h-4 w-4" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              )}
              {property.land_area_perches !== null && property.land_area_perches !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Maximize className="h-4 w-4" />
                  <span>{property.land_area_perches} Perches</span>
                </div>
              )}
            </div>
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
            <Badge variant="outline" className="text-xs font-normal">
              {propertyTypeLabels[property.property_type]}
            </Badge>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

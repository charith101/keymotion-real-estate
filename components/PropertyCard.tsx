"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useCurrency } from '@/lib/currency-context';
import type { Property } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
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
  const { isAuthenticated, toggleSaveProperty, isPropertySaved } = useAuth();
  const { formatPrice } = useCurrency();
  
  const coverImage = property.images.find(img => img.isCover) || property.images[0];
  const isSaved = isPropertySaved(property.id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveProperty(property.id);
  };

  return (
    <Card className={cn("group overflow-hidden transition-shadow hover:shadow-lg", className)}>
      <Link href={`/properties/${property.slug}`}>
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden -mt-6">
          {coverImage && (
            <Image
              src={coverImage.url}
              alt={coverImage.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <Badge variant={property.listingType === 'sale' ? 'default' : 'secondary'}>
              For {property.listingType === 'sale' ? 'Sale' : property.listingType === 'rent' ? 'Rent' : 'Lease'}
            </Badge>
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              {propertyTypeLabels[property.propertyType]}
            </Badge>
          </div>

          {/* Save Button */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={handleSaveClick}
              aria-label={isSaved ? "Remove from saved" : "Save property"}
            >
              <Heart className={cn("h-4 w-4", isSaved && "fill-red-500 text-red-500")} />
            </Button>
          )}
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
            {property.bedrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            {property.landArea !== undefined && (
              <div className="flex items-center gap-1">
                <Maximize className="h-4 w-4" />
                <span>{property.landArea} {property.landAreaUnit}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-lg font-bold text-primary">
              {formatPrice(property.price)}
              {property.pricePeriod && (
                <span className="text-sm font-normal text-muted-foreground">
                  /{property.pricePeriod === 'monthly' ? 'mo' : 'yr'}
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

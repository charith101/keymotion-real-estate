"use client";

import { Heart, Share2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import type { Property } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';
import { saveProperty, unsaveProperty } from '@/lib/actions/saved';

interface PropertyHeaderProps {
  property: Property;
  initialIsSaved?: boolean;
}

const propertyTypeLabels: Record<string, string> = {
  land: 'Land',
  house: 'House',
  apartment: 'Apartment',
  commercial: 'Commercial',
  agricultural: 'Agricultural',
};

export function PropertyHeader({ property, initialIsSaved = false }: PropertyHeaderProps) {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(initialIsSaved);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          url,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save properties');
      return;
    }
    
    // optimistic update
    setIsSaved(!isSaved);
    
    if (isSaved) {
      const res = await unsaveProperty(property.id);
      if (res.error) {
        setIsSaved(true);
        toast.error(res.error);
      } else {
        toast.success('Removed from saved');
      }
    } else {
      const res = await saveProperty(property.id);
      if (res.error) {
        setIsSaved(false);
        toast.error(res.error);
      } else {
        toast.success('Added to saved');
      }
    }
  };

  return (
    <div>
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant={property.listingType === 'sale' ? 'default' : 'secondary'}>
          For {property.listingType === 'sale' ? 'Sale' : property.listingType === 'rent' ? 'Rent' : 'Lease'}
        </Badge>
        <Badge variant="outline">
          {propertyTypeLabels[property.propertyType]}
        </Badge>
      </div>

      {/* Title */}
      <h1 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
        {property.title}
      </h1>

      {/* Location */}
      <div className="mt-2 flex items-center gap-1 text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>{property.city}, {property.district}</span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {isAuthenticated && (
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Heart className={cn("mr-2 h-4 w-4", isSaved && "fill-red-500 text-red-500")} />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}

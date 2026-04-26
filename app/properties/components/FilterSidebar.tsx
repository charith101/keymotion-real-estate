"use client";

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { districts } from '@/lib/constants/districts';
import type { PropertyFilters, ListingType, PropertyType } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

interface FilterSidebarProps {
  filters: PropertyFilters;
  onFilterChange: (filters: Partial<PropertyFilters>) => void;
}

const propertyTypeOptions: { value: PropertyType; label: string }[] = [
  { value: 'land', label: 'Land' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'agricultural', label: 'Agricultural' },
];

const bedroomOptions = [1, 2, 3, 4, 5];

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateLocal = (updates: Partial<PropertyFilters>) => {
    setLocalFilters(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-4 mx-4 md:mx-0 flex flex-col h-full">
      <div className="space-y-4 flex-1">
        {/* Listing Type */}
        <div>
          <Label className="text-sm font-medium">Listing Type</Label>
          <ToggleGroup
            type="single"
            variant={'outline'}
            value={localFilters.listingType || ''} 
            onValueChange={(value) => updateLocal({ listingType: value as ListingType || undefined })} // <-- Changed to updateLocal
            className="mt-2 justify-start"
          >
            <ToggleGroupItem value="sale" className="flex-1">Buy</ToggleGroupItem>
            <ToggleGroupItem value="rent" className="flex-1">Rent</ToggleGroupItem>
            <ToggleGroupItem value="lease" className="flex-1">Lease</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <Separator className='mx-0'/>
        
        {/* Property Type */}
        <div>
          <Label className="text-sm font-medium">Property Type</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {propertyTypeOptions.map(({ value, label }) => {
              const isSelected = localFilters.propertyTypes?.includes(value); // <-- Changed to localFilters
              return (
                <button
                  key={value}
                  onClick={() => {
                    const current = localFilters.propertyTypes || [];
                    const updated = isSelected
                      ? current.filter(t => t !== value)
                      : [...current, value];
                    updateLocal({ propertyTypes: updated.length > 0 ? updated : undefined }); // <-- Changed to updateLocal
                  }}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background hover:bg-accent'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <Separator/>    
        
        {/* District */}
        <div>
          <Label className="text-sm font-medium">District</Label>
          <Select
            value={localFilters.district || 'all'} // <-- Changed to localFilters
            onValueChange={(value) => updateLocal({ district: value === 'all' ? undefined : value })} // <-- Changed to updateLocal
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder="All Districts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Separator/>      
        
        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium">Price Range (LKR)</Label>
          <div className="mt-4">
            <Slider
              value={[localFilters.minPrice || 0, localFilters.maxPrice || 100000000]}
              min={0}
              max={100000000}
              step={10000}
              onValueChange={([min, max]) => {
                updateLocal({ 
                  minPrice: min > 0 ? min : undefined,
                  maxPrice: max < 100000000 ? max : undefined,
                });
              }}
              className="w-full"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Rs. {Number(((localFilters.minPrice ?? 0) / 1000000).toFixed(1))}M</span>
              <span>Rs. {Number(((localFilters.maxPrice ?? 500000000) / 1000000).toFixed(1))}M</span>
            </div>
          </div>
        </div>
        <Separator />      
        
        {/* Bedrooms */}
        <div>
          <Label className="text-sm font-medium">Bedrooms</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {bedroomOptions.map((num) => {
              const isSelected = localFilters.bedrooms === num; // <-- Changed to localFilters
              return (
                <button
                  key={num}
                  onClick={() => updateLocal({ bedrooms: isSelected ? undefined : num })} // <-- Changed to updateLocal
                  className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background hover:bg-accent'
                  }`}
                >
                  {num}+
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. The Done Button */}
      <div className="sticky bottom-0 bg-background pt-4 pb-2 mt-4">
        <Button 
          className="w-full" 
          onClick={() => onFilterChange(localFilters)}
        >
          Done
        </Button>
      </div>
    </div>
  );
}
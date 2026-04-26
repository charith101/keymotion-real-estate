"use client";

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { PropertyCard } from '@/components/PropertyCard';
import { FilterSidebar } from './FilterSidebar';
import { mockProperties } from '@/lib/mock-data';
import type { PropertyFilters, ListingType, PropertyType } from '@/lib/types';

interface PropertiesClientProps {
  initialProperties?: any[];
  initialCount?: number;
}

/**
 * Maps from the client-side PropertyFilters shape (lib/types.ts) to
 * the URL param keys that getProperties() in lib/queries/properties.ts reads.
 *
 * Client shape  →  URL param key
 * listingType   →  listing
 * propertyTypes →  type  (comma-separated)
 * minPrice      →  min_price
 * maxPrice      →  max_price
 * bedrooms      →  beds
 * search        →  search  (same)
 * sort          →  sort    (same)
 */

export function PropertiesClient({ initialProperties, initialCount }: PropertiesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  // Parse the current URL params back into the client-side PropertyFilters shape.
  // URL params use the server keys: listing, type, min_price, max_price, beds.
  const filters: PropertyFilters = useMemo(() => {
    const typeParam = searchParams.get('type');
    return {
      search: searchParams.get('search') || undefined,
      listingType: (searchParams.get('listing') as ListingType) || undefined,
      propertyTypes: typeParam ? (typeParam.split(',') as PropertyType[]) : undefined,
      district: searchParams.get('district') || undefined,
      minPrice: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
      maxPrice: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
      bedrooms: searchParams.get('beds') ? Number(searchParams.get('beds')) : undefined,
      sort: (searchParams.get('sort') as PropertyFilters['sort']) || undefined,
    };
  }, [searchParams]);

  // Use server-fetched results; fall back to mock data only when no server data exists.
  const displayedProperties = useMemo(() => {
    if (initialProperties && initialProperties.length >= 0) return initialProperties;
    return mockProperties.filter(p => p.status === 'active');
  }, [initialProperties]);

  /**
   * Convert the client-side PropertyFilters shape into the URL param keys
   * that the server's getProperties() function reads.
   */
  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Helper to set or delete a param
    const set = (key: string, value: string | undefined | null) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    };

    if ('search' in newFilters) {
      set('search', newFilters.search);
    }
    if ('listingType' in newFilters) {
      set('listing', newFilters.listingType);
    }
    if ('propertyTypes' in newFilters) {
      const types = newFilters.propertyTypes;
      set('type', types && types.length > 0 ? types.join(',') : undefined);
    }
    if ('district' in newFilters) {
      set('district', newFilters.district);
    }
    if ('minPrice' in newFilters) {
      set('min_price', newFilters.minPrice !== undefined ? String(newFilters.minPrice) : undefined);
    }
    if ('maxPrice' in newFilters) {
      set('max_price', newFilters.maxPrice !== undefined ? String(newFilters.maxPrice) : undefined);
    }
    if ('bedrooms' in newFilters) {
      set('beds', newFilters.bedrooms !== undefined ? String(newFilters.bedrooms) : undefined);
    }
    if ('sort' in newFilters) {
      set('sort', newFilters.sort);
    }

    router.push(`/properties?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push('/properties');
    setSearchInput('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput || undefined });
  };

  const hasActiveFilters = Object.values(filters).some(
    v => v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0)
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our collection of properties in Sri Lanka
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search properties..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
        
        {/* Mobile Filter Button */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTitle className="sr-only">Filter Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Filter section
          </SheetDescription>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto sm:w-[400px]">
            <SheetHeader className='-mb-2'>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <Separator/>
            <div className="mt-1">
              <FilterSidebar 
                filters={filters} 
                onFilterChange={(newFilters) => {
                  updateFilters(newFilters);
                  setMobileFiltersOpen(false);
                }} 
              />
            </div>
          </SheetContent>
        </Sheet>
      </form>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.listingType && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => updateFilters({ listingType: undefined })}
              className="h-7 gap-1"
            >
              {filters.listingType === 'sale' ? 'For Sale' : filters.listingType === 'rent' ? 'For Rent' : 'For Lease'}
              <X className="h-3 w-3" />
            </Button>
          )}
          {filters.propertyTypes?.map(type => (
            <Button
              key={type}
              variant="secondary"
              size="sm"
              onClick={() => updateFilters({ 
                propertyTypes: filters.propertyTypes?.filter(t => t !== type) 
              })}
              className="h-7 gap-1 capitalize"
            >
              {type}
              <X className="h-3 w-3" />
            </Button>
          ))}
          {filters.district && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => updateFilters({ district: undefined })}
              className="h-7 gap-1"
            >
              {filters.district}
              <X className="h-3 w-3" />
            </Button>
          )}
          {filters.bedrooms && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => updateFilters({ bedrooms: undefined })}
              className="h-7 gap-1"
            >
              {filters.bedrooms}+ beds
              <X className="h-3 w-3" />
            </Button>
          )}
          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}
              className="h-7 gap-1"
            >
              Price range
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 text-muted-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <Card className='sticky top-24'>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <Separator className='-mt-5'/>
        <CardContent className="space-y-3">
          <FilterSidebar filters={filters} onFilterChange={updateFilters} />
          </CardContent>
          </Card>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {/* Results Count & Sort */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{displayedProperties.length}</span> of{' '}
              <span className="font-medium text-foreground">{initialCount ?? mockProperties.filter(p => p.status === 'active').length}</span> properties
            </p>
            <Select
              value={filters.sort || ''}
              onValueChange={(value) =>
                updateFilters({ sort: value as PropertyFilters['sort'] || undefined })
              }
            >
              <SelectTrigger className="rounded-md border bg-background px-3 py-1.5 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="most_viewed">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Property Grid */}
          {displayedProperties.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {displayedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">No properties found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your filters or search criteria
              </p>
              <Button variant="outline" onClick={clearAllFilters} className="mt-4">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

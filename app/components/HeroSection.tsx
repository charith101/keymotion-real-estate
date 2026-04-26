"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface HeroSectionProps {
  exchangeRates?: { usd_rate: number; eur_rate: number } | null;
}

export function HeroSection({ exchangeRates }: HeroSectionProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [listingType, setListingType] = useState<string>('sale');
  const [searchQuery, setSearchQuery] = useState('');

  // Avoid hydration mismatch — only read theme after mount
  useEffect(() => setMounted(true), []);

  const heroImage = mounted && resolvedTheme === 'dark'
    ? '/images/beach2dark.png'
    : '/images/beach2.jpg';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (listingType) params.set('listingType', listingType);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary to-background min-h-[99vh] flex items-center py-24 md:py-36">
      {/* Background Image — swaps based on dark / light mode */}
      <img
        src={heroImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-99 transition-opacity duration-500"
      />
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Buy, Sell, Rent, Lease, Search In Ahangama, Midigama, Kabalana
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
           For any Lands Villas, Actuve Businesses
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-10">
          <div className="items-center mx-auto flex max-w-2xl flex-col gap-4 rounded-xl bg-card p-4 shadow-lg md:flex-row md:items-center md:gap-3 md:rounded-full md:p-2">
            {/* Listing Type Tabs */}
            <Tabs
              value={listingType}
              onValueChange={(value) => setListingType(value)}
              className="border-r-0 md:border-r md:pr-3"
            >
              <TabsList className="bg-transparent">
                <TabsTrigger value="sale" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground">
                  Buy
                </TabsTrigger>
                <TabsTrigger value="rent" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground">
                  Rent
                </TabsTrigger>
                <TabsTrigger value="lease" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground">
                  Lease
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by location, property type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="md:border-0 border-1 w-full rounded-full bg-transparent pl-10 shadow-none focus-visible:ring-0"
              />
            </div>

            {/* Search Button */}
            <Button type="submit" size="lg" className="rounded-full">
              <Search className="mr-2 h-4 w-4 md:hidden" />
              Search Properties
            </Button>
          </div>
        </form>

          {/* Quick Stats */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            {/* <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground">500+</span>
              <span>Active Listings</span>
            </div>
            <div className="hidden h-8 w-px bg-border md:block" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground">25</span>
              <span>Districts Covered</span>
            </div>
            <div className="hidden h-8 w-px bg-border md:block" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground">1,200+</span>
              <span>Happy Clients</span>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}

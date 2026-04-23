"use client";

import Link from 'next/link';
import { Home, Building2, Landmark, TreePine, MapPin } from 'lucide-react';

const propertyTypes = [
  { type: 'land', label: 'Land', icon: MapPin, description: 'Plots & Lots' },
  { type: 'house', label: 'Houses', icon: Home, description: 'Villas & Homes' },
  { type: 'apartment', label: 'Apartments', icon: Building2, description: 'Flats & Units' },
  { type: 'commercial', label: 'Commercial', icon: Landmark, description: 'Shops & Offices' },
  { type: 'agricultural', label: 'Agricultural', icon: TreePine, description: 'Farms & Estates' },
];

export function PropertyTypeFilters() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Browse by Property Type
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find the perfect property that suits your needs
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {propertyTypes.map(({ type, label, icon: Icon, description }) => (
            <Link
              key={type}
              href={`/properties?propertyTypes=${type}`}
              className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center transition-all hover:border-primary hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{label}</h3>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

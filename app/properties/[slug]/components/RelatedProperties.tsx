"use client";

import { PropertyCard } from '@/components/PropertyCard';
import type { Property } from '@/lib/types';

interface RelatedPropertiesProps {
  properties: Property[];
}

export function RelatedProperties({ properties }: RelatedPropertiesProps) {
  return (
    <section className="mt-12 border-t pt-12">
      <h2 className="text-2xl font-bold tracking-tight">Related Properties</h2>
      <p className="mt-2 text-muted-foreground">
        Similar properties you might be interested in
      </p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {properties.slice(0, 4).map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}

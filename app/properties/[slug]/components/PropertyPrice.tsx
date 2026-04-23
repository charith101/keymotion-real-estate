"use client";

import { useCurrency } from '@/lib/currency-context';
import type { Property, Currency } from '@/lib/types';

interface PropertyPriceProps {
  property: Property;
}

const currencies: { value: Currency; label: string }[] = [
  { value: 'LKR', label: 'LKR' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
];

export function PropertyPrice({ property }: PropertyPriceProps) {
  const { currency, setCurrency, formatPrice } = useCurrency();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <p className="text-3xl font-bold text-primary md:text-4xl">
        {formatPrice(property.price)}
        {property.pricePeriod && (
          <span className="text-lg font-normal text-muted-foreground">
            /{property.pricePeriod === 'monthly' ? 'month' : 'year'}
          </span>
        )}
      </p>
      
      {/* Currency Toggle */}
      <div className="flex rounded-md border">
        {currencies.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCurrency(value)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors first:rounded-l-md last:rounded-r-md ${
              currency === value
                ? 'bg-primary text-primary-foreground'
                : 'bg-background hover:bg-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

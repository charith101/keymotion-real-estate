import { Bed, Bath, Maximize, MapPin } from 'lucide-react';
import type { Property } from '@/lib/types';

interface QuickStatsProps {
  property: Property;
}

export function QuickStats({ property }: QuickStatsProps) {
  const stats = [];

  if (property.bedrooms !== undefined) {
    stats.push({
      icon: Bed,
      label: 'Bedrooms',
      value: property.bedrooms,
    });
  }

  if (property.bathrooms !== undefined) {
    stats.push({
      icon: Bath,
      label: 'Bathrooms',
      value: property.bathrooms,
    });
  }

  if (property.landArea !== undefined) {
    stats.push({
      icon: MapPin,
      label: 'Land Area',
      value: `${property.landArea} ${property.landAreaUnit}`,
    });
  }

  if (property.floorArea !== undefined) {
    stats.push({
      icon: Maximize,
      label: 'Floor Area',
      value: `${property.floorArea.toLocaleString()} sqft`,
    });
  }

  if (stats.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-6 rounded-lg border bg-muted/50 p-4">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
import type { NearbyAttraction } from '@/lib/types';

interface NearbyAttractionsProps {
  attractions: NearbyAttraction[];
}

export function NearbyAttractions({ attractions }: NearbyAttractionsProps) {
  if (attractions.length === 0) return null;

  // Group attractions by category
  const grouped = attractions.reduce((acc, attraction) => {
    const category = attraction.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(attraction);
    return acc;
  }, {} as Record<string, NearbyAttraction[]>);

  return (
    <div>
      <h2 className="text-xl font-semibold">Nearby Attractions</h2>
      <div className="mt-4 space-y-4">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
            <div className="mt-2 space-y-2">
              {items.map((attraction) => (
                <div
                  key={attraction.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                >
                  <span className="font-medium">{attraction.name}</span>
                  <Badge variant="secondary">{attraction.distance}</Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

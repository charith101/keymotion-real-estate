import { 
  Car, TreePine, Zap, Droplets, Building, Shield, Paintbrush, Sofa, 
  Waves, Route, History, Leaf, Mountain, Home 
} from 'lucide-react';
import type { PropertyFact } from '@/lib/types';

interface PropertyFactsProps {
  facts: PropertyFact[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  car: Car,
  trees: TreePine,
  zap: Zap,
  droplets: Droplets,
  building: Building,
  shield: Shield,
  paintbrush: Paintbrush,
  sofa: Sofa,
  waves: Waves,
  route: Route,
  history: History,
  leaf: Leaf,
  mountain: Mountain,
  home: Home,
};

export function PropertyFacts({ facts }: PropertyFactsProps) {
  if (facts.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold">Property Facts</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {facts.map((fact) => {
          const Icon = iconMap[fact.icon] || Building;
          return (
            <div
              key={fact.id}
              className="flex items-center gap-3 rounded-lg border bg-card p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{fact.label}</p>
                <p className="font-medium">{fact.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

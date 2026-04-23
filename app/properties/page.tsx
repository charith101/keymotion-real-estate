import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PropertiesClient } from './components/PropertiesClient';
import { getProperties } from '@/lib/queries/properties'

export const metadata: Metadata = {
  title: 'Properties | Browse All Listings',
  description: 'Browse our extensive collection of properties in Sri Lanka. Find land, houses, apartments, and commercial properties for sale, rent, or lease.',
  openGraph: {
    title: 'Properties | Key Motion Real Estate',
    description: 'Browse our extensive collection of properties in Sri Lanka. Find land, houses, apartments, and commercial properties for sale, rent, or lease.',
    type: 'website',
  },
};

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const filters = await searchParams

  const [{ properties, count }] = await Promise.all([
  getProperties(filters),
])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <PropertiesClient initialProperties={properties} initialCount={count} />
      </main>
      <Footer />
    </div>
  );
}

import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from './components/HeroSection';
import { PropertyTypeFilters } from './components/PropertyTypeFilters';
import { FeaturedListings } from './components/FeaturedListings';
import { getFeaturedProperties } from '@/lib/queries/properties'
import { getExchangeRates } from '@/lib/currency'
import { WhyChooseUs } from './components/WhyChooseUs';
import { CTABanner } from './components/CTABanner';

export const metadata: Metadata = {
  title: 'Key Motion Real Estate',
  description: 'Your trusted partner for finding the perfect property in Ahangama, Midigama And Kabalana Sri Lanka. Buy, sell, rent, or lease lands, luxury villas, and thriving businesses with ease.',
  openGraph: {
    title: 'Key Motion Real Estate | Find Your Dream Property in Ahangama, Midigama And Kabalana Sri Lanka',
    description: 'Your trusted partner for finding the perfect property in Ahangama, Midigama And Kabalana Sri Lanka. Buy, sell, rent, or lease lands, luxury villas, and thriving businesses with ease.',
    type: 'website',
  },
};

export const revalidate = 3600

export default async function HomePage() {
  const [featured, rates] = await Promise.all([
  getFeaturedProperties(),
  getExchangeRates()
])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection exchangeRates={rates} />
        <PropertyTypeFilters />
        <FeaturedListings featuredProperties={featured} exchangeRates={rates} />
        <WhyChooseUs />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}

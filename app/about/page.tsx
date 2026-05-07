import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Users, Target, Award, Globe } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Key Motion Real Estate, your trusted partner for real estate in Ahangama, Midigama And Kabalana Sri Lanka. We connect buyers, sellers, and tenants with their dream properties worldwide.',
  openGraph: {
    title: 'About Us | Key Motion Real Estate',
    description: 'Learn about Key Motion Real Estate, your trusted partner for real estate in Ahangama, Midigama And Kabalana Sri Lanka.',
    type: 'website',
  },
};

const values = [
  {
    icon: Users,
    title: 'Client First',
    description: 'We prioritize your needs and work tirelessly to find the perfect property match.',
  },
  {
    icon: Target,
    title: 'Precision',
    description: 'Every listing is verified and every detail is accurate for informed decisions.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We maintain the highest standards in service quality and professionalism.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connecting international buyers with Sri Lankan properties seamlessly.',
  },
];

const howWeWork = [
  {
    step: '01',
    title: 'Consultation',
    description: 'We start by understanding your requirements, budget, and preferences through a detailed consultation.',
  },
  {
    step: '02',
    title: 'Property Matching',
    description: 'Our team curates a selection of properties that match your criteria from our extensive database.',
  },
  {
    step: '03',
    title: 'Site Visits',
    description: 'We arrange convenient site visits and provide detailed information about each property.',
  },
  {
    step: '04',
    title: 'Transaction Support',
    description: 'From negotiation to documentation, we guide you through every step of the process.',
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                About Key Motion Real Estate
              </h1>
              <p className="mt-6 text-lg text-primary-foreground/80">
                Your trusted partner for finding the perfect property in Sri Lanka. 
                We bridge the gap between dreams and reality in real estate.
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Who We Are</h2>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Key Motion Real Estate is a leading real estate agency based in Sri Lanka, dedicated to connecting 
                  buyers, sellers, and tenants with exceptional properties across the country. With years 
                  of experience in the industry, we have built a reputation for integrity, professionalism, 
                  and outstanding customer service.
                </p>
                <p>
                  Our team of experienced real estate professionals brings deep knowledge of local markets, 
                  property laws, and investment opportunities. Whether you are looking for a beachfront 
                  villa in Galle, a modern apartment in Colombo, or agricultural land in the hill country, 
                  we have the expertise to guide you every step of the way.
                </p>
                <p>
                  We serve clients from around the world, making property investment in Sri Lanka 
                  accessible and straightforward for international buyers. Our multilingual team and 
                  comprehensive support ensure a smooth experience regardless of where you are located.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-secondary/30 py-16">
          <div className="container">
            <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
              Our Values
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(({ icon: Icon, title, description }) => (
                <div key={title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Work */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
              How We Work
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {howWeWork.map(({ step, title, description }) => (
                <div key={step} className="relative">
                  <span className="text-5xl font-bold text-primary/20">{step}</span>
                  <h3 className="mt-2 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Ready to Find Your Dream Property?
              </h2>
              <p className="mt-4 text-primary-foreground/80">
                Get in touch with our team today and let us help you find the perfect property.
              </p>
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="mt-8">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

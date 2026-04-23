import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone } from 'lucide-react';

export function CTABanner() {
  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Looking to List Your Property?
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            Reach thousands of potential buyers and renters worldwide. 
            Our team will help you showcase your property and connect with the right audience.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Phone className="mr-2 h-4 w-4" />
                Contact Us
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

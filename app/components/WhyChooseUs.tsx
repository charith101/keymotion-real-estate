import { Shield, Globe, Users, Clock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Verified Listings',
    description: 'Every property is verified by our team to ensure authenticity and accurate information.',
  },
  {
    icon: Globe,
    title: 'Worldwide Reach',
    description: 'Connect with buyers and sellers from around the globe. We serve international clients with ease.',
  },
  {
    icon: Users,
    title: 'Expert Guidance',
    description: 'Our experienced team provides personalized assistance throughout your property journey.',
  },
  {
    icon: Clock,
    title: 'Quick Process',
    description: 'Streamlined processes ensure faster transactions with minimal hassle.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Why Choose Key Motion
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            We are committed to making your property search and investment journey smooth and successful
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
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
  );
}

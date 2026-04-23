import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContactForm } from './components/ContactForm';
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Key Motion Real Estate. Contact us for property inquiries, site visits, or any questions about real estate in Sri Lanka.',
  openGraph: {
    title: 'Contact Us | Key Motion Real Estate',
    description: 'Get in touch with Key Motion Real Estate for property inquiries and real estate services.',
    type: 'website',
  },
};

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+94 11 234 5678',
    href: 'tel:+94112345678',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+94 71 234 5678',
    href: 'https://wa.me/94712345678',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@keymotionrealestate.com',
    href: 'mailto:info@keymotionrealestate.com',
  },
  {
    icon: MapPin,
    label: 'Office',
    value: '123 Galle Road, Colombo 3, Sri Lanka',
    href: '#',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon - Sat: 9:00 AM - 6:00 PM',
    href: '#',
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Contact Us
              </h1>
              <p className="mt-4 text-primary-foreground/80">
                Have a question or want to learn more? We would love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Send Us a Message</h2>
                <p className="mt-2 text-muted-foreground">
                  Fill out the form below and we will get back to you as soon as possible.
                </p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Get in Touch</h2>
                <p className="mt-2 text-muted-foreground">
                  Reach out to us directly through any of these channels.
                </p>
                <div className="mt-8 space-y-6">
                  {contactInfo.map(({ icon: Icon, label, value, href }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

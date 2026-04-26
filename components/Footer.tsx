import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MessageCircle } from 'lucide-react';

const footerLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logokey.svg"
                alt="Key Motion Real Estate"
                width={140}
                height={40}
                className="h-10 w-auto  rounded p-0.5"
              />
              <span className="text-xl font-semibold tracking-tight">Key Motion Real Estate</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted partner for finding the perfect property in Sri Lanka. 
              We connect buyers, sellers, and tenants with their dream properties worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Us</h3>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <a href="tel:+94112345678" className="flex items-center gap-2 transition-colors hover:text-foreground">
                <Phone className="h-4 w-4" />
                +94 11 234 5678
              </a>
              <a 
                href="https://wa.me/94712345678" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" />
                +94 71 234 5678
              </a>
              <a href="mailto:info@keymotionrealestate.com" className="flex items-center gap-2 transition-colors hover:text-foreground">
                <Mail className="h-4 w-4" />
                info@keymotionrealestate.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground -mb-4">
          <p>&copy; {new Date().getFullYear()} Key Motion Real Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

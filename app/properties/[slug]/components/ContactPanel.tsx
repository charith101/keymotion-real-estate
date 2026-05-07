"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import type { Property } from '@/lib/types';
import { toast } from 'sonner';

interface ContactPanelProps {
  property: Property;
}

export function ContactPanel({ property }: ContactPanelProps) {
  const { isAuthenticated, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: `Hi, I'm interested in "${property.title}". Please provide more information.`,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Inquiry sent successfully! We will contact you soon.');
    setFormData(prev => ({ ...prev, name: '', email: '', phone: '', country: '' }));
    setIsSubmitting(false);
  };

  const handleSiteVisit = () => {
    if (!isAuthenticated) {
      toast.error('Please login to request a site visit');
      return;
    }
    toast.success('Site visit request sent! Our team will contact you to schedule.');
  };

  return (
    <div className="sticky top-24 space-y-4">
      {/* Contact Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Agent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            className="w-full" 
            onClick={(e) => {
              e.preventDefault();
              const url = typeof window !== 'undefined' ? window.location.href : '';
              const userName = user?.name || 'A potential buyer';
              const messageText = `Hi, I'm interested in the property: "${property.title}".\nLink: ${url}\nMy name is: ${userName}`;
              const encodedMessage = encodeURIComponent(messageText);
              window.open(`https://wa.me/94727812370?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
            }}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Send A Message In WhatsApp
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href="tel:+94112345678">
              <Phone className="mr-2 h-4 w-4" />
              +94 11 234 5678
            </a>
          </Button>
          {/* {isAuthenticated ? (
            <Button variant="secondary" className="w-full" onClick={handleSiteVisit}>
              <Calendar className="mr-2 h-4 w-4" />
              Request Site Visit
            </Button>
          ) : (
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/login">
                <Calendar className="mr-2 h-4 w-4" />
                Login to Request Visit
              </Link>
            </Button>
          )} */}
        </CardContent>
      </Card>

      {/* Lawyer Card */}
      {property.lawyers && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
              Legal Representative
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                {property.lawyers.full_name?.substring(0, 2).toUpperCase() || 'L'}
              </div>
              <div>
                <p className="font-semibold text-base">{property.lawyers.full_name}</p>
                <p className="text-sm text-muted-foreground">{property.lawyers.firm_name || 'Licensed Attorney-at-Law'}</p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
              {property.lawyers.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${property.lawyers.phone}`} className="font-medium hover:underline">
                    {property.lawyers.phone}
                  </a>
                </div>
              )}
              {property.lawyers.email && (
                <div className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${property.lawyers.email}`} className="font-medium hover:underline">
                    {property.lawyers.email}
                  </a>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              {property.lawyers.address || 'All property transactions are conducted under the supervision of our registered legal representative.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Inquiry Form - Commented out for demo */}
      {/*
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Send Inquiry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                placeholder="e.g. United States"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
            </Button>
          </form>
        </CardContent>
      </Card>
      */}
    </div>
  );
}

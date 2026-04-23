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
  const { isAuthenticated } = useAuth();
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
          <Button className="w-full" asChild>
            <a href="https://wa.me/94712345678" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </a>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href="tel:+94112345678">
              <Phone className="mr-2 h-4 w-4" />
              +94 11 234 5678
            </a>
          </Button>
          {isAuthenticated ? (
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
          )}
        </CardContent>
      </Card>

      {/* Inquiry Form */}
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
    </div>
  );
}

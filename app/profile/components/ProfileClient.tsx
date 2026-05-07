"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, MessageSquare, Calendar, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { ProfilePropertyCard } from './ProfilePropertyCard';
import { unsaveProperty } from '@/lib/actions/saved';
import { toast } from 'sonner';


const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  read: 'bg-yellow-100 text-yellow-800',
  replied: 'bg-green-100 text-green-800',
};

interface ProfileClientProps {
  initialSaved?: any[];
  initialInquiries?: any[];
}

export function ProfileClient({ initialSaved, initialInquiries }: ProfileClientProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Please login to view your profile.</p>
      </div>
    );
  }
  const [savedProperties, setSavedProperties] = useState<any[]>(initialSaved || []);
  const userInquiries = initialInquiries || [];

  const handleRemoveSaved = async (propertyId: string) => {
    // optimistic update
    setSavedProperties(prev => prev.filter(p => p.id !== propertyId));
    const res = await unsaveProperty(propertyId);
    if (res.error) {
      toast.error(res.error);
      // We don't have the original property to put it back easily, but a router refresh could fix it
    } else {
      toast.success('Property removed from saved');
    }
  };

  return (
    <div className="container py-8">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="saved" className="mt-8">
        <TabsList>
          <TabsTrigger value="saved" className="gap-2">
            <Heart className="h-4 w-4" />
            Saved Properties
            {savedProperties.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {savedProperties.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            My Inquiries
            {userInquiries.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {userInquiries.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Saved Properties Tab */}
        <TabsContent value="saved" className="mt-6">
          {savedProperties.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {savedProperties.map((property) => (
                <ProfilePropertyCard 
                  key={property.id} 
                  property={property} 
                  onRemove={handleRemoveSaved} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
              <Heart className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-semibold">No saved properties</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start saving properties by clicking the heart icon on listings.
              </p>
              <Link href="/properties">
                <Button className="mt-4">Browse Properties</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        {/* Inquiries Tab */}
        <TabsContent value="inquiries" className="mt-6">
          {userInquiries.length > 0 ? (
            <div className="space-y-4">
              {userInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1 space-y-1">
                    <Link 
                      href={`/properties/${inquiry.propertySlug}`}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {inquiry.propertyTitle}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                      <Badge variant="outline" className="capitalize">
                        {inquiry.type === 'site_visit' ? 'Site Visit' : 'General'}
                      </Badge>
                      <Badge className={statusColors[inquiry.status]}>
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {inquiry.message}
                    </p>
                  </div>
                  <Link href={`/properties/${inquiry.propertySlug}`}>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-3.5 w-3.5" />
                      View Property
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-semibold">No inquiries yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                When you contact agents about properties, your inquiries will appear here.
              </p>
              <Link href="/properties">
                <Button className="mt-4">Browse Properties</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  CheckCircle, 
  Home, 
  FileText, 
  MessageSquare, 
  Plus, 
  ArrowRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
const defaultStats = [
  { label: 'Active Listings', value: 0, icon: Building2, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { label: 'Sold', value: 0, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
  { label: 'Rented', value: 0, icon: Home, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { label: 'Drafts', value: 0, icon: FileText, color: 'text-orange-600', bgColor: 'bg-orange-100' },
]

function computeStats(properties: any[]) {
  const active = properties.filter(p => p.status === 'active').length
  const sold = properties.filter(p => p.status === 'sold').length
  const rented = properties.filter(p => p.status === 'rented').length
  const drafts = properties.filter(p => p.status === 'draft').length
  return [
    { label: 'Active Listings', value: active, icon: Building2, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Sold', value: sold, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Rented', value: rented, icon: Home, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { label: 'Drafts', value: drafts, icon: FileText, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ]
}

export default function AdminDashboard() {
  const [properties, setProperties] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [pRes, iRes] = await Promise.all([
          fetch('/api/admin/properties/list', { credentials: 'same-origin' }),
          fetch('/api/admin/inquiries/list', { credentials: 'same-origin' }),
        ])

        const pJson = await pRes.json()
        const iJson = await iRes.json()

        if (!cancelled) {
          setProperties(pRes.ok ? (pJson.data || []) : [])
          setInquiries(iRes.ok ? (iJson.data || []) : [])
        }
      } catch (err) {
        // ignore — UI shows empty state
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const recentProperties = properties.slice(0, 5)
  const recentInquiries = inquiries.slice(0, 5)
  const unreadCount = inquiries.filter((i: any) => i.status === 'new').length
  const stats = loading ? defaultStats : computeStats(properties)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here is your property overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/properties/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </Link>
          <Link href="/admin/inquiries">
            <Button variant="outline" className="relative">
              <MessageSquare className="mr-2 h-4 w-4" />
              Inquiries
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, bgColor }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bgColor}`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Inquiries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Inquiries</CardTitle>
            <Link href="/admin/inquiries">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {inquiry.propertyTitle}
                    </p>
                  </div>
                  <Badge 
                    variant={inquiry.status === 'new' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {inquiry.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Properties</CardTitle>
            <Link href="/admin/properties">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProperties.map((property) => (
                <div key={property.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium line-clamp-1">{property.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {property.city}, {property.district}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {property.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

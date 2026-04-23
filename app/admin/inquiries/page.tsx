"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp, ExternalLink, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { InquiryStatus } from '@/lib/types';

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  read: 'bg-yellow-100 text-yellow-800',
  replied: 'bg-green-100 text-green-800',
};

export default function AdminInquiriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/admin/inquiries/list', { credentials: 'same-origin' })
        const json = await res.json()
        if (res.ok && !cancelled) setInquiries(json.data || [])
      } catch (err) {
        // noop
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const updateStatus = (id: string, status: InquiryStatus) => {
    setInquiries(prev => 
      prev.map(inquiry => 
        inquiry.id === id ? { ...inquiry, status } : inquiry
      )
    );
    toast.success(`Status updated to ${status}`);
  };

  const markAllAsRead = () => {
    setInquiries(prev => 
      prev.map(inquiry => 
        inquiry.status === 'new' ? { ...inquiry, status: 'read' } : inquiry
      )
    );
    toast.success('All inquiries marked as read');
  };

  const unreadCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inquiries</h1>
          <p className="text-muted-foreground">
            Manage property inquiries and site visit requests
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inquiry List */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <p className="text-muted-foreground">No inquiries found</p>
          </div>
        ) : (
          filteredInquiries.map((inquiry) => (
            <Collapsible 
              key={inquiry.id} 
              open={expandedIds.includes(inquiry.id)}
              onOpenChange={() => toggleExpand(inquiry.id)}
            >
              <div className="rounded-lg border bg-card">
                <CollapsibleTrigger asChild>
                  <button className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50">
                    <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{inquiry.name}</span>
                        <Badge className={statusColors[inquiry.status]}>
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {inquiry.type === 'site_visit' ? 'Site Visit' : 'General'}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {inquiry.propertyTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                      {expandedIds.includes(inquiry.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t p-4 space-y-4">
                    {/* Contact Details */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline">
                          {inquiry.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <a href={`tel:${inquiry.phone}`} className="text-primary hover:underline">
                          {inquiry.phone}
                        </a>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Country</p>
                        <p>{inquiry.country}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Property</p>
                        <Link 
                          href={`/properties/${inquiry.propertySlug}`}
                          target="_blank"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          View Property
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Message</p>
                      <p className="rounded-md bg-muted p-3">{inquiry.message}</p>
                    </div>

                    {/* Admin Notes */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Admin Notes</p>
                      <Textarea 
                        placeholder="Add internal notes..."
                        defaultValue={inquiry.adminNotes}
                        rows={2}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-muted-foreground">Update status:</span>
                      <Button
                        variant={inquiry.status === 'new' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateStatus(inquiry.id, 'new')}
                      >
                        New
                      </Button>
                      <Button
                        variant={inquiry.status === 'read' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateStatus(inquiry.id, 'read')}
                      >
                        Read
                      </Button>
                      <Button
                        variant={inquiry.status === 'replied' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateStatus(inquiry.id, 'replied')}
                      >
                        Replied
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))
        )}
      </div>
    </div>
  );
}

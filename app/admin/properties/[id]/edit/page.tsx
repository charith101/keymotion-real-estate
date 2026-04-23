"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, X, GripVertical, Upload, Star, Trash2, Loader } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { districts } from '@/lib/constants/districts';
import { toast } from 'sonner';

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  propertyType: z.enum(['land', 'house', 'apartment', 'commercial', 'agricultural']),
  listingType: z.enum(['sale', 'rent', 'lease']),
  status: z.enum(['active', 'draft']),
  featured: z.boolean(),
  price: z.number().min(1, 'Price is required'),
  pricePeriod: z.enum(['monthly', 'yearly']).optional(),
  lawyerId: z.string().optional(),
  landArea: z.number().optional(),
  landAreaUnit: z.enum(['perches', 'acres']).optional(),
  floorArea: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  district: z.string().min(1, 'District is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFact {
  id: string;
  icon: string;
  label: string;
  value: string;
}

interface NearbyAttraction {
  id: string;
  name: string;
  category: string;
  distance: string;
}

interface ImageItem {
  id: string;
  storage_path: string;
  is_cover: boolean;
  display_order: number;
  isNew?: boolean;
}

interface ImagePreview {
  id: string;
  storage_path?: string;
  file?: File;
  preview: string;
  isCover: boolean;
  isNew: boolean;
  display_order?: number;
}

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [facts, setFacts] = useState<PropertyFact[]>([]);
  const [attractions, setAttractions] = useState<NearbyAttraction[]>([]);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [lawyers, setLawyers] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      status: 'draft',
      featured: false,
      listingType: 'sale',
      propertyType: 'house',
      landAreaUnit: 'perches',
      lawyerId: '',
    },
  });

  const propertyType = watch('propertyType');
  const listingType = watch('listingType');

  // Load property data
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/properties/${id}`);
        const json = await res.json();

        if (!res.ok) {
          toast.error(json.error || 'Failed to load property');
          return;
        }

        const p = json.data.property;
        if (cancelled) return;

        reset({
          title: p.title,
          description: p.description ?? '',
          propertyType: p.property_type,
          listingType: p.listing_type,
          status: p.status === 'active' ? 'active' : 'draft',
          featured: !!p.featured,
          price: p.price_lkr,
          pricePeriod: p.price_period ?? undefined,
          landArea: p.land_area_perches ?? p.land_area_acres ?? undefined,
          landAreaUnit: p.land_area_acres ? 'acres' : 'perches',
          floorArea: p.floor_area_sqft ?? undefined,
          bedrooms: p.bedrooms ?? undefined,
          bathrooms: p.bathrooms ?? undefined,
          district: p.district,
          city: p.city,
          address: p.address ?? undefined,
          latitude: p.latitude ?? undefined,
          longitude: p.longitude ?? undefined,
          lawyerId: p.lawyer_id ?? '',
        });

        setFacts(
          (json.data.facts || []).map((f: any) => ({
            id: f.id,
            icon: f.icon ?? '',
            label: f.label,
            value: f.value,
          }))
        );

        setAttractions(
          (json.data.attractions || []).map((a: any) => ({
            id: a.id,
            name: a.name,
            category: a.category,
            distance: a.distance_km ? String(a.distance_km) : '',
          }))
        );

        const existingImages: ImagePreview[] = (json.data.property_images || []).map((img: any) => ({
          id: img.id,
          storage_path: img.storage_path,
          preview: '', // Will be resolved on display
          isCover: img.is_cover,
          isNew: false,
          display_order: img.display_order,
        }));

        // Resolve image URLs
        for (const img of existingImages) {
          try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            img.preview = `${supabaseUrl}/storage/v1/object/public/property-images/${img.storage_path}`;
          } catch {
            img.preview = '';
          }
        }

        setImages(existingImages);
        setIsLoading(false);
      } catch (err) {
        toast.error('Server error');
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, reset]);

  // Load lawyers
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/admin/lawyers', { credentials: 'same-origin' });
        const j = await r.json();
        if (!cancelled && r.ok) setLawyers(j.data || []);
      } catch {
        // noop
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Determine which fields to show based on property type
  const shouldShowBedrooms = propertyType !== 'land' && propertyType !== 'commercial';
  const shouldShowBathrooms = propertyType !== 'land' && propertyType !== 'commercial';
  const shouldShowFloorArea = propertyType !== 'land';
  const shouldShowLandArea = propertyType === 'land' || propertyType === 'agricultural';

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);

    const insertData: any = {
      title: data.title,
      description: data.description ?? null,
      property_type: data.propertyType,
      listing_type: data.listingType,
      status: data.status,
      price_lkr: Number(data.price),
      price_period: data.pricePeriod ?? null,
      featured: Boolean(data.featured),
      district: data.district,
      city: data.city,
      address: data.address ?? null,
      lawyer_id: data.lawyerId && data.lawyerId.length > 0 ? data.lawyerId : null,
    };

    if (data.landArea && data.landAreaUnit === 'perches') insertData.land_area_perches = Number(data.landArea);
    if (data.landArea && data.landAreaUnit === 'acres') insertData.land_area_acres = Number(data.landArea);
    if (data.floorArea) insertData.floor_area_sqft = Number(data.floorArea);
    if (data.bedrooms !== undefined) insertData.bedrooms = Number(data.bedrooms);
    if (data.bathrooms !== undefined) insertData.bathrooms = Number(data.bathrooms);
    if (data.latitude) insertData.latitude = Number(data.latitude);
    if (data.longitude) insertData.longitude = Number(data.longitude);

    const factsToInsert = facts
      .filter((f) => f.label && f.value)
      .map((f, idx) => ({ id: f.id, label: f.label, value: f.value, icon: f.icon ?? null, display_order: idx }));

    const atToInsert = attractions
      .filter((a) => a.name && a.category)
      .map((a, idx) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        distance_km: a.distance ? Number(a.distance) || null : null,
        display_order: idx,
      }));

    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: insertData, facts: factsToInsert, attractions: atToInsert }),
        credentials: 'same-origin',
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || 'Failed to update property');
        setIsSubmitting(false);
        return;
      }

      // Handle image deletion (images not in current list that aren't new)
      const currentImageIds = new Set(images.filter((img) => !img.isNew).map((img) => img.id));
      const oldImageIds = new Set(
        images
          .filter((img) => !img.isNew && !img.id.startsWith('temp-'))
          .map((img) => img.id)
      );

      // Upload new images
      const newImages = images.filter((img) => img.isNew && img.file);
      if (newImages.length > 0) {
        const form = new FormData();
        newImages.forEach((img) => {
          if (img.file) form.append('files', img.file);
        });

        // Set first new image as cover if no current cover exists
        const hasCover = images.some((img) => img.isCover);
        if (!hasCover && newImages.length > 0) {
          form.append('isCover', 'true');
        }

        const upRes = await fetch(`/api/admin/properties/${id}/images`, {
          method: 'POST',
          body: form,
          credentials: 'same-origin',
        });

        const upJson = await upRes.json();
        if (!upRes.ok) {
          toast.error(upJson.error || 'Failed to upload images');
          setIsSubmitting(false);
          return;
        }
      }

      // Reorder and set covers
      const imagesToUpdate = images
        .filter((img) => !img.isNew)
        .map((img, idx) => ({
          id: img.id,
          display_order: idx,
          is_cover: img.isCover,
        }));

      if (imagesToUpdate.length > 0) {
        await Promise.all(
          imagesToUpdate.map((img) =>
            fetch(`/api/admin/properties/${id}/images/${img.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                display_order: img.display_order,
                is_cover: img.is_cover,
              }),
              credentials: 'same-origin',
            })
          )
        );
      }

      toast.success('Property updated');
      router.push('/admin/properties');
    } catch (err) {
      toast.error('Server error');
      setIsSubmitting(false);
    }
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ImagePreview[] = files.map((file) => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      isCover: false,
      isNew: true,
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (id: string) => {
    const image = images.find((img) => img.id === id);
    if (image && image.preview) {
      try {
        URL.revokeObjectURL(image.preview);
      } catch {}
    }
    const remaining = images.filter((img) => img.id !== id);
    // If removed image was cover, set first remaining as cover
    if (image?.isCover && remaining.length > 0 && !remaining.some((img) => img.isCover)) {
      remaining[0].isCover = true;
    }
    setImages(remaining);
  };

  const setCoverImage = (id: string) => {
    setImages((prevImages) =>
      prevImages.map((img) => ({
        ...img,
        isCover: img.id === id,
      }))
    );
  };

  const moveImage = (id: string, direction: 'up' | 'down') => {
    const idx = images.findIndex((img) => img.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === images.length - 1)) return;
    const newImages = [...images];
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newImages[idx], newImages[newIdx]] = [newImages[newIdx], newImages[idx]];
    setImages(newImages);
  };

  const addFact = () => {
    setFacts([...facts, { id: `temp-${Date.now()}`, icon: '', label: '', value: '' }]);
  };

  const removeFact = (id: string) => {
    setFacts(facts.filter((f) => f.id !== id));
  };

  const updateFact = (id: string, field: keyof PropertyFact, value: string) => {
    setFacts((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const addAttraction = () => {
    setAttractions([...attractions, { id: `temp-${Date.now()}`, name: '', category: '', distance: '' }]);
  };

  const removeAttraction = (id: string) => {
    setAttractions(attractions.filter((a) => a.id !== id));
  };

  const updateAttraction = (id: string, field: keyof NearbyAttraction, value: string) => {
    setAttractions((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/properties">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Property</h1>
          <p className="text-muted-foreground">Update property listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} placeholder="Property title" className="mt-1.5" />
              {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                rows={5}
                placeholder="Detailed property description"
                className="mt-1.5"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Property Type</Label>
                <Select value={propertyType} onValueChange={(v) => setValue('propertyType', v as any)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="agricultural">Agricultural</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Listing Type</Label>
                <Select value={listingType} onValueChange={(v) => setValue('listingType', v as any)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="lease">For Lease</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Lawyer</Label>
                <Select
                  value={watch('lawyerId') || ''}
                  onValueChange={(v) => setValue('lawyerId', v === 'none' ? '' : v)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select lawyer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {lawyers.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                        {l.firm ? ` — ${l.firm}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={watch('status')} onValueChange={(v) => setValue('status', v as any)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="featured" className="flex items-center gap-2 mt-2">
                  <Switch
                    checked={watch('featured')}
                    onCheckedChange={(v) => setValue('featured', v)}
                  />
                  Featured
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="price">Price (LKR)</Label>
                <Input
                  id="price"
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="0"
                  className="mt-1.5"
                />
                {errors.price && <p className="mt-1 text-sm text-destructive">{errors.price.message}</p>}
              </div>

              {listingType !== 'sale' && (
                <div>
                  <Label>Price Period</Label>
                  <Select
                    value={watch('pricePeriod') || ''}
                    onValueChange={(v) => setValue('pricePeriod', v as any)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {shouldShowLandArea && (
              <div>
                <Label>Land Area</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    type="number"
                    step="0.01"
                    {...register('landArea', { valueAsNumber: true })}
                    placeholder="Area"
                  />
                  <Select value={watch('landAreaUnit') || 'perches'} onValueChange={(v) => setValue('landAreaUnit', v as any)}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="perches">Perches</SelectItem>
                      <SelectItem value="acres">Acres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {shouldShowFloorArea && (
              <div>
                <Label htmlFor="floorArea">Floor Area (sqft)</Label>
                <Input
                  id="floorArea"
                  type="number"
                  step="0.01"
                  {...register('floorArea', { valueAsNumber: true })}
                  placeholder="Floor area in sqft"
                  className="mt-1.5"
                />
              </div>
            )}

            {shouldShowBedrooms && (
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  {...register('bedrooms', { valueAsNumber: true })}
                  placeholder="Number of bedrooms"
                  className="mt-1.5"
                />
              </div>
            )}

            {shouldShowBathrooms && (
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  {...register('bathrooms', { valueAsNumber: true })}
                  placeholder="Number of bathrooms"
                  className="mt-1.5"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>District</Label>
                <Select value={watch('district')} onValueChange={(v) => setValue('district', v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.district && (
                  <p className="mt-1 text-sm text-destructive">{errors.district.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register('city')} placeholder="City name" className="mt-1.5" />
                {errors.city && <p className="mt-1 text-sm text-destructive">{errors.city.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address (Private)</Label>
              <Input id="address" {...register('address')} placeholder="Full address" className="mt-1.5" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  {...register('latitude', { valueAsNumber: true })}
                  placeholder="Latitude"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  {...register('longitude', { valueAsNumber: true })}
                  placeholder="Longitude"
                  className="mt-1.5"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center cursor-pointer hover:bg-muted/50 transition"
            >
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 font-medium">Drop images here or click to upload</p>
              <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB each</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleAddImages}
              className="hidden"
            />

            {images.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{images.length} image(s)</p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((img, idx) => (
                    <div key={img.id} className="relative group">
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={img.preview}
                          alt={`Image ${idx}`}
                          fill
                          className="object-cover"
                        />
                        {img.isCover && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                          </div>
                        )}
                      </div>

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-lg transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        {idx > 0 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            onClick={() => moveImage(img.id, 'up')}
                            title="Move up"
                          >
                            <GripVertical className="h-4 w-4" />
                          </Button>
                        )}
                        {idx < images.length - 1 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            onClick={() => moveImage(img.id, 'down')}
                            title="Move down"
                          >
                            <GripVertical className="h-4 w-4" />
                          </Button>
                        )}
                        {!img.isCover && (
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            onClick={() => setCoverImage(img.id)}
                            title="Set as cover"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={() => removeImage(img.id)}
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property Facts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Property Facts</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addFact}>
              <Plus className="mr-2 h-4 w-4" />
              Add Fact
            </Button>
          </CardHeader>
          <CardContent>
            {facts.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No facts added yet. Click &quot;Add Fact&quot; to add property features.
              </p>
            ) : (
              <div className="space-y-3">
                {facts.map((fact) => (
                  <div key={fact.id} className="flex items-center gap-2">
                    <Input
                      placeholder="Icon (e.g., car)"
                      value={fact.icon}
                      onChange={(e) => updateFact(fact.id, 'icon', e.target.value)}
                      className="w-24"
                    />
                    <Input
                      placeholder="Label (e.g., Parking)"
                      value={fact.label}
                      onChange={(e) => updateFact(fact.id, 'label', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value (e.g., 2 spaces)"
                      value={fact.value}
                      onChange={(e) => updateFact(fact.id, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFact(fact.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nearby Attractions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Nearby Attractions</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addAttraction}>
              <Plus className="mr-2 h-4 w-4" />
              Add Attraction
            </Button>
          </CardHeader>
          <CardContent>
            {attractions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No attractions added yet. Click &quot;Add Attraction&quot; to add nearby places.
              </p>
            ) : (
              <div className="space-y-3">
                {attractions.map((attraction) => (
                  <div key={attraction.id} className="flex items-center gap-2">
                    <Input
                      placeholder="Name (e.g., Central Hospital)"
                      value={attraction.name}
                      onChange={(e) => updateAttraction(attraction.id, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Select
                      value={attraction.category}
                      onValueChange={(v) => updateAttraction(attraction.id, 'category', v)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beach">Beach</SelectItem>
                        <SelectItem value="supermarket">Supermarket</SelectItem>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="school">School</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="airport">Airport</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Distance (km)"
                      type="number"
                      step="0.1"
                      value={attraction.distance}
                      onChange={(e) => updateAttraction(attraction.id, 'distance', e.target.value)}
                      className="w-32"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttraction(attraction.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}

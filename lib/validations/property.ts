import { z } from 'zod'

export const propertySchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be lower-case, URL friendly (a-z0-9 and hyphens)')
      .min(3)
      .max(100),

    title: z.string().min(5).max(200),

    description: z.string().nullable().optional(),

    property_type: z.enum(['land', 'house', 'apartment', 'commercial', 'agricultural']),

    listing_type: z.enum(['sale', 'rent', 'lease']),

    status: z.enum(['active', 'draft', 'sold', 'rented']),

    price_lkr: z.number().int().positive(),

    price_period: z.enum(['monthly', 'yearly']).nullable(),

    land_area_perches: z.number().positive().nullable().optional(),
    land_area_acres: z.number().positive().nullable().optional(),
    floor_area_sqft: z.number().positive().nullable().optional(),

    bedrooms: z.number().int().min(0).max(50).nullable().optional(),
    bathrooms: z.number().int().min(0).max(50).nullable().optional(),

    district: z.string().min(1),
    city: z.string().min(1),

    address: z.string().nullable().optional(),

    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),

    featured: z.boolean().default(false),

    lawyer_id: z.string().uuid().nullable().optional(),
  })
  .superRefine((val, ctx) => {
    // If listing is rent, price_period must be set
    if (val.listing_type === 'rent') {
      if (!val.price_period) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'price_period is required for rent listings',
          path: ['price_period'],
        })
      }
    }

    // If listing is sale or lease, price_period must be null
    if (val.listing_type === 'sale' || val.listing_type === 'lease') {
      if (val.price_period != null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'price_period must be null for sale or lease listings',
          path: ['price_period'],
        })
      }
    }
  })

export type PropertyFormValues = z.infer<typeof propertySchema>

export default propertySchema

# Copilot Prompt — Real Estate Backend Operations

## Your Role
You are implementing the data layer and backend operations for a production real estate web app. Before writing a single line of code, **read the existing files in the project** — understand the folder structure, existing components, types, and Supabase client setup. Do not duplicate what already exists. Fit your code into the existing project cleanly.

---

## Project Context

- **Framework:** Next.js (App Router, latest)
- **Database:** Supabase (PostgreSQL) with Row-Level Security enabled
- **UI:** shadcn/ui + Tailwind CSS
- **Auth:** Already configured. Supabase clients exist at:
  - `lib/supabase/client.ts` → browser client (for Client Components)
  - `lib/supabase/server.ts` → server client + admin client (for Server Components, Route Handlers)
  - `lib/supabase/middleware.ts` → session refresh + route protection
  - `lib/supabase/database.types.ts` → auto-generated Supabase types
- **Forms:** react-hook-form + zod
- **Icons:** Lucide React

---

## Database Schema (read carefully — code must match exactly)

### Enums
```
property_type_enum:    land | house | apartment | commercial | agricultural
listing_type_enum:     sale | rent | lease
property_status_enum:  active | draft | sold | rented
inquiry_type_enum:     general | site_visit | document_request
inquiry_status_enum:   new | read | replied
attraction_category_enum: beach | supermarket | hospital | school | restaurant | airport | transport | other
user_role_enum:        user | admin
```

### Key tables and columns
```
properties:         id, slug, title, description, property_type, listing_type, status,
                    price_lkr, price_period (monthly|yearly|null), land_area_perches,
                    land_area_acres, floor_area_sqft, bedrooms, bathrooms, district, city,
                    address (private), latitude numeric(9,6), longitude numeric(9,6),
                    featured, views_count (bigint), lawyer_id (FK→lawyers),
                    deleted_at (soft delete), updated_at, created_at, search_vector (tsvector)

property_images:    id, property_id, storage_path, alt_text, is_cover, display_order, blur_data_url
property_documents: id, property_id, storage_path, label, is_public
property_facts:     id, property_id, label, value, icon, display_order
nearby_attractions: id, property_id, name, category, distance_km, display_order
inquiries:          id, property_id, user_id (nullable), name, email, phone, country,
                    message, inquiry_type, status, admin_notes, deleted_at, updated_at, created_at
saved_properties:   user_id, property_id, saved_at  (composite PK)
lawyers:            id, full_name, firm_name, phone, email, address, notes, active, created_at
profiles:           id, full_name, phone, country, avatar_url, role, updated_at, created_at
exchange_rates_cache: id, base (UNIQUE), usd_rate, eur_rate, fetched_at
property_view_logs: id, property_id, user_id (nullable), viewed_at, viewed_date
```

### Critical rules
- **Soft delete:** Never hard-delete properties or inquiries. Set `deleted_at = now()`. All queries must filter `deleted_at IS NULL`.
- **Active filter:** Public queries always filter `status = 'active' AND deleted_at IS NULL`.
- **Price:** `price_lkr` is the single source of truth. USD/EUR conversion is done client-side from `exchange_rates_cache`. Never store converted prices.
- **Admin check:** Use the existing `is_admin()` (JWT) and `is_admin_strict()` (DB) Supabase functions. Never reimplement role checks in app code — RLS handles it. On the server, verify admin by checking the JWT claim: `session.access_token` decoded payload `user_role === 'admin'`.
- **Images:** Stored in Supabase Storage bucket `property-images`. Path format: `{property_id}/{filename}`. Public CDN URLs via `supabase.storage.from('property-images').getPublicUrl(path)`.
- **Documents:** Stored in bucket `property-docs`. Private — always serve via signed URLs: `supabase.storage.from('property-docs').createSignedUrl(path, 3600)`.
- **Views:** Never UPDATE `views_count` directly. Always call the RPC: `supabase.rpc('increment_property_views', { p_slug: slug })`.
- **select():** Always specify exact columns needed. Never use `select('*')` in any query.

---

## TypeScript Types

Define these in `types/` (or check if they already exist — do not duplicate):

```ts
// types/property.ts
export interface Property {
  id: string
  slug: string
  title: string
  description: string | null
  property_type: 'land' | 'house' | 'apartment' | 'commercial' | 'agricultural'
  listing_type: 'sale' | 'rent' | 'lease'
  status: 'active' | 'draft' | 'sold' | 'rented'
  price_lkr: number
  price_period: 'monthly' | 'yearly' | null
  land_area_perches: number | null
  land_area_acres: number | null
  floor_area_sqft: number | null
  bedrooms: number | null
  bathrooms: number | null
  district: string
  city: string
  featured: boolean
  views_count: number
  lawyer_id: string | null
  created_at: string
  updated_at: string
}

export interface PropertyImage {
  id: string
  property_id: string
  storage_path: string
  alt_text: string | null
  is_cover: boolean
  display_order: number
  blur_data_url: string | null
}

export interface PropertyDocument {
  id: string
  property_id: string
  storage_path: string
  label: string
  is_public: boolean
}

export interface PropertyFact {
  id: string
  property_id: string
  label: string
  value: string
  icon: string | null
  display_order: number
}

export interface NearbyAttraction {
  id: string
  property_id: string
  name: string
  category: 'beach' | 'supermarket' | 'hospital' | 'school' | 'restaurant' | 'airport' | 'transport' | 'other'
  distance_km: number | null
  display_order: number
}

export interface Lawyer {
  id: string
  full_name: string
  firm_name: string | null
  phone: string | null
  email: string | null
  address: string | null
  notes: string | null
  active: boolean
}

export interface Inquiry {
  id: string
  property_id: string | null
  user_id: string | null
  name: string
  email: string
  phone: string | null
  country: string | null
  message: string | null
  inquiry_type: 'general' | 'site_visit' | 'document_request'
  status: 'new' | 'read' | 'replied'
  admin_notes: string | null
  created_at: string
}

// Full property detail (joined)
export interface PropertyDetail extends Property {
  property_images: PropertyImage[]
  property_facts: PropertyFact[]
  nearby_attractions: NearbyAttraction[]
  property_documents: PropertyDocument[]
  lawyers: Lawyer | null
}

// Card variant (minimal fields for listing grid)
export interface PropertyCard {
  id: string
  slug: string
  title: string
  property_type: Property['property_type']
  listing_type: Property['listing_type']
  status: Property['status']
  price_lkr: number
  price_period: Property['price_period']
  land_area_perches: number | null
  bedrooms: number | null
  bathrooms: number | null
  district: string
  city: string
  cover_image: string | null   // resolved public URL, not storage_path
  cover_alt: string | null
}

// Filter params from URL search params
export interface PropertyFilters {
  search?: string
  type?: string
  listing?: string
  district?: string
  min_price?: string
  max_price?: string
  min_area?: string
  max_area?: string
  beds?: string
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'most_viewed'
  page?: string
}
```

---

## What to Build

Work through each section below. Check existing files first. Write clean, readable code. Simple things should be simple.

---

### 1. Property Queries — `lib/queries/properties.ts`

Server-side query functions used by Server Components. Use the server client from `lib/supabase/server.ts`. All functions are async, return typed data, handle errors gracefully (return `null` or `[]` on error — never throw unless it's a programming error).

**`getProperties(filters: PropertyFilters)`**
- Used on the `/properties` page (SSR)
- Applies all filters: search (textSearch on search_vector), property_type, listing_type, district, price range, land area, bedrooms
- Always filters `status = 'active'` and `deleted_at IS NULL`
- Sorting: price_asc → `price_lkr asc`, price_desc → `price_lkr desc`, newest → `created_at desc`, most_viewed → `views_count desc`. Default: newest.
- Pagination: 12 per page. Accept `page` param.
- Select only card fields + cover image in a subquery or separate resolve step
- Return `{ properties: PropertyCard[], count: number }`

**`getPropertyBySlug(slug: string)`**
- Used on `/properties/[slug]` (ISR)
- Full join: images, facts, attractions, documents, lawyers
- Images ordered by `display_order asc`
- Facts ordered by `display_order asc`
- Attractions ordered by `display_order asc`
- Return `PropertyDetail | null`

**`getFeaturedProperties()`**
- Used on home page
- Filter: `featured = true`, `status = 'active'`, `deleted_at IS NULL`
- Limit 6
- Return `PropertyCard[]`

**`getRelatedProperties(propertyId: string, district: string, propertyType: string)`**
- Exclude current property
- Match same district first, fallback to same type
- Limit 4
- Return `PropertyCard[]`

**`resolvePropertyCards(rows)`**
- Helper that takes raw property rows and resolves cover image public URL from Supabase Storage
- Pattern: find image where `is_cover = true` (or first image), call `getPublicUrl(storage_path)`
- Returns `PropertyCard[]`

---

### 2. Property CRUD — `lib/actions/properties.ts`

Server Actions (`'use server'`). Used by admin forms. All actions must:
1. Verify the caller is admin by decoding the JWT claim (`user_role === 'admin'`). Return `{ error: 'Unauthorized' }` immediately if not.
2. Use the **server client** (RLS-protected) not the admin client — RLS already restricts to admins.
3. Validate input with zod before touching the database.
4. Return `{ data, error }` — never throw from a Server Action.

**`createProperty(formData)`**
- Zod schema validates all required fields
- Insert into `properties`
- After insert: upload images (see image handling below), insert facts rows, insert attraction rows
- On success: call `revalidatePath('/properties')` and `revalidatePath('/')`
- Return `{ data: { slug }, error }`

**`updateProperty(id, formData)`**
- Zod validation
- Update `properties` row
- Handle image additions/removals/reordering
- Handle facts: delete existing rows for this property, re-insert updated ones (simplest correct approach for ordered key-value lists)
- Handle attractions: same delete-and-reinsert pattern
- On success: `revalidatePath('/properties')`, `revalidatePath('/properties/[slug]', 'page')`
- Return `{ error }`

**`deleteProperty(id)`**
- Soft delete only: `UPDATE properties SET deleted_at = now() WHERE id = $1`
- On success: `revalidatePath('/properties')`, `revalidatePath('/')`
- Return `{ error }`

**`togglePropertyStatus(id, status)`**
- Updates `status` column only
- Valid transitions: draft↔active, active→sold, active→rented
- `revalidatePath` on success
- Return `{ error }`

**`duplicateProperty(id)`**
- Read the original property + its facts + attractions
- Insert a copy with `status = 'draft'`, `slug = original-slug + '-copy'`, `featured = false`
- Copy facts and attractions rows
- Do NOT copy images (too expensive — admin adds images manually to the copy)
- Return `{ data: { id }, error }`

---

### 3. Image Handling — `lib/actions/images.ts`

Server Actions for image operations.

**`uploadPropertyImage(propertyId, file, altText, isCover)`**
- Upload file to Supabase Storage: bucket `property-images`, path `{propertyId}/{timestamp}-{filename}`
- Use the server client's storage API
- Insert row into `property_images`
- If `isCover = true`: first set all existing images for this property to `is_cover = false`, then insert with `is_cover = true` (respects the unique partial index)
- Return `{ data: { id, storage_path }, error }`

**`deletePropertyImage(imageId)`**
- Read the `storage_path` from `property_images`
- Delete from Storage: `supabase.storage.from('property-images').remove([path])`
- Delete the DB row
- Return `{ error }`

**`reorderPropertyImages(imageIds: string[])`**
- Accept ordered array of image IDs
- Update each row's `display_order` to its index in the array
- Use a Promise.all of individual updates (simple and clear — this is a low-frequency admin operation)
- Return `{ error }`

**`setCoverImage(imageId, propertyId)`**
- Set all images for this property to `is_cover = false`
- Set the target image to `is_cover = true`
- Return `{ error }`

---

### 4. Document Handling — `lib/actions/documents.ts`

**`uploadPropertyDocument(propertyId, file, label, isPublic)`**
- Upload to `property-docs` bucket, path `{propertyId}/{timestamp}-{filename}`
- Insert into `property_documents`
- Return `{ data: { id }, error }`

**`deletePropertyDocument(documentId)`**
- Read `storage_path` from DB
- Delete from Storage
- Delete DB row
- Return `{ error }`

**`getSignedDocumentUrl(storagePath)`**
- Call `supabase.storage.from('property-docs').createSignedUrl(path, 3600)`
- 3600 second expiry (1 hour)
- Return `{ url, error }`
- Use this in the property detail page: authenticated users get a signed URL, guests see "Login to Download"

---

### 5. Inquiry Operations

**Route Handler — `app/api/inquiries/route.ts`**

`POST /api/inquiries`
- Parse and validate body with zod: `name` (required), `email` (required, valid email), `phone` (optional), `country` (optional), `message` (optional), `property_id` (required, uuid), `inquiry_type` (enum, default 'general')
- Get current user if logged in (attach `user_id` if authenticated — do not require login)
- Insert into `inquiries` table
- The DB trigger handles rate limiting — if it throws `too_many_requests` ERRCODE, return HTTP 429 with a user-friendly message
- Return HTTP 201 on success, appropriate error codes on failure
- Do NOT send email from this route (that is a separate concern)

**Server Actions — `lib/actions/inquiries.ts`** (admin only)

**`updateInquiryStatus(id, status)`**
- Valid values: 'new' | 'read' | 'replied'
- Admin only
- Return `{ error }`

**`updateAdminNotes(id, notes)`**
- Admin only
- Updates `admin_notes` field only
- Return `{ error }`

**`deleteInquiry(id)`**
- Soft delete: set `deleted_at = now()`
- Admin only
- Return `{ error }`

**`getInquiries(filters)`**
- Admin only — use server client (RLS restricts to admin)
- Filters: status, property_id, inquiry_type, date range
- Join with properties (title only) for display
- Filter `deleted_at IS NULL`
- Order by `created_at desc`
- Return `{ data: Inquiry[], error }`

---

### 6. Saved Properties — `lib/actions/saved.ts`

**`saveProperty(propertyId)`**
- Client-callable Server Action
- Get current user — return error if not authenticated
- Insert into `saved_properties`
- Handle the case where it already exists (unique constraint) — treat as success, not error
- Return `{ error }`

**`unsaveProperty(propertyId)`**
- Delete from `saved_properties` where `user_id = current user` and `property_id = propertyId`
- Return `{ error }`

**`getSavedProperties(userId)`**
- Join with properties (card fields) + cover image
- Filter `deleted_at IS NULL` on properties
- Return `PropertyCard[]`

**`isPropertySaved(propertyId)`**
- Returns `boolean`
- Used to set the initial heart icon state on PropertyCard

---

### 7. Lawyer Operations

**`lib/queries/lawyers.ts`**

**`getLawyers()`** — returns all active lawyers. Used in admin property form dropdown.

**`lib/actions/lawyers.ts`** (admin only)

**`createLawyer(data)`** — insert into lawyers table. Zod validation: full_name required, email must be valid if provided.

**`updateLawyer(id, data)`** — update lawyer row.

**`toggleLawyerActive(id)`** — toggle `active` boolean.

---

### 8. Currency — `lib/currency.ts`

**`getExchangeRates()`**
- Server-side function
- Query `exchange_rates_cache` where `base = 'LKR'`
- Return `{ usd_rate: number, eur_rate: number }`
- This is called once in the server component and passed as props to the client CurrencyToggle component

**`convertPrice(priceLkr, currency, rates)`**
- Pure function, no async
- `currency: 'LKR' | 'USD' | 'EUR'`
- Returns the converted numeric value
- Used in the CurrencyToggle client component for instant switching

**`formatPrice(amount, currency)`**
- Pure function
- Formats with correct currency symbol and locale separators
- LKR: `Rs. 45,000,000` — USD: `$139,500` — EUR: `€130,500`

---

### 9. Property Detail Page Integration

In `app/properties/[slug]/page.tsx`, after fetching the property:

**Lawyer Card** — shown in the contact sidebar / below the inquiry form:
- If `property.lawyers` is not null, render a card with:
  - Lawyer's full name (bold)
  - Firm name (if present, muted text below name)
  - Phone number with a click-to-call link (`tel:`)
  - Email with a `mailto:` link
  - A small "briefcase" icon (Lucide) as the card header icon
  - Label it clearly: "Your Legal Representative" or "Assigned Lawyer"
- If no lawyer assigned, render nothing (do not show an empty card)

**View count increment** — call the RPC on page load:
- In the page component (server side), after fetching the property, trigger the view increment
- Since Server Components can't set cookies, fire the RPC server-side for authenticated users
- For anonymous users, add a small Client Component that checks `localStorage` for `viewed_{slug}` key, skips the call if found, otherwise calls the RPC and sets the key. This is the app-layer dedup for anon visitors documented in the DB setup.

**Signed document URLs** — for documents where `is_public = false`:
- Generate signed URLs server-side before passing to the client
- Pass as `{ label, url, is_public }` to the document list component
- Guests: the document component receives `url: null` and shows "Login to Download"

---

### 10. Admin Property Form Zod Schema

Define in `lib/validations/property.ts`. Used by the admin create/edit form.

```ts
// Fields and their rules:
slug:               string, regex /^[a-z0-9]+(-[a-z0-9]+)*$/, min 3, max 100
title:              string, min 5, max 200
description:        string optional
property_type:      enum (land|house|apartment|commercial|agricultural)
listing_type:       enum (sale|rent|lease)
status:             enum (active|draft|sold|rented)
price_lkr:          number, positive, integer
price_period:       'monthly' | 'yearly' | null
                    — zod .refine(): if listing_type is 'rent', price_period must be set
                    — if listing_type is 'sale' or 'lease', price_period must be null
land_area_perches:  number optional, positive
land_area_acres:    number optional, positive
floor_area_sqft:    number optional, positive
bedrooms:           integer optional, min 0, max 50
bathrooms:          integer optional, min 0, max 50
district:           string, non-empty
city:               string, non-empty
address:            string optional
latitude:           number optional, between -90 and 90
longitude:          number optional, between -180 and 180
featured:           boolean, default false
lawyer_id:          uuid string optional, nullable
```

---

### 11. Excel Export — `app/api/admin/export/route.ts`

`GET /api/admin/export`
- Verify admin from JWT (decode `access_token` claim, check `user_role === 'admin'`). Return 401 if not.
- Use the **admin client** (`createAdminClient()`) to bypass RLS and fetch all properties regardless of status
- Fetch all properties with: id, slug, title, property_type, listing_type, status, price_lkr, district, city, bedrooms, bathrooms, land_area_perches, land_area_acres, floor_area_sqft, featured, views_count, created_at
- Join lawyer name (full_name from lawyers table)
- Use the `xlsx` library to build the workbook:
  - Sheet 1: "Properties" — one row per property, all fields as columns
  - Column headers in Title Case
  - Price formatted as number (no currency symbol — let Excel handle formatting)
  - Dates formatted as `YYYY-MM-DD`
- Set response headers: `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `Content-Disposition: attachment; filename="properties-export-{date}.xlsx"`
- Stream the buffer as the response

---

## Code Quality Rules — Follow These Without Exception

1. **Read existing files first.** Do not create files that already exist. Do not redefine types that are already defined.
2. **Server vs Client boundary is strict.** `createClient()` from `server.ts` is only used in server-side code (Server Components, Server Actions, Route Handlers). `createClient()` from `client.ts` is only used in Client Components (`"use client"`). Never mix them.
3. **Never use `select('*')`** in any Supabase query. Always list exact columns.
4. **Always filter soft-deleted rows.** Any query on `properties` or `inquiries` must include `deleted_at IS NULL` unless in an admin context explicitly showing all.
5. **Error handling pattern:** Functions return `{ data, error }` or `{ error }`. Errors are typed strings. No unhandled promise rejections. No silent failures.
6. **No complex abstractions for simple things.** A function that inserts one row should just insert one row. No factory patterns, no base classes, no over-engineered helpers.
7. **Form validation happens in two places:** zod schema (server-side, in Server Action) AND client-side (react-hook-form with the same zod schema via `zodResolver`). Never trust only client-side validation.
8. **Admin verification is always the first thing** in any admin Server Action or Route Handler before any DB operation.
9. **Revalidate paths after mutations.** Every Server Action that changes data that appears on a public page must call `revalidatePath` for the affected pages.
10. **Images use `next/image`.** Always pass `width` + `height` or use `fill` with a sized container. Always pass meaningful `alt` text. Cover images are `priority`. All others are lazy (default).

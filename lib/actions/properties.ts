"use server"

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '../supabase/server'
import propertySchema from '../validations/property'
import type { PropertyFormValues } from '../validations/property'

const FactsSchema = z.array(
  z.object({
    label: z.string(),
    value: z.string(),
    icon: z.string().nullable().optional(),
    display_order: z.number().int().optional(),
  })
)

const AttractionsSchema = z.array(
  z.object({
    name: z.string(),
    category: z.enum(['beach', 'supermarket', 'hospital', 'school', 'restaurant', 'airport', 'transport', 'other']),
    distance_km: z.number().nullable().optional(),
    display_order: z.number().int().optional(),
  })
)

type CreatePayload = {
  data: PropertyFormValues
  facts?: z.infer<typeof FactsSchema>
  attractions?: z.infer<typeof AttractionsSchema>
}

async function isAdmin(supabaseClient: any): Promise<boolean> {
  try {
    const { data } = await supabaseClient.auth.getSession()
    const session = data?.session
    const token = session?.access_token
    if (!token) return false

    const parts = token.split('.')
    if (parts.length < 2) return false
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'))
    return payload?.user_role === 'admin'
  } catch {
    return false
  }
}

/**
 * createProperty
 */
export async function createProperty(payload: CreatePayload): Promise<{ data?: { id: string; slug: string }; error?: string }>{
  try {
    const supabase = (await createClient()) as any

    if (!(await isAdmin(supabase))) {
      return { error: 'Unauthorized' }
    }

    const parse = propertySchema.safeParse(payload.data)
    if (!parse.success) {
      // return readable validation errors to the client for easier debugging
      const issues = parse.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }))
      return { error: `Validation failed: ${JSON.stringify(issues)}` }
    }

    const insertData = parse.data

    const { data: inserted, error: insertError } = await supabase
      .from('properties')
      .insert([insertData])
      .select('id,slug')
      .limit(1)

    if (insertError || !inserted || inserted.length === 0) {
      return { error: insertError?.message ?? 'Insert failed' }
    }

    const prop = inserted[0]

    // insert facts
    if (payload.facts && payload.facts.length > 0) {
      const factsToInsert = payload.facts.map((f, idx) => ({
        property_id: prop.id,
        label: f.label,
        value: f.value,
        icon: f.icon ?? null,
        display_order: f.display_order ?? idx,
      }))

      await supabase.from('property_facts').insert(factsToInsert)
    }

    // insert attractions
    if (payload.attractions && payload.attractions.length > 0) {
      const atToInsert = payload.attractions.map((a, idx) => ({
        property_id: prop.id,
        name: a.name,
        category: a.category,
        distance_km: a.distance_km ?? null,
        display_order: a.display_order ?? idx,
      }))

      await supabase.from('nearby_attractions').insert(atToInsert)
    }

    // revalidate public pages
    try {
      revalidatePath('/properties')
      revalidatePath('/')
    } catch {
      // noop
    }

  return { data: { id: prop.id, slug: prop.slug } }
  } catch (err) {
    return { error: 'Server error' }
  }
}

/** updateProperty
 * Simplified: updates properties row, replaces facts and attractions (delete+insert).
 * Image handling should be done via image actions.
 */
export async function updateProperty(id: string, payload: CreatePayload): Promise<{ error?: string }>{
  try {
    const supabase = (await createClient()) as any

    if (!(await isAdmin(supabase))) return { error: 'Unauthorized' }

  const parse = propertySchema.safeParse(payload.data)
  if (!parse.success) return { error: `Validation failed: ${JSON.stringify(parse.error.format())}` }

    const updateData = parse.data

    const { error: updErr } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', id)

    if (updErr) return { error: updErr.message }

    // replace facts
    await supabase.from('property_facts').delete().eq('property_id', id)
    if (payload.facts && payload.facts.length > 0) {
      const factsToInsert = payload.facts.map((f, idx) => ({
        property_id: id,
        label: f.label,
        value: f.value,
        icon: f.icon ?? null,
        display_order: f.display_order ?? idx,
      }))
      await supabase.from('property_facts').insert(factsToInsert)
    }

    // replace attractions
    await supabase.from('nearby_attractions').delete().eq('property_id', id)
    if (payload.attractions && payload.attractions.length > 0) {
      const atToInsert = payload.attractions.map((a, idx) => ({
        property_id: id,
        name: a.name,
        category: a.category,
        distance_km: a.distance_km ?? null,
        display_order: a.display_order ?? idx,
      }))
      await supabase.from('nearby_attractions').insert(atToInsert)
    }

    // revalidate
    try {
      revalidatePath('/properties')
      // try revalidating the property page if slug changed or known
      if (updateData.slug) revalidatePath(`/properties/${updateData.slug}`)
    } catch {}

    return {}
  } catch (err) {
    return { error: 'Server error' }
  }
}

/** deleteProperty — soft delete */
export async function deleteProperty(id: string): Promise<{ error?: string }>{
  try {
    const supabase = (await createClient()) as any
    if (!(await isAdmin(supabase))) return { error: 'Unauthorized' }

    const { error } = await supabase
      .from('properties')
      .update({ deleted_at: 'now()' }, { returning: 'minimal' })
      .eq('id', id)

    if (error) return { error: error.message }

    try {
      revalidatePath('/properties')
      revalidatePath('/')
    } catch {}

    return {}
  } catch (err) {
    return { error: 'Server error' }
  }
}

/** togglePropertyStatus */
export async function togglePropertyStatus(id: string, status: 'draft' | 'active' | 'sold' | 'rented') : Promise<{ error?: string }>{
  try {
    const supabase = (await createClient()) as any
    if (!(await isAdmin(supabase))) return { error: 'Unauthorized' }

    // fetch current
    const { data, error: selErr } = await supabase.from('properties').select('status,slug').eq('id', id).limit(1)
    if (selErr || !data || data.length === 0) return { error: selErr?.message ?? 'Not found' }

    const current = data[0]

    // validate transition
    const valid = (() => {
      if (current.status === 'draft' && status === 'active') return true
      if (current.status === 'active' && (status === 'draft' || status === 'sold' || status === 'rented')) return true
      if (current.status === 'draft' && status === 'draft') return true
      return false
    })()

    if (!valid) return { error: 'Invalid status transition' }

    const { error: updErr } = await supabase.from('properties').update({ status }).eq('id', id)
    if (updErr) return { error: updErr.message }

    try {
      revalidatePath('/properties')
      if (current.slug) revalidatePath(`/properties/${current.slug}`)
    } catch {}

    return {}
  } catch (err) {
    return { error: 'Server error' }
  }
}

/** duplicateProperty */
export async function duplicateProperty(id: string): Promise<{ data?: { id: string }; error?: string }>{
  try {
    const supabase = (await createClient()) as any
    if (!(await isAdmin(supabase))) return { error: 'Unauthorized' }

    const { data: propData, error: propErr } = await supabase.from('properties').select('*').eq('id', id).limit(1)
    if (propErr || !propData || propData.length === 0) return { error: propErr?.message ?? 'Original not found' }

    const original = propData[0]

    // fetch facts & attractions
    const { data: facts } = await supabase.from('property_facts').select('label,value,icon,display_order').eq('property_id', id)
    const { data: at } = await supabase.from('nearby_attractions').select('name,category,distance_km,display_order').eq('property_id', id)

    // create copy
    const copy = { ...original }
    delete copy.id
    copy.slug = `${original.slug}-copy`
    copy.status = 'draft'
    copy.featured = false
    copy.created_at = new Date().toISOString()
    copy.updated_at = new Date().toISOString()
    copy.deleted_at = null

    const { data: inserted, error: insErr } = await supabase.from('properties').insert([copy]).select('id').limit(1)
    if (insErr || !inserted || inserted.length === 0) return { error: insErr?.message ?? 'Insert failed' }

    const newId = inserted[0].id

    if (facts && facts.length > 0) {
      const factsToInsert = facts.map((f: any) => ({ property_id: newId, label: f.label, value: f.value, icon: f.icon ?? null, display_order: f.display_order }))
      await supabase.from('property_facts').insert(factsToInsert)
    }

    if (at && at.length > 0) {
      const atToInsert = at.map((a: any) => ({ property_id: newId, name: a.name, category: a.category, distance_km: a.distance_km ?? null, display_order: a.display_order }))
      await supabase.from('nearby_attractions').insert(atToInsert)
    }

    return { data: { id: newId } }
  } catch (err) {
    return { error: 'Server error' }
  }
}

// exported as named functions above

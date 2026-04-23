"use server"

import { createClient } from '../supabase/server'
import type { PropertyCard } from '../../types/property'
import { resolvePropertyCards } from '../queries/properties'

/** saveProperty - client-callable Server Action */
export async function saveProperty(propertyId: string): Promise<{ error?: string }>{
  try {
    const supabase = (await createClient()) as any

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id
    if (!userId) return { error: 'Not authenticated' }

    const payload = { user_id: userId, property_id: propertyId }

    const { error } = await supabase.from('saved_properties').insert([payload] as any)

    if (error) {
      const msg = String(error.message ?? '')
      // unique constraint -> treat as success
      if (String(error.code ?? '').includes('23505') || msg.toLowerCase().includes('duplicate') ) {
        return {}
      }
      return { error: error.message }
    }

    return {}
  } catch (err) {
    return { error: 'Server error' }
  }
}

export async function unsaveProperty(propertyId: string): Promise<{ error?: string }>{
  try {
    const supabase = (await createClient()) as any
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id
    if (!userId) return { error: 'Not authenticated' }

    const { error } = await supabase.from('saved_properties').delete().eq('user_id', userId).eq('property_id', propertyId)
    if (error) return { error: error.message }
    return {}
  } catch (err) {
    return { error: 'Server error' }
  }
}

export async function getSavedProperties(userId: string): Promise<PropertyCard[]> {
  try {
    const supabase = (await createClient()) as any

    const { data: rows, error } = await supabase
      .from('saved_properties')
      .select('property_id')
      .eq('user_id', userId)

    if (error || !rows) return []

    const ids = rows.map((r: any) => r.property_id)
    if (ids.length === 0) return []

    const { data: props, error: pErr } = await supabase
      .from('properties')
      .select('id,slug,title,property_type,listing_type,status,price_lkr,price_period,land_area_perches,bedrooms,bathrooms,district,city')
      .in('id', ids)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (pErr || !props) return []

    const cards = await resolvePropertyCards(props)
    return cards
  } catch (err) {
    return []
  }
}

export async function isPropertySaved(propertyId: string): Promise<boolean> {
  try {
    const supabase = (await createClient()) as any
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id
    if (!userId) return false

    const { data, error } = await supabase.from('saved_properties').select('property_id').eq('user_id', userId).eq('property_id', propertyId).limit(1)
    if (error) return false
    return Array.isArray(data) && data.length > 0
  } catch (err) {
    return false
  }
}



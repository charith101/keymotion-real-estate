"use server"

import { z } from 'zod'
import { createClient } from '../supabase/server'
import type { Inquiry } from '../../types/property'

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

export async function updateInquiryStatus(id: string, status: 'new' | 'read' | 'replied') : Promise<{ error?: string }>{
  try {
    const supabase = (await createClient()) as any
    if (!(await isAdmin(supabase))) return { error: 'Unauthorized' }

    const allowed = ['new', 'read', 'replied']
    if (!allowed.includes(status)) return { error: 'Invalid status' }

    const { error } = await supabase.from('inquiries').update({ status }).eq('id', id)
    if (error) return { error: error.message }
    return {}
  } catch (err) {
    return { error: 'Server error' }
  }
}

export async function updateAdminNotes(id: string, notes: string | null) : Promise<{ error?: string }>{
  try {
    const supabase = (await createClient()) as any
    if (!(await isAdmin(supabase))) return { error: 'Unauthorized' }

    const { error } = await supabase.from('inquiries').update({ admin_notes: notes ?? null }).eq('id', id)
    if (error) return { error: error.message }
    return {}
  } catch (err) {
    return { error: 'Server error' }
  }
}

export async function deleteInquiry(id: string) : Promise<{ error?: string }>{
  try {
    const supabase = (await createClient()) as any
    if (!(await isAdmin(supabase))) return { error: 'Unauthorized' }

    const { error } = await supabase.from('inquiries').update({ deleted_at: 'now()' }).eq('id', id)
    if (error) return { error: error.message }
    return {}
  } catch (err) {
    return { error: 'Server error' }
  }
}

type InquiriesFilter = {
  status?: 'new' | 'read' | 'replied'
  property_id?: string
  inquiry_type?: 'general' | 'site_visit' | 'document_request'
  from?: string // ISO date
  to?: string // ISO date
}

export async function getInquiries(filters: InquiriesFilter): Promise<{ data?: Inquiry[]; error?: string }>{
  try {
    const supabase = (await createClient()) as any
    if (!(await isAdmin(supabase))) return { error: 'Unauthorized' }

    let q = supabase
      .from('inquiries')
      .select('id,property_id,user_id,name,email,phone,country,message,inquiry_type,status,admin_notes,created_at,properties(title)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (filters.status) q = q.eq('status', filters.status)
    if (filters.property_id) q = q.eq('property_id', filters.property_id)
    if (filters.inquiry_type) q = q.eq('inquiry_type', filters.inquiry_type)
    if (filters.from) q = q.gte('created_at', filters.from)
    if (filters.to) q = q.lte('created_at', filters.to)

    const { data, error } = await q
    if (error) return { error: error.message }

    // map results to Inquiry[] (properties.title will be in properties)
    const mapped: Inquiry[] = (data || []).map((r: any) => ({
      id: r.id,
      property_id: r.property_id,
      user_id: r.user_id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      country: r.country,
      message: r.message,
      inquiry_type: r.inquiry_type,
      status: r.status,
      admin_notes: r.admin_notes,
      created_at: r.created_at,
    }))

    return { data: mapped }
  } catch (err) {
    return { error: 'Server error' }
  }
}

// exported as named functions above

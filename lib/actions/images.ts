"use server"

import { z } from 'zod'
import { createClient } from '../supabase/server'

const UploadImageSchema = z.object({
  propertyId: z.string().uuid(),
  fileName: z.string(),
  isCover: z.boolean().optional(),
  altText: z.string().nullable().optional(),
})

const IdSchema = z.string().uuid()

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

export async function uploadPropertyImage(propertyId: string, file: any, altText?: string | null, isCover = false) {
  try {
    const supabase = (await createClient()) as any

    if (!(await isAdmin(supabase))) return { error: 'Unauthorized' }

    // basic validation
    const name = file?.name ?? file?.filename ?? null
    const parsed = UploadImageSchema.safeParse({ propertyId, fileName: name, isCover, altText })
    if (!parsed.success) return { error: 'Invalid input' }

    const timestamp = Date.now()
    const filename = `${timestamp}-${parsed.data.fileName}`
    const storagePath = `${propertyId}/${filename}`

    // upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(storagePath, file)

    if (uploadError) return { error: uploadError.message }

    // if isCover true, unset existing covers first
    if (isCover) {
      await supabase.from('property_images').update({ is_cover: false }).eq('property_id', propertyId)
    }

    // determine display_order (append to end)
    const { data: existing } = await supabase.from('property_images').select('display_order').eq('property_id', propertyId).order('display_order', { ascending: false }).limit(1)
    const nextOrder = (existing && existing.length > 0 && typeof existing[0].display_order === 'number') ? existing[0].display_order + 1 : 0

    // insert DB row
    const { data: rowData, error: rowErr } = await supabase.from('property_images').insert([{
      property_id: propertyId,
      storage_path: storagePath,
      alt_text: altText ?? null,
      is_cover: !!isCover,
      display_order: nextOrder,
    }]).select('id,storage_path')

    if (rowErr) return { error: rowErr.message }

    const row = Array.isArray(rowData) ? rowData[0] : rowData

    return { data: { id: row.id, storage_path: row.storage_path } }
  } catch (err) {
    return { error: 'Server error' }
  }
}

export async function deletePropertyImage(imageId: string) {
  try {
    const supabase = (await createClient()) as any
    if (!(await isAdmin(supabase))) return { error: 'Unauthorized' }

    const parsed = IdSchema.safeParse(imageId)
    if (!parsed.success) return { error: 'Invalid id' }

    const { data: row, error: selErr } = await supabase.from('property_images').select('storage_path').eq('id', imageId).limit(1)
    if (selErr) return { error: selErr.message }
    if (!row || row.length === 0) return { error: 'Not found' }

    const storagePath = row[0].storage_path

    // delete from storage
    const { error: delErr } = await supabase.storage.from('property-images').remove([storagePath])
    if (delErr) return { error: delErr.message }

    // delete DB row
    const { error: dbErr } = await supabase.from('property_images').delete().eq('id', imageId)
    if (dbErr) return { error: dbErr.message }

    return {}
  } catch (err) {
    return { error: 'Server error' }
  }
}

export async function reorderPropertyImages(imageIds: string[]) {
  try {
    const supabase = (await createClient()) as any
    if (!(await isAdmin(supabase))) return { error: 'Unauthorized' }

    if (!Array.isArray(imageIds)) return { error: 'Invalid input' }

    await Promise.all(imageIds.map((id, idx) => supabase.from('property_images').update({ display_order: idx }).eq('id', id)))

    return {}
  } catch (err) {
    return { error: 'Server error' }
  }
}

export async function setCoverImage(imageId: string, propertyId: string) {
  try {
    const supabase = (await createClient()) as any
    if (!(await isAdmin(supabase))) return { error: 'Unauthorized' }

    const p = IdSchema.safeParse(imageId)
    const q = z.string().uuid().safeParse(propertyId)
    if (!p.success || !q.success) return { error: 'Invalid input' }

    // unset others
    await supabase.from('property_images').update({ is_cover: false }).eq('property_id', propertyId)

    // set target
    const { error } = await supabase.from('property_images').update({ is_cover: true }).eq('id', imageId)
    if (error) return { error: error.message }

    return {}
  } catch (err) {
    return { error: 'Server error' }
  }
}

// exported as named functions above

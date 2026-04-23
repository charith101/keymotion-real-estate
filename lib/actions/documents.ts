"use server"

import { z } from 'zod'
import { createClient } from '../supabase/server'

const UploadDocSchema = z.object({
  propertyId: z.string().uuid(),
  fileName: z.string(),
  label: z.string().optional(),
  isPublic: z.boolean().optional(),
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

export async function uploadPropertyDocument(propertyId: string, file: any, label?: string | null, isPublic = false) {
  try {
    const supabase = (await createClient()) as any
    if (!(await isAdmin(supabase))) return { error: 'Unauthorized' }

    const name = file?.name ?? file?.filename ?? null
    const parsed = UploadDocSchema.safeParse({ propertyId, fileName: name, label, isPublic })
    if (!parsed.success) return { error: 'Invalid input' }

    const timestamp = Date.now()
    const filename = `${timestamp}-${parsed.data.fileName}`
    const storagePath = `${propertyId}/${filename}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('property-docs')
      .upload(storagePath, file)

    if (uploadError) return { error: uploadError.message }

    const { data: rowData, error: rowErr } = await supabase.from('property_documents').insert([{
      property_id: propertyId,
      storage_path: storagePath,
      label: label ?? null,
      is_public: !!isPublic,
    }]).select('id')

    if (rowErr) return { error: rowErr.message }

    const row = Array.isArray(rowData) ? rowData[0] : rowData
    return { data: { id: row.id } }
  } catch (err) {
    return { error: 'Server error' }
  }
}

export async function deletePropertyDocument(documentId: string) {
  try {
    const supabase = (await createClient()) as any
    if (!(await isAdmin(supabase))) return { error: 'Unauthorized' }

    const parsed = IdSchema.safeParse(documentId)
    if (!parsed.success) return { error: 'Invalid id' }

    const { data: row, error: selErr } = await supabase.from('property_documents').select('storage_path').eq('id', documentId).limit(1)
    if (selErr) return { error: selErr.message }
    if (!row || row.length === 0) return { error: 'Not found' }

    const storagePath = row[0].storage_path

    const { error: delErr } = await supabase.storage.from('property-docs').remove([storagePath])
    if (delErr) return { error: delErr.message }

    const { error: dbErr } = await supabase.from('property_documents').delete().eq('id', documentId)
    if (dbErr) return { error: dbErr.message }

    return {}
  } catch (err) {
    return { error: 'Server error' }
  }
}

export async function getSignedDocumentUrl(storagePath: string) {
  try {
    const supabase = (await createClient()) as any

    const parsed = z.string().min(1).safeParse(storagePath)
    if (!parsed.success) return { url: null, error: 'Invalid storage path' }

    const { data, error } = await supabase.storage.from('property-docs').createSignedUrl(storagePath, 3600)
    if (error) return { url: null, error: error.message }

    return { url: data?.signedUrl ?? null }
  } catch (err) {
    return { url: null, error: 'Server error' }
  }
}

// exported as named functions above

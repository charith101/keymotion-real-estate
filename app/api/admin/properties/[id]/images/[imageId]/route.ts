import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { setCoverImage, reorderPropertyImages } from '@/lib/actions/images'

export async function PATCH(req: Request, context: any) {
  try {
    const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params
    const id = params?.id
    const imageId = params?.imageId

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 })
    }

    const body = await req.json()
    const { display_order, is_cover } = body

    // Verify user is admin
    const server = await createServerClient()
    const { data: { session } } = await server.auth.getSession()
    if (!session || !session.access_token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = session.access_token
    const parts = token.split('.')
    if (parts.length < 2) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'))
    if (payload?.user_role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Use service role for updates
    const { createClient } = await import('@supabase/supabase-js')
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const updateData: any = {}
    if (typeof display_order === 'number') updateData.display_order = display_order
    if (typeof is_cover === 'boolean') {
      if (is_cover) {
        // If setting as cover, unset others first
        await admin.from('property_images').update({ is_cover: false }).eq('property_id', id)
      }
      updateData.is_cover = is_cover
    }

    const { error } = await admin
      .from('property_images')
      .update(updateData)
      .eq('id', imageId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: null }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const params = context?.params && typeof context.params.then === 'function' ? await context.params : context?.params
    const imageId = params?.imageId
    if (!imageId) return NextResponse.json({ error: 'Image ID required' }, { status: 400 })

    const server = await createServerClient()
    const { data: { session } } = await server.auth.getSession()
    if (!session || !session.access_token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const token = session.access_token
    const parts = token.split('.')
    if (parts.length < 2) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'))
    if (payload?.user_role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { createClient } = await import('@supabase/supabase-js')
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // fetch storage path
    const { data: row, error: selErr } = await admin.from('property_images').select('storage_path').eq('id', imageId).limit(1)
    if (selErr) return NextResponse.json({ error: selErr.message }, { status: 500 })
    if (!row || row.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const storagePath = row[0].storage_path
    // delete from storage
    const { error: delErr } = await admin.storage.from('property-images').remove([storagePath])
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 })

    // delete DB row
    const { error: dbErr } = await admin.from('property_images').delete().eq('id', imageId)
    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

    return NextResponse.json({ data: null }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

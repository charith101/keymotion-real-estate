import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
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

    const { createClient } = await import('@supabase/supabase-js')
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const { data, error } = await admin
      .from('inquiries')
      .select('id,property_id,name,email,phone,country,message,inquiry_type,status,admin_notes,created_at,properties(title,slug)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const mapped = (data || []).map((r: any) => ({
      id: r.id,
      propertyId: r.property_id,
      propertyTitle: r.properties?.title ?? null,
      propertySlug: r.properties?.slug ?? null,
      type: r.inquiry_type,
      name: r.name,
      email: r.email,
      phone: r.phone,
      country: r.country,
      message: r.message,
      status: r.status,
      adminNotes: r.admin_notes ?? null,
      createdAt: r.created_at,
    }))

    return NextResponse.json({ data: mapped })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

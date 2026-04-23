import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

// Return a list of properties for admin UI. Verifies the user is admin using the
// cookie-based server client, then uses the service-role key to fetch data.
export async function GET(req: Request) {
  try {
    // verify admin from session cookie
    const server = await createServerClient()
    const { data: { session } } = await server.auth.getSession()

    if (!session || !session.access_token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // simple admin check from JWT custom claim (user_role)
    const token = session.access_token
    const parts = token.split('.')
    if (parts.length < 2) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'))
    if (payload?.user_role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // create service-role client to bypass RLS for full admin list
    const { createClient } = await import('@supabase/supabase-js')
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const { data, error } = await admin
      .from('properties')
      .select('id, title, slug, city, district, price_lkr, status, featured, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const mapped = (data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      city: p.city,
      district: p.district,
      price: p.price_lkr ?? 0,
      status: p.status,
      featured: !!p.featured,
      createdAt: p.created_at,
      images: [],
    }))

    return NextResponse.json({ data: mapped })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

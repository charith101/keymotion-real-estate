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
      .from('profiles')
      .select('id,full_name,phone,avatar_url,role,created_at')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const mapped = (data || []).map((u: any) => ({
      id: u.id,
      name: u.full_name ?? null,
      email: null,
      avatar: u.avatar_url ?? null,
      role: u.role ?? 'user',
      phone: u.phone ?? null,
      createdAt: u.created_at ?? null,
      savedProperties: [],
    }))

    return NextResponse.json({ data: mapped })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

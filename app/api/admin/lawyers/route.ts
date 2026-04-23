import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
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

    const { data, error } = await admin.from('lawyers').select('id,full_name,firm_name,phone,email,active').order('full_name', { ascending: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const mapped = (data || []).map((l: any) => ({ id: l.id, name: l.full_name, firm: l.firm_name, phone: l.phone, email: l.email, active: l.active }))
    return NextResponse.json({ data: mapped })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { access_token, refresh_token } = body || {}

    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400 })
    }

    const res = NextResponse.json({ ok: true })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              // apply cookies to the outgoing NextResponse
              res.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // setSession will create auth cookies via the cookies.setAll hook
    // Note: supabase.auth.setSession expects an object { access_token, refresh_token }
    const { error } = await supabase.auth.setSession({ access_token, refresh_token } as any)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return res
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

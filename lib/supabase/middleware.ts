import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get session for the JWT payload
  const { data: { session } } = await supabase.auth.getSession()
  
  // Get user for secure server-side verification
  const { data: { user } } = await supabase.auth.getUser()

  let role = null
  if (session?.access_token && user) {
    try {
      const payload = JSON.parse(atob(session.access_token.split('.')[1]))
      role = payload.user_role
    } catch (e) {
      // Ignore parsing errors
    }
  }

  const path = request.nextUrl.pathname

  // Admin routes: must be logged in AND have admin role
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Profile routes: must be logged in
  if (path.startsWith('/profile')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Auth pages: must NOT be logged in
  if (path === '/login' || path === '/register') {
    if (user) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}
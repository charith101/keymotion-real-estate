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

  // Refresh session — do not remove this call.
  // It keeps the session alive and syncs auth state.
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  let role = null
  if (session?.access_token) {
   const payload = JSON.parse(atob(session.access_token.split('.')[1]))
   role = payload.user_role
  }

  // --- Route protection ---

  // Admin routes: must be logged in AND have admin role in JWT
  if (request.nextUrl.pathname.startsWith('/admin')) {
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// Profile routes
if (request.nextUrl.pathname.startsWith('/profile')) {
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Auth pages
if (
  request.nextUrl.pathname === '/login' ||
  request.nextUrl.pathname === '/register'
) {
  if (user) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

  return supabaseResponse
}
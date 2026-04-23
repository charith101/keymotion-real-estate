import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

// Standard server client — uses anon key + RLS
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — safe to ignore.
            // The middleware handles session refreshing.
          }
        },
      },
    }
  )
}

// Admin client — bypasses RLS entirely.
// Only use in server-side API routes (e.g. Excel export).
// NEVER import this in any client component or expose to the browser.
// export function createAdminClient() {
//   const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
//   return createSupabaseClient<Database>(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY!,
//     {
//       auth: {
//         autoRefreshToken: false,
//         persistSession: false,
//       },
//     }
//   )
// }
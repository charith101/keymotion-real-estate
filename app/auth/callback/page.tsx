"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading')

  useEffect(() => {
    // After the provider redirects back, ensure Supabase has processed the session on the
    // browser client, then POST the tokens to a server route which will set httpOnly
    // Supabase cookies so SSR can read the session.
    const supabase = createClient()

    let mounted = true

    async function finalize() {
      try {
        // Attempt to read the session from the client-side Supabase instance
        const { data } = await supabase.auth.getSession()
        const session = data?.session

        if (!mounted) return

        if (session && session.access_token && session.refresh_token) {
          // Post tokens to the server route which will set httpOnly cookies
          const resp = await fetch('/api/auth/set', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            }),
          })

          if (!resp.ok) {
            setStatus('error')
            router.replace('/login')
            return
          }

          setStatus('done')
          router.replace('/')
        } else {
          // If no session, go to login to show an error state
          setStatus('error')
          router.replace('/login')
        }
      } catch (e) {
        if (!mounted) return
        setStatus('error')
        router.replace('/login')
      }
    }

    // Small delay to let Supabase complete internal redirects (provider -> site)
    const timer = setTimeout(finalize, 500)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [router])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md shadow-lg rounded-xl px-8 py-6 flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div
            role="status"
            aria-live="polite"
            className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-sky-500 animate-spin"
          >
            <span className="sr-only">Loading…</span>
          </div>

          <div className="text-left">
            <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
              {status === 'loading' && 'Signing you in…'}
              {status === 'done' && 'Redirecting…'}
              {status === 'error' && 'Failed to sign in'}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {status === 'loading' && 'Completing authentication with provider.'}
              {status === 'done' && 'Taking you back to the app.'}
              {status === 'error' && 'You will be redirected to the login page shortly.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

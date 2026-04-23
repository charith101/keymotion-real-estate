"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading')

  useEffect(() => {
    let mounted = true

    async function doLogout() {
      try {
        // Sign out client-side
        const supabase = createClient()
        try {
          await supabase.auth.signOut()
        } catch {}

        // Call server to clear httpOnly cookies used for SSR
        const resp = await fetch('/api/auth/clear', { method: 'POST' })
        if (!mounted) return
        if (!resp.ok) {
          setStatus('error')
          router.replace('/login')
          return
        }

        setStatus('done')
        // Redirect to login (or home)
        router.replace('/login')
      } catch (e) {
        if (!mounted) return
        setStatus('error')
        router.replace('/login')
      }
    }

    doLogout()

    return () => { mounted = false }
  }, [router])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
  <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-md shadow-lg rounded-xl px-8 py-6 flex items-center gap-6">
    
    {/* Icon */}
    <div className="flex items-center gap-4">
      {status === 'loading' && (
        <div
          role="status"
          aria-live="polite"
          className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-indigo-600 animate-spin"
        >
          <span className="sr-only">Logging out…</span>
        </div>
      )}

      {status === 'done' && (
        <svg
          className="h-12 w-12 text-green-600"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-20" />
          <path d="M9 12.5l1.8 1.8L15 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {status === 'error' && (
        <svg
          className="h-12 w-12 text-red-600"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-20" />
          <path d="M12 8v5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="12" cy="16.2" r="0.7" fill="currentColor" />
        </svg>
      )}

      {/* Text */}
      <div className="text-left">
        <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
          {status === 'loading' && 'Logging you out…'}
          {status === 'done' && 'Signed out'}
          {status === 'error' && 'Failed to sign out'}
        </p>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {status === 'loading' && 'Ending your session securely.'}
          {status === 'done' && 'Redirecting you back to the app.'}
          {status === 'error' && 'You will be redirected shortly.'}
        </p>
      </div>
    </div>
  </div>
</div>
  )
}

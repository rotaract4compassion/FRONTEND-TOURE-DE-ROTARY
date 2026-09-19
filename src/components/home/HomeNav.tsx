'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { SITE } from '@/config/site'
import type { User } from '@supabase/supabase-js'

export default function HomeNav() {
  const router  = useRouter()
  const [user,    setUser]    = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    // Resolve existing session on mount
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    // Stay in sync across tabs
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
  }

  // Derive display initial from email or user metadata
  const initial = user
    ? (user.user_metadata?.full_name as string | undefined)?.charAt(0).toUpperCase()
      ?? user.email?.charAt(0).toUpperCase()
      ?? '?'
    : null

  return (
    <nav className="sticky top-0 z-50 bg-sand border-b border-sand-dark px-5 py-3.5 flex items-center justify-between">

      {/* Wordmark */}
      <Link href="/" className="focus-visible:outline-none">
        <span className="font-serif text-[19px] font-bold text-navy tracking-tight leading-none">
          {SITE.name}
        </span>
      </Link>

      {/* Right side — auth state driven */}
      {loading ? (
        // Tiny placeholder — prevents layout shift while session resolves
        <div className="w-20 h-8 rounded-pill bg-sand-dark animate-pulse" />
      ) : user ? (
        // ── Logged in ──────────────────────────────────────────────────────
        <div className="flex items-center gap-3">
          {/* Avatar initial */}
          <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
            <span className="font-serif text-[12px] font-bold text-bronze leading-none">
              {initial}
            </span>
          </div>

          {/* Portal link */}
          <Link
            href="/dashboard"
            className="font-sans text-[12px] font-bold text-navy
                       hover:text-bronze transition-colors duration-200
                       focus-visible:outline-none"
          >
            My Portal
          </Link>

          {/* Divider */}
          <span className="text-sand-dark select-none">·</span>

          {/* Sign out */}
          <button
            type="button"
            onClick={handleSignOut}
            className="font-sans text-[12px] font-semibold text-ink-subtle
                       hover:text-coral transition-colors duration-200
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-bronze focus-visible:ring-offset-2"
          >
            Sign out
          </button>
        </div>
      ) : (
        // ── Logged out ─────────────────────────────────────────────────────
        <Link
          href="/register"
          className="font-sans text-[11px] font-bold text-bronze uppercase tracking-[.04em]
                     border-[1.5px] border-bronze rounded-pill px-4 py-2
                     hover:bg-bronze hover:text-white transition-colors duration-200
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-bronze focus-visible:ring-offset-2"
        >
          Get Started
        </Link>
      )}
    </nav>
  )
}

'use client'
// ─────────────────────────────────────────────────────────────────────────────
// Tour de Dar — useFundraising hook
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'
import { useUserContext }               from '@/context/UserContext'
import { ensureMyFundraising, getMyFundraising } from '@/lib/supabase/fundraising'
import type { Campaign, Donation }      from '@/lib/supabase/fundraising'

interface UseFundraisingReturn {
  campaign:  Campaign | null
  donations: Donation[]
  loading:   boolean
  shareUrl:  string | null
  refresh:   () => void
}

export function useFundraising(): UseFundraisingReturn {
  const { user, profile, loading: ctxLoading } = useUserContext()

  const [campaign,  setCampaign]  = useState<Campaign | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading,   setLoading]   = useState(true)
  const [shareUrl,  setShareUrl]  = useState<string | null>(null)
  const ran = useRef(false)

  async function load() {
    if (!user || !profile) { setLoading(false); return }
    setLoading(true)

    const { slug } = await ensureMyFundraising(
      user.id,
      profile.full_name ?? 'athlete',
    )
    if (slug) {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      setShareUrl(`${origin}/fundraise/${slug}`)
    }

    const { campaign: c, donations: d } = await getMyFundraising(user.id)
    setCampaign(c)
    setDonations(d)
    setLoading(false)
  }

  useEffect(() => {
    // Wait for UserContext to finish resolving
    if (ctxLoading) return

    // Not logged in or no profile row — stop spinning
    if (!user || !profile) { setLoading(false); return }

    if (ran.current) return
    ran.current = true
    load()
  }, [user, profile, ctxLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  return { campaign, donations, loading, shareUrl, refresh: load }
}
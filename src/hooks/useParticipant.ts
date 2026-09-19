'use client'

import { useState, useEffect } from 'react'
import { useUser }              from '@/hooks/useUser'
import { getMyRegistration }    from '@/lib/supabase/participant'
import type { Registration }    from '@/types'

// Race day: 1 November 2026, EAT (UTC+3)
const RACE_DATE = new Date('2026-11-01T00:00:00+03:00')

export function useParticipant() {
  const { user, profile, loading: userLoading } = useUser()

  const [registration, setRegistration] = useState<Registration | null>(null)
  const [regLoading,   setRegLoading]   = useState(true)

  useEffect(() => {
    // Wait until auth resolves before hitting Supabase
    if (userLoading) return

    if (!user) {
      setRegLoading(false)
      return
    }

    setRegLoading(true)
    getMyRegistration(user.id)
      .then(({ data }) => setRegistration(data))
      .finally(() => setRegLoading(false))
  }, [user?.id, userLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  const daysUntil = Math.max(
    0,
    Math.ceil((RACE_DATE.getTime() - Date.now()) / 86_400_000),
  )

  return {
    profile,
    registration,
    daysUntil,
    loading: userLoading || regLoading,
  }
}

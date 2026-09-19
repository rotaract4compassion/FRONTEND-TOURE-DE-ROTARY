'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getAllRegistrations,
  getRegistrationById,
  computeStats,
  type RegistrationRow,
  type AdminStats,
} from '@/lib/supabase/admin'

export function useAdminRegistrations() {
  const [rows,    setRows]    = useState<RegistrationRow[]>([])
  const [stats,   setStats]   = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await getAllRegistrations()
    setRows(data)
    setStats(computeStats(data))
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { rows, stats, loading, refresh: fetch }
}

export function useAdminRegistration(id: string) {
  const [row,     setRow]     = useState<RegistrationRow | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await getRegistrationById(id)
    setRow(data)
    setLoading(false)
  }, [id])

  useEffect(() => { fetch() }, [fetch])

  return { row, loading, refresh: fetch }
}

import { supabase } from '@/lib/supabase/client'
import { CATEGORY_MAP } from '@/config/categories'

export type RegistrationRow = {
  id: string
  user_id: string
  category: 'sprint' | 'olympic' | 'relay'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  status: 'pending' | 'confirmed' | 'cancelled'
  bib_number: string | null
  story: string | null
  created_at: string
  profiles: { full_name: string | null; phone: string | null; email: string | null } | null
}

export type AdminStats = {
  total: number
  paid: number
  pending: number
  unbibed: number
  revenue: number
  byCategory: { sprint: number; olympic: number; relay: number }
}

export function computeStats(rows: RegistrationRow[]): AdminStats {
  const paid  = rows.filter(r => r.payment_status === 'paid')
  const revenue = paid.reduce((sum, r) => sum + (CATEGORY_MAP[r.category]?.price ?? 0), 0)
  return {
    total:      rows.length,
    paid:       paid.length,
    pending:    rows.filter(r => r.payment_status === 'pending').length,
    unbibed:    paid.filter(r => !r.bib_number).length,
    revenue,
    byCategory: {
      sprint:  rows.filter(r => r.category === 'sprint').length,
      olympic: rows.filter(r => r.category === 'olympic').length,
      relay:   rows.filter(r => r.category === 'relay').length,
    },
  }
}

export async function getAllRegistrations() {
  const { data, error } = await supabase
    .from('registrations')
    .select('*, profiles(full_name, phone, email)')
    .order('created_at', { ascending: false })
  return { data: (data ?? []) as RegistrationRow[], error: error?.message ?? null }
}

export async function getRegistrationById(id: string) {
  const { data, error } = await supabase
    .from('registrations')
    .select('*, profiles(full_name, phone, email)')
    .eq('id', id)
    .single()
  return { data: data as RegistrationRow | null, error: error?.message ?? null }
}

export async function adminConfirmPayment(id: string) {
  const { error } = await supabase
    .from('registrations')
    .update({ payment_status: 'paid', status: 'confirmed', updated_at: new Date().toISOString() })
    .eq('id', id)
  return { error: error?.message ?? null }
}

export async function adminAssignBib(id: string, bibNumber: string) {
  const { error } = await supabase
    .from('registrations')
    .update({ bib_number: bibNumber, updated_at: new Date().toISOString() })
    .eq('id', id)
  return { error: error?.message ?? null }
}

// ─────────────────────────────────────────────────────────────────────────────
// Tour de Dar — Participant Supabase helpers
// ─────────────────────────────────────────────────────────────────────────────
import { supabase }          from '@/lib/supabase/client'
import type { ApiResponse, Registration, UserProfile } from '@/types'

/** Fetch the current user's most-recent registration row. */
export async function getMyRegistration(
  userId: string,
): Promise<ApiResponse<Registration>> {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return {
    data:  data as Registration | null,
    error: error?.message ?? null,
  }
}

/** Update editable profile fields. */
export async function updateMyProfile(
  userId: string,
  updates: { full_name?: string | null; phone?: string | null },
): Promise<ApiResponse<UserProfile>> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  return {
    data:  data as UserProfile | null,
    error: error?.message ?? null,
  }
}

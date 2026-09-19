import { supabase } from '@/lib/supabase/client'
import type { ApiResponse } from '@/types'

// ─────────────────────────────────────────────────────────────────────────────
// Tour de Dar — Auth Actions
// All auth goes through here. No inline Supabase calls in components.
// ─────────────────────────────────────────────────────────────────────────────

export interface SignUpPayload {
  email:      string
  password:   string
  fullName:   string
  phone:      string   // E.164 format: +255XXXXXXXXX
}

/**
 * Create a new Supabase auth user.
 *
 * fullName and phone are passed in options.data so the DB trigger
 * can read them before the session is established — prevents the
 * race condition where the trigger fires before metadata is written.
 */
export async function signUp(payload: SignUpPayload): Promise<ApiResponse<null>> {
  const { error } = await supabase.auth.signUp({
    email:    payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.fullName,
        phone:     payload.phone,
        role:      'participant',
      },
    },
  })

  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

/**
 * Sign in with email + password.
 */
export async function signIn(
  email: string,
  password: string,
): Promise<ApiResponse<null>> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

/**
 * Send a password reset email.
 */
export async function sendPasswordReset(email: string): Promise<ApiResponse<null>> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/confirm`,
  })
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

/**
 * Redirect path after login, based on role.
 * TdDar has one portal — /dashboard.
 */
export function portalRedirect(): string {
  return '/dashboard'
}

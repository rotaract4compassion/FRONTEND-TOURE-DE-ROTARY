// ─────────────────────────────────────────────────────────────────────────────
// Tour de Dar — External API Wrapper
// All calls to PayMe Africa and other external services go through here.
// No /app/api/ routes in this project.
// ─────────────────────────────────────────────────────────────────────────────
import type { ApiResponse, PaymentInitResponse } from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return { data: null, error: (body as { message?: string }).message ?? `HTTP ${res.status}` }
    }
    const data = await res.json() as T
    return { data, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Network error' }
  }
}

// ── PayMe Africa ──────────────────────────────────────────────────────────────

export interface PaymentPayload {
  amount:      number              // TSh, full amount including processing fee
  description: string
  customer: {
    name:  string
    email: string
    phone: string                  // +255XXXXXXXXX
  }
  metadata?:   Record<string, string>
  return_url?: string              // Override — defaults to /dashboard?payment=success
  cancel_url?: string              // Override — defaults to /register?payment=cancelled
}

export const paymentsApi = {
  /**
   * Initiate a PayMe Africa payment.
   * Returns a paymentUrl to redirect the user to, and a transactionId to store.
   * Pass return_url / cancel_url overrides for non-registration flows (e.g. donations).
   */
  initiate: (payload: PaymentPayload) =>
    apiFetch<PaymentInitResponse>('/payments/initiate', {
      method: 'POST',
      body:   JSON.stringify({
        ...payload,
        currency:     'TZS',
        return_url:   payload.return_url  ?? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success`,
        cancel_url:   payload.cancel_url  ?? `${process.env.NEXT_PUBLIC_SITE_URL}/register?payment=cancelled`,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/webhook`,
      }),
    }),

  /**
   * Verify a payment by transactionId.
   * Called on the success redirect to confirm before updating DB.
   */
  verify: (transactionId: string) =>
    apiFetch<{ status: 'paid' | 'pending' | 'failed' }>(`/payments/verify/${transactionId}`),
}

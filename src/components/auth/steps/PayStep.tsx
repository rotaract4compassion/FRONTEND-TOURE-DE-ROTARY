'use client'

import { useState } from 'react'
import { CATEGORY_MAP, DISCIPLINE_MAP, PROCESSING_FEE_RATE } from '@/config/categories'
import { formatTSh, initials } from '@/lib/utils'
import { signUp } from '@/lib/supabase/auth'
import { paymentsApi } from '@/lib/api'
import { supabase } from '@/lib/supabase/client'
import type { FlowState } from '@/types'

interface Props {
  data:   FlowState
  onBack: () => void
}

export default function PayStep({ data, onBack }: Props) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const cat   = data.category   ? CATEGORY_MAP[data.category]     : null
  const disc  = data.discipline ? DISCIPLINE_MAP[data.discipline]  : null
  const base  = cat?.price ?? 0
  const fee   = Math.round(base * PROCESSING_FEE_RATE)
  const total = base + fee

  async function handlePay() {
    if (!cat) return
    setLoading(true)
    setError(null)

    try {
      const { error: signUpError } = await signUp({
        email:    data.email,
        password: data.password,
        fullName: data.fullName,
        phone:    data.phone,
      })
      if (signUpError) { setError(signUpError); return }

      await new Promise(r => setTimeout(r, 800))

      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id

      if (userId) {
        await supabase.from('registrations').insert({
          user_id:        userId,
          category:       data.category,
          discipline:     data.discipline ?? null,
          story:          data.story.trim() || null,
          payment_status: 'pending',
          status:         'pending',
        })
      }

      const { data: payment, error: payError } = await paymentsApi.initiate({
        amount:      total,
        description: `Tour de Dar 2026 — ${cat.name}${disc ? ` (${disc.name})` : ''}`,
        customer:    { name: data.fullName, email: data.email, phone: data.phone },
        metadata:    { category: data.category ?? '', discipline: data.discipline ?? '', user_id: userId ?? '' },
      })

      if (payError || !payment?.paymentUrl) {
        setError(payError ?? 'Payment could not be initiated. Please try again.')
        return
      }

      window.location.href = payment.paymentUrl

    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (!cat) return null

  return (
    <div className="animate-fade-up">

      <h2 className="font-serif text-[32px] font-bold italic text-white leading-[1.08] tracking-[-0.02em] mb-[6px]">
        Almost there.
      </h2>
      <p className="font-sans text-[13px] text-white/40 mb-[26px] leading-relaxed">
        Review your registration and complete payment.
      </p>

      {/* Summary card */}
      <div className="bg-white/[.06] border-[1.5px] border-white/10 rounded-[18px] p-[18px] mb-[10px]">

        {/* Participant row */}
        <div className="flex items-center gap-3 pb-[14px] border-b border-white/[.08] mb-[14px]">
          <div className="w-[38px] h-[38px] rounded-full bg-bronze/[.18] flex items-center justify-center flex-shrink-0">
            <span className="font-serif text-[14px] font-bold text-bronze">
              {initials(data.fullName || 'You')}
            </span>
          </div>
          <div>
            <p className="font-sans text-[14px] font-semibold text-white leading-tight">
              {data.fullName || 'You'}
            </p>
            <p className="font-sans text-[12px] text-white/38">{data.email}</p>
          </div>
        </div>

        {/* Details rows */}
        <div className="flex flex-col gap-[9px]">
          <SummaryRow label="Category" value={cat.name} />
          {disc && (
            <SummaryRow
              label="Discipline"
              value={disc.name}
              valueStyle={{ color: disc.hex }}
            />
          )}
          <SummaryRow label="Event date" value="1 November 2026" />
          <SummaryRow label="Location"   value="Dar es Salaam, TZ" />
        </div>

      </div>

      {/* Fee breakdown */}
      <div className="bg-white/[.04] border-[1.5px] border-white/[.08] rounded-[18px] p-[18px] mb-5">
        <FeeRow label="Registration fee"                              amount={base} />
        <FeeRow label={`Processing fee (${(PROCESSING_FEE_RATE * 100).toFixed(1)}%)`} amount={fee}  />
        <div className="border-t border-white/[.08] mt-[14px] pt-[14px] flex justify-between items-baseline">
          <span className="font-sans text-[14px] font-bold text-white">Total</span>
          <span className="font-num font-extrabold text-[27px] text-bronze leading-none">
            {formatTSh(total)}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-[12px] bg-coral/10 border border-coral/30 px-4 py-3 mb-5">
          <p className="font-sans text-[13px] text-coral">{error}</p>
        </div>
      )}

      {/* Nav */}
      <div className="flex gap-[10px]">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 bg-white/[.06] border-[1.5px] border-white/[.12] text-white/45
                     font-sans text-[14px] font-semibold rounded-[12px] py-4
                     hover:border-white/25 hover:text-white/65
                     disabled:opacity-30 transition-all duration-200 focus:outline-none"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="flex-[2] bg-coral text-white font-sans text-[14px] font-extrabold
                     rounded-[12px] py-4 hover:opacity-90 active:scale-[.98]
                     disabled:opacity-60 disabled:cursor-not-allowed
                     transition-all duration-200 focus:outline-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Setting up…
            </span>
          ) : (
            'Pay with PayMe Africa'
          )}
        </button>
      </div>

      <p className="font-sans text-[11px] text-white/20 text-center mt-3 leading-relaxed">
        You will be redirected to PayMe Africa to complete payment securely.
      </p>

    </div>
  )
}

function SummaryRow({
  label,
  value,
  valueStyle,
}: {
  label: string
  value: string
  valueStyle?: React.CSSProperties
}) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="font-sans text-[12px] text-white/38">{label}</span>
      <span className="font-sans text-[13px] font-semibold text-white text-right" style={valueStyle}>
        {value}
      </span>
    </div>
  )
}

function FeeRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex justify-between items-baseline py-[3px]">
      <span className="font-sans text-[13px] text-white/45">{label}</span>
      <span className="font-num font-extrabold text-[14px] text-white/60">
        {formatTSh(amount)}
      </span>
    </div>
  )
}

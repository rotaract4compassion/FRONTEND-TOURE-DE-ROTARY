'use client'
// ─────────────────────────────────────────────────────────────────────────────
// Tour de Dar — Donor Client Component
// Public — no auth. Handles donation form + PayMe redirect + thank-you overlay.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'
import { useRouter }                    from 'next/navigation'
import { insertDonation, markDonationPaid } from '@/lib/supabase/fundraising'
import { paymentsApi }                  from '@/lib/api'
import { formatTSh, initials }          from '@/lib/utils'
import type { Campaign, Donation }      from '@/lib/supabase/fundraising'

const QUICK_AMOUNTS = [10_000, 25_000, 50_000]
const MIN_AMOUNT    = 1_000

const CAT_LABEL: Record<string, string> = {
  sprint:  'Sprint',
  olympic: 'Olympic',
  relay:   'Relay',
}

const inputCls = [
  'w-full bg-white/[.07] border-[1.5px] border-white/[.11] rounded-[12px]',
  'px-4 py-[14px] font-sans text-[13px] text-white',
  'placeholder:text-white/[.22]',
  'focus:outline-none focus:border-bronze focus:bg-white/10',
  'transition-all duration-200',
].join(' ')

const labelCls =
  'block font-num text-[10px] font-extrabold text-white/35 uppercase tracking-[.08em] mb-[8px]'

interface Props {
  campaign:   Campaign
  donations:  Donation[]
  donated:    boolean
  donationId: string | undefined
  paymeRef:   string | undefined
  cancelled:  boolean
}

export default function DonorClient({
  campaign,
  donations,
  donated,
  donationId,
  paymeRef,
  cancelled,
}: Props) {
  const router    = useRouter()
  const markedRef = useRef(false)

  // Form
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [quickAmt, setQuickAmt] = useState<number | null>(null)
  const [custom,   setCustom]   = useState('')
  const [message,  setMessage]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  // Thank-you overlay
  const [donorDisplayName,   setDonorDisplayName]   = useState('')
  const [donorDisplayAmount, setDonorDisplayAmount] = useState(0)
  const [showThankYou,       setShowThankYou]       = useState(false)

  // Mark paid when returning from PayMe
  useEffect(() => {
    if (!donated || !donationId || markedRef.current) return
    markedRef.current = true

    const ss = typeof sessionStorage !== 'undefined' ? sessionStorage : null
    const dn = ss?.getItem('tdd_donor_name')   ?? ''
    const da = parseInt(ss?.getItem('tdd_donor_amount') ?? '0', 10)
    setDonorDisplayName(dn)
    setDonorDisplayAmount(da)
    ss?.removeItem('tdd_donor_name')
    ss?.removeItem('tdd_donor_amount')

    markDonationPaid(donationId, paymeRef ?? '').then(() => {
      router.refresh()
      setShowThankYou(true)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const finalAmount =
    quickAmt ?? (parseInt(custom.replace(/\D/g, ''), 10) || 0)

  async function handleDonate() {
    if (!name.trim())          { setError('Please enter your name.');            return }
    if (!email.includes('@'))  { setError('Please enter a valid email address.'); return }
    if (finalAmount < MIN_AMOUNT) {
      setError(`Minimum donation is ${formatTSh(MIN_AMOUNT)}.`)
      return
    }

    setLoading(true)
    setError(null)

    const { donationId: newId, error: insertErr } = await insertDonation(
      campaign.id, name.trim(), email.trim(), finalAmount, message.trim(),
    )
    if (insertErr || !newId) {
      setError('Could not initiate donation. Please try again.')
      setLoading(false)
      return
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { data: payment, error: payErr } = await paymentsApi.initiate({
      amount:      Math.round(finalAmount * 1.015),
      description: `Donation — ${campaign.participant_name} · Tour de Dar 2026`,
      customer:    { name: name.trim(), email: email.trim(), phone: '+255000000000' },
      metadata:    { donation_id: newId, campaign_id: campaign.id, slug: campaign.slug },
      return_url:  `${origin}/fundraise/${campaign.slug}?donated=true&donation=${newId}`,
      cancel_url:  `${origin}/fundraise/${campaign.slug}?payment=cancelled`,
    })

    if (payErr || !payment?.paymentUrl) {
      setError('Payment initiation failed. Please try again.')
      setLoading(false)
      return
    }

    // Stash donor info for thank-you screen (retrieved after PayMe redirect)
    const ss = typeof sessionStorage !== 'undefined' ? sessionStorage : null
    ss?.setItem('tdd_donor_name',   name.trim())
    ss?.setItem('tdd_donor_amount', String(finalAmount))

    window.location.href = payment.paymentUrl
  }

  const pct = Math.min(100, Math.round((campaign.total_raised / campaign.goal) * 100))

  return (
    <div className="min-h-dvh bg-navy relative overflow-x-hidden">

      {/* Texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'repeating-linear-gradient(-52deg,transparent 0,transparent 40px,rgba(200,149,60,.03) 40px,rgba(200,149,60,.03) 41px)',
        }}
      />

      {/* Page content */}
      <div className="relative z-10 max-w-canvas mx-auto px-[22px] pb-12">

        {/* Wordmark */}
        <div className="pt-[24px] mb-[24px] text-center">
          <p className="font-serif text-[22px] italic font-bold text-bronze tracking-[-0.01em]">
            Tour de Dar
          </p>
          <p className="font-sans text-[11px] text-white/35 mt-[3px]">
            Benefiting Ocean Road Cancer Institute
          </p>
        </div>

        {/* Participant hero */}
        <div className="text-center mb-[22px]">
          <div className="w-[52px] h-[52px] rounded-full bg-white/[.08] border-[1.5px] border-bronze/30 flex items-center justify-center mx-auto mb-[10px]">
            <span className="font-num text-[16px] font-extrabold text-bronze">
              {initials(campaign.participant_name)}
            </span>
          </div>
          <h1 className="font-serif text-[26px] italic font-bold text-white tracking-[-0.02em] mb-[8px]">
            {campaign.participant_name}
          </h1>
          <div className="flex items-center justify-center gap-[8px]">
            {campaign.participant_category && (
              <span className="font-sans text-[10px] font-bold text-bronze bg-bronze/10 rounded-full px-[10px] py-[3px] uppercase tracking-[.05em]">
                {CAT_LABEL[campaign.participant_category] ?? campaign.participant_category}
              </span>
            )}
            {campaign.participant_bib && (
              <span className="font-num text-[10px] font-bold text-white/30">
                BIB #{campaign.participant_bib}
              </span>
            )}
          </div>
        </div>

        {/* Story (parchment) */}
        {campaign.participant_story && (
          <div
            className="border-[1.5px] rounded-[16px] px-[18px] py-[14px] mb-[14px]"
            style={{ background: '#F5EDD6', borderColor: '#D4C9A8' }}
          >
            <p className="font-sans text-[12.5px] italic leading-[1.6]" style={{ color: '#5C4A1E' }}>
              &ldquo;{campaign.participant_story}&rdquo;
            </p>
          </div>
        )}

        {/* Progress */}
        <div className="bg-white/[.06] border-[1.5px] border-white/10 rounded-[18px] p-[18px] text-center mb-[14px]">
          <p className="font-sans text-[11px] text-white/35 mb-[4px]">Total raised</p>
          <p className="font-num text-[38px] font-extrabold text-bronze leading-none">
            {formatTSh(campaign.total_raised)}
          </p>
          <p className="font-sans text-[11px] text-white/30 mt-[4px]">
            of {formatTSh(campaign.goal)} goal
          </p>
          <div className="h-[6px] bg-white/[.08] rounded-full overflow-hidden mt-[14px] mb-[6px]">
            <div
              className="h-full bg-bronze rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between">
            <span className="font-num text-[10px] font-bold text-white/28">{pct}%</span>
            <span className="font-num text-[10px] font-bold text-white/28">
              {campaign.supporter_count} supporter{campaign.supporter_count !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Cancelled banner */}
        {cancelled && !showThankYou && (
          <div className="bg-coral/10 border-[1.5px] border-coral/30 rounded-[12px] px-[16px] py-[12px] mb-[14px]">
            <p className="font-sans text-[13px] text-coral">
              Payment was cancelled. You can try again below.
            </p>
          </div>
        )}

        {/* ── Donation form ──────────────────────────────────────────────── */}
        <p className="font-num text-[10px] font-extrabold text-white/35 uppercase tracking-[.08em] mb-[14px]">
          Make a donation
        </p>

        {/* Name */}
        <div className="mb-[14px]">
          <label className={labelCls}>Your name</label>
          <input
            type="text"
            autoComplete="name"
            placeholder="Grace Mwamba"
            value={name}
            onChange={e => setName(e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Email */}
        <div className="mb-[14px]">
          <label className={labelCls}>
            Email{' '}
            <span className="text-white/20 normal-case font-sans font-normal tracking-normal">
              (for receipt)
            </span>
          </label>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Amount quick-picks */}
        <div className="mb-[14px]">
          <label className={labelCls}>Amount (TSh)</label>
          <div className="grid grid-cols-3 gap-[8px] mb-[8px]">
            {QUICK_AMOUNTS.map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => { setQuickAmt(amt); setCustom('') }}
                className={[
                  'rounded-[10px] py-[12px] font-num text-[12px] font-extrabold',
                  'border-[1.5px] transition-all duration-200 focus:outline-none',
                  quickAmt === amt
                    ? 'bg-bronze/10 border-bronze text-bronze'
                    : 'bg-white/[.05] border-white/[.10] text-white/40 hover:text-white/60 hover:border-white/20',
                ].join(' ')}
              >
                {formatTSh(amt, true)}
              </button>
            ))}
          </div>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Or enter custom amount"
            value={custom}
            onChange={e => { setCustom(e.target.value); setQuickAmt(null) }}
            className={inputCls}
          />
        </div>

        {/* Message */}
        <div className="mb-[20px]">
          <label className={labelCls}>
            Message{' '}
            <span className="text-white/20 normal-case font-sans font-normal tracking-normal">
              (optional)
            </span>
          </label>
          <textarea
            placeholder="Cheering you on every stroke, every pedal, every step!"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-coral/10 border-[1.5px] border-coral/30 rounded-[12px] px-[16px] py-[12px] mb-[14px]">
            <p className="font-sans text-[13px] text-coral">{error}</p>
          </div>
        )}

        {/* Donate CTA */}
        <button
          type="button"
          onClick={handleDonate}
          disabled={loading}
          className="w-full bg-bronze text-navy font-sans text-[14px] font-extrabold rounded-[12px] py-[16px] hover:opacity-90 active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-navy/30 border-t-navy animate-spin" />
              Processing…
            </span>
          ) : (
            finalAmount >= MIN_AMOUNT
              ? `Donate ${formatTSh(finalAmount)} via PayMe`
              : 'Donate via PayMe'
          )}
        </button>

        {/* Fee note */}
        <p className="font-sans text-[11px] text-white/25 text-center mt-[14px] leading-relaxed">
          Payments processed by PayMe Africa · 1.5% transaction fee applies.
          <br />
          All proceeds go to Ocean Road Cancer Institute.
        </p>

        {/* Recent supporters */}
        {donations.length > 0 && (
          <div className="mt-[30px]">
            <p className="font-num text-[10px] font-extrabold text-white/35 uppercase tracking-[.08em] mb-[10px]">
              Recent supporters
            </p>
            <div className="bg-white/[.04] border-[1.5px] border-white/[.08] rounded-[18px] px-[18px]">
              {donations.slice(0, 6).map((d, i) => (
                <div key={d.id}>
                  <div className="flex justify-between items-baseline py-[12px]">
                    <span className="font-sans text-[13px] text-white/50">{d.donor_name}</span>
                    <span className="font-num text-[13px] font-extrabold text-bronze">
                      {formatTSh(d.amount)}
                    </span>
                  </div>
                  {i < Math.min(donations.length, 6) - 1 && (
                    <div className="h-px bg-white/[.06]" />
                  )}
                </div>
              ))}
              {donations.length > 6 && (
                <p className="font-sans text-[11px] text-white/25 text-center pb-[12px]">
                  +{donations.length - 6} more supporter{donations.length - 6 !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ── Thank-you overlay ──────────────────────────────────────────────── */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 bg-navy/95 backdrop-blur-sm flex flex-col items-center justify-center px-[32px]">

          {/* Check circle */}
          <div className="w-[64px] h-[64px] rounded-full bg-bronze/15 border-[2px] border-bronze/40 flex items-center justify-center mb-[22px]">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path
                d="M6 14L11.5 19.5L22 8"
                stroke="#C8953C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className="font-serif text-[30px] italic font-bold text-white text-center tracking-[-0.02em] mb-[8px]">
            {donorDisplayName
              ? `Thank you, ${donorDisplayName.split(' ')[0]}.`
              : 'Thank you!'}
          </h2>

          {donorDisplayAmount > 0 && (
            <p className="font-sans text-[14px] text-white/55 text-center mb-[6px]">
              Your donation of{' '}
              <span className="text-bronze font-bold">{formatTSh(donorDisplayAmount)}</span>{' '}
              is confirmed.
            </p>
          )}

          <p className="font-sans text-[13px] text-white/35 text-center leading-relaxed mb-[32px]">
            Your support for {campaign.participant_name} is everything.
          </p>

          <button
            type="button"
            onClick={() => setShowThankYou(false)}
            className="bg-bronze text-navy font-sans text-[13px] font-extrabold rounded-[12px] px-[32px] py-[14px] hover:opacity-90 transition-opacity focus:outline-none"
          >
            See their progress
          </button>

        </div>
      )}

    </div>
  )
}

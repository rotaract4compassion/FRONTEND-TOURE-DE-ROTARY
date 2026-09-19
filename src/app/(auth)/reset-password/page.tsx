'use client'
import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordReset } from '@/lib/supabase/auth'

const inp = [
  'w-full bg-white/[.07] border-[1.5px] border-white/[.11] rounded-[12px]',
  'px-4 py-[15px] font-sans text-body text-white',
  'placeholder:text-white/[.22]',
  'focus:outline-none focus:border-bronze focus:bg-white/10',
  'transition-all duration-200',
].join(' ')

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!email) { setError('Please enter your email address.'); return }
    setLoading(true); setError(null)
    const { error: e } = await sendPasswordReset(email)
    if (e) { setError(e); setLoading(false); return }
    setSent(true); setLoading(false)
  }

  if (sent) return (
    <div className="w-full px-6 pb-10 animate-fade-up">
      <div className="bg-white/[.06] border-[1.5px] border-white/10 rounded-[18px] p-8 text-center mt-6">
        <div className="w-14 h-14 rounded-full bg-bronze/[.15] flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="font-serif text-[28px] font-bold italic text-white tracking-[-0.02em] mb-2">Check your inbox.</h2>
        <p className="font-sans text-[13px] text-white/40 mb-6 leading-relaxed">
          Reset link sent to <span className="text-bronze font-semibold">{email}</span>. Expires in 1 hour.
        </p>
        <Link href="/login" className="font-sans text-[13px] font-semibold text-bronze/70 hover:text-bronze transition-colors">
          Back to sign in →
        </Link>
      </div>
    </div>
  )

  return (
    <div className="w-full px-6 pb-10 animate-fade-up">
      <h2 className="font-serif text-[32px] font-bold italic text-white leading-[1.08] tracking-[-0.02em] mb-[6px]">
        Reset your password.
      </h2>
      <p className="font-sans text-[13px] text-white/40 mb-[26px] leading-relaxed">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <div className="mb-5">
        <label className="block font-num font-extrabold text-[10px] text-white/40 uppercase tracking-[.08em] mb-[9px]">Email</label>
        <input type="email" autoComplete="email" placeholder="you@example.com" value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          className={inp} />
      </div>
      {error && (
        <div className="mb-5 rounded-[12px] bg-coral/10 border border-coral/30 px-4 py-3">
          <p className="font-sans text-[13px] text-coral">{error}</p>
        </div>
      )}
      <button type="button" onClick={handleSubmit} disabled={loading}
        className="w-full bg-bronze text-navy font-sans text-[14px] font-extrabold rounded-[12px] py-4
                   hover:opacity-90 active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed
                   transition-all duration-200 focus:outline-none">
        {loading
          ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />Sending…</span>
          : 'Send reset link'}
      </button>
      <p className="mt-6 text-center">
        <Link href="/login" className="font-sans text-[13px] font-semibold text-bronze/60 hover:text-bronze transition-colors">
          ← Back to sign in
        </Link>
      </p>
    </div>
  )
}

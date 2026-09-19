'use client'

import { useState, type ChangeEvent } from 'react'
import { cn } from '@/lib/utils'

// ── Props ─────────────────────────────────────────────────────────────────────
// data/onChange/onNext are typed narrowly — only the fields DetailsStep owns.
// This lets RegistrationFlow pass a plain AccountState without needing FlowState.
interface Data {
  fullName: string
  email:    string
  phone:    string
  password: string
}

interface Props {
  data:          Data
  onChange:      (patch: Partial<Data>) => void
  onNext:        () => void
  // Optional overrides
  submitLabel?:  string        // default "Continue →"
  loading?:      boolean       // disables button and shows spinner text
  serverError?:  string | null // error from the server (e.g. "Email already in use")
}

// ── Validation ────────────────────────────────────────────────────────────────
interface Errors {
  fullName?: string
  email?:    string
  phone?:    string
  password?: string
}

// ── Styles ────────────────────────────────────────────────────────────────────
const inp = [
  'w-full bg-white border-[1.5px] border-[#0D1B3D]/[.12] rounded-[12px]',
  'px-4 py-[15px] font-sans text-body text-[#0D1B3D]',
  'placeholder:text-[#0D1B3D]/30',
  'focus:outline-none focus:border-[#9F2B68] focus:ring-4 focus:ring-[#9F2B68]/10',
  'transition-all duration-200',
].join(' ')

const lbl = 'block font-num font-extrabold text-[10px] text-[#0D1B3D]/55 uppercase tracking-[.08em] mb-[9px]'

export default function DetailsStep({
  data,
  onChange,
  onNext,
  submitLabel  = 'Continue →',
  loading      = false,
  serverError  = null,
}: Props) {
  const [errors,   setErrors]   = useState<Errors>({})
  const [showPass, setShowPass] = useState(false)
  const [phoneRaw, setPhoneRaw] = useState(
    data.phone.startsWith('+255') ? data.phone.slice(4) : data.phone,
  )

  function validate(): boolean {
    const e: Errors = {}
    if (!data.fullName.trim() || data.fullName.trim().length < 2)
      e.fullName = 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      e.email = 'Enter a valid email address.'
    if (!/^\d{9}$/.test(phoneRaw))
      e.phone = 'Enter 9 digits after +255.'
    if (data.password.length < 8)
      e.password = 'Password must be at least 8 characters.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handlePhone(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 9)
    setPhoneRaw(raw)
    onChange({ phone: `+255${raw}` })
  }

  function handleNext() {
    if (loading) return
    if (validate()) onNext()
  }

  return (
    <div className="animate-fade-up">

      <h2 className="font-serif text-[32px] font-bold italic text-[#0D1B3D] leading-[1.08] tracking-[-0.02em] mb-[6px]">
        Your details.
      </h2>
      <p className="font-sans text-[13px] text-[#0D1B3D]/55 mb-[26px] leading-relaxed">
        Create your Tour de Dar account. It&apos;s free.
      </p>

      {/* Full name */}
      <div className="mb-5">
        <label className={lbl}>Full name</label>
        <input
          type="text"
          autoComplete="name"
          placeholder="Amina Rashid"
          value={data.fullName}
          onChange={e => onChange({ fullName: e.target.value })}
          className={inp}
          disabled={loading}
        />
        {errors.fullName && <p className="mt-[6px] font-sans text-[11.5px] text-coral">{errors.fullName}</p>}
      </div>

      {/* Email */}
      <div className="mb-5">
        <label className={lbl}>Email</label>
        <input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={data.email}
          onChange={e => onChange({ email: e.target.value })}
          className={inp}
          disabled={loading}
        />
        {errors.email && <p className="mt-[6px] font-sans text-[11.5px] text-coral">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div className="mb-5">
        <label className={lbl}>Phone number</label>
        <div className="flex gap-2">
          <div className={cn(
            'flex items-center px-[14px] rounded-[12px] flex-shrink-0',
            'bg-[#3F78B5]/[.07] border-[1.5px] border-[#3F78B5]/[.14]',
            'font-sans text-body text-[#0D1B3D]/55 select-none',
          )}>
            +255
          </div>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel-local"
            placeholder="712 345 678"
            value={phoneRaw}
            onChange={handlePhone}
            className={cn(inp, 'flex-1')}
            disabled={loading}
          />
        </div>
        {errors.phone && <p className="mt-[6px] font-sans text-[11.5px] text-coral">{errors.phone}</p>}
      </div>

      {/* Password */}
      <div className="mb-0">
        <label className={lbl}>Password</label>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            value={data.password}
            onChange={e => onChange({ password: e.target.value })}
            className={cn(inp, 'pr-[54px]')}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPass(p => !p)}
            className="absolute right-4 top-1/2 -translate-y-1/2
                       font-num font-bold text-[11px] text-[#3F78B5]/70
                       hover:text-[#0D1B3D] transition-colors duration-200
                       focus:outline-none tracking-[.05em]"
          >
            {showPass ? 'HIDE' : 'SHOW'}
          </button>
        </div>
        {errors.password && <p className="mt-[6px] font-sans text-[11.5px] text-coral">{errors.password}</p>}
      </div>

      {/* Server-side error (e.g. email already in use) */}
      {serverError && (
        <p className="mt-4 font-sans text-[12px] text-coral leading-snug">
          {serverError}
        </p>
      )}

      <button
        type="button"
        onClick={handleNext}
        disabled={loading}
        className={cn(
          'mt-6 w-full bg-[#FFC62E] text-[#0D1B3D] font-sans text-[14px] font-extrabold',
          'rounded-[12px] py-4 transition-all duration-200 focus:outline-none',
          'focus-visible:ring-2 focus-visible:ring-[#9F2B68] focus-visible:ring-offset-2',
          'focus-visible:ring-offset-white',
          loading
            ? 'opacity-60 cursor-not-allowed'
            : 'hover:opacity-90 active:scale-[.98]',
        )}
      >
        {loading ? 'Creating account…' : submitLabel}
      </button>

    </div>
  )
}

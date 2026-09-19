'use client'

import { useState }      from 'react'
import Link              from 'next/link'
import DetailsStep       from '@/components/auth/steps/DetailsStep'
import { signUp }        from '@/lib/supabase/auth'

interface AccountState {
  fullName: string
  email:    string
  phone:    string
  password: string
}

const INITIAL: AccountState = {
  fullName: '',
  email:    '',
  phone:    '',
  password: '',
}

export default function RegistrationFlow() {
  const [state,       setState]  = useState<AccountState>(INITIAL)
  const [loading,     setLoading] = useState(false)
  const [serverError, setError]   = useState<string | null>(null)
  const [done,        setDone]    = useState(false)

  async function handleCreate() {
    setLoading(true)
    setError(null)

    const { error } = await signUp({
      email:    state.email,
      password: state.password,
      fullName: state.fullName,
      phone:    state.phone,
    })

    setLoading(false)

    if (error) {
      setError(error)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="flex flex-col flex-1 w-full px-6 pb-12 animate-fade-up">
        <div className="flex-1 flex flex-col justify-center items-center text-center gap-3">

          {/* Check mark */}
          <div className="w-14 h-14 rounded-full bg-[#9F2B68]/[.10] border border-[#9F2B68]/25 flex items-center justify-center mb-2">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
              <path d="M4 11.5L9 16.5L18 6" stroke="#9F2B68" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h2 className="font-serif text-[28px] font-bold italic text-[#0D1B3D] leading-[1.1] tracking-[-0.02em]">
            Account created.
          </h2>
          <p className="font-sans text-[13px] text-[#0D1B3D]/42 leading-relaxed max-w-[260px]">
            Check your email to verify your address, then sign in to your portal.
          </p>

          <Link
            href="/login"
            className="mt-5 w-full max-w-[280px] bg-[#FFC62E] text-[#0D1B3D] font-sans text-[14px]
                       font-extrabold rounded-[12px] py-4 text-center block
                       hover:opacity-90 active:scale-[.98] transition-all duration-200
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-[#9F2B68] focus-visible:ring-offset-2
                       focus-visible:ring-offset-white"
          >
            Go to Sign in →
          </Link>

        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 w-full px-6 pb-12">
      <DetailsStep
        data={state}
        onChange={patch => setState(prev => ({ ...prev, ...patch }))}
        onNext={handleCreate}
        submitLabel="Create account →"
        loading={loading}
        serverError={serverError}
      />
    </div>
  )
}

'use client'

import { useState, useEffect }       from 'react'
import { useParams, useRouter }       from 'next/navigation'
import { useAdminRegistration }       from '@/hooks/useAdmin'
import { adminConfirmPayment, adminAssignBib } from '@/lib/supabase/admin'
import { CATEGORY_MAP }               from '@/config/categories'
import { cn }                         from '@/lib/utils'

export default function AthleteDetailPage() {
  const { id }    = useParams<{ id: string }>()
  const router    = useRouter()
  const { row, loading, refresh } = useAdminRegistration(id)

  const [bibInput,  setBibInput]  = useState('')
  const [bibSaving, setBibSaving] = useState(false)
  const [paySaving, setPaySaving] = useState(false)
  const [bibMsg,    setBibMsg]    = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => { if (row?.bib_number) setBibInput(row.bib_number) }, [row?.bib_number])

  if (loading) return <Spinner />
  if (!row)    return <NotFound onBack={() => router.back()} />

  const name     = row.profiles?.full_name ?? 'Unknown'
  const email    = row.profiles?.email     ?? '—'
  const phone    = row.profiles?.phone     ?? '—'
  const avi      = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const category = CATEGORY_MAP[row.category]
  const paid     = row.payment_status === 'paid'

  async function handleConfirmPayment() {
    setPaySaving(true)
    await adminConfirmPayment(row!.id)
    await refresh()
    setPaySaving(false)
  }

  async function handleAssignBib() {
    const val = bibInput.trim()
    if (!val) return
    setBibSaving(true)
    setBibMsg(null)
    const { error } = await adminAssignBib(row!.id, val.padStart(3, '0'))
    setBibMsg(error ? { ok: false, text: error } : { ok: true, text: `Bib #${val.padStart(3, '0')} assigned.` })
    if (!error) await refresh()
    setBibSaving(false)
  }

  return (
    <div className="px-[22px] pb-6">
      {/* Back */}
      <button type="button" onClick={() => router.back()}
              className="flex items-center gap-[5px] pt-4 mb-4 focus-visible:outline-none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="font-sans text-[12px] font-semibold text-white/45">Athletes</span>
      </button>

      {/* Identity */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-full bg-bronze/[.15] border-[1.5px] border-bronze/35 flex-shrink-0
                        flex items-center justify-center font-serif text-[16px] italic font-bold text-bronze">
          {avi}
        </div>
        <div>
          <div className="font-serif text-[20px] italic font-bold text-white leading-[1.1]">{name}</div>
          <div className="font-sans text-[11px] text-white/35 mt-[2px] capitalize">
            {category?.name ?? row.category} · {row.category === 'relay' ? 'Relay' : 'Individual'}
          </div>
        </div>
      </div>

      {/* ── Payment ───────────────────────────────────────────────────── */}
      <SLabel>Payment status</SLabel>
      <div className="bg-white/[.06] border-[1.5px] border-white/10 rounded-[16px] p-[15px] mb-4
                      flex items-center justify-between">
        {paid ? (
          <span className="font-sans text-[11px] font-bold rounded-[6px] px-[10px] py-[4px]"
                style={{ background: 'rgba(72,199,136,.10)', color: '#48c788' }}>✓ Paid</span>
        ) : (
          <span className="font-sans text-[11px] font-bold rounded-[6px] px-[10px] py-[4px]"
                style={{ background: 'rgba(245,158,11,.10)', color: '#F59E0B' }}>⚠ Pending</span>
        )}
        {!paid && (
          <button type="button" onClick={handleConfirmPayment} disabled={paySaving}
                  className={cn(
                    'bg-bronze text-navy font-sans text-[11px] font-extrabold rounded-[10px] px-3 py-2',
                    'focus-visible:outline-none',
                    paySaving && 'opacity-50 cursor-not-allowed',
                  )}>
            {paySaving ? 'Saving…' : 'Confirm payment'}
          </button>
        )}
      </div>

      {/* ── Bib ───────────────────────────────────────────────────────── */}
      <SLabel>Bib assignment</SLabel>
      <div className="bg-white/[.06] border-[1.5px] border-white/10 rounded-[16px] p-[15px] mb-4">
        <div className="font-sans text-[12px] text-white/35 mb-[8px]">
          {row.bib_number ? `Current bib: #${row.bib_number}` : 'No bib assigned yet'}
        </div>
        <div className="flex gap-2">
          <input type="number" min={1} max={999} value={bibInput}
                 onChange={e => { setBibInput(e.target.value); setBibMsg(null) }}
                 placeholder="042"
                 className="w-[72px] bg-white/[.07] border-[1.5px] border-white/[.11] rounded-[10px]
                            px-3 py-[10px] font-num text-[14px] font-bold text-white text-center
                            outline-none focus:border-bronze/50 [appearance:textfield]" />
          <button type="button" onClick={handleAssignBib} disabled={bibSaving || !bibInput.trim()}
                  className={cn(
                    'flex-1 bg-bronze text-navy font-sans text-[12px] font-extrabold rounded-[10px] py-[10px]',
                    'focus-visible:outline-none',
                    (bibSaving || !bibInput.trim()) && 'opacity-45 cursor-not-allowed',
                  )}>
            {bibSaving ? 'Saving…' : 'Assign bib'}
          </button>
        </div>
        {bibMsg && (
          <p className={cn('font-sans text-[12px] mt-2', bibMsg.ok ? 'text-[#48c788]' : 'text-coral')}>
            {bibMsg.text}
          </p>
        )}
      </div>

      {/* ── Contact ───────────────────────────────────────────────────── */}
      <SLabel>Contact</SLabel>
      <div className="bg-white/[.04] border-[1.5px] border-white/[.07] rounded-[16px] px-[15px] mb-4">
        <ContactRow icon="✉" value={email} />
        <div className="h-px bg-white/[.06]" />
        <ContactRow icon="☎" value={phone} last />
      </div>

      {/* ── Story ─────────────────────────────────────────────────────── */}
      {row.story && (
        <>
          <SLabel>Race story</SLabel>
          <div className="bg-white/[.04] border-[1.5px] border-white/[.07] rounded-[14px] px-4 py-[14px]">
            <div className="font-serif text-[34px] italic font-bold text-bronze/[.18] leading-[0.85] mb-[4px] -mt-[3px]">
              &ldquo;
            </div>
            <p className="font-serif text-[13px] italic font-bold text-white/60 leading-[1.55]">
              {row.story}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-num text-[10px] font-extrabold text-white/35 uppercase tracking-[.08em] mb-[9px]">
      {children}
    </p>
  )
}

function ContactRow({ icon, value, last }: { icon: string; value: string; last?: boolean }) {
  return (
    <div className={cn('flex items-center gap-[10px] py-[11px]', !last && '')}>
      <span className="text-[14px] text-white/30">{icon}</span>
      <span className="font-sans text-[12px] text-white/60 truncate">{value}</span>
    </div>
  )
}

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-[22px]">
      <p className="font-sans text-[14px] text-white/35">Registration not found.</p>
      <button type="button" onClick={onBack}
              className="font-sans text-[13px] font-semibold text-bronze">← Back</button>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-5 h-5 rounded-full border-2 border-bronze border-t-transparent animate-spin" />
    </div>
  )
}

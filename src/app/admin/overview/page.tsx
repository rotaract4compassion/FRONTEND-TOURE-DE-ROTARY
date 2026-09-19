'use client'

import { useRouter }              from 'next/navigation'
import { useAdminRegistrations }  from '@/hooks/useAdmin'
import { formatTSh }              from '@/lib/utils'
import type { RegistrationRow }   from '@/lib/supabase/admin'

export default function OverviewPage() {
  const { rows, stats, loading } = useAdminRegistrations()
  const router = useRouter()

  if (loading) return <Spinner />

  const recent = rows.slice(0, 5)
  const maxCat = Math.max(stats!.byCategory.olympic, stats!.byCategory.sprint, stats!.byCategory.relay, 1)

  return (
    <div className="px-[22px] pb-6">
      <div className="pt-4 mb-4">
        <SLabel>Race overview · 1 Nov 2026</SLabel>
      </div>

      {/* ── Stats grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <StatCard label="Registrations" value={String(stats!.total)}        colour="text-bronze"         />
        <StatCard label="Paid"          value={String(stats!.paid)}          colour="text-[#48c788]"      />
        <StatCard label="Revenue"       value={formatTSh(stats!.revenue)}    colour="text-bronze" small   />
        <StatCard label="Unbibed"       value={String(stats!.unbibed)}       colour="text-[#F59E0B]"      />
      </div>

      {/* ── By category ───────────────────────────────────────────────── */}
      <SLabel>By category</SLabel>
      <div className="bg-white/[.04] border-[1.5px] border-white/[.07] rounded-[16px] p-[15px] mb-4">
        {(['olympic', 'sprint', 'relay'] as const).map(cat => (
          <div key={cat} className="mb-[10px] last:mb-0">
            <div className="flex justify-between mb-[5px]">
              <span className="font-sans text-[12px] text-white/38 capitalize">{cat}</span>
              <span className="font-num text-[12px] font-extrabold text-white">
                {stats!.byCategory[cat]}
              </span>
            </div>
            <div className="h-[6px] bg-white/[.08] rounded-full overflow-hidden">
              <div className="h-full bg-bronze rounded-full"
                   style={{ width: `${(stats!.byCategory[cat] / maxCat) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent ────────────────────────────────────────────────────── */}
      <SLabel>Recent registrations</SLabel>
      <div className="bg-white/[.06] border-[1.5px] border-white/10 rounded-[16px] px-[15px]">
        {recent.map((row, i) => (
          <RegRow key={row.id} row={row} last={i === recent.length - 1}
                  onClick={() => router.push(`/admin/athletes/${row.id}`)} />
        ))}
        {recent.length === 0 && (
          <p className="font-sans text-[13px] text-white/30 py-4 text-center">No registrations yet.</p>
        )}
      </div>
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

function StatCard({ label, value, colour, small }: {
  label: string; value: string; colour: string; small?: boolean
}) {
  return (
    <div className="bg-white/[.06] border-[1.5px] border-white/[.09] rounded-[14px] p-[13px]">
      <div className="font-sans text-[11px] text-white/38 mb-1">{label}</div>
      <div className={`font-num font-extrabold leading-none ${colour} ${small ? 'text-[18px]' : 'text-[26px]'}`}>
        {value}
      </div>
    </div>
  )
}

function RegRow({ row, last, onClick }: { row: RegistrationRow; last: boolean; onClick: () => void }) {
  const name  = row.profiles?.full_name ?? 'Unknown'
  const avi   = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const paid  = row.payment_status === 'paid'

  return (
    <button type="button" onClick={onClick}
            className="w-full flex items-center gap-[10px] py-[11px] text-left focus-visible:outline-none"
            style={{ borderBottom: last ? 'none' : '1px solid rgba(255,255,255,.05)' }}>
      <div className="w-8 h-8 rounded-full bg-bronze/[.15] border border-bronze/25 flex-shrink-0
                      flex items-center justify-center font-serif text-[11px] italic font-bold text-bronze">
        {avi}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-sans text-[13px] font-semibold text-white truncate mb-[2px]">{name}</div>
        <div className="flex gap-[5px]">
          <Chip bg="rgba(200,149,60,.12)" colour="#C8953C">{row.category}</Chip>
          {paid
            ? <Chip bg="rgba(72,199,136,.10)"  colour="#48c788">Paid</Chip>
            : <Chip bg="rgba(245,158,11,.10)"  colour="#F59E0B">Pending</Chip>}
        </div>
      </div>
      <span className="font-num text-[12px] font-extrabold text-white/20 flex-shrink-0">→</span>
    </button>
  )
}

function Chip({ bg, colour, children }: { bg: string; colour: string; children: React.ReactNode }) {
  return (
    <span className="font-sans text-[10px] font-bold rounded-[6px] px-[7px] py-[2px] capitalize"
          style={{ background: bg, color: colour }}>
      {children}
    </span>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-5 h-5 rounded-full border-2 border-bronze border-t-transparent animate-spin" />
    </div>
  )
}

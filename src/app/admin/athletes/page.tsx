'use client'

import { useState, useMemo }     from 'react'
import { useRouter }             from 'next/navigation'
import { useAdminRegistrations } from '@/hooks/useAdmin'
import { cn }                    from '@/lib/utils'
import type { RegistrationRow }  from '@/lib/supabase/admin'

type StatusFilter   = 'all' | 'paid' | 'pending'
type CategoryFilter = 'all' | 'sprint' | 'olympic' | 'relay'

export default function AthletesPage() {
  const { rows, stats, loading } = useAdminRegistrations()
  const router = useRouter()

  const [query,    setQuery]    = useState('')
  const [status,   setStatus]   = useState<StatusFilter>('all')
  const [category, setCategory] = useState<CategoryFilter>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter(r => {
      const name  = (r.profiles?.full_name ?? '').toLowerCase()
      const phone = (r.profiles?.phone     ?? '').toLowerCase()
      if (q && !name.includes(q) && !phone.includes(q)) return false
      if (status   !== 'all' && r.payment_status !== status)   return false
      if (category !== 'all' && r.category       !== category) return false
      return true
    })
  }, [rows, query, status, category])

  if (loading) return <Spinner />

  return (
    <div className="px-[22px] pb-6">
      <div className="pt-4 mb-[10px]">
        <p className="font-num text-[10px] font-extrabold text-white/35 uppercase tracking-[.08em] mb-[10px]">
          All registrations
        </p>

        {/* Search */}
        <div className="relative mb-[11px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" width="15" height="15"
               viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input type="search" value={query} onChange={e => setQuery(e.target.value)}
                 placeholder="Search by name or phone…"
                 className="w-full bg-white/[.07] border-[1.5px] border-white/[.11] rounded-[10px]
                            pl-9 pr-4 py-[11px] font-sans text-[13px] text-white placeholder:text-white/25
                            outline-none focus:border-bronze/50 transition-colors" />
        </div>

        {/* Filter chips */}
        <div className="flex gap-[6px] flex-wrap mb-[13px]">
          {(['all', 'pending', 'paid'] as StatusFilter[]).map(s => (
            <FilterChip key={s} active={status === s} onClick={() => setStatus(s)}>
              {s === 'all' ? `All · ${stats?.total ?? 0}` : s === 'paid' ? `Paid · ${stats?.paid ?? 0}` : `Pending · ${stats?.pending ?? 0}`}
            </FilterChip>
          ))}
          {(['olympic', 'sprint', 'relay'] as CategoryFilter[]).map(c => (
            <FilterChip key={c} active={category === c} onClick={() => setCategory(c === category ? 'all' : c)}>
              {c}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-white/[.06] border-[1.5px] border-white/10 rounded-[16px] px-[15px]">
        {filtered.length === 0 ? (
          <p className="font-sans text-[13px] text-white/30 py-5 text-center">No results.</p>
        ) : (
          filtered.map((row, i) => (
            <AthletRow key={row.id} row={row} last={i === filtered.length - 1}
                       onClick={() => router.push(`/admin/athletes/${row.id}`)} />
          ))
        )}
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterChip({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button type="button" onClick={onClick}
            className={cn(
              'rounded-full px-[10px] py-[4px] font-sans text-[10px] font-bold border-[1.5px] capitalize',
              'focus-visible:outline-none',
              active
                ? 'bg-bronze/[.15] border-bronze/40 text-bronze'
                : 'bg-white/[.05] border-white/[.12] text-white/45',
            )}>
      {children}
    </button>
  )
}

function AthletRow({ row, last, onClick }: { row: RegistrationRow; last: boolean; onClick: () => void }) {
  const name = row.profiles?.full_name ?? 'Unknown'
  const avi  = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const paid = row.payment_status === 'paid'

  return (
    <button type="button" onClick={onClick}
            className="w-full flex items-center gap-[10px] py-[11px] text-left focus-visible:outline-none"
            style={{ borderBottom: last ? 'none' : '1px solid rgba(255,255,255,.05)' }}>
      <div className="w-[30px] h-[30px] rounded-full bg-bronze/[.15] border border-bronze/25 flex-shrink-0
                      flex items-center justify-center font-serif text-[11px] italic font-bold text-bronze">
        {avi}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-sans text-[12px] font-semibold text-white truncate mb-[2px]">{name}</div>
        <span className="font-sans text-[10px] font-bold rounded-[6px] px-[7px] py-[2px] capitalize"
              style={{ background: 'rgba(200,149,60,.12)', color: '#C8953C' }}>
          {row.category}
        </span>
      </div>
      <div className="text-right flex-shrink-0 flex flex-col items-end gap-[3px]">
        <span className="font-sans text-[10px] font-bold rounded-[6px] px-[7px] py-[2px]"
              style={paid
                ? { background: 'rgba(72,199,136,.10)',  color: '#48c788' }
                : { background: 'rgba(245,158,11,.10)',  color: '#F59E0B' }}>
          {paid ? 'Paid' : 'Pending'}
        </span>
        <span className="font-num text-[11px] font-extrabold text-white/[.35]">
          {row.bib_number ? `#${row.bib_number}` : '—'}
        </span>
      </div>
    </button>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-5 h-5 rounded-full border-2 border-bronze border-t-transparent animate-spin" />
    </div>
  )
}

'use client'

import { useState }              from 'react'
import { useRouter }             from 'next/navigation'
import { useAdminRegistrations } from '@/hooks/useAdmin'
import { adminAssignBib }        from '@/lib/supabase/admin'
import { cn }                    from '@/lib/utils'

export default function BibsPage() {
  const { rows, loading, refresh } = useAdminRegistrations()
  const router = useRouter()
  const [inputs,    setInputs]    = useState<Record<string, string>>({})
  const [saving,    setSaving]    = useState<Record<string, boolean>>({})
  const [autoSaving, setAutoSaving] = useState(false)

  const queue = rows.filter(r => r.payment_status === 'paid' && !r.bib_number)
  const assigned = rows.filter(r => r.bib_number)

  if (loading) return <Spinner />

  async function handleAssign(id: string) {
    const val = (inputs[id] ?? '').trim()
    if (!val) return
    setSaving(s => ({ ...s, [id]: true }))
    await adminAssignBib(id, val.padStart(3, '0'))
    await refresh()
    setSaving(s => ({ ...s, [id]: false }))
    setInputs(i => ({ ...i, [id]: '' }))
  }

  async function handleAutoAssign() {
    setAutoSaving(true)
    let next = (assigned.length > 0
      ? Math.max(...assigned.map(r => parseInt(r.bib_number ?? '0', 10))) + 1
      : 1)
    for (const r of queue) {
      await adminAssignBib(r.id, String(next).padStart(3, '0'))
      next++
    }
    await refresh()
    setAutoSaving(false)
  }

  return (
    <div className="px-[22px] pb-6">
      <div className="pt-4 mb-[10px]">
        <p className="font-num text-[10px] font-extrabold text-white/35 uppercase tracking-[.08em] mb-[4px]">
          Bib assignment queue
        </p>
        <p className="font-sans text-[12px] text-white/35 mb-[13px]">
          {queue.length > 0
            ? `${queue.length} confirmed athlete${queue.length !== 1 ? 's' : ''} need bibs`
            : 'All paid athletes have bibs assigned.'}
        </p>
      </div>

      {queue.length > 0 && (
        <>
          <div className="bg-white/[.06] border-[1.5px] border-white/10 rounded-[16px] px-[15px] mb-4">
            {queue.map((row, i) => {
              const name = row.profiles?.full_name ?? 'Unknown'
              const avi  = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
              return (
                <div key={row.id}
                     className="flex items-center gap-[10px] py-[11px]"
                     style={{ borderBottom: i < queue.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                  <span className="font-num text-[15px] font-extrabold text-white/20 w-7 flex-shrink-0">
                    #?
                  </span>
                  <button type="button" onClick={() => router.push(`/admin/athletes/${row.id}`)}
                          className="flex-1 text-left min-w-0 focus-visible:outline-none">
                    <div className="font-sans text-[12px] font-semibold text-white truncate mb-[2px]">{name}</div>
                    <span className="font-sans text-[10px] font-bold rounded-[6px] px-[7px] py-[2px] capitalize"
                          style={{ background: 'rgba(200,149,60,.12)', color: '#C8953C' }}>
                      {row.category}
                    </span>
                  </button>
                  <div className="flex gap-[6px] flex-shrink-0 items-center">
                    <input type="number" min={1} max={999}
                           value={inputs[row.id] ?? ''}
                           onChange={e => setInputs(p => ({ ...p, [row.id]: e.target.value }))}
                           placeholder="042"
                           className="w-[56px] bg-white/[.07] border-[1.5px] border-white/[.11] rounded-[8px]
                                      px-2 py-[7px] font-num text-[12px] font-bold text-white text-center
                                      outline-none focus:border-bronze/50 [appearance:textfield]" />
                    <button type="button" onClick={() => handleAssign(row.id)}
                            disabled={saving[row.id] || !(inputs[row.id] ?? '').trim()}
                            className={cn(
                              'bg-bronze text-navy font-sans text-[11px] font-extrabold rounded-[8px] px-3 py-[7px]',
                              'focus-visible:outline-none',
                              (saving[row.id] || !(inputs[row.id] ?? '').trim()) && 'opacity-40 cursor-not-allowed',
                            )}>
                      {saving[row.id] ? '…' : 'Assign'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <button type="button" onClick={handleAutoAssign} disabled={autoSaving}
                  className={cn(
                    'w-full bg-bronze text-navy font-sans text-[13px] font-extrabold rounded-[12px] py-[14px]',
                    'focus-visible:outline-none',
                    autoSaving && 'opacity-50 cursor-not-allowed',
                  )}>
            {autoSaving ? 'Assigning…' : 'Auto-assign remaining bibs'}
          </button>
        </>
      )}

      {/* Already-assigned preview */}
      {assigned.length > 0 && (
        <div className="mt-5">
          <p className="font-num text-[10px] font-extrabold text-white/35 uppercase tracking-[.08em] mb-[9px]">
            Assigned · {assigned.length}
          </p>
          <div className="bg-white/[.04] border-[1.5px] border-white/[.07] rounded-[16px] px-[15px]">
            {assigned.slice(0, 5).map((row, i) => {
              const name = row.profiles?.full_name ?? 'Unknown'
              return (
                <div key={row.id} className="flex items-center justify-between py-[10px]"
                     style={{ borderBottom: i < Math.min(assigned.length, 5) - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
                  <span className="font-sans text-[12px] font-semibold text-white/70 truncate">{name}</span>
                  <span className="font-num text-[13px] font-extrabold text-bronze flex-shrink-0 ml-3">
                    #{row.bib_number}
                  </span>
                </div>
              )
            })}
            {assigned.length > 5 && (
              <p className="font-sans text-[11px] text-white/30 py-[10px] text-center">
                +{assigned.length - 5} more
              </p>
            )}
          </div>
        </div>
      )}
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

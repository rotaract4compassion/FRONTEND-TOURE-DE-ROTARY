'use client'

import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  Copy,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  Users,
} from 'lucide-react'
import { useFundraising } from '@/hooks/useFundraising'
import { formatTSh } from '@/lib/utils'

export default function FundraisePage() {
  const { campaign, donations, loading, shareUrl } = useFundraising()
  const [copied, setCopied] = useState(false)

  if (loading) return <Spinner />

  const raised = campaign?.total_raised ?? 0
  const goal = campaign?.goal ?? 200_000
  const count = campaign?.supporter_count ?? 0
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0
  const remaining = Math.max(0, goal - raised)
  const paid = donations.filter(d => d.payment_status === 'paid')

  async function handleCopy() {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // Clipboard can be unavailable in some browsers.
    }
  }

  function handleWhatsApp() {
    if (!shareUrl) return
    const txt = encodeURIComponent(
      `Support me at Tour de Dar 2026 — racing for Ocean Road Cancer Institute!\n${shareUrl}`,
    )
    window.open(`https://wa.me/?text=${txt}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="participant-fundraise min-h-full bg-[#f6f8fb] text-[#10233f]">
      <div className="mx-auto w-full max-w-[1240px] px-5 pb-12 sm:px-7 lg:px-10 lg:pb-14">
        {/* Page heading */}
        <header className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-end sm:justify-between lg:pt-9">
          <div>
            <p className="mb-2 font-num text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#2563eb]">
              Your impact
            </p>
            <h1 className="font-serif text-[32px] font-bold leading-none tracking-[-0.035em] text-[#10233f] sm:text-[38px]">
              Fundraise for a cause.
            </h1>
            <p className="mt-3 max-w-[560px] text-[13px] leading-6 text-[#64748b]">
              Turn every share into support for Ocean Road Cancer Institute.
              Your personal fundraising page makes it easy for friends and family to contribute.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#dbe4ef] bg-white px-3 py-2 shadow-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
              <Heart size={14} strokeWidth={2.5} />
            </span>
            <div className="pr-1">
              <p className="font-num text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#94a3b8]">
                Supporters
              </p>
              <p className="font-num text-[13px] font-extrabold text-[#10233f]">{count}</p>
            </div>
          </div>
        </header>

        {/* Main fundraising overview */}
        <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,.75fr)]">
          <div className="overflow-hidden rounded-[24px] border border-[#dce5ef] bg-white shadow-[0_12px_35px_rgba(15,35,63,0.06)]">
            <div className="border-b border-[#edf1f5] px-5 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-num text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#94a3b8]">
                    Fundraising progress
                  </p>
                  <h2 className="mt-1 font-sans text-[17px] font-extrabold text-[#10233f]">
                    Your campaign
                  </h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
                  <Sparkles size={17} />
                </div>
              </div>
            </div>

            <div className="px-5 py-6 sm:px-7 sm:py-7">
              <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-[#94a3b8]">Total raised</p>
                  <p className="mt-1 font-num text-[38px] font-extrabold leading-none tracking-[-0.035em] text-[#10233f] sm:text-[46px]">
                    {formatTSh(raised)}
                  </p>
                  <p className="mt-2 text-[12px] text-[#64748b]">
                    of {formatTSh(goal)} goal
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="font-num text-[28px] font-extrabold leading-none text-[#2563eb]">
                    {pct}%
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-[#94a3b8]">funded</p>
                </div>
              </div>

              <div className="mt-7">
                <div className="h-3 overflow-hidden rounded-full bg-[#eaf0f6]">
                  <div
                    className="h-full rounded-full bg-[#2563eb] transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[10px] font-semibold text-[#94a3b8]">
                  <span>{formatTSh(raised)} raised</span>
                  <span>{remaining > 0 ? `${formatTSh(remaining)} to go` : 'Goal reached'}</span>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <Stat icon={<Users size={15} />} label="Supporters" value={String(count)} />
                <Stat icon={<Heart size={15} />} label="Campaign goal" value={formatTSh(goal)} />
              </div>
            </div>
          </div>

          {/* Share card */}
          <aside className="rounded-[24px] border border-[#cfe0f7] bg-[#102f59] p-5 text-white shadow-[0_12px_35px_rgba(15,35,63,0.1)] sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/10 text-[#7db3ff]">
              <Share2 size={19} />
            </div>
            <p className="mt-6 font-num text-[10px] font-extrabold uppercase tracking-[0.13em] text-white/45">
              Grow your campaign
            </p>
            <h2 className="mt-2 font-serif text-[25px] font-bold leading-tight">
              Share your reason for riding.
            </h2>
            <p className="mt-3 text-[12px] leading-5 text-white/60">
              A personal message can make it easier for people to understand why this cause matters to you.
            </p>

            <button
              type="button"
              onClick={handleWhatsApp}
              disabled={!shareUrl}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-[12px] bg-white px-4 py-3 text-[12px] font-extrabold text-[#102f59] transition hover:bg-[#f3f7fc] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MessageCircle size={15} />
              Share on WhatsApp
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!shareUrl}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-[12px] border border-white/15 bg-white/5 px-4 py-3 text-[12px] font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Link copied' : 'Copy fundraising link'}
            </button>
          </aside>
        </section>

        {/* Supporters + story */}
        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)]">
          <div className="rounded-[24px] border border-[#dce5ef] bg-white shadow-[0_10px_30px_rgba(15,35,63,0.045)]">
            <div className="flex items-center justify-between border-b border-[#edf1f5] px-5 py-5 sm:px-6">
              <div>
                <p className="font-num text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#94a3b8]">
                  Your community
                </p>
                <h2 className="mt-1 text-[16px] font-extrabold text-[#10233f]">Recent supporters</h2>
              </div>
              <Users size={18} className="text-[#94a3b8]" />
            </div>

            {paid.length > 0 ? (
              <div className="px-5 sm:px-6">
                {paid.slice(0, 8).map((d, i) => (
                  <div key={d.id} className="flex items-center justify-between gap-4 border-b border-[#edf1f5] py-4 last:border-0">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
                        <Heart size={14} fill="currentColor" />
                      </span>
                      <span className="truncate text-[13px] font-semibold text-[#334155]">{d.donor_name}</span>
                    </div>
                    <span className="shrink-0 font-num text-[13px] font-extrabold text-[#10233f]">
                      {formatTSh(d.amount)}
                    </span>
                  </div>
                ))}
                {paid.length > 8 && (
                  <p className="pb-4 pt-1 text-center text-[11px] font-medium text-[#94a3b8]">
                    +{paid.length - 8} more supporter{paid.length - 8 !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
                  <Heart size={19} />
                </div>
                <p className="mt-4 text-[13px] font-semibold text-[#475569]">Your first supporter is waiting.</p>
                <p className="mx-auto mt-1 max-w-[300px] text-[11px] leading-5 text-[#94a3b8]">
                  Share your fundraising page to start building your community.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-[24px] border border-[#dce5ef] bg-white p-5 shadow-[0_10px_30px_rgba(15,35,63,0.045)] sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-num text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#94a3b8]">
                  Your message
                </p>
                <h2 className="mt-1 text-[16px] font-extrabold text-[#10233f]">Your story</h2>
              </div>
              <Heart size={18} className="text-[#2563eb]" />
            </div>

            {campaign?.participant_story ? (
              <>
                <div className="mt-5 rounded-[16px] border border-[#dbe7f4] bg-[#f7faff] p-5">
                  <p className="text-[13px] italic leading-6 text-[#475569]">
                    “{campaign.participant_story}”
                  </p>
                </div>
                <a
                  href="/profile"
                  className="mt-3 flex items-center justify-between rounded-[12px] border border-[#dce5ef] px-4 py-3 text-[12px] font-bold text-[#475569] transition hover:border-[#b9cbe0] hover:text-[#10233f]"
                >
                  Edit your story
                  <ArrowUpRight size={15} />
                </a>
              </>
            ) : (
              <div className="mt-5 rounded-[16px] border border-dashed border-[#cbd8e6] bg-[#f8fafc] p-5">
                <p className="text-[13px] font-semibold text-[#475569]">Tell people why you ride.</p>
                <p className="mt-1 text-[11px] leading-5 text-[#94a3b8]">
                  Add your personal story to your fundraising profile and give supporters a reason to join you.
                </p>
                <a
                  href="/profile"
                  className="mt-4 inline-flex items-center gap-2 text-[12px] font-extrabold text-[#2563eb]"
                >
                  Add your story <ArrowUpRight size={14} />
                </a>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-[#e4eaf1] bg-[#f8fafc] px-4 py-3">
      <div className="flex items-center gap-2 text-[#64748b]">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-[0.08em]">{label}</span>
      </div>
      <p className="mt-2 font-num text-[14px] font-extrabold text-[#10233f]">{value}</p>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-[#f6f8fb]">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2563eb] border-t-transparent" />
    </div>
  )
}

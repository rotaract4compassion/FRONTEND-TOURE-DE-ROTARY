'use client'

import Image from 'next/image'
import { ArrowRight, Bike, CalendarDays, Check, ChevronRight, Clock3, Heart, MapPin, Ticket, UserRound, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useParticipant } from '@/hooks/useParticipant'
import { useFundraising } from '@/hooks/useFundraising'
import { CATEGORY_MAP } from '@/config/categories'
import { useParticipantTheme } from '@/context/ParticipantThemeContext'

const EVENT_DATE = '1 November 2026'

export default function DashboardPage() {
  const { profile, registration, daysUntil, loading } = useParticipant()
  const { campaign } = useFundraising()
  const router = useRouter()
  const { theme } = useParticipantTheme()
  const dark = theme === 'dark'

  if (loading) return <Spinner dark={dark} />

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Athlete'
  const category = registration?.category ? CATEGORY_MAP[registration.category] : null
  const bib = registration?.bib_number
  const isPaid = registration?.payment_status === 'paid'
  const isConfirmed = registration?.status === 'confirmed'
  const raised = campaign?.total_raised ?? 0
  const goal = campaign?.goal ?? 200_000
  const supporters = campaign?.supporter_count ?? 0
  const raisedPct = Math.min(100, Math.round((raised / Math.max(goal, 1)) * 100))

  return (
    <div className={`min-h-[calc(100dvh-72px)] px-4 py-5 sm:px-6 lg:px-8 lg:py-7 ${dark ? 'bg-[#071A33] text-white' : 'bg-sand text-navy'}`}>
      <div className="mx-auto max-w-[1240px]">
        <section className={`mb-6 overflow-hidden rounded-[20px] border shadow-card ${dark ? 'border-white/10 bg-[#0C2748]' : 'border-navy/10 bg-white'}`}>
          <div className="grid min-h-[300px] lg:grid-cols-[1.45fr_.8fr]">
            <div className="relative min-h-[280px] overflow-hidden">
              <Image
                src="/assets/auth/dar-city-bridge.jpg"
                alt="Dar es Salaam waterfront and bridge"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
              <div className="absolute inset-0 flex items-end p-6 sm:p-8">
                <div className={`max-w-[520px] rounded-[16px] p-5 shadow-card-md sm:p-6 ${dark ? 'bg-[#0C2748]/95' : 'bg-white/95'}`}>
                  <p className="font-num text-[9px] font-extrabold uppercase tracking-[.16em] text-[#B12A70]">Participant dashboard</p>
                  <h1 className={`mt-2 font-serif text-[34px] font-bold italic leading-none tracking-[-.03em] sm:text-[44px] ${dark ? 'text-white' : 'text-navy'}`}>Good morning, {firstName}</h1>
                  <p className={`mt-3 font-sans text-[12px] sm:text-[13px] ${dark ? 'text-white/55' : 'text-navy/55'}`}>Your Tour de Rotary journey starts here.</p>
                  <div className={`mt-4 flex flex-wrap gap-4 font-sans text-[10px] font-semibold ${dark ? 'text-white/55' : 'text-navy/55'}`}>
                    <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-[#1769AA]" />Dar es Salaam</span>
                    <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} className="text-[#1769AA]" />2026 Edition</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between bg-[#123C70] p-6 text-white sm:p-8">
              <div>
                <p className="font-num text-[9px] font-extrabold uppercase tracking-[.16em] text-white/60">Tour de Rotary 2026</p>
                <h2 className="mt-3 font-serif text-[27px] font-bold italic leading-tight">Race day is getting closer.</h2>
              </div>
              <div className="mt-8">
                <div className="grid grid-cols-3 divide-x divide-white/20">
                  <Countdown value={daysUntil} label="Days" />
                  <Countdown value={String(0).padStart(2, '0')} label="Hours" />
                  <Countdown value={String(0).padStart(2, '0')} label="Minutes" />
                </div>
                <div className="mt-6 border-t border-white/15 pt-4">
                  <p className="font-sans text-[10px] text-white/55">Race day</p>
                  <p className="mt-1 font-sans text-[13px] font-semibold">{EVENT_DATE}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr_.8fr]">
          <section className={`rounded-[18px] border p-5 shadow-card sm:p-6 ${dark ? 'border-white/10 bg-[#0C2748]' : 'border-navy/10 bg-white'}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className={`font-serif text-[23px] font-bold ${dark ? 'text-white' : 'text-navy'}`}>Your journey</h2>
                <p className={`mt-1 font-sans text-[11px] ${dark ? 'text-white/50' : 'text-navy/50'}`}>Complete your steps and get race ready.</p>
              </div>
              <span className="font-num text-[10px] font-extrabold text-[#1769AA]">{isConfirmed ? '4 of 5' : '3 of 5'} completed</span>
            </div>
            <div className="mt-5 space-y-0">
              <JourneyRow label="Registration" done={isConfirmed} dark={dark} />
              <JourneyRow label="Profile" done={Boolean(profile?.full_name)} dark={dark} />
              <JourneyRow label="Payment" done={isPaid} dark={dark} />
              <JourneyRow label="Training" done={false} progress={72} dark={dark} />
              <JourneyRow label="Race ready" done={false} dark={dark} />
            </div>
          </section>

          <section className={`rounded-[18px] border p-5 shadow-card sm:p-6 ${dark ? 'border-white/10 bg-[#0C2748]' : 'border-navy/10 bg-white'}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Heart size={20} className="text-[#B12A70]" />
                <h2 className={`font-serif text-[23px] font-bold ${dark ? 'text-white' : 'text-navy'}`}>Your fundraising</h2>
              </div>
              <button type="button" onClick={() => router.push('/fundraise')} className="font-sans text-[10px] font-bold text-[#1769AA]">View details →</button>
            </div>
            <p className={`mt-6 font-num text-[30px] font-extrabold tracking-[-.03em] ${dark ? 'text-white' : 'text-navy'}`}>TSh {raised.toLocaleString()}</p>
            <p className={`mt-1 font-sans text-[11px] ${dark ? 'text-white/45' : 'text-navy/45'}`}>raised of TSh {goal.toLocaleString()} goal</p>
            <div className={`mt-4 h-2 overflow-hidden rounded-full ${dark ? 'bg-white/10' : 'bg-navy/10'}`}><div className="h-full rounded-full bg-[#B12A70]" style={{ width: `${raisedPct}%` }} /></div>
            <div className={`mt-2 flex justify-between font-sans text-[10px] font-semibold ${dark ? 'text-white/45' : 'text-navy/45'}`}><span>{raisedPct}%</span><span>{supporters} supporter{supporters === 1 ? '' : 's'}</span></div>
            <button type="button" onClick={() => router.push('/fundraise')} className="mt-6 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#B12A70] px-4 py-3 font-sans text-[11px] font-bold text-white transition hover:bg-[#9F2465]">Share my fundraising page <ArrowRight size={14} /></button>
          </section>

          <section className={`rounded-[18px] border p-5 shadow-card sm:p-6 ${dark ? 'border-white/10 bg-[#0C2748]' : 'border-navy/10 bg-white'}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5"><Bike size={20} className="text-[#1769AA]" /><h2 className={`font-serif text-[23px] font-bold ${dark ? 'text-white' : 'text-navy'}`}>Your ride</h2></div>
              <button type="button" onClick={() => router.push('/training')} className="font-sans text-[10px] font-bold text-[#1769AA]">View route →</button>
            </div>
            <div className={`mt-5 overflow-hidden rounded-[12px] ${dark ? 'bg-[#123C70]' : 'bg-[#EAF1F8]'}`}>
              <Image src="/assets/auth/dar-city-bridge.jpg" alt="Dar es Salaam route" width={720} height={360} className="h-[145px] w-full object-cover" />
            </div>
            <div className="mt-4 space-y-3">
              <RideInfo icon={Bike} label="Distance" value={category?.distances.bike ?? '—'} dark={dark} />
              <RideInfo icon={Clock3} label="Start time" value="6:00 AM" dark={dark} />
              <RideInfo icon={MapPin} label="Start point" value="Dar es Salaam" dark={dark} />
            </div>
          </section>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_.8fr]">
          <section className={`rounded-[18px] border p-5 shadow-card sm:p-6 ${dark ? 'border-white/10 bg-[#0C2748]' : 'border-navy/10 bg-white'}`}>
            <div className="flex items-center gap-2.5"><ArrowRight size={20} className="text-[#1769AA]" /><h2 className={`font-serif text-[23px] font-bold ${dark ? 'text-white' : 'text-navy'}`}>Quick actions</h2></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ActionCard title="My Ticket" text="View and manage your ticket" icon={Ticket} tone="blue" dark={dark} onClick={() => router.push('/ticket')} />
              <ActionCard title="Training" text="Access your training plans" icon={Bike} tone="yellow" dark={dark} onClick={() => router.push('/training')} />
              <ActionCard title="Fundraise" text="Grow your impact" icon={Heart} tone="pink" dark={dark} onClick={() => router.push('/fundraise')} />
              <ActionCard title="My Profile" text="Update your details" icon={UserRound} tone="soft" dark={dark} onClick={() => router.push('/profile')} />
            </div>
          </section>

          <section className={`rounded-[18px] border p-5 shadow-card sm:p-6 ${dark ? 'border-white/10 bg-[#0C2748]' : 'border-navy/10 bg-white'}`}>
            <div className="flex items-center justify-between"><div className="flex items-center gap-2.5"><CalendarDays size={20} className="text-[#1769AA]" /><h2 className={`font-serif text-[23px] font-bold ${dark ? 'text-white' : 'text-navy'}`}>Upcoming</h2></div><span className="font-sans text-[10px] font-bold text-[#1769AA]">View all →</span></div>
            <div className={`mt-4 divide-y ${dark ? 'divide-white/10' : 'divide-navy/10'}`}>
              <Upcoming date="04 OCT" title="Race briefing" detail="Saturday · 4:00 PM" dark={dark} />
              <Upcoming date="28 SEP" title="Registration closes" detail="Sunday" dark={dark} />
              <Upcoming date="03 OCT" title="Kit collection" detail="Friday" dark={dark} />
            </div>
          </section>
        </div>

        {bib && (
          <button type="button" onClick={() => router.push('/ticket')} className={`mt-5 flex w-full items-center justify-between rounded-[16px] border px-5 py-4 text-left transition ${dark ? 'border-[#F8BE22]/30 bg-[#3A3217] hover:bg-[#4A401C]' : 'border-[#F8BE22]/40 bg-[#FFF8DE] hover:bg-[#FFF3C1]'}`}>
            <div className="flex items-center gap-3"><Ticket size={20} className="text-[#A27600]" /><div><p className={`font-sans text-[12px] font-bold ${dark ? 'text-white' : 'text-navy'}`}>Your race bib is ready</p><p className={`mt-0.5 font-sans text-[10px] ${dark ? 'text-white/50' : 'text-navy/50'}`}>Bib #{bib} · tap to view your ticket</p></div></div><ChevronRight size={18} className="text-[#A27600]" />
          </button>
        )}

        {!isConfirmed && (
          <div className={`mt-5 rounded-[14px] border px-4 py-3 font-sans text-[11px] ${dark ? 'border-[#F8BE22]/30 bg-[#3A3217] text-white/60' : 'border-[#F8BE22]/40 bg-[#FFF8DE] text-navy/60'}`}>Your registration is under review. You&apos;ll be notified once it&apos;s confirmed.</div>
        )}
      </div>
    </div>
  )
}

function Countdown({ value, label }: { value: number | string; label: string }) {
  return <div className="px-2 text-center"><p className="font-num text-[27px] font-extrabold leading-none">{value}</p><p className="mt-1 font-sans text-[8px] font-semibold uppercase tracking-[.12em] text-white/55">{label}</p></div>
}

function JourneyRow({ label, done, progress, dark }: { label: string; done: boolean; progress?: number; dark: boolean }) {
  return <div className={`flex items-center gap-3 border-b py-3 last:border-0 ${dark ? 'border-white/10' : 'border-navy/10'}`}><div className={done ? 'flex h-7 w-7 items-center justify-center rounded-full bg-[#1769AA] text-white' : `flex h-7 w-7 items-center justify-center rounded-full border ${dark ? 'border-white/15 bg-[#0F3158] text-white/30' : 'border-navy/15 bg-white text-navy/30'}`}>{done ? <Check size={14} /> : <span className={`h-2 w-2 rounded-full ${dark ? 'bg-white/15' : 'bg-navy/15'}`} />}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><span className={`font-sans text-[11px] font-semibold ${dark ? 'text-white' : 'text-navy'}`}>{label}</span><span className={`font-sans text-[9px] font-medium ${dark ? 'text-white/40' : 'text-navy/40'}`}>{done ? 'Completed' : progress ? `${progress}%` : 'Pending'}</span></div>{progress !== undefined && <div className={`mt-2 h-1.5 overflow-hidden rounded-full ${dark ? 'bg-white/10' : 'bg-navy/10'}`}><div className="h-full rounded-full bg-[#1769AA]" style={{ width: `${progress}%` }} /></div>}</div><ChevronRight size={14} className={dark ? 'text-white/25' : 'text-navy/25'} /></div>
}

function RideInfo({ icon: Icon, label, value, dark }: { icon: typeof Bike; label: string; value: string; dark: boolean }) {
  return <div className="flex items-center gap-3"><Icon size={16} className="text-[#1769AA]" /><div><p className={`font-num text-[8px] font-extrabold uppercase tracking-[.1em] ${dark ? 'text-white/35' : 'text-navy/35'}`}>{label}</p><p className={`mt-0.5 font-sans text-[11px] font-semibold ${dark ? 'text-white' : 'text-navy'}`}>{value}</p></div></div>
}

function ActionCard({ title, text, icon: Icon, tone, dark, onClick }: { title: string; text: string; icon: typeof Ticket; tone: 'blue' | 'yellow' | 'pink' | 'soft'; dark: boolean; onClick: () => void }) {
  const styles = {
    blue: 'bg-[#1769AA] text-white',
    yellow: 'bg-[#F8BE22] text-navy',
    pink: 'bg-[#B12A70] text-white',
    soft: dark ? 'bg-[#123C70] text-white' : 'bg-[#E6F0FA] text-navy',
  }[tone]
  return <button type="button" onClick={onClick} className={`group min-h-[128px] rounded-[13px] p-4 text-left transition hover:-translate-y-0.5 ${styles}`}><Icon size={22} strokeWidth={1.8} /><p className="mt-5 font-sans text-[12px] font-bold">{title}</p><p className="mt-1 pr-2 font-sans text-[9px] leading-relaxed opacity-75">{text}</p><ArrowRight size={14} className="mt-3 transition-transform group-hover:translate-x-1" /></button>
}

function Upcoming({ date, title, detail, dark }: { date: string; title: string; detail: string; dark: boolean }) {
  return <div className="flex items-center gap-3 py-3"><div className={`w-11 shrink-0 rounded-[8px] px-1.5 py-2 text-center ${dark ? 'bg-[#123C70]' : 'bg-[#F4F7FA]'}`}><p className="font-num text-[8px] font-extrabold text-[#1769AA]">{date.split(' ')[0]}</p><p className={`font-num text-[7px] font-bold ${dark ? 'text-white/45' : 'text-navy/45'}`}>{date.split(' ')[1]}</p></div><div className="min-w-0 flex-1"><p className={`font-sans text-[11px] font-semibold ${dark ? 'text-white' : 'text-navy'}`}>{title}</p><p className={`mt-0.5 font-sans text-[9px] ${dark ? 'text-white/45' : 'text-navy/45'}`}>{detail}</p></div><ChevronRight size={15} className={dark ? 'text-white/25' : 'text-navy/25'} /></div>
}

function Spinner({ dark }: { dark: boolean }) {
  return <div className={`flex min-h-[calc(100dvh-72px)] items-center justify-center ${dark ? 'bg-[#071A33]' : 'bg-sand'}`}><div className="h-7 w-7 animate-spin rounded-full border-2 border-white/15 border-t-[#1769AA]" /></div>
}

'use client'

import { ArrowUpRight, Bike, CalendarDays, CheckCircle2, Clock3, Dumbbell, Map, Play, Waves } from 'lucide-react'
import { useParticipant } from '@/hooks/useParticipant'
import { useParticipantTheme } from '@/context/ParticipantThemeContext'
import { cn } from '@/lib/utils'

interface Resource {
  title: string
  subtitle: string
  type: string
}

interface DiscSection {
  slug: 'swim' | 'bike' | 'run'
  label: string
  distance: string
  colour: string
  icon: typeof Waves
  resources: Resource[]
}

const SECTIONS: DiscSection[] = [
  {
    slug: 'swim',
    label: 'Swim',
    distance: '1.5 km',
    colour: '#1769AA',
    icon: Waves,
    resources: [
      { title: 'Open-water technique guide', subtitle: 'Build confidence in open water', type: 'PDF · 12 pages' },
      { title: '8-week swim plan', subtitle: 'Structured sessions toward race day', type: 'Training schedule' },
    ],
  },
  {
    slug: 'bike',
    label: 'Bike',
    distance: '40 km',
    colour: '#C58A22',
    icon: Bike,
    resources: [
      { title: 'Bike fit and gear checklist', subtitle: 'Get your setup race-ready', type: 'PDF · 6 pages' },
      { title: 'DSM route preview', subtitle: 'Know the course before race day', type: 'Interactive map' },
    ],
  },
  {
    slug: 'run',
    label: 'Run',
    distance: '10 km',
    colour: '#B12A70',
    icon: Play,
    resources: [
      { title: 'Brick training protocol', subtitle: 'Practice your bike-to-run transition', type: 'Training guide' },
      { title: 'Coco Beach course map', subtitle: 'Preview the route and elevation', type: 'PDF · Course map' },
    ],
  },
]

const SPRINT_LABELS: Record<string, string> = {
  swim: '750 m',
  bike: '20 km',
  run: '5 km',
}

export default function TrainingPage() {
  const { registration, daysUntil, loading } = useParticipant()
  const { theme } = useParticipantTheme()
  const light = theme === 'light'
  const isSprint = registration?.category === 'sprint'

  if (loading) return <Spinner light={light} />

  return (
    <div className={cn('min-h-[calc(100dvh-72px)] px-5 pb-10 pt-6 sm:px-7 lg:px-8 lg:pb-12 lg:pt-8', light ? 'bg-[#F7F9FC]' : 'bg-[#07152F]')}>
      <div className="mx-auto max-w-[1180px]">
        <header className="mb-7 lg:mb-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className={cn('mb-2 font-num text-[9px] font-extrabold uppercase tracking-[.16em]', light ? 'text-[#1769AA]' : 'text-[#F8BE22]')}>
                Participant training
              </p>
              <h1 className={cn('font-serif text-[34px] font-bold italic leading-none tracking-[-.025em] sm:text-[42px]', light ? 'text-[#102E5C]' : 'text-white')}>
                Train smart.
              </h1>
              <p className={cn('mt-2 max-w-[530px] font-sans text-[12px] leading-relaxed', light ? 'text-slate-500' : 'text-white/45')}>
                Prepare for every part of your Tour de Dar race with focused guides, route resources and practical training support.
              </p>
            </div>

            <div className={cn('flex w-fit items-center gap-3 rounded-[15px] border px-4 py-3', light ? 'border-[#102E5C]/10 bg-white shadow-[0_8px_24px_rgba(16,46,92,.05)]' : 'border-white/[.08] bg-[#0D1B3D]')}>
              <CalendarDays size={19} className={light ? 'text-[#1769AA]' : 'text-[#F8BE22]'} strokeWidth={1.7} />
              <div>
                <p className={cn('font-num text-[22px] font-extrabold leading-none', light ? 'text-[#102E5C]' : 'text-white')}>{daysUntil}</p>
                <p className={cn('mt-1 font-num text-[8px] font-extrabold uppercase tracking-[.1em]', light ? 'text-slate-400' : 'text-white/35')}>days to race</p>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-7 grid gap-3 sm:grid-cols-3">
          <SummaryCard light={light} icon={<Waves size={18} />} label="Swim" value={isSprint ? SPRINT_LABELS.swim : '1.5 km'} colour="#1769AA" />
          <SummaryCard light={light} icon={<Bike size={18} />} label="Bike" value={isSprint ? SPRINT_LABELS.bike : '40 km'} colour="#C58A22" />
          <SummaryCard light={light} icon={<Play size={18} />} label="Run" value={isSprint ? SPRINT_LABELS.run : '10 km'} colour="#B12A70" />
        </section>

        <section className={cn('mb-7 overflow-hidden rounded-[20px] border', light ? 'border-[#102E5C]/10 bg-white shadow-[0_10px_35px_rgba(16,46,92,.05)]' : 'border-white/[.08] bg-[#0D1B3D]')}>
          <div className={cn('flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6', light ? 'border-[#102E5C]/10' : 'border-white/[.07]')}>
            <div>
              <p className={cn('font-num text-[9px] font-extrabold uppercase tracking-[.13em]', light ? 'text-slate-400' : 'text-white/30')}>Your preparation</p>
              <h2 className={cn('mt-1 font-sans text-[18px] font-bold', light ? 'text-[#102E5C]' : 'text-white')}>Build your race routine</h2>
            </div>
            <div className={cn('flex items-center gap-2 rounded-full px-3 py-1.5', light ? 'bg-[#EAF3FB] text-[#1769AA]' : 'bg-[#1769AA]/15 text-[#8FC7F2]')}>
              <CheckCircle2 size={14} />
              <span className="font-sans text-[10px] font-bold">Start with consistency</span>
            </div>
          </div>
          <div className="grid gap-px sm:grid-cols-3">
            <PrepItem light={light} icon={<Clock3 size={18} />} title="Train regularly" text="Keep your sessions consistent as race day approaches." />
            <PrepItem light={light} icon={<Dumbbell size={18} />} title="Build gradually" text="Increase effort and distance without rushing the process." />
            <PrepItem light={light} icon={<Map size={18} />} title="Know the course" text="Use the route resources to understand what is ahead." />
          </div>
        </section>

        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className={cn('font-num text-[9px] font-extrabold uppercase tracking-[.13em]', light ? 'text-slate-400' : 'text-white/30')}>Training resources</p>
            <h2 className={cn('mt-1 font-sans text-[18px] font-bold', light ? 'text-[#102E5C]' : 'text-white')}>Prepare by discipline</h2>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {SECTIONS.map(section => {
            const Icon = section.icon
            const distance = isSprint ? SPRINT_LABELS[section.slug] : section.distance
            return (
              <section key={section.slug} className={cn('rounded-[18px] border p-4 transition-shadow sm:p-5', light ? 'border-[#102E5C]/10 bg-white hover:shadow-[0_12px_32px_rgba(16,46,92,.07)]' : 'border-white/[.08] bg-[#0D1B3D] hover:border-white/[.13]')}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border" style={{ color: section.colour, borderColor: `${section.colour}35`, backgroundColor: `${section.colour}${light ? '10' : '18'}` }}>
                      <Icon size={19} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className={cn('font-sans text-[14px] font-bold', light ? 'text-[#102E5C]' : 'text-white')}>{section.label}</h3>
                      <p className={cn('mt-0.5 font-num text-[10px] font-extrabold', light ? 'text-slate-400' : 'text-white/35')}>{distance}</p>
                    </div>
                  </div>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: section.colour }} />
                </div>

                <div className="space-y-2">
                  {section.resources.map(resource => (
                    <button key={resource.title} type="button" className={cn('group flex w-full items-center gap-3 rounded-[12px] border p-3 text-left transition', light ? 'border-[#102E5C]/[.08] bg-[#F7F9FC] hover:border-[#1769AA]/20 hover:bg-[#F1F6FB]' : 'border-white/[.07] bg-white/[.035] hover:border-white/[.13] hover:bg-white/[.05]')}>
                      <div className="min-w-0 flex-1">
                        <p className={cn('truncate font-sans text-[11px] font-bold', light ? 'text-[#102E5C]' : 'text-white/85')}>{resource.title}</p>
                        <p className={cn('mt-1 truncate font-sans text-[9px]', light ? 'text-slate-400' : 'text-white/35')}>{resource.subtitle}</p>
                        <p className="mt-1.5 font-num text-[8px] font-extrabold uppercase tracking-[.08em]" style={{ color: section.colour }}>{resource.type}</p>
                      </div>
                      <ArrowUpRight size={15} className={cn('shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5', light ? 'text-slate-300' : 'text-white/25')} />
                    </button>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        <div className={cn('mt-5 flex items-center gap-3 rounded-[15px] border px-4 py-3.5', light ? 'border-[#F8BE22]/25 bg-[#FFF9E8]' : 'border-[#F8BE22]/20 bg-[#F8BE22]/[.06]')}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F8BE22]/15 text-[#C58A22]"><CalendarDays size={15} /></span>
          <p className={cn('font-sans text-[10px] leading-relaxed', light ? 'text-slate-600' : 'text-white/50')}>
            Race day is <strong className={light ? 'text-[#102E5C]' : 'text-white/75'}>1 November 2026</strong>. Use these resources alongside your own training plan and follow guidance from your coach or medical professional where applicable.
          </p>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ light, icon, label, value, colour }: { light: boolean; icon: React.ReactNode; label: string; value: string; colour: string }) {
  return (
    <div className={cn('flex items-center gap-3 rounded-[16px] border p-4', light ? 'border-[#102E5C]/10 bg-white' : 'border-white/[.08] bg-[#0D1B3D]')}>
      <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border" style={{ color: colour, borderColor: `${colour}35`, backgroundColor: `${colour}10` }}>{icon}</div>
      <div><p className={cn('font-sans text-[10px]', light ? 'text-slate-400' : 'text-white/35')}>{label}</p><p className={cn('mt-0.5 font-num text-[15px] font-extrabold', light ? 'text-[#102E5C]' : 'text-white')}>{value}</p></div>
    </div>
  )
}

function PrepItem({ light, icon, title, text }: { light: boolean; icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className={cn('p-5 sm:p-6', light ? 'bg-white' : 'bg-[#0D1B3D]')}>
      <div className={cn('mb-3 flex h-8 w-8 items-center justify-center rounded-full', light ? 'bg-[#EAF3FB] text-[#1769AA]' : 'bg-[#1769AA]/15 text-[#8FC7F2]')}>{icon}</div>
      <p className={cn('font-sans text-[12px] font-bold', light ? 'text-[#102E5C]' : 'text-white/85')}>{title}</p>
      <p className={cn('mt-1.5 font-sans text-[10px] leading-relaxed', light ? 'text-slate-500' : 'text-white/38')}>{text}</p>
    </div>
  )
}

function Spinner({ light }: { light: boolean }) {
  return <div className={cn('flex min-h-[55vh] items-center justify-center', light ? 'bg-[#F7F9FC]' : 'bg-[#07152F]')}><div className={cn('h-6 w-6 animate-spin rounded-full border-2 border-t-transparent', light ? 'border-[#1769AA]' : 'border-[#F8BE22]')} /></div>
}

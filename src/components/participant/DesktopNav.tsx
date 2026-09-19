'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Bell, Heart, Home, LogOut, Ticket, User, Bike, Moon, Sun, Check } from 'lucide-react'
import { useParticipant } from '@/hooks/useParticipant'
import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/utils'
import { useParticipantTheme } from '@/context/ParticipantThemeContext'

const ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/ticket', label: 'My Ticket', icon: Ticket },
  { href: '/training', label: 'Training', icon: Bike },
  { href: '/fundraise', label: 'Fundraise', icon: Heart },
  { href: '/profile', label: 'My Profile', icon: User },
]

export function DesktopNav() {
  const pathname = usePathname()
  const { profile } = useParticipant()
  const { signOut } = useUser()
  const initial = profile?.full_name?.charAt(0).toUpperCase() ?? 'A'
  const { theme, setTheme } = useParticipantTheme()
  const light = theme === 'light'
  const [appearanceOpen, setAppearanceOpen] = useState(false)

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 flex h-[72px] items-center justify-between border-b px-6 transition-colors lg:px-8',
          light ? 'border-navy/10 bg-white' : 'border-white/[.07] bg-[#091631]/95',
        )}
      >
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative h-12 w-[148px] shrink-0">
            <img src="/assets/auth/tour-de-rotary-mark.png" alt="Tour de Rotary Dar es Salaam" className="h-full w-full object-contain object-left" />
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className={cn('relative rounded-full p-2 transition', light ? 'text-navy/65 hover:bg-navy/5 hover:text-navy' : 'text-white/65 hover:bg-white/5 hover:text-white')}
          >
            <Bell size={19} strokeWidth={1.7} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#B12A70]" />
          </button>
          <div className={cn('hidden h-7 w-px sm:block', light ? 'bg-navy/10' : 'bg-white/10')} />
          <div className="relative">
            <button
              type="button"
              onClick={() => setAppearanceOpen(open => !open)}
              aria-label="Appearance settings"
              aria-expanded={appearanceOpen}
              title="Appearance"
              className={cn(
                'rounded-full p-2 transition',
                light ? 'text-navy/55 hover:bg-navy/5 hover:text-navy' : 'text-white/65 hover:bg-white/5 hover:text-white',
              )}
            >
              {light ? <Moon size={18} strokeWidth={1.8} /> : <Sun size={18} strokeWidth={1.8} />}
            </button>
            {appearanceOpen && (
              <div className={cn(
                'absolute right-0 top-11 w-44 rounded-[14px] border p-2 shadow-card-lg',
                light ? 'border-navy/10 bg-white' : 'border-white/10 bg-[#0d1b3d]',
              )}>
                <p className={cn('px-2 py-1.5 font-num text-[9px] font-extrabold uppercase tracking-[.12em]', light ? 'text-navy/35' : 'text-white/35')}>Appearance</p>
                <button
                  type="button"
                  onClick={() => { setTheme('light'); setAppearanceOpen(false) }}
                  className={cn('flex w-full items-center justify-between rounded-[9px] px-2.5 py-2 text-left font-sans text-[11px] font-semibold', light ? 'bg-navy/[.05] text-navy' : 'text-white/70 hover:bg-white/[.05]')}
                >
                  <span className="flex items-center gap-2"><Sun size={15} /> Light mode</span>
                  {light && <Check size={14} className="text-[#1769AA]" />}
                </button>
                <button
                  type="button"
                  onClick={() => { setTheme('dark'); setAppearanceOpen(false) }}
                  className={cn('mt-1 flex w-full items-center justify-between rounded-[9px] px-2.5 py-2 text-left font-sans text-[11px] font-semibold', !light ? 'bg-white/[.06] text-white' : 'text-navy/65 hover:bg-navy/[.05]')}
                >
                  <span className="flex items-center gap-2"><Moon size={15} /> Dark mode</span>
                  {!light && <Check size={14} className="text-bronze" />}
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <div className={cn('flex h-9 w-9 items-center justify-center rounded-full border font-num text-[12px] font-extrabold', light ? 'border-navy/10 bg-[#EAF1F8] text-navy' : 'border-bronze/30 bg-bronze/10 text-bronze')}>
              {initial}
            </div>
            <span className={cn('hidden font-sans text-[12px] font-semibold sm:block', light ? 'text-navy' : 'text-white/80')}>
              {profile?.full_name?.split(' ')[0] ?? 'Athlete'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            aria-label="Sign out"
            className={cn('rounded-full p-2 transition', light ? 'text-navy/50 hover:bg-navy/5 hover:text-navy' : 'text-white/35 hover:bg-white/5 hover:text-white')}
          >
            <LogOut size={17} strokeWidth={1.7} />
          </button>
        </div>
      </header>

      <aside
        className={cn(
          'fixed bottom-0 left-0 top-[72px] z-40 hidden w-[228px] flex-col border-r px-5 py-7 lg:flex',
          light ? 'border-navy/10 bg-white' : 'border-white/[.06] bg-[#091631]/95',
        )}
      >
        <p className={cn('px-3 pb-3 font-num text-[9px] font-extrabold uppercase tracking-[.12em]', light ? 'text-navy/35' : 'text-white/25')}>
          Participant portal
        </p>
        <nav className="space-y-1" aria-label="Participant navigation">
          {ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-11 items-center gap-3 rounded-[11px] px-3 transition-colors',
                  light
                    ? active
                      ? 'bg-[#E6F0FA] text-[#1769AA]'
                      : 'text-navy/55 hover:bg-navy/[.04] hover:text-navy'
                    : active
                      ? 'bg-bronze text-white shadow-[0_8px_24px_rgba(200,149,60,.16)]'
                      : 'text-white/50 hover:bg-white/[.05] hover:text-white',
                )}
              >
                <Icon size={19} strokeWidth={active ? 2 : 1.7} />
                <span className="font-sans text-[12px] font-semibold">{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto px-3 pb-2">
          <p className={cn('font-serif text-[18px] italic leading-tight', light ? 'text-navy/45' : 'text-white/45')}>Stronger<br />Together.</p>
          <div className="mt-3 flex items-center gap-1">
            <span className="h-1 w-6 bg-[#1769AA]" />
            <span className="h-1 w-6 bg-[#B12A70]" />
            <span className="h-1 w-6 bg-[#F8BE22]" />
          </div>
          <p className={cn('mt-3 font-num text-[9px] uppercase tracking-[.1em]', light ? 'text-navy/35' : 'text-bronze/50')}>1 November 2026</p>
        </div>
      </aside>
    </>
  )
}

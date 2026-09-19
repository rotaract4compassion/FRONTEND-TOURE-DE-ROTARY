'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Ticket, Bike, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useParticipantTheme } from '@/context/ParticipantThemeContext'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/ticket', label: 'Ticket', icon: Ticket },
  { href: '/training', label: 'Training', icon: Bike },
  { href: '/fundraise', label: 'Fundraise', icon: Heart },
  { href: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const { theme } = useParticipantTheme()
  const light = theme === 'light'

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 flex border-t pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)] lg:hidden',
        light ? 'border-navy/10 bg-white' : 'border-white/[.06] bg-navy',
      )}
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link key={href} href={href} className="flex flex-1 flex-col items-center gap-1" aria-current={active ? 'page' : undefined}>
            <Icon size={19} strokeWidth={active ? 2 : 1.7} className={cn(active ? (light ? 'text-[#1769AA]' : 'text-bronze') : light ? 'text-navy/30' : 'text-white/30')} />
            <span className={cn('font-sans text-[9px] font-semibold', active ? (light ? 'text-[#1769AA]' : 'text-bronze') : light ? 'text-navy/30' : 'text-white/30')}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

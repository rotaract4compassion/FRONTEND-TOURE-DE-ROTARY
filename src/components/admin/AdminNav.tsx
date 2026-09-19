'use client'

import Link            from 'next/link'
import { usePathname } from 'next/navigation'
import { cn }          from '@/lib/utils'

const TABS = [
  {
    href: '/admin/overview',
    label: 'Overview',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
              stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/admin/athletes',
    label: 'Athletes',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="9"  cy="7"  r="3" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="17" cy="7"  r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 21C2 17.1 5.1 14 9 14C12.9 14 16 17.1 16 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M19 14C21.2 14 23 15.8 23 18V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/admin/bibs',
    label: 'Bibs',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M20 7L15 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9L20 7Z"
              stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M15 3V9H21" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8 13H16M8 17H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="relative z-10 flex border-t border-white/[.06] bg-navy/[.98] pt-2 pb-[18px]"
         aria-label="Admin navigation">
      {TABS.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link key={href} href={href}
                className="flex-1 flex flex-col items-center gap-[3px]"
                aria-current={active ? 'page' : undefined}>
            <span className={cn(active ? 'text-bronze' : 'text-white/[.28]')}>{icon}</span>
            <span className={cn('font-sans text-[9px] font-semibold',
                                active ? 'text-bronze' : 'text-white/[.28]')}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

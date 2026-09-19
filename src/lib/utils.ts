import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { LifecycleState } from '@/types'

// ─────────────────────────────────────────────────────────────────────────────
// Tour de Dar — Shared Utilities
// ─────────────────────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ── Currency ──────────────────────────────────────────────────────────────────
export function formatTSh(amount: number, compact = false): string {
  if (compact) return formatTShCompact(amount)
  return `TSh ${amount.toLocaleString('en-TZ')}`
}

export function formatTShCompact(amount: number): string {
  if (amount >= 1_000_000) {
    const v = amount / 1_000_000
    return `TSh ${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`
  }
  if (amount >= 1_000) return `TSh ${(amount / 1_000).toFixed(0)}K`
  return `TSh ${amount}`
}

// ── Race time ─────────────────────────────────────────────────────────────────
// Format a race duration in seconds → "1:23:45" or "45:02"
export function formatRaceTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

// ── Bib ───────────────────────────────────────────────────────────────────────
export function pad(n: number | string, digits = 3): string {
  return String(n).padStart(digits, '0')
}

// ── Date ──────────────────────────────────────────────────────────────────────
export function formatEventDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

// ── Lifecycle guard ───────────────────────────────────────────────────────────
export function isLifecycleState(val: unknown): val is LifecycleState {
  return val === 'live' || val === 'memory' || val === 'archive'
}

// ── Strings ───────────────────────────────────────────────────────────────────
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max - 1).trimEnd() + '…'
}

export function initials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function slugify(str: string): string {
  return str.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Number ────────────────────────────────────────────────────────────────────
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-TZ')
}

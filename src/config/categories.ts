// ─────────────────────────────────────────────────────────────────────────────
// Tour de Dar — Category & Discipline Configuration
// ─────────────────────────────────────────────────────────────────────────────
import type { CategoryConfig, DisciplineConfig } from '@/types'

// ── Registration fees (TSh) ───────────────────────────────────────────────────
export const REGISTRATION_FEES: Record<string, number> = {
  sprint:  45_000,
  olympic: 75_000,
  relay:   90_000,   // per relay team member
}

// ── Processing fee ────────────────────────────────────────────────────────────
export const PROCESSING_FEE_RATE = 0.015  // 1.5% PayMe Africa

// ── Categories ────────────────────────────────────────────────────────────────
export const CATEGORIES: CategoryConfig[] = [
  {
    slug:    'sprint',
    name:    'Sprint',
    tagline: 'Fast. Sharp. Fearless.',
    price:   REGISTRATION_FEES.sprint,
    distances: { swim: '750m', bike: '20km', run: '5km' },
  },
  {
    slug:    'olympic',
    name:    'Olympic',
    tagline: 'The full distance. The full story.',
    price:   REGISTRATION_FEES.olympic,
    distances: { swim: '1.5km', bike: '40km', run: '10km' },
  },
  {
    slug:    'relay',
    name:    'Relay',
    tagline: 'Three athletes. One finish line.',
    price:   REGISTRATION_FEES.relay,
    distances: { swim: '1.5km', bike: '40km', run: '10km' },
  },
]

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map(c => [c.slug, c])
) as Record<string, CategoryConfig>

// ── Disciplines ───────────────────────────────────────────────────────────────
// Relay only — each member picks one discipline.
export const DISCIPLINES: DisciplineConfig[] = [
  {
    slug:        'swim',
    name:        'Swim',
    hex:         '#4FC3F7',
    distances:   { sprint: '750m', olympic: '1.5km' },
    description: 'Open water off the Msasani Peninsula.',
  },
  {
    slug:        'bike',
    name:        'Bike',
    hex:         '#F59E0B',
    distances:   { sprint: '20km', olympic: '40km' },
    description: 'Coastal roads through the peninsula.',
  },
  {
    slug:        'run',
    name:        'Run',
    hex:         '#E85D3A',
    distances:   { sprint: '5km', olympic: '10km' },
    description: 'Through the city to Coco Beach.',
  },
]

export const DISCIPLINE_MAP = Object.fromEntries(
  DISCIPLINES.map(d => [d.slug, d])
) as Record<string, DisciplineConfig>

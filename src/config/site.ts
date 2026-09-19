// ─────────────────────────────────────────────────────────────────────────────
// Tour de Dar — Site Config
// Single source of truth for site metadata. Used by layout, home sections,
// and SEO. Keep in sync with event_config in Supabase.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name:      'Tour de Dar',
  tagline:   'Swim. Bike. Run. For a reason.',
  shortName: 'TdDar',
  organiser: 'Rotaract 4 Compassion',
  url:       process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tourdedar.co.tz',

  event: {
    date:     '2026-11-01',
    location: 'Dar es Salaam, Tanzania',
    venue:    'Coco Beach finish line',
  },

  beneficiary: {
    name:  'Ocean Road Cancer Institute',
    short: 'ORCI',
    url:   'https://orci.ac.tz',
  },

  contact: {
    email: 'hello@tourdedar.co.tz',
  },

  description: 'A charity triathlon in Dar es Salaam raising funds for Ocean Road Cancer Institute.',
} as const

// ── Disciplines — re-exported here for home section convenience ───────────────
// Canonical definition lives in src/config/categories.ts
export { DISCIPLINES } from '@/config/categories'

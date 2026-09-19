// ─────────────────────────────────────────────────────────────────────────────
// Tour de Dar — Core Types
// ─────────────────────────────────────────────────────────────────────────────
import type { User } from '@supabase/supabase-js'

// ── Lifecycle ─────────────────────────────────────────────────────────────────
// Read from event_config.lifecycle_state via useLifecycle() — NEVER hardcoded.
export type LifecycleState = 'live' | 'memory' | 'archive'

// ── Race ──────────────────────────────────────────────────────────────────────
export type Category      = 'sprint' | 'olympic' | 'relay'
export type DisciplineSlug = 'swim'   | 'bike'    | 'run'

// ── Users ─────────────────────────────────────────────────────────────────────
export type UserRole = 'participant' | 'volunteer' | 'hq_admin'

export type PaymentStatus     = 'pending' | 'paid' | 'failed' | 'refunded'
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled'

// ── Profiles ──────────────────────────────────────────────────────────────────
export interface UserProfile {
  id:         string
  email:      string
  full_name:  string | null
  phone:      string | null
  avatar_url: string | null
  role:       UserRole
  created_at: string
  updated_at: string
}

// ── Registrations ─────────────────────────────────────────────────────────────
export interface Registration {
  id:             string
  user_id:        string
  category:       Category
  discipline:     DisciplineSlug | null   // relay only
  story:          string | null
  bib_number:     string | null
  payment_status: PaymentStatus
  payment_ref:    string | null
  status:         RegistrationStatus
  created_at:     string
}

// ── Config shapes ─────────────────────────────────────────────────────────────
export interface CategoryConfig {
  slug:      Category
  name:      string
  tagline:   string
  price:     number               // TSh
  distances: {
    swim?: string
    bike?: string
    run?:  string
  }
}

export interface DisciplineConfig {
  slug:        DisciplineSlug
  name:        string
  hex:         string             // exact hex — for inline styles only
  distances:   { sprint: string; olympic: string }
  description: string
}

// ── Context ───────────────────────────────────────────────────────────────────
export interface UserContextValue {
  user:    User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
}

// ── Registration flow state ───────────────────────────────────────────────────
export interface FlowState {
  fullName:   string
  email:      string
  phone:      string
  password:   string
  category:   Category | null
  discipline: DisciplineSlug | null
  story:      string
}

// ── API ───────────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data:  T | null
  error: string | null
}

export interface PaymentInitResponse {
  paymentUrl:    string
  transactionId: string
}

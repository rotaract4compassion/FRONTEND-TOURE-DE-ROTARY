// ─────────────────────────────────────────────────────────────────────────────
// Tour de Dar — Fundraising Supabase helpers (browser client only)
// ─────────────────────────────────────────────────────────────────────────────
import { supabase as sb } from './client'
import { slugify }        from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Campaign {
  id:                   string
  participant_id:       string
  slug:                 string
  goal:                 number
  created_at:           string
  participant_name:     string
  participant_bib:      string | null
  participant_story:    string | null
  participant_category: string | null
  total_raised:         number
  supporter_count:      number
}

export interface Donation {
  id:             string
  campaign_id:    string
  donor_name:     string
  amount:         number
  message:        string | null
  payment_status: string
  created_at:     string
}

// ── Internal ──────────────────────────────────────────────────────────────────

function makeSlug(fullName: string, uid: string): string {
  return `${slugify(fullName)}-${uid.slice(0, 6)}`
}

// ── ensureMyFundraising ───────────────────────────────────────────────────────

export async function ensureMyFundraising(
  userId:   string,
  fullName: string,
): Promise<{ slug: string | null; error: Error | null }> {
  const { data: existing } = await sb
    .from('fundraising_campaigns')
    .select('slug')
    .eq('participant_id', userId)
    .single()

  if (existing?.slug) return { slug: existing.slug, error: null }

  const slug = makeSlug(fullName, userId)
  const { error } = await sb
    .from('fundraising_campaigns')
    .insert({ participant_id: userId, slug, goal: 200_000 })

  return { slug: error ? null : slug, error: error as Error | null }
}

// ── getMyFundraising ──────────────────────────────────────────────────────────

export async function getMyFundraising(userId: string): Promise<{
  campaign:  Campaign | null
  donations: Donation[]
  error:     Error | null
}> {
  const { data: c, error: cErr } = await sb
    .from('fundraising_campaigns')
    .select('id, participant_id, slug, goal, created_at')
    .eq('participant_id', userId)
    .single()

  if (cErr || !c) return { campaign: null, donations: [], error: null }

  const [{ data: reg }, { data: prof }, { data: donRaw }] = await Promise.all([
    sb.from('registrations').select('bib_number, story, category').eq('user_id', userId).single(),
    sb.from('profiles').select('full_name').eq('id', userId).single(),
    sb.from('donations')
      .select('id, campaign_id, donor_name, amount, message, payment_status, created_at')
      .eq('campaign_id', c.id)
      .order('created_at', { ascending: false }),
  ])

  const donations    = (donRaw ?? []) as Donation[]
  const paid         = donations.filter(d => d.payment_status === 'paid')
  const total_raised = paid.reduce((s, d) => s + d.amount, 0)

  return {
    campaign: {
      id:                   c.id,
      participant_id:       c.participant_id,
      slug:                 c.slug,
      goal:                 c.goal,
      created_at:           c.created_at,
      participant_name:     (prof as any)?.full_name  ?? 'Athlete',
      participant_bib:      (reg  as any)?.bib_number ?? null,
      participant_story:    (reg  as any)?.story       ?? null,
      participant_category: (reg  as any)?.category    ?? null,
      total_raised,
      supporter_count: paid.length,
    },
    donations,
    error: null,
  }
}

// ── insertDonation ────────────────────────────────────────────────────────────

export async function insertDonation(
  campaignId: string,
  donorName:  string,
  donorEmail: string,
  amount:     number,
  message:    string,
): Promise<{ donationId: string | null; error: Error | null }> {
  const { data, error } = await sb
    .from('donations')
    .insert({
      campaign_id:    campaignId,
      donor_name:     donorName,
      donor_email:    donorEmail,
      amount,
      message:        message.trim() || null,
      payment_status: 'pending',
    })
    .select('id')
    .single()

  return { donationId: data?.id ?? null, error: error as Error | null }
}

// ── markDonationPaid ──────────────────────────────────────────────────────────

export async function markDonationPaid(
  donationId: string,
  paymeRef:   string,
): Promise<void> {
  await sb
    .from('donations')
    .update({
      payment_status:  'paid',
      payme_reference: paymeRef || 'return-url',
    })
    .eq('id', donationId)
    .eq('payment_status', 'pending')
}
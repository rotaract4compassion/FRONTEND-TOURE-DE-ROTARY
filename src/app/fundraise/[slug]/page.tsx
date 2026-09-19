// ─────────────────────────────────────────────────────────────────────────────
// Tour de Dar — Public Fundraise Donor Page (server component)
// Route: /fundraise/[slug]  — no auth required
// ─────────────────────────────────────────────────────────────────────────────
import { notFound }     from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DonorClient      from './DonorClient'
import type { Campaign, Donation } from '@/lib/supabase/fundraising'

interface Props {
  params:       { slug: string }
  searchParams: { donated?: string; donation?: string; ref?: string; payment?: string }
}

export default async function FundraisePage({ params, searchParams }: Props) {
  const sb = createClient()

  const { data: c } = await sb
    .from('fundraising_campaigns')
    .select('id, participant_id, slug, goal, created_at')
    .eq('slug', params.slug)
    .single()

  if (!c) notFound()

  const [{ data: prof }, { data: reg }, { data: donRaw }] = await Promise.all([
    sb.from('profiles')
      .select('full_name')
      .eq('id', c.participant_id)
      .single(),
    sb.from('registrations')
      .select('bib_number, story, category')
      .eq('user_id', c.participant_id)
      .single(),
    sb.from('donations')
      .select('id, campaign_id, donor_name, amount, message, payment_status, created_at')
      .eq('campaign_id', c.id)
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false }),
  ])

  const donations   = (donRaw ?? []) as Donation[]
  const totalRaised = donations.reduce((s, d) => s + d.amount, 0)

  const campaign: Campaign = {
    id:                   c.id,
    participant_id:       c.participant_id,
    slug:                 c.slug,
    goal:                 c.goal,
    created_at:           c.created_at,
    participant_name:     (prof as any)?.full_name  ?? 'Athlete',
    participant_bib:      (reg  as any)?.bib_number ?? null,
    participant_story:    (reg  as any)?.story       ?? null,
    participant_category: (reg  as any)?.category    ?? null,
    total_raised:         totalRaised,
    supporter_count:      donations.length,
  }

  return (
    <DonorClient
      campaign={campaign}
      donations={donations}
      donated={searchParams.donated === 'true'}
      donationId={searchParams.donation}
      paymeRef={searchParams.ref}
      cancelled={searchParams.payment === 'cancelled'}
    />
  )
}

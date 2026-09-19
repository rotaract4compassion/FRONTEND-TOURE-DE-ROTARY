import type { DisciplineSlug } from '@/types'

interface SamplePost {
  id:            string
  initial:       string
  name:          string
  discipline:    DisciplineSlug
  time:          string
  content:       string
  reactions:     number
  reactionEmoji: string
}

// Static placeholders — replaced by Supabase query in Build 4 (Community Feed)
const SAMPLE_POSTS: SamplePost[] = [
  {
    id:            '1',
    initial:       'K',
    name:          'Kelvin D.',
    discipline:    'bike',
    time:          '2h ago',
    content:       'First 40km training ride done. Legs are not happy but the route is beautiful.',
    reactions:     18,
    reactionEmoji: '🔥',
  },
  {
    id:            '2',
    initial:       'J',
    name:          'Joshua M.',
    discipline:    'swim',
    time:          '5h ago',
    content:       'Open water at Msasani this morning. Visibility is incredible right now.',
    reactions:     31,
    reactionEmoji: '💪',
  },
]

const DISC_BADGE: Record<DisciplineSlug, { bg: string; text: string; label: string }> = {
  swim: { bg: '#4FC3F7', text: '#0D1B3D', label: 'Swim' },
  bike: { bg: '#F59E0B', text: '#0D1B3D', label: 'Bike' },
  run:  { bg: '#E85D3A', text: '#FFFFFF', label: 'Run'  },
}

export default function CommunityPulse() {
  return (
    <section className="bg-sand px-5 pt-11 pb-9">

      {/* Header row */}
      <div className="flex items-end justify-between mb-5">
        <h2 className="font-serif text-section font-bold text-navy leading-[1.18] tracking-tight">
          The community<br />is already moving.
        </h2>
        <span className="font-sans text-[12px] font-semibold text-bronze cursor-pointer whitespace-nowrap ml-3 flex-shrink-0">
          View all
        </span>
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-2.5 mb-4">
        {SAMPLE_POSTS.map(post => {
          const badge = DISC_BADGE[post.discipline]
          return (
            <article key={post.id} className="bg-white rounded-card shadow-card p-4">
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-[12px] font-bold text-bronze">
                    {post.initial}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className="font-sans text-[13px] font-bold text-navy">
                      {post.name}
                    </span>
                    <span
                      className="font-sans text-[10px] font-bold px-1.5 py-0.5 rounded-pill"
                      style={{ background: badge.bg, color: badge.text }}
                    >
                      {badge.label}
                    </span>
                    <span className="font-sans text-[11px] text-ink-subtle ml-auto">
                      {post.time}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="font-sans text-[13px] text-ink-muted leading-[1.5]">
                    {post.content}
                  </p>

                  {/* Reactions — Jakarta Sans for the count */}
                  <div className="flex items-center gap-3.5 mt-2.5">
                    <span className="font-sans text-[12px] text-ink-subtle">
                      {post.reactionEmoji}&nbsp;
                      <span className="font-num font-bold">{post.reactions}</span>
                    </span>
                    <span className="font-sans text-[12px] text-ink-subtle">
                      Reply
                    </span>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* CTA */}
      <button
        type="button"
        className="w-full py-3.5 bg-transparent border border-sand-dark rounded-button
                   font-sans text-body-sm font-semibold text-ink-subtle
                   hover:border-ink-ghost transition-colors duration-200
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2"
      >
        Join the conversation
      </button>

    </section>
  )
}

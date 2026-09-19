import { DISCIPLINES } from '@/config/site'
import type { DisciplineSlug } from '@/types'

const INITIALS: Record<DisciplineSlug, string> = {
  swim: 'S',
  bike: 'B',
  run:  'R',
}

// Run uses white text on coral; swim and bike use navy on their colours
const INITIAL_TEXT: Record<DisciplineSlug, string> = {
  swim: 'text-navy',
  bike: 'text-navy',
  run:  'text-white',
}

const PILL_TEXT: Record<DisciplineSlug, string> = {
  swim: 'text-navy',
  bike: 'text-navy',
  run:  'text-white',
}

export default function DisciplinesSection() {
  return (
    <section className="bg-sand px-5 pt-11 pb-9">

      <h2 className="font-serif text-section font-bold text-navy leading-[1.15] tracking-tight mb-2">
        One race.<br />Three disciplines.
      </h2>
      <p className="font-sans text-body-sm text-ink-subtle leading-relaxed mb-7">
        Sprint or Olympic distance. Solo or relay. One city.
      </p>

      <div className="flex flex-col gap-3">
        {DISCIPLINES.map(d => (
          <div
            key={d.slug}
            className="bg-white shadow-card flex gap-3.5 items-start p-4"
            style={{ borderLeft: `4px solid ${d.colour}`, borderRadius: '0 16px 16px 0' }}
          >
            {/* Discipline initial circle */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: d.colour }}
            >
              <span className={`font-num text-[15px] font-black ${INITIAL_TEXT[d.slug]}`}>
                {INITIALS[d.slug]}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              {/* Name + distance pill */}
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-serif text-[17px] font-bold text-navy leading-none">
                  {d.name}
                </span>
                <span
                  className={`font-sans text-[10px] font-bold px-2 py-0.5 rounded-pill ${PILL_TEXT[d.slug]}`}
                  style={{ background: d.colour }}
                >
                  {d.distances.sprint} · {d.distances.olympic}
                </span>
              </div>
              {/* Description */}
              <p className="font-sans text-[12px] text-ink-muted leading-[1.55]">
                {d.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}

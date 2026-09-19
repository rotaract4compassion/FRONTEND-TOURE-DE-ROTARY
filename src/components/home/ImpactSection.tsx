import { SITE } from '@/config/site'
import { formatTShCompact } from '@/lib/utils'

const STATS = [
  { value: formatTShCompact(18_000_000), label: 'Target' },
  { value: '2,400+',                     label: 'Patients served' },
]

export default function ImpactSection() {
  return (
    <section
      className="relative overflow-hidden px-5 pt-12 pb-12"
      style={{
        backgroundImage: "linear-gradient(rgba(7,22,48,.82), rgba(7,22,48,.9)), url('/assets/landing/pexels-mikhail-nilov-8542538.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
      }}
    >

      {/* Radial bronze glow — top right */}
      <div
        className="absolute -top-12 -right-12 w-44 h-44 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(200,149,60,.10) 0%, transparent 70%)' }}
      />

      {/* Section label */}
      <p className="relative font-sans text-[10px] font-bold text-bronze uppercase tracking-[.07em] mb-4">
        Why it matters
      </p>

      {/* Headline — Playfair italic */}
      <h2 className="relative font-serif text-section font-bold italic text-white leading-[1.2] tracking-tight mb-4">
        Every stroke.<br />Every pedal.<br />Every step. Counts.
      </h2>

      {/* Body — Montserrat */}
      <p className="relative font-sans text-body-sm text-white/50 leading-[1.65] mb-7">
        All proceeds go to {SITE.beneficiary.name} — the only public cancer hospital
        in Tanzania. Your entry funds treatment for patients who cannot afford it.
      </p>

      {/* Stats — Jakarta Sans */}
      <div className="relative flex gap-2.5 mb-7">
        {STATS.map(s => (
          <div
            key={s.label}
            className="flex-1 bg-white/5 border border-bronze/15 rounded-card px-2.5 py-4 text-center"
          >
            <div className="font-num text-[22px] font-black text-bronze leading-none tracking-tight mb-1">
              {s.value}
            </div>
            <div className="font-sans text-[9px] font-bold text-white/30 uppercase tracking-[.08em]">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        className="relative w-full py-4 bg-coral text-white rounded-button
                   font-sans text-body-sm font-bold
                   hover:bg-coral-dark active:scale-[.98] transition-all duration-200
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
      >
        Register & change lives
      </button>

    </section>
  )
}

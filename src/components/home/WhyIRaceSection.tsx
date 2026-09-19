// Placeholder quote — replaced by live Supabase data in Build 3 (Participant Profile)
const FEATURED = {
  text:          "I race for my mother. She was treated at Ocean Road. She's still here. So am I.",
  author:        'Amina Rashid',
  initial:       'A',
  category:      'Sprint',
  location:      'Dar es Salaam',
  disciplineColor:     '#4FC3F7',
  disciplineTextColor: '#0D1B3D',
}

// SVG noise data URI for archival grain — opacity controlled inline
const GRAIN_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export default function WhyIRaceSection() {
  const q = FEATURED
  return (
    <section className="bg-parchment relative overflow-hidden px-5 py-11">

      {/* Archival grain overlay — 0.07 opacity per spec */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: GRAIN_URL, opacity: 0.07 }}
      />

      {/* Section label — Montserrat */}
      <p className="relative font-sans text-[10px] font-bold text-bronze-700 uppercase tracking-[.07em] mb-5">
        Why I race
      </p>

      {/* Pull quote — Playfair italic */}
      <blockquote className="relative font-serif text-section font-bold italic text-navy leading-[1.42] tracking-tight mb-6">
        &ldquo;{q.text}&rdquo;
      </blockquote>

      {/* Attribution */}
      <div className="relative flex items-center gap-2.5">
        {/* Avatar — navy circle, serif initial in bronze */}
        <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
          <span className="font-serif text-[13px] font-bold text-bronze">{q.initial}</span>
        </div>
        <div>
          <div className="font-sans text-[13px] font-bold text-navy leading-none mb-1">
            {q.author}
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="font-sans text-[10px] font-bold px-1.5 py-0.5 rounded-pill"
              style={{ background: q.disciplineColor, color: q.disciplineTextColor }}
            >
              {q.category}
            </span>
            <span className="font-sans text-[11px] text-ink-subtle">{q.location}</span>
          </div>
        </div>
      </div>

    </section>
  )
}

// Static for now — wired to Supabase in Build 9 (HQ Admin)
const STATS = [
  { value: '247', label: 'Registered' },
  { value: '3',   label: 'Disciplines' },
  { value: '43',  label: 'Teams' },
]

export default function StatsStrip() {
  return (
    <section className="bg-navy-700 px-5 py-5 flex justify-around">
      {STATS.map(({ value, label }) => (
        <div key={label} className="text-center">
          {/* Number — Plus Jakarta Sans */}
          <div className="font-num text-[30px] font-black text-bronze leading-none tracking-tight mb-1">
            {value}
          </div>
          {/* Label — Montserrat */}
          <div className="font-sans text-[10px] font-bold text-white/35 uppercase tracking-[.07em]">
            {label}
          </div>
        </div>
      ))}
    </section>
  )
}

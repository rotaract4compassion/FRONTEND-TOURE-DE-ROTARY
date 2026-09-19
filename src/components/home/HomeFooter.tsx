import { SITE } from '@/config/site'

export default function HomeFooter() {
  return (
    <footer className="bg-navy-900 px-5 py-6 flex items-center justify-between">
      <div>
        <div className="font-serif text-[16px] font-bold text-white mb-1 leading-none">
          {SITE.name}
        </div>
        <div className="font-sans text-[11px] text-white/30 font-medium">
          {SITE.event.location}
        </div>
      </div>
      <div className="font-sans text-[10px] font-bold text-bronze uppercase tracking-[.06em] text-right leading-snug">
        Supporting<br />{SITE.beneficiary.short}
      </div>
    </footer>
  )
}

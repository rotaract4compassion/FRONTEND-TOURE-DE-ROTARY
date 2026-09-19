'use client'

import { cn } from '@/lib/utils'
import { DISCIPLINES } from '@/config/categories'
import type { FlowState, DisciplineSlug } from '@/types'

interface Props {
  data:     FlowState
  onChange: (patch: Partial<FlowState>) => void
  onNext:   () => void
  onBack:   () => void
}

export default function DisciplineStep({ data, onChange, onNext, onBack }: Props) {
  const selected = data.discipline

  return (
    <div className="animate-fade-up">

      <h2 className="font-serif text-[32px] font-bold italic text-white leading-[1.08] tracking-[-0.02em] mb-[6px]">
        Your discipline.
      </h2>
      <p className="font-sans text-[13px] text-white/40 mb-[26px] leading-relaxed">
        Pick your leg of the relay team.
      </p>

      <div className="flex flex-col gap-[10px]">
        {DISCIPLINES.map(disc => {
          const isSel = selected === disc.slug

          return (
            <button
              key={disc.slug}
              type="button"
              onClick={() => onChange({ discipline: disc.slug as DisciplineSlug })}
              aria-pressed={isSel}
              style={isSel ? { borderColor: disc.hex } : {}}
              className={cn(
                'text-left rounded-[16px] border-[2px] p-4 w-full',
                'transition-all duration-[220ms] focus:outline-none active:scale-[.99]',
                isSel
                  ? 'bg-white/[.09]'
                  : 'bg-white/[.04] border-white/10 hover:bg-white/[.06] hover:border-white/20',
              )}
            >
              <div className="flex items-center gap-[14px]">

                {/* Coloured circle */}
                <div
                  className="w-[46px] h-[46px] rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${disc.hex}22` }}
                >
                  <span
                    className="font-serif text-[20px] font-bold italic leading-none"
                    style={{ color: disc.hex }}
                  >
                    {disc.name[0]}
                  </span>
                </div>

                {/* Name + distance + description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-[4px]">
                    <span className="font-serif text-[19px] font-bold italic text-white leading-none">
                      {disc.name}
                    </span>
                    <span
                      className="font-num font-extrabold text-[13px] leading-none"
                      style={{ color: disc.hex }}
                    >
                      {disc.distances.olympic}
                    </span>
                  </div>
                  <p className="font-sans text-[12px] text-white/35 leading-snug">
                    {disc.description}
                  </p>
                </div>

                {/* Check circle */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                             border-[2px] transition-all duration-200"
                  style={
                    isSel
                      ? { background: disc.hex, borderColor: 'transparent' }
                      : { background: 'transparent', borderColor: 'rgba(255,255,255,0.18)' }
                  }
                >
                  {isSel && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                      <path
                        d="M1.5 5L4 7.5L8.5 2.5"
                        stroke="#0D1B3D"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

              </div>
            </button>
          )
        })}
      </div>

      {/* Nav */}
      <div className="flex gap-[10px] mt-[22px]">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-white/[.06] border-[1.5px] border-white/[.12] text-white/45
                     font-sans text-[14px] font-semibold rounded-[12px] py-4
                     hover:border-white/25 hover:text-white/65 transition-all duration-200 focus:outline-none"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!selected}
          className="flex-[2] bg-bronze text-navy font-sans text-[14px] font-extrabold
                     rounded-[12px] py-4 hover:opacity-90 active:scale-[.98]
                     disabled:opacity-30 disabled:cursor-not-allowed
                     transition-all duration-200 focus:outline-none"
        >
          Continue →
        </button>
      </div>

    </div>
  )
}

'use client'

import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/config/categories'
import { formatTSh } from '@/lib/utils'
import type { FlowState, Category } from '@/types'

interface Props {
  data:     FlowState
  onChange: (patch: Partial<FlowState>) => void
  onNext:   () => void
  onBack:   () => void
}

const CAT_HEX: Record<Category, string> = {
  sprint:  '#C8953C',
  olympic: 'rgba(255,255,255,0.75)',
  relay:   '#E85D3A',
}

const CAT_PRICE_COLOR: Record<Category, string> = {
  sprint:  'text-bronze',
  olympic: 'text-white',
  relay:   'text-coral',
}

export default function CategoryStep({ data, onChange, onNext, onBack }: Props) {
  const selected = data.category

  return (
    <div className="animate-fade-up">

      <h2 className="font-serif text-[32px] font-bold italic text-white leading-[1.08] tracking-[-0.02em] mb-[6px]">
        Choose your race.
      </h2>
      <p className="font-sans text-[13px] text-white/40 mb-[26px] leading-relaxed">
        Select the distance that calls to you.
      </p>

      <div className="flex flex-col gap-[10px]">
        {CATEGORIES.map(cat => {
          const isSel = selected === cat.slug
          const hex   = CAT_HEX[cat.slug]

          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onChange({ category: cat.slug, discipline: null })}
              aria-pressed={isSel}
              style={isSel ? { borderColor: hex } : {}}
              className={cn(
                'text-left rounded-[16px] border-[2px] p-[17px] w-full',
                'transition-all duration-[220ms] focus:outline-none active:scale-[.99]',
                isSel
                  ? 'bg-white/[.09]'
                  : 'bg-white/[.04] border-white/10 hover:bg-white/[.06] hover:border-white/20',
              )}
            >
              <div className="flex justify-between gap-[10px]">

                {/* Left */}
                <div className="min-w-0">
                  <div className="flex items-center gap-[10px] mb-[3px]">
                    {/* Dot */}
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 border-[2px] transition-all duration-200"
                      style={
                        isSel
                          ? { background: hex, borderColor: 'transparent' }
                          : { background: 'transparent', borderColor: 'rgba(255,255,255,0.25)' }
                      }
                    />
                    <span className="font-serif text-[22px] font-bold italic text-white leading-none">
                      {cat.name}
                    </span>
                  </div>
                  <p className="font-sans text-[11px] text-white/35 pl-[22px] mb-[10px]">
                    {cat.tagline}
                  </p>
                  {/* Distance pills */}
                  <div className="flex gap-[5px] flex-wrap pl-[22px]">
                    {cat.distances.swim && <Pill color="#4FC3F7" label={`Swim ${cat.distances.swim}`} />}
                    {cat.distances.bike && <Pill color="#F59E0B" label={`Bike ${cat.distances.bike}`} />}
                    {cat.distances.run  && <Pill color="#E85D3A" label={`Run ${cat.distances.run}`}  />}
                  </div>
                </div>

                {/* Right — price */}
                <div className="text-right flex-shrink-0">
                  <span className={cn('font-num font-extrabold text-[21px] leading-none block', CAT_PRICE_COLOR[cat.slug])}>
                    {formatTSh(cat.price, true)}
                  </span>
                  <span className="font-num text-[9px] text-white/25 uppercase tracking-[.06em] mt-[3px] block">
                    per person
                  </span>
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

function Pill({ color, label }: { color: string; label: string }) {
  return (
    <span
      className="font-num font-bold text-[9px] uppercase rounded-pill px-[8px] py-[3px]"
      style={{ background: `${color}20`, color }}
    >
      {label}
    </span>
  )
}

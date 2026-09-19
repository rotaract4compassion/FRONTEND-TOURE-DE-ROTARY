'use client'

import type { FlowState } from '@/types'

interface Props {
  data:     FlowState
  onChange: (patch: Partial<FlowState>) => void
  onNext:   () => void
  onBack:   () => void
}

const MAX = 200

export default function StoryStep({ data, onChange, onNext, onBack }: Props) {
  const remaining = MAX - data.story.length
  const overLimit = remaining < 0

  return (
    <div className="animate-fade-up">

      <h2 className="font-serif text-[32px] font-bold italic text-white leading-[1.08] tracking-[-0.02em] mb-[6px]">
        Why do you race?
      </h2>
      <p className="font-sans text-[13px] text-white/40 mb-[26px] leading-relaxed">
        Share your reason. It becomes part of the race&apos;s memory.
      </p>

      {/* Parchment card */}
      <div
        className="rounded-[18px] p-5 pb-[14px] mb-5"
        style={{
          background: '#F5EDD6',
          border:     '1.5px solid #D4C9A8',
        }}
      >
        {/* Opening quote */}
        <p
          className="font-serif text-[56px] font-bold italic leading-[0.9]
                     select-none mb-[6px] -mt-1 -ml-0.5"
          style={{ color: 'rgba(200,149,60,0.20)' }}
          aria-hidden
        >
          &ldquo;
        </p>

        {/* Textarea */}
        <textarea
          rows={5}
          value={data.story}
          onChange={e => onChange({ story: e.target.value })}
          placeholder="I race for my mother. She was treated at Ocean Road. She's still here. So am I."
          className="w-full bg-transparent resize-none
                     font-serif text-[17px] font-bold italic leading-[1.55]
                     placeholder:opacity-25 focus:outline-none"
          style={{ color: '#1a1208' }}
          aria-label="Why I race"
        />

        {/* Char counter */}
        <div className="flex justify-end mt-1">
          <span
            className="font-num font-extrabold text-[12px] transition-colors duration-200"
            style={{
              color: overLimit
                ? '#E85D3A'
                : remaining < 30
                ? '#a07828'
                : 'rgba(26,18,8,0.28)',
            }}
          >
            {overLimit ? `${Math.abs(remaining)} over` : `${remaining} left`}
          </span>
        </div>
      </div>

      {/* Nav — Back · Skip · Save */}
      <div className="flex gap-[10px]">
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
          onClick={() => { onChange({ story: '' }); onNext() }}
          className="flex-1 bg-white/[.06] border-[1.5px] border-white/[.12] text-white/40
                     font-sans text-[14px] font-semibold rounded-[12px] py-4
                     hover:border-white/25 hover:text-white/60 transition-all duration-200 focus:outline-none"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={overLimit}
          className="flex-[2] bg-bronze text-navy font-sans text-[14px] font-extrabold
                     rounded-[12px] py-4 hover:opacity-90 active:scale-[.98]
                     disabled:opacity-30 disabled:cursor-not-allowed
                     transition-all duration-200 focus:outline-none"
        >
          Save →
        </button>
      </div>

    </div>
  )
}

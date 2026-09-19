interface Props {
  total:   number
  current: number
  labels:  string[]
}

export default function ProgressDots({ total, current, labels }: Props) {
  return (
    <div className="flex flex-col items-center gap-[8px] pb-[18px]">

      {/* Dots + connectors */}
      <div className="flex items-center gap-[5px]">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex items-center gap-[5px]">
            {i > 0 && (
              <div
                className={[
                  'h-px w-[12px] transition-colors duration-300',
                  i <= current ? 'bg-bronze/40' : 'bg-white/[.1]',
                ].join(' ')}
              />
            )}
            <div
              className={[
                'rounded-pill transition-all duration-300',
                i === current
                  ? 'w-[20px] h-[8px] bg-bronze'
                  : i < current
                  ? 'w-[8px] h-[8px] bg-bronze/45'
                  : 'w-[8px] h-[8px] bg-white/[.14]',
              ].join(' ')}
              aria-current={i === current ? 'step' : undefined}
            />
          </div>
        ))}
      </div>

      {/* Step label */}
      <p className="font-sans text-[11px] text-white/35">
        Step{' '}
        <span className="font-num font-extrabold text-bronze">{current + 1}</span>
        {' '}of{' '}
        <span className="font-num font-extrabold text-white/50">{total}</span>
        {' '}·{' '}
        <span className="text-white/45">{labels[current]}</span>
      </p>

    </div>
  )
}

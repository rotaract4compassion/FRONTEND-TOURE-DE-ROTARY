'use client'

import { useState, useEffect } from 'react'
import { SITE } from '@/config/site'

interface Unit {
  value: number
  label: string
}

const ZERO_UNITS: Unit[] = [
  { value: 0, label: 'days' },
  { value: 0, label: 'hours' },
  { value: 0, label: 'mins' },
]

function computeUnits(eventDate: Date): Unit[] {
  const diff = eventDate.getTime() - Date.now()
  if (diff <= 0) return ZERO_UNITS
  return [
    { value: Math.floor(diff / 86_400_000),                            label: 'days'  },
    { value: Math.floor((diff % 86_400_000) / 3_600_000),              label: 'hours' },
    { value: Math.floor((diff % 3_600_000)  / 60_000),                 label: 'mins'  },
  ]
}

export default function CountdownTimer() {
  // Initialise with zeros — avoids hydration mismatch
  const [units, setUnits] = useState<Unit[]>(ZERO_UNITS)

  useEffect(() => {
    const eventDate = new Date(`${SITE.event.date}T07:00:00`)
    setUnits(computeUnits(eventDate))
    const id = setInterval(() => setUnits(computeUnits(eventDate)), 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex gap-2.5">
      {units.map(({ value, label }) => (
        <div
          key={label}
          className="flex-1 bg-white/5 border border-bronze/20 rounded-card px-2 pt-3.5 pb-2.5 text-center"
        >
          {/* Number — Plus Jakarta Sans */}
          <div className="font-num text-[36px] font-black text-bronze leading-none tracking-tight mb-1.5">
            {String(value).padStart(2, '0')}
          </div>
          {/* Label — Montserrat */}
          <div className="font-sans text-[9px] font-bold text-white/30 uppercase tracking-[.09em]">
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}

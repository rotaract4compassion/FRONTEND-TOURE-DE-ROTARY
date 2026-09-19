'use client'

import { useEffect, useState } from 'react'
import { SITE } from '@/config/site'
import { formatEventDate } from '@/lib/utils'
import CountdownTimer from './CountdownTimer'

const HERO_IMAGES = [
  '/assets/landing/pexels-jim-de-ramos-395808-1263349.jpg',
  '/assets/landing/pexels-daejeung-14226402.jpg',
  '/assets/landing/pexels-olly-3760259.jpg',
  '/assets/landing/pexels-boom-12659357.jpg',
]

export default function HeroSection() {
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveImage(current => (current + 1) % HERO_IMAGES.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="bg-navy relative min-h-[620px] overflow-hidden px-5 pt-11 pb-0 lg:min-h-[720px] lg:px-12 xl:px-16">

      {/* Rotating photography — deliberately fades into the navy rather than
          meeting the content with a hard edge. */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {HERO_IMAGES.map((src, index) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out"
            style={{ opacity: activeImage === index ? 1 : 0 }}
          >
            <div
              className="absolute right-[-12%] top-0 h-[78%] w-[112%] lg:right-[-5%] lg:h-[92%] lg:w-[82%]"
              style={{
                backgroundImage: `url("${src}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                WebkitMaskImage: 'linear-gradient(145deg, transparent 22%, rgba(0,0,0,.18) 39%, #000 63%, #000 100%)',
                maskImage: 'linear-gradient(145deg, transparent 22%, rgba(0,0,0,.18) 39%, #000 63%, #000 100%)',
              }}
            />

            {/* Soft colour/legibility veil. It keeps the left side dark while
                allowing headlines and buttons to sit naturally over the photo. */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, rgba(7,22,48,1) 0%, rgba(7,22,48,.88) 22%, rgba(7,22,48,.38) 48%, rgba(7,22,48,.08) 78%, rgba(7,22,48,.18) 100%)',
              }}
            />
          </div>
        ))}
      </div>

      {/* Subtle diagonal course-map lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -52deg,
            transparent 0, transparent 36px,
            rgba(200,149,60,.04) 36px, rgba(200,149,60,.04) 37px
          )`,
        }}
      />

      {/* Radial bronze glow — top right */}
      <div
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(200,149,60,.10) 0%, transparent 70%)' }}
      />

      {/* Hero content intentionally remains above the photography so it can
          cross the soft image transition. */}
      <div className="relative z-10 max-w-3xl lg:max-w-[760px]">
        {/* Live indicator */}
        <div className="relative flex items-center gap-2 mb-8">
          <span className="live-dot" />
          <span className="font-sans text-[11px] font-bold text-coral uppercase tracking-[.06em]">
            Registration Open
          </span>
        </div>

        {/* Hero headline — Playfair, italic, full weight */}
        <h1 className="relative font-serif text-hero font-black italic text-white leading-[1.02] tracking-tight mb-1.5">
          The city<br />moves.
        </h1>

        {/* Tagline second line — Playfair, bronze */}
        <p className="relative font-serif text-headline font-bold italic text-bronze leading-[1.08] tracking-tight mb-7">
          The memory<br />remains.
        </p>

        {/* Event meta — Montserrat */}
        <p className="relative font-sans text-caption text-white/65 font-medium mb-8">
          {formatEventDate(SITE.event.date)}&nbsp;·&nbsp;{SITE.event.location}
        </p>

        {/* Countdown — Plus Jakarta Sans numerals via CountdownTimer */}
        <div className="relative mb-6">
          <CountdownTimer />
        </div>

        {/* CTAs */}
        <div className="relative flex flex-col gap-2.5 mb-9 sm:flex-row sm:max-w-[520px]">
          <button
            type="button"
            className="w-full py-4 bg-coral text-white rounded-button
                       font-sans text-body-sm font-bold
                       hover:bg-coral-dark active:scale-[.98] transition-all duration-200
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            Register for TdDar 2026
          </button>
          <button
            type="button"
            className="w-full py-3.5 bg-transparent text-white/75 rounded-button
                       font-sans text-body-sm font-semibold
                       border border-white/25 backdrop-blur-[2px]
                       hover:border-white/50 hover:text-white
                       transition-all duration-200
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-1 focus-visible:ring-offset-navy"
          >
            Learn about the race
          </button>
        </div>
      </div>

      {/* Discipline stripe — bleeds full width, closing the hero */}
      <div className="relative z-10 flex h-1 -mx-5 lg:-mx-12 xl:-mx-16">
        <div className="flex-1 bg-discipline-swim" />
        <div className="flex-1 bg-discipline-bike" />
        <div className="flex-1 bg-discipline-run" />
      </div>

    </section>
  )
}

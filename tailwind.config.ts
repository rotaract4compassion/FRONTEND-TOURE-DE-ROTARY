import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', md: '1.5rem', lg: '2rem' },
      screens: { sm: '420px', md: '768px', lg: '1024px', xl: '1280px' },
    },
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1B3D',
          50:  '#E8EAEF',
          100: '#C6CBDA',
          200: '#9FA8C1',
          300: '#7886A9',
          400: '#5A6B96',
          500: '#3D5183',
          600: '#2E3E6F',
          700: '#1E2D59',
          800: '#0D1B3D',
          900: '#070E22',
        },
        bronze: {
          DEFAULT: '#C8953C',
          50:  '#FAF3E7',
          100: '#F3E2C4',
          200: '#E9CB96',
          300: '#DEB468',
          400: '#D4A24B',
          500: '#C8953C',
          600: '#A87A2E',
          700: '#866020',
          800: '#644714',
          900: '#422E08',
        },
        parchment: {
          DEFAULT: '#F5EDD6',
          light:   '#FAF6EE',
          dark:    '#EAD9B3',
        },
        coral: {
          DEFAULT: '#E85D3A',
          light:   '#F28060',
          dark:    '#C44420',
        },
        ocean: {
          DEFAULT: '#1A3A2E',
          light:   '#2D5E48',
          dark:    '#0F2218',
        },
        sand: {
          DEFAULT: '#F7F3EB',
          light:   '#FDFAF5',
          dark:    '#EDE5D0',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          muted:   '#4A4A4A',
          subtle:  '#7A7A7A',
          ghost:   '#ABABAB',
        },
        discipline: {
          swim: '#4FC3F7',
          bike: '#F59E0B',
          run:  '#E85D3A',
        },
      },

      fontFamily: {
        // Playfair Display — editorial moments only
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        // Montserrat — all UI
        sans:  ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        // Plus Jakarta Sans — numbers and numeric displays only
        num:   ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        // Editorial — Playfair Display
        'hero':     ['clamp(3rem,10vw,4rem)',     { lineHeight: '1',    fontWeight: '900' }],
        'headline': ['clamp(2rem,6vw,2.5rem)',    { lineHeight: '1.1',  fontWeight: '700' }],
        'section':  ['clamp(1.5rem,4vw,1.75rem)', { lineHeight: '1.2',  fontWeight: '700' }],
        'bib':      ['clamp(2.25rem,8vw,3rem)',   { lineHeight: '1',    fontWeight: '900' }],
        // UI — Montserrat
        'label':    ['0.6875rem', { lineHeight: '1',    fontWeight: '700', letterSpacing: '0.08em' }],
        'body-lg':  ['1rem',      { lineHeight: '1.65', fontWeight: '400' }],
        'body':     ['0.9375rem', { lineHeight: '1.6',  fontWeight: '400' }],
        'body-sm':  ['0.875rem',  { lineHeight: '1.55', fontWeight: '400' }],
        'caption':  ['0.75rem',   { lineHeight: '1.4',  fontWeight: '500' }],
      },

      spacing: {
        'section':    '5rem',
        'section-sm': '3rem',
        'page':       '1.25rem',
      },

      maxWidth: {
        'canvas':  '420px',
        'content': '680px',
        'wide':    '1080px',
      },

      borderRadius: {
        'card':   '16px',
        'pill':   '9999px',
        'button': '10px',
      },

      boxShadow: {
        'card':    '0 2px 20px rgba(13,27,61,0.07)',
        'card-md': '0 4px 32px rgba(13,27,61,0.11)',
        'card-lg': '0 8px 48px rgba(13,27,61,0.16)',
        'bronze':  '0 4px 24px rgba(200,149,60,0.28)',
        'coral':   '0 4px 24px rgba(232,93,58,0.28)',
        'navy':    '0 4px 24px rgba(13,27,61,0.40)',
        'inset':   'inset 0 1px 3px rgba(13,27,61,0.08)',
      },

      backgroundImage: {
        'hero-overlay':      'linear-gradient(180deg,rgba(13,27,61,.72) 0%,rgba(13,27,61,.38) 55%,rgba(13,27,61,.88) 100%)',
        'bronze-shimmer':    'linear-gradient(90deg,#C8953C 0%,#D4A24B 50%,#C8953C 100%)',
        'parchment-surface': 'linear-gradient(135deg,#F5EDD6 0%,#FAF6EE 60%,#EAD9B3 100%)',
        'navy-depth':        'linear-gradient(160deg,#070E22 0%,#0D1B3D 55%,#1E2D59 100%)',
        'ocean-depth':       'linear-gradient(160deg,#0F2218 0%,#1A3A2E 100%)',
      },

      keyframes: {
        'fade-up':   { from: { opacity:'0', transform:'translateY(20px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        'fade-in':   { from: { opacity:'0' }, to: { opacity:'1' } },
        'slide-up':  { from: { opacity:'0', transform:'translateY(40px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        'scale-in':  { from: { opacity:'0', transform:'scale(0.94)' }, to: { opacity:'1', transform:'scale(1)' } },
        'bib-stamp': { '0%': { opacity:'0', transform:'scale(1.12) rotate(-3deg)' }, '100%': { opacity:'1', transform:'scale(1) rotate(0deg)' } },
        shimmer:     { '0%': { backgroundPosition:'-200% center' }, '100%': { backgroundPosition:'200% center' } },
        'pulse-soft':{ '0%,100%': { opacity:'1' }, '50%': { opacity:'.45' } },
        'live-dot':  { '0%,100%': { transform:'scale(1)', opacity:'1' }, '50%': { transform:'scale(1.35)', opacity:'.7' } },
      },

      animation: {
        'fade-up':    'fade-up 0.55s ease-out both',
        'fade-in':    'fade-in 0.4s ease-out both',
        'slide-up':   'slide-up 0.75s ease-out both',
        'scale-in':   'scale-in 0.45s ease-out both',
        'bib-stamp':  'bib-stamp 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        'shimmer':    'shimmer 2.2s linear infinite',
        'pulse-slow': 'pulse-soft 3s ease-in-out infinite',
        'live-dot':   'live-dot 1.8s ease-in-out infinite',
      },

      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34,1.56,0.64,1)',
        'smooth': 'cubic-bezier(0.4,0,0.2,1)',
      },
    },
  },
  plugins: [],
}

export default config

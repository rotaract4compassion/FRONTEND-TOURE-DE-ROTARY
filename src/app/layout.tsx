import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Montserrat, Plus_Jakarta_Sans } from 'next/font/google'
import { UserProvider } from '@/context/UserContext'
import { SITE } from '@/config/site'
import './globals.css'

// ── Playfair Display — editorial moments only ─────────────────────────────
const playfair = Playfair_Display({
  subsets:  ['latin'],
  variable: '--font-playfair',
  display:  'swap',
  weight:   ['700', '900'],
})

// ── Montserrat — all UI ───────────────────────────────────────────────────
const montserrat = Montserrat({
  subsets:  ['latin'],
  variable: '--font-montserrat',
  display:  'swap',
  weight:   ['400', '500', '600', '700'],
})

// ── Plus Jakarta Sans — numbers only (max weight 800) ────────────────────
const jakarta = Plus_Jakarta_Sans({
  subsets:  ['latin'],
  variable: '--font-jakarta',
  display:  'swap',
  weight:   ['700', '800'],           // 800 = extrabold — font has no 900
})

export const metadata: Metadata = {
  title: {
    default:  SITE.name,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.tagline,
  keywords: [
    'triathlon', 'Dar es Salaam', 'Tanzania',
    'charity race', 'swimming', 'cycling', 'running',
    'Tour de Dar', 'Ocean Road Cancer Institute',
  ],
  openGraph: {
    title:       SITE.name,
    description: SITE.tagline,
    url:         SITE.url,
    siteName:    SITE.name,
    locale:      'en_TZ',
    type:        'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       SITE.name,
    description: SITE.tagline,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor:   '#0D1B3D',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} ${jakarta.variable}`}
    >
      <body className="antialiased">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}

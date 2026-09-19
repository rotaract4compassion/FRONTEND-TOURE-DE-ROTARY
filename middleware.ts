import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PREFIXES    = ['/', '/about', '/activities', '/contact', '/merch']
const AUTH_PREFIXES      = ['/login', '/register', '/reset-password']
const PROTECTED_PREFIXES = [
  '/dashboard', '/ticket', '/training', '/fundraise', '/profile',
  '/results', '/community', '/team',
  '/admin',   // role check is enforced in app/admin/layout.tsx
]

// Public fundraise donor pages: /fundraise/{slug}
// These are NOT the participant /fundraise tab — donors need no auth.
const PUBLIC_FUNDRAISE = /^\/fundraise\/[^/]+\/?$/

function matchesAny(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(p =>
    p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(p + '/'),
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll:  ()             => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  const { data: { session } } = await supabase.auth.getSession()
  const isLoggedIn = !!session

  // Public donor pages bypass auth entirely
  if (PUBLIC_FUNDRAISE.test(pathname))          return response

  if (matchesAny(pathname, PUBLIC_PREFIXES))    return response
  if (matchesAny(pathname, AUTH_PREFIXES)) {
    if (isLoggedIn) return NextResponse.redirect(new URL('/dashboard', request.url))
    return response
  }
  if (matchesAny(pathname, PROTECTED_PREFIXES)) {
    if (!isLoggedIn) {
      const url = new URL('/login', request.url)
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
    return response
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|otf|eot)).*)',
  ],
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

function StandardAuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isRegister = pathname.startsWith('/register')
  const isReset = pathname.startsWith('/reset-password')

  return (
    <div className="min-h-dvh overflow-hidden bg-white">
      <div className="min-h-dvh grid lg:grid-cols-[40%_60%] relative">
        <section className="relative min-h-[300px] lg:min-h-dvh overflow-hidden bg-[#3F78B5]">
          <Image src="/assets/auth/dar-city-bridge.jpg" alt="Dar es Salaam waterfront and bridge" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#3F78B5]/55 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#173E69]/75 via-[#3F78B5]/20 to-[#3F78B5]/20" />
        </section>
        <section className="relative min-h-[calc(100dvh-300px)] lg:min-h-dvh bg-white overflow-visible">
          <div className="absolute right-0 top-0 flex gap-2 opacity-90">
            <span className="h-36 w-4 rotate-[24deg] bg-[#9F2B68]" />
            <span className="h-28 w-3 rotate-[24deg] bg-[#FFC62E]" />
            <span className="h-44 w-4 rotate-[24deg] bg-[#3F78B5]" />
          </div>
          <div className="absolute bottom-0 right-0 flex gap-2 opacity-90">
            <span className="h-40 w-4 rotate-[24deg] bg-[#3F78B5]" />
            <span className="h-32 w-5 rotate-[24deg] bg-[#9F2B68]" />
            <span className="h-24 w-4 rotate-[24deg] bg-[#FFC62E]" />
          </div>
          <main className="relative z-20 flex min-h-[calc(100dvh-300px)] lg:min-h-dvh items-center justify-center px-5 py-8 lg:px-0 lg:py-10">
            <div className="w-full max-w-[470px] lg:-ml-[33%]">
              <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_22px_70px_rgba(13,27,61,.18)] ring-1 ring-[#0D1B3D]/[.08]">
                <div className="flex h-[7px] w-full">
                  <span className="flex-[4] bg-[#3F78B5]" />
                  <span className="flex-[3] bg-[#9F2B68]" />
                  <span className="flex-[2] bg-[#FFC62E]" />
                </div>
                <div className="px-7 pb-8 pt-7 sm:px-9 sm:pb-9 sm:pt-8">
                  {!isReset && (
                    <div className="mb-7 flex items-center rounded-full bg-[#3F78B5]/[.07] p-1">
                      <Link href="/login" className={`flex-1 rounded-full py-2.5 text-center font-sans text-[12px] font-extrabold transition-all ${!isRegister ? 'bg-[#3F78B5] text-white shadow-sm' : 'text-[#3F78B5]/60 hover:text-[#3F78B5]'}`}>Sign in</Link>
                      <Link href="/register" className={`flex-1 rounded-full py-2.5 text-center font-sans text-[12px] font-extrabold transition-all ${isRegister ? 'bg-[#9F2B68] text-white shadow-sm' : 'text-[#9F2B68]/65 hover:text-[#9F2B68]'}`}>Register</Link>
                    </div>
                  )}
                  {children}
                </div>
              </div>
            </div>
          </main>
        </section>
      </div>
    </div>
  )
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Sign in, register and reset-password all render through the same
  // StandardAuthLayout shell. Only the form in `children` changes between
  // them — page chrome, split panel, stripes and tab bar stay identical.
  return <StandardAuthLayout>{children}</StandardAuthLayout>
}
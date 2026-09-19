import { redirect }           from 'next/navigation'
import { getSupabaseServer }  from '@/lib/supabase/server'
import { AdminNav }           from '@/components/admin/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServer()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login?next=/admin/overview')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', session.user.id)
    .single()

  if ((profile as { role?: string } | null)?.role !== 'hq_admin') redirect('/dashboard')

  const initials = (profile?.full_name ?? 'HQ')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="h-dvh bg-navy flex flex-col overflow-hidden">
      {/* Texture */}
      <div className="fixed inset-0 pointer-events-none z-0"
           style={{ backgroundImage: 'repeating-linear-gradient(-52deg,transparent 0,transparent 40px,rgba(200,149,60,.03) 40px,rgba(200,149,60,.03) 41px)' }}
           aria-hidden />

      {/* Admin header */}
      <header className="relative z-10 px-[22px] py-[10px] flex items-center justify-between border-b border-white/[.06]">
        <div>
          <div className="font-sans text-[11px] font-bold text-bronze/70 uppercase tracking-[.08em] mb-[1px]">
            Tour de Dar
          </div>
          <div className="font-serif text-[17px] italic font-bold text-white leading-none">
            HQ Admin
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-bronze/[.15] border-[1.5px] border-bronze/35
                        flex items-center justify-center font-serif text-[13px] italic font-bold text-bronze select-none">
          {initials}
        </div>
      </header>

      {/* Scrollable content */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="w-full max-w-canvas mx-auto">
          {children}
        </div>
      </main>

      <AdminNav />
    </div>
  )
}
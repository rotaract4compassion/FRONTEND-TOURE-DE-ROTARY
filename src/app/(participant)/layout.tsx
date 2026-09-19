import { DesktopNav } from '@/components/participant/DesktopNav'
import { BottomNav } from '@/components/participant/BottomNav'
import { ParticipantThemeProvider } from '@/context/ParticipantThemeContext'

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ParticipantThemeProvider>
      <div className="participant-shell min-h-dvh overflow-hidden bg-sand text-navy transition-colors duration-200">
        <DesktopNav />

        <main className="relative min-h-dvh overflow-x-hidden overflow-y-auto pb-[82px] pt-[60px] lg:h-dvh lg:pb-0 lg:pl-[228px] lg:pt-[72px]">
          <div className="mx-auto w-full max-w-[1480px] pb-6 lg:pb-10">
            {children}
          </div>
        </main>

        <BottomNav />
      </div>
    </ParticipantThemeProvider>
  )
}

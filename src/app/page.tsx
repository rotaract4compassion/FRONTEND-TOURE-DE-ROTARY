import HomeNav           from '@/components/home/HomeNav'
import HeroSection       from '@/components/home/HeroSection'
import StatsStrip        from '@/components/home/StatsStrip'
import DisciplinesSection from '@/components/home/DisciplinesSection'
import WhyIRaceSection   from '@/components/home/WhyIRaceSection'
import CommunityPulse    from '@/components/home/CommunityPulse'
import ImpactSection     from '@/components/home/ImpactSection'
import HomeFooter        from '@/components/home/HomeFooter'

export default function HomePage() {
  return (
    <main>
      <HomeNav />
      <HeroSection />
      <StatsStrip />
      <DisciplinesSection />
      <WhyIRaceSection />
      <CommunityPulse />
      <ImpactSection />
      <HomeFooter />
    </main>
  )
}

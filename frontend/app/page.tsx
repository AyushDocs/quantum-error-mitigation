import HeroSection from '@/components/HeroSection'
import OverviewSection from '@/components/OverviewSection'
import CircuitVisualizer from '@/components/CircuitVisualizer'
import ZNEChart from '@/components/ZNEChart'
import MeasurementMitigation from '@/components/MeasurementMitigation'
import ComparisonChart from '@/components/ComparisonChart'
import AdvancedTechniques from '@/components/AdvancedTechniques'
import MethodologyAccordion from '@/components/MethodologyAccordion'
import FooterSection from '@/components/FooterSection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <OverviewSection />
      <CircuitVisualizer />
      <ZNEChart />
      <MeasurementMitigation />
      <ComparisonChart />
      <AdvancedTechniques />
      <MethodologyAccordion />
      <FooterSection />
    </main>
  )
}

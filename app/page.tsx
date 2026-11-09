import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import WhyAvyanco from '@/components/sections/why'
import Testimonials from '@/components/sections/Testimonials'
import FAQ from '@/components/sections/FAQ'
import CTA from '@/components/sections/CTA'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <WhyAvyanco />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}

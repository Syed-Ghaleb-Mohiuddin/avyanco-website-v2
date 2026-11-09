'use client'

import { useRef, useState } from 'react'
import CurtainGrid from '@/components/sections/services/CurtainGrid'
import ServiceMonolith from '@/components/sections/services/ServiceMonolith'

// ── Services Section ──────────────────────────────────────────────────────────
//
// ARCHITECTURE:
//  Hero is position:sticky — it stays pinned as the services section rises
//  naturally over it in normal document flow. No GSAP needed for the lift.
//
//  Layer order (bottom → top):
//    Hero                  sticky, z-index:1
//    .services             relative, z-index:2
//      .curtain            glass tracks rise naturally
//      ServiceMonolith     tall container + sticky viewport stacking panels

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeCountry, setActiveCountry] = useState<string>('cayman')

  return (
    <section id="services" className="services" ref={sectionRef}>
      <div className="curtain__scroll-track">

        {/* ── Layers 1 & 2: Glass Tracks & Sticky NavBar ── */}
        <CurtainGrid
          sectionRef={sectionRef}
          onCountryChange={setActiveCountry}
        />

        {/* ── Layer 3: Sovereign Monolith Service Panels ── */}
        {/* Tall-container pattern: the section itself provides scroll distance,
            the inner sticky viewport locks to the screen, panels stack inside. */}
        <ServiceMonolith activeCountryId={activeCountry} />

      </div>
    </section>
  )
}

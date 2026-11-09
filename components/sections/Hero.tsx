'use client'

import React, { useRef, useEffect, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { HERO_TRUST_ELEMENTS, HERO_COUNTRIES, HERO_LABEL_OFFSETS } from '@/lib/constants'
import type { HeroTrustElement, HeroCountryId } from '@/lib/constants'
import MapStage from './hero/MapStage'

// ── Trust sub-components ─────────────────────────────────────

function TrustBadge({ label, sublabel }: { label: string; sublabel: string }) {
  return (
    <div className="trust-badge trust-glass">
      <span className="trust-badge__label">{label}</span>
      <span className="trust-badge__sublabel">{sublabel}</span>
    </div>
  )
}

function TrustPill({ label, sublabel }: { label: string; sublabel: string }) {
  return (
    <div className="trust-pill trust-glass">
      <span className="trust-pill__label">{label}</span>
      <span className="trust-pill__sep">·</span>
      <span className="trust-pill__sublabel">{sublabel}</span>
    </div>
  )
}

function TrustAvatars({ label, sublabel }: { label: string; sublabel: string }) {
  return (
    <div className="trust-avatars trust-glass">
      <div className="trust-avatars__stack">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="trust-avatars__avatar" />
        ))}
      </div>
      <div className="trust-avatars__text">
        <span className="trust-avatars__label">{label}</span>
        <span className="trust-avatars__sublabel">{sublabel}</span>
      </div>
    </div>
  )
}

const trustComponents: Record<
  HeroTrustElement['type'],
  React.FC<{ label: string; sublabel: string }>
> = {
  badge: TrustBadge,
  pill: TrustPill,
  avatars: TrustAvatars,
}

// Float durations per element index — different so they feel independent
const FLOAT_DURATIONS = [2.8, 3.4, 4.1, 3.8]

// ── Hero ─────────────────────────────────────────────────────

export default function Hero() {
  const [countryIndex, setCountryIndex] = useState(0)
  const activeCountry = HERO_COUNTRIES[countryIndex]

  const handleCycleComplete = () => {
    setCountryIndex((prev) => (prev + 1) % HERO_COUNTRIES.length)
  }

  const headlineRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)

  // Phase 7: one ref per trust element
  const trustRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Phase 2: Typography entrance ──────────────────────
      gsap.set([headlineRef.current, descriptionRef.current, ctaRef.current], {
        y: 40,
        opacity: 0,
      })

      gsap.to(headlineRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.2,
      })

      gsap.to(descriptionRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.35,
      })

      gsap.to(ctaRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.5,
      })

      // ── Phase 7: Trust elements entrance ──────────────────
      const els = trustRefs.current.filter(Boolean)

      // Start hidden
      gsap.set(els, { opacity: 0, y: 20 })

      // Staggered fade-up after text completes (text last anim ends ~1.2s)
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 1.2,
        onComplete() {
          // Kick off perpetual float animation per element, each with its own
          // duration so they drift independently (never in sync)
          els.forEach((el, i) => {
            if (!el) return
            const duration = FLOAT_DURATIONS[i] ?? 3.4
            const delay = HERO_TRUST_ELEMENTS[i]?.floatDelay ?? 0
            el.style.animation =
              `trust-float ${duration}s ease-in-out ${delay}s infinite`
          })
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="hero">
      {/* Map stage — Phase 6: cursor parallax + service text */}
      <MapStage
        mapFile={activeCountry.mapFile}
        primaryService={activeCountry.primaryService}
        labelOffset={HERO_LABEL_OFFSETS[activeCountry.id as HeroCountryId]}
        onCycleComplete={handleCycleComplete}
      />

      {/* Trust elements — Phase 7: staggered entrance + perpetual float */}
      {HERO_TRUST_ELEMENTS.map((el, i) => {
        const Component = trustComponents[el.type]
        return (
          <div
            key={el.id}
            ref={(node) => { trustRefs.current[i] = node }}
            className="hero__trust-element"
            style={el.position as React.CSSProperties}
          >
            <Component label={el.label} sublabel={el.sublabel} />
          </div>
        )
      })}

      {/* Typography block — bottom-left */}
      <div className="hero__text">
        <h1 ref={headlineRef} className="hero__headline">
          Where Global<br />Business Begins
        </h1>
        <p ref={descriptionRef} className="hero__description">
          The #1 ranked corporate services firm in the UAE. Company formation,
          compliance, and advisory across global jurisdictions.
        </p>
        <button ref={ctaRef} className="hero__cta" type="button">
          Book a Consultation
        </button>
      </div>
    </section>
  )
}

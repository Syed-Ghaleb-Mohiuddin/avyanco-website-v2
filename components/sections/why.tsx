'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { PROOF_ITEMS, WHY_CAPTION } from '@/lib/constants/why'
import type { ProofItem } from '@/lib/constants/why'
import { ABOUT_DATA, TEAM_DATA } from '@/lib/constants'
import Team, { PEDESTAL_LAYOUT } from '@/components/sections/Team'
import type { TeamHandle } from '@/components/sections/Team'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface MousePos { x: number; y: number }

const SCATTERED = [
  { x: 0, y: 60, rotation: 0, scale: 1.02 },
  { x: -420, y: -120, rotation: -3.2, scale: 0.84 },
  { x: 360, y: -180, rotation: 2.4, scale: 0.9 },
  { x: -320, y: 220, rotation: 1.8, scale: 0.88 },
  { x: 340, y: 190, rotation: -1.6, scale: 0.9 },
  { x: 0, y: 320, rotation: 0.4, scale: 0.84 },
] as const

const COMPOSED = [
  { x: 0, y: -200, rotation: 0, scale: 1 },
  { x: -320, y: 10, rotation: 0, scale: 1 },
  { x: 0, y: 10, rotation: 0, scale: 1 },
  { x: 320, y: 10, rotation: 0, scale: 1 },
  { x: -190, y: 220, rotation: 0, scale: 1 },
  { x: 190, y: 220, rotation: 0, scale: 1 },
] as const

function ProofCard({
  item,
  cardRef,
}: {
  item: ProofItem
  cardRef: (node: HTMLDivElement | null) => void
}) {
  const ariaLabel = item.detail
    ? `${item.value} ${item.label}, ${item.detail}`
    : `${item.value} ${item.label}`

  if (item.variant === 'hero') {
    return (
      <div
        ref={cardRef}
        className="why-proof why-proof--hero"
        role="figure"
        aria-label={ariaLabel}
      >
        <span className="why-proof__hero-stat">{item.value}</span>
        <span className="why-proof__hero-label">{item.label}</span>
      </div>
    )
  }

  if (item.variant === 'mini') {
    return (
      <div
        ref={cardRef}
        className="why-proof why-proof--mini"
        role="figure"
        aria-label={ariaLabel}
      >
        <span className="why-proof__stat">{item.value}</span>
        <span className="why-proof__label">{item.label}</span>
      </div>
    )
  }

  if (item.variant === 'block') {
    return (
      <div
        ref={cardRef}
        className="why-proof why-proof--block"
        role="figure"
        aria-label={ariaLabel}
      >
        <span className="why-proof__stat">{item.value}</span>
        <span className="why-proof__label">{item.label}</span>
      </div>
    )
  }

  if (item.variant === 'wide') {
    return (
      <div
        ref={cardRef}
        className="why-proof why-proof--wide"
        role="figure"
        aria-label={ariaLabel}
      >
        <span className="why-proof__wide-value">{item.value}</span>
        <span className="why-proof__wide-label">{item.label}</span>
      </div>
    )
  }

  return (
    <div
      ref={cardRef}
      className="why-proof why-proof--rating"
      role="figure"
      aria-label={ariaLabel}
    >
      <span className="why-proof__rating-value">{item.value}</span>
      <span className="why-proof__rating-label">{item.label}</span>
      <span className="why-proof__rating-meta">{item.detail}</span>
    </div>
  )
}

export default function WhySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  // Why elements
  const lightRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)
  const proofRefs = useRef<(HTMLDivElement | null)[]>([])

  // About elements
  const hallwayRef = useRef<HTMLDivElement>(null)
  const lineARef = useRef<HTMLSpanElement>(null)
  const lineBRef = useRef<HTMLSpanElement>(null)
  const monolithRef = useRef<HTMLDivElement>(null)
  const wipeRef = useRef<HTMLDivElement>(null)
  const shimmerRef = useRef<HTMLDivElement>(null)

  // Team section — imperative handle exposes all DOM refs
  const teamHandleRef = useRef<TeamHandle>(null)

  // ── mouse effect on monolith ───────────────────────────────
  const mouseRaf = useRef<number | null>(null)
  const mouse = useRef<MousePos>({ x: 0.5, y: 0.5 })

  // Mouse parallax for team shadows
  const shadowMouse = useRef<MousePos>({ x: 0.5, y: 0.5 })
  const shadowRaf = useRef<number | null>(null)

  const onMouseMove = useCallback((e: MouseEvent) => {
    const m = monolithRef.current
    if (!m) return
    const rect = m.getBoundingClientRect()
    mouse.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
    // Also update global shadow mouse
    shadowMouse.current = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    }
  }, [])

  const animateMouse = useCallback(() => {
    const shimmer = shimmerRef.current
    if (!shimmer) return

    const { x, y } = mouse.current
    gsap.set(shimmer, {
      background: `radial-gradient(
        420px circle at ${x * 100}% ${y * 100}%,
        rgba(255,255,255,0.55) 0%,
        rgba(255,255,255,0.08) 45%,
        transparent 70%
      )`,
    })
    mouseRaf.current = requestAnimationFrame(animateMouse)
  }, [])

  const startMouse = useCallback(() => {
    if (mouseRaf.current) return
    mouseRaf.current = requestAnimationFrame(animateMouse)
  }, [animateMouse])

  const stopMouse = useCallback(() => {
    if (mouseRaf.current) cancelAnimationFrame(mouseRaf.current)
    mouseRaf.current = null
    gsap.to(shimmerRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' })
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = proofRefs.current.filter(Boolean) as HTMLDivElement[]
      if (els.length !== PROOF_ITEMS.length) return

      const hallway  = hallwayRef.current!
      const lineA    = lineARef.current!
      const lineB    = lineBRef.current!
      const monolith = monolithRef.current!
      const wipe     = wipeRef.current!
      const sticky   = stickyRef.current!

      // Team DOM refs (guaranteed available — all rendered before effect fires)
      const th = teamHandleRef.current!
      const teamEl      = th.teamEl!
      const spotlightEl = th.spotlightEl!
      const headlineEl  = th.headlineEl!
      const radiantEl   = th.radiantEl!
      const memberEls   = th.memberEls.filter(Boolean) as HTMLDivElement[]
      const pedestalEls = th.pedestalEls.filter(Boolean) as HTMLDivElement[]
      const labelEls    = th.labelEls.filter(Boolean) as HTMLDivElement[]

      // ── Initial State — Why ────────────────────────────────
      els.forEach((el, i) => {
        gsap.set(el, {
          xPercent: -50,
          yPercent: -50,
          x: SCATTERED[i].x,
          y: SCATTERED[i].y,
          rotation: SCATTERED[i].rotation,
          scale: SCATTERED[i].scale,
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
        })
      })
      gsap.set(captionRef.current, { opacity: 0, y: 18 })

      // ── Initial State — About ──────────────────────────────
      gsap.set([lineA, lineB], { opacity: 0, y: 30 })
      gsap.set(monolith, { opacity: 0, y: 100, scale: 0.96 })
      gsap.set(wipe, { scaleX: 0, scaleY: 0, opacity: 0, transformOrigin: 'center center' })
      gsap.set(hallway, { opacity: 0, scaleY: 0.4, transformOrigin: '50% 100%' })
      gsap.set(sticky, { perspective: 1000 })

      // ── Initial State — Team ───────────────────────────────
      gsap.set(teamEl, { autoAlpha: 0 })
      // transformOrigin 'center bottom' → spotlight blooms up from the stage floor
      gsap.set(spotlightEl, { autoAlpha: 0, scale: 0, transformOrigin: 'center bottom' })
      gsap.set(headlineEl, { autoAlpha: 0 })
      gsap.set(radiantEl, { autoAlpha: 0 })

      if (memberEls.length === TEAM_DATA.members.length) {
        memberEls.forEach((m, i) => {
          gsap.set(m, {
            xPercent: -50,
            x: PEDESTAL_LAYOUT[i].x,
            y: '115vh',
            autoAlpha: 0,
            scale: PEDESTAL_LAYOUT[i].scale,
            transformOrigin: 'bottom center',
          })
        })
        pedestalEls.forEach((p) => gsap.set(p, { scaleX: 0, autoAlpha: 0 }))
        labelEls.forEach((l)    => gsap.set(l, { autoAlpha: 0, y: 10 }))
      }

      // ── Master Timeline ────────────────────────────────────
      const tl = gsap.timeline()

      // ─── Phase 1: Why Section Composes (0 → 1.0) ──────────
      els.forEach((el, i) => {
        tl.to(el, {
          x: COMPOSED[i].x,
          y: COMPOSED[i].y,
          rotation: COMPOSED[i].rotation,
          scale: COMPOSED[i].scale,
          ease: 'power1.inOut',
          duration: 1,
        }, 0)
      })
      tl.to(captionRef.current, { opacity: 1, y: 0, ease: 'power1.out', duration: 0.45 }, 0.55)

      // ─── Phase 2: Transition to Deep Space (1.4 → 2.2) ────
      tl.to(els, {
        rotationX: 70,
        y: '+=300',
        scale: 0.6,
        opacity: 0,
        ease: 'power2.inOut',
        duration: 0.8,
        stagger: 0.05,
      }, 1.4)

      tl.to(captionRef.current, { opacity: 0, duration: 0.4 }, 1.4)
      tl.to(labelRef.current, { opacity: 0, duration: 0.4 }, 1.4)
      tl.to(lightRef.current, { opacity: 0, duration: 0.4 }, 1.4)

      // Background transitions to ivory
      tl.to(sticky, { backgroundColor: 'var(--bg-chamber)', duration: 0.6 }, 1.5)

      // ─── Phase 3: Hallway rises (1.7 → 2.4) ───────────────
      tl.to(hallway, { opacity: 1, scaleY: 1, ease: 'power2.out', duration: 0.7 }, 1.7)

      // ─── Phase 4: Grand Statement (2.0 → 2.55) ─────────────
      tl.to(lineA, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.4 }, 2.0)
      tl.to(lineB, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.4 }, 2.15)

      // ─── Phase 5: Vault doors part (2.7 → 3.3) ────────────
      tl.to(lineA, { x: '-54vw', opacity: 0, duration: 0.6, ease: 'power2.in' }, 2.7)
      tl.to(lineB, { x: '54vw',  opacity: 0, duration: 0.6, ease: 'power2.in' }, 2.7)

      // ─── Phase 6: Monolith rises (3.1 → 3.7) ──────────────
      tl.to(monolith, { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 0.6 }, 3.1)

      // ─── Phase 7: Exit Wipe expands (4.1 → 4.7) ───────────
      tl.set(wipe, { opacity: 1 }, 4.1)
      tl.to(wipe, { scaleX: 2.2, scaleY: 2.2, ease: 'power2.in', duration: 0.6 }, 4.1)

      // ─── Phase 8: Reveal team under wipe (4.7) ─────────────
      tl.set(teamEl, { autoAlpha: 1 }, 4.7)

      // ─── Phase 9a: Spotlight blooms (4.7 → 5.1) ────────────
      // Fires simultaneously with wipe dissolve so the stage is
      // already lit when the ivory overlay fades — no harsh cut.
      tl.to(spotlightEl, {
        scale: 1,
        autoAlpha: 1,
        ease: 'power2.out',
        duration: 0.4,
      }, 4.7)

      // ─── Phase 9b: Wipe cross-dissolves away (4.85 → 5.5) ──
      // Spotlight visible underneath → feels like a light-change.
      tl.to(wipe, {
        autoAlpha: 0,
        ease: 'power1.inOut',
        duration: 0.65,
      }, 4.85)
      // Hard-hide — never blocks team pointer events
      tl.set(wipe, { display: 'none' }, 5.55)

      // ─── Phase 10: "THE BOARD" headline (5.2 → 5.65) ───────
      // CSS gradient handles visual subtlety; GSAP goes to full 1.
      tl.to(headlineEl, {
        autoAlpha: 1,
        ease: 'power1.out',
        duration: 0.45,
      }, 5.2)

      // ─── Phase 11: Members rise in V-formation (5.5 → 6.8) ─
      const RISE = 5.5

      if (memberEls.length === TEAM_DATA.members.length) {
        memberEls.forEach((m, i) => {
          tl.to(m, {
            y: PEDESTAL_LAYOUT[i].finalY,  // vh-based — center-stage
            autoAlpha: 1,
            ease: 'power3.out',
            duration: 1.0,
          }, RISE + PEDESTAL_LAYOUT[i].riseDelay)
        })

        pedestalEls.forEach((p, i) => {
          tl.to(p, {
            scaleX: 1,
            autoAlpha: 1,
            ease: 'back.out(1.4)',
            duration: 0.45,
          }, RISE + PEDESTAL_LAYOUT[i].riseDelay + 0.65)
        })

        labelEls.forEach((l, i) => {
          tl.to(l, {
            autoAlpha: 1,
            y: 0,
            ease: 'power1.out',
            duration: 0.35,
          }, RISE + PEDESTAL_LAYOUT[i].riseDelay + 0.9)
        })
      }


      // ─── Phase 12: Radiant Wash exit (8.0 → 8.6) ─────────
      // Fades the entire screen to solid ivory, perfectly welding
      // with the Testimonials section that follows. No blurry scaling.
      tl.to(radiantEl, {
        autoAlpha: 1,
        ease: 'power2.inOut',
        duration: 0.6,
      }, 8.0)

      // ── ScrollTrigger — single, master ────────────────────
      ScrollTrigger.create({
        animation: tl,
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      })

      // ── Mouse events on monolith ──────────────────────────
      monolith.addEventListener('mouseenter', () => {
        gsap.to(shimmerRef.current, { opacity: 1, duration: 0.4 })
        startMouse()
      })
      monolith.addEventListener('mousemove', onMouseMove as EventListener)
      monolith.addEventListener('mouseleave', stopMouse)

    }, containerRef)

    // ── Shadow RAF (outside gsap.context so cleanup can reach it) ──
    const onGlobalMouseMove = (e: MouseEvent) => {
      shadowMouse.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }

    const animateShadows = () => {
      if (!teamHandleRef.current) return
      const members = teamHandleRef.current.memberEls.filter(Boolean) as HTMLDivElement[]
      const { x } = shadowMouse.current
      const sx = (x - 0.5) * 40
      members.forEach((m) => {
        const shadow = m.querySelector<HTMLElement>('.team-member__shadow')
        if (shadow) gsap.set(shadow, { x: sx })
      })
      shadowRaf.current = requestAnimationFrame(animateShadows)
    }

    window.addEventListener('mousemove', onGlobalMouseMove, { passive: true })
    shadowRaf.current = requestAnimationFrame(animateShadows)


    return () => {
      ctx.revert()
      if (mouseRaf.current) cancelAnimationFrame(mouseRaf.current)
      if (shadowRaf.current) cancelAnimationFrame(shadowRaf.current)
      window.removeEventListener('mousemove', onGlobalMouseMove)
    }
  }, [onMouseMove, startMouse, stopMouse])

  return (
    <div id="why-avyanco" ref={containerRef} className="why-section">
      <div ref={stickyRef} className="why-section__sticky">

        {/* ── Why Layers ──────────────────────────────── */}
        <div ref={lightRef} className="why-section__light" aria-hidden="true" />

        <div ref={labelRef} className="why-section__label" aria-label="Section: Why Avyanco">
          <span className="why-section__eyebrow">Why Avyanco</span>
        </div>

        <div className="why-section__stage">
          {PROOF_ITEMS.map((item, index) => (
            <ProofCard
              key={item.id}
              item={item}
              cardRef={(node) => {
                proofRefs.current[index] = node
              }}
            />
          ))}
        </div>

        <p ref={captionRef} className="why-section__caption">
          {WHY_CAPTION}
        </p>

        {/* ── About Layers ────────────────────────────── */}
        {/* Hallway / depth layer */}
        <div ref={hallwayRef} className="about-hallway" aria-hidden="true" />

        {/* Ambient background orbs */}
        <div className="about-orb about-orb--a" aria-hidden="true" />
        <div className="about-orb about-orb--b" aria-hidden="true" />

        {/* Grand Statement */}
        <div className="about-statement" aria-label="Grand statement: Not Just an Agency. The Architects of Global Enterprise.">
          <span ref={lineARef} className="about-statement__line about-statement__line--a" aria-hidden="true">
            {ABOUT_DATA.grandStatement[0]}
          </span>
          <span ref={lineBRef} className="about-statement__line about-statement__line--b" aria-hidden="true">
            {ABOUT_DATA.grandStatement[1]}
          </span>
        </div>

        {/* Glass Monolith */}
        <article
          ref={monolithRef}
          className="about-monolith"
          aria-label="About Avyanco"
        >
          {/* Mouse shimmer overlay */}
          <div
            ref={shimmerRef}
            className="about-monolith__shimmer"
            aria-hidden="true"
          />

          <div className="about-monolith__inner">
            <p className="about-monolith__eyebrow">Est. 2003 · Dubai, UAE</p>
            <h2 className="about-monolith__headline">{ABOUT_DATA.monolithHeadline}</h2>
            <div className="about-monolith__rule" aria-hidden="true" />
            <p className="about-monolith__body">{ABOUT_DATA.monolithBody}</p>
            <p className="about-monolith__body">{ABOUT_DATA.monolithMission}</p>

            <dl className="about-monolith__stats">
              {ABOUT_DATA.stats.map((stat) => (
                <div key={stat.id} className="about-monolith__stat">
                  <dt className="about-monolith__stat-value">{stat.value}</dt>
                  <dd className="about-monolith__stat-label">{stat.label}</dd>
                </div>
              ))}
            </dl>

            <p className="about-monolith__caption">{ABOUT_DATA.caption}</p>
          </div>

          <div className="about-monolith__edge about-monolith__edge--top" aria-hidden="true" />
          <div className="about-monolith__edge about-monolith__edge--left" aria-hidden="true" />
          <div className="about-monolith__edge about-monolith__edge--bottom" aria-hidden="true" />
        </article>

        {/* Exit wipe overlay — morphs into floor spotlight for team transition */}
        <div ref={wipeRef} className="about-wipe" aria-hidden="true" />

        {/* ── Team Section — always rendered, GSAP controls visibility ── */}
        <Team ref={teamHandleRef} />

      </div>
    </div>
  )
}

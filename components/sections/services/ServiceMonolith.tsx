'use client'

// ═══════════════════════════════════════════════════════════
// SERVICE MONOLITH — Sovereign Monolith Design
//
// ARCHITECTURE (Tall Container + Sticky Viewport):
//  .service-monolith              — tall outer container (N × 100vh scroll space)
//    .service-monolith__viewport  — sticky 100vh inner wrapper, pinned to top:0
//      .service-monolith__stack   — abs-positioned stack of all panels
//        .service-monolith__panel — individual slab (abs, 100% of viewport)
//
// ANIMATION (UNTOUCHED):
//  A single GSAP ScrollTrigger scrubs a master timeline across the entire
//  scroll distance. Each panel animates in sequence:
//    - Incoming: translateY(100%) → translateY(0), scale(1)
//    - Outgoing (previous): scale(1) → scale(0.94), opacity(1) → opacity(0.55)
//    - Shutter reveal: clip-path opens on items once panel settles
//
// DESIGN:
//  Each panel is a "Power Split" — left column is the category identity
//  (gallery wall title), right column is the unique category art piece.
//  Five art templates: Blueprint Tiles, Floating Spheres, Precision Slabs,
//  Protective Matrix, Signature Gallery. Plus Workspace Grid for the 6th.
// ═══════════════════════════════════════════════════════════

import { useRef, useEffect, useCallback, useMemo } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { SERVICES_CATEGORIES, COUNTRY_SERVICES } from '@/lib/constants'
import type { ServiceCategory } from '@/lib/constants'

// ── Constants ────────────────────────────────────────────────

const VH_PER_PANEL = 1.0

// ── Glint effect (pure CSS-variable, no GSAP) ─────────────────

function useGlint(containerRef: React.RefObject<HTMLDivElement | null>) {
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--glint-x', `${x}%`)
    el.style.setProperty('--glint-y', `${y}%`)
  }, [containerRef])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('mousemove', handleMouseMove as EventListener)
    return () => el.removeEventListener('mousemove', handleMouseMove as EventListener)
  }, [containerRef, handleMouseMove])
}

// ══════════════════════════════════════════════════════════════
// ART COMPONENTS — one per service category
// ══════════════════════════════════════════════════════════════

// ── A. Blueprint Tiles — Business Setup ──────────────────────

function BlueprintTiles({ items }: { items: ServiceCategory['items'] }) {
  return (
    <div className="blueprint-tiles">
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`blueprint-tile${items.length === 3 && i === 2 ? ' blueprint-tile--span' : ''}`}
        >
          <div className="blueprint-tile__grid" aria-hidden="true" />
          <div className="blueprint-tile__corners" aria-hidden="true">
            <span className="bp-corner bp-corner--tl" />
            <span className="bp-corner bp-corner--tr" />
            <span className="bp-corner bp-corner--bl" />
            <span className="bp-corner bp-corner--br" />
          </div>
          <span className="blueprint-tile__label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── B. Floating Spheres — Corporate Services ─────────────────

function FloatingSpheres({ items }: { items: ServiceCategory['items'] }) {
  const configs = [
    { pos: { top: '8%',   left: '14%'  }, size: 128, duration: '5s',   delay: '0s'   },
    { pos: { top: '6%',   right: '14%' }, size: 86,  duration: '4.2s', delay: '0.8s' },
    { pos: { top: '50%',  left: '6%'   }, size: 70,  duration: '6s',   delay: '1.6s' },
    { pos: { top: '44%',  right: '10%' }, size: 114, duration: '4.6s', delay: '0.4s' },
    { pos: { bottom: '8%', left: '38%' }, size: 88,  duration: '5.4s', delay: '1.2s' },
  ]

  return (
    <div className="sphere-field">
      {items.map((item, i) => {
        const cfg = configs[i] ?? configs[0]
        return (
          <div
            key={item.id}
            className="sphere"
            style={{
              ...cfg.pos,
              width: cfg.size,
              height: cfg.size,
              '--sphere-duration': cfg.duration,
              '--sphere-delay': cfg.delay,
            } as unknown as React.CSSProperties}
          >
            <span className="sphere__label">{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── C. Precision Slabs — Finance & Accounting ────────────────

function PrecisionSlabs({ items }: { items: ServiceCategory['items'] }) {
  return (
    <div className="precision-slabs">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="precision-bar"
          style={{ '--bar-delay': `${i * 0.55}s` } as React.CSSProperties}
        >
          <div className="precision-bar__scan" aria-hidden="true" />
          <span className="precision-bar__label">{item.label}</span>
          <div className="precision-bar__ticks" aria-hidden="true">
            <span className="precision-bar__tick" />
            <span className="precision-bar__tick" />
            <span className="precision-bar__tick" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── D. Protective Matrix — Tax & Compliance ──────────────────

function ProtectiveMatrix({ items }: { items: ServiceCategory['items'] }) {
  return (
    <div className="shield-matrix">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="shield-panel"
          style={{
            '--shield-delay': `${i * 0.4}s`,
            zIndex: items.length - i,
          } as React.CSSProperties}
        >
          <div className="shield-panel__shimmer" aria-hidden="true" />
          <span className="shield-panel__num" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="shield-panel__label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── E. Signature Gallery — Legal & Advisory ──────────────────

function SignatureGallery({ items }: { items: ServiceCategory['items'] }) {
  return (
    <div className="sig-gallery">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="sig-frame"
          style={{
            '--frame-tilt': i === 0 ? '-4deg' : '4deg',
          } as React.CSSProperties}
        >
          <div className="sig-frame__mat">
            <span className="sig-frame__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="sig-frame__label">{item.label}</span>
            <div className="sig-frame__rule" aria-hidden="true" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── F. Workspace Grid — Workspace ────────────────────────────

function WorkspaceGrid({ items }: { items: ServiceCategory['items'] }) {
  return (
    <div className="workspace-grid">
      {items.map((item) => (
        <div key={item.id} className="workspace-card">
          <span className="workspace-card__label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Category Art Dispatcher ───────────────────────────────────

function CategoryArt({ category }: { category: ServiceCategory }) {
  switch (category.id) {
    case 'business-setup':     return <BlueprintTiles items={category.items} />
    case 'corporate-services': return <FloatingSpheres items={category.items} />
    case 'finance-accounting': return <PrecisionSlabs items={category.items} />
    case 'tax-compliance':     return <ProtectiveMatrix items={category.items} />
    case 'legal-advisory':     return <SignatureGallery items={category.items} />
    case 'workspace':          return <WorkspaceGrid items={category.items} />
    default:                   return null
  }
}

// ── Panel ────────────────────────────────────────────────────

interface PanelProps {
  category: ServiceCategory
  index: number
  panelRef: (el: HTMLDivElement | null) => void
  shutterRef: (el: HTMLUListElement | null) => void
}

function ServicePanel({ category, index, panelRef, shutterRef }: PanelProps) {
  const innerRef = useRef<HTMLDivElement>(null)
  useGlint(innerRef)

  return (
    <div
      ref={panelRef}
      className="service-monolith__panel"
      style={{ '--panel-accent': category.accent } as React.CSSProperties}
    >
      <div ref={innerRef} className="service-monolith__panel-inner">

        {/* City background — subtle, breathing, behind the glass */}
        <div
          className="slab__bg"
          style={{ backgroundImage: `url(${category.bgImage})` }}
          aria-hidden="true"
        />

        {/* Power split — left: category identity | right: category art */}
        <div className="slab__split">

          {/* Left: Gallery wall — category name + info */}
          <div className="slab__left">
            <span className="slab__step">{String(index + 1).padStart(2, '0')}</span>
            <div className="slab__heading">
              <span className="slab__icon" aria-hidden="true">{category.icon}</span>
              <h3 className="slab__label">{category.label}</h3>
            </div>
            <p className="slab__summary">{category.summary}</p>
            {/* Shutter list — clip-path animated by GSAP (DO NOT MOVE) */}
            <ul ref={shutterRef} className="service-monolith__items">
              {category.items.map((item) => (
                <li key={item.id} className="service-monolith__item">
                  <span className="service-monolith__item-dot" aria-hidden="true" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Category art — unique interaction piece per category */}
          <div className="slab__right">
            <span className="service-monolith__ghost" aria-hidden="true">
              {category.label}
            </span>
            <CategoryArt category={category} />
          </div>

        </div>

        {/* Glint layer — follows cursor via CSS variables */}
        <div className="service-monolith__glint" aria-hidden="true" />
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────

export default function ServiceMonolith({ activeCountryId = 'uae' }: { activeCountryId?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const shutterRefs = useRef<(HTMLUListElement | null)[]>([])

  const filteredCategories = useMemo(() => {
    return SERVICES_CATEGORIES.filter((category) => COUNTRY_SERVICES[activeCountryId]?.[category.id] !== false)
  }, [activeCountryId])

  const N = filteredCategories.length // Dynamic based on active country

  useEffect(() => {
    const container = containerRef.current
    const viewport = viewportRef.current
    const panels = panelRefs.current.slice(0, N) as HTMLDivElement[]
    const shutters = shutterRefs.current.slice(0, N) as HTMLUListElement[]

    if (!container || !viewport || panels.some((p) => !p) || shutters.some((s) => !s)) return

    // ── Set initial states ─────────────────────────────────
    gsap.set(panels[0], { y: '0%', scale: 1, opacity: 1 })
    gsap.set(panels.slice(1), { y: '100%', scale: 1, opacity: 1 })

    gsap.set(shutters, { clipPath: 'inset(0 100% 0 0 round 4px)' })
    gsap.set(shutters[0], { clipPath: 'inset(0 0% 0 0 round 4px)' })

    // ── Build the master scrub timeline ───────────────────
    const totalScroll = (N - 1) * VH_PER_PANEL * window.innerHeight
    const segmentDuration = 1 / (N - 1)

    const tl = gsap.timeline({ paused: true })

    for (let i = 1; i < N; i++) {
      const incomingPanel = panels[i]
      const outgoingPanel = panels[i - 1]
      const incomingShutter = shutters[i]

      const startPos = (i - 1) * segmentDuration
      const endPos = i * segmentDuration

      tl.fromTo(
        incomingPanel,
        { y: '100%' },
        {
          y: '0%',
          ease: 'power3.inOut',
          duration: endPos - startPos,
        },
        startPos
      )

      tl.to(
        outgoingPanel,
        {
          scale: 0.94,
          opacity: 0.5,
          ease: 'power2.inOut',
          duration: endPos - startPos,
        },
        startPos
      )

      const shutterStart = startPos + (endPos - startPos) * 0.65
      tl.fromTo(
        incomingShutter,
        { clipPath: 'inset(0 100% 0 0 round 4px)' },
        {
          clipPath: 'inset(0 0% 0 0 round 4px)',
          ease: 'power2.out',
          duration: endPos - shutterStart,
        },
        shutterStart
      )
    }

    // ── Attach ScrollTrigger ───────────────────────────────
    ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: `+=${totalScroll}`,
      scrub: 1,
      animation: tl,
    })

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === container) st.kill()
      })
      tl.kill()
    }
  }, [N, activeCountryId])

  return (
    <div
      ref={containerRef}
      className="service-monolith"
      style={{ height: `calc(100vh + ${(N - 1) * VH_PER_PANEL * 100}vh)` }}
    >
      <div ref={viewportRef} className="service-monolith__viewport">

        <div className="service-monolith__header">
          <p className="service-monolith__eyebrow">What We Do</p>
          <h2 className="service-monolith__title">
            Comprehensive Corporate Services
            <br />
            <span className="service-monolith__title-accent">
              Across Every Major Jurisdiction
            </span>
          </h2>
        </div>

        <div className="service-monolith__stack">
          {filteredCategories.map((category, idx) => (
            <ServicePanel
              key={category.id}
              category={category}
              index={idx}
              panelRef={(el) => { panelRefs.current[idx] = el }}
              shutterRef={(el) => { shutterRefs.current[idx] = el }}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

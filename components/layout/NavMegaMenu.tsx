// ═══════════════════════════════════════════════════════════
// NAV MEGA MENU
//
// Height budget (NAV_EXPANDED_HEIGHT = 560px):
//   78px  — logo / CTA row spacer  (flex-shrink: 0)
//   flex:1 — 2-column content grid (fills remaining space)
//   44px  — premium footer strip   (flex-shrink: 0)
//   ─────
//   560px total — zero overflow by design.
//
// Using flex-column instead of height:100% + marginTop avoids
// the overflow bug where marginTop pushed the grid past the
// container boundary (66px margin + 560px height = 626px).
// ═══════════════════════════════════════════════════════════

'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'
import NavServicesPanel  from './nav/NavServicesPanel'
import NavCountriesPanel from './nav/NavCountriesPanel'
import NavSimplePanel    from './nav/NavSimplePanel'

// ── Types & data ──────────────────────────────────────────────

type CategoryId = 'services' | 'countries' | 'about' | 'insights' | 'contact' | 'calculator'

const CATEGORIES: ReadonlyArray<{ id: CategoryId; label: string; index: string }> = [
  { id: 'services',   label: 'Services',       index: '01' },
  { id: 'countries',  label: 'Countries',      index: '02' },
  { id: 'about',      label: 'Why Avyanco',    index: '03' },
  { id: 'insights',   label: 'Insights',       index: '04' },
  { id: 'contact',    label: 'Contact',        index: '05' },
  { id: 'calculator', label: 'Calculate Cost', index: '06' },
] as const

interface NavMegaMenuProps {
  isExpanded: boolean
}

// ── Component ─────────────────────────────────────────────────

export default function NavMegaMenu({ isExpanded }: NavMegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('services')

  const itemEls     = useRef<(HTMLButtonElement | null)[]>(CATEGORIES.map(() => null))
  const rightColRef = useRef<HTMLDivElement>(null)
  const footerRef   = useRef<HTMLDivElement>(null)

  const handleHover = useCallback((id: CategoryId) => setActiveCategory(id), [])

  // ── Stagger animations in / hard-reset out ───────────────────
  useEffect(() => {
    const els    = itemEls.current.filter(Boolean) as HTMLButtonElement[]
    const right  = rightColRef.current
    const footer = footerRef.current

    if (isExpanded) {
      gsap.fromTo(
        els,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.42, ease: 'power2.out', delay: 0.52 },
      )
      if (right) {
        gsap.fromTo(right, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38, ease: 'power2.out', delay: 0.62 })
      }
      if (footer) {
        gsap.fromTo(footer, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power2.out', delay: 0.76 })
      }
    } else {
      gsap.killTweensOf([...els, right, footer])
      gsap.set([...els, right, footer], { y: 0, opacity: 0 })
      setActiveCategory('services')
    }

    return () => { gsap.killTweensOf([...els, right, footer]) }
  }, [isExpanded])

  const renderPanel = () => {
    if (activeCategory === 'services')  return <NavServicesPanel  key="services"  />
    if (activeCategory === 'countries') return <NavCountriesPanel key="countries" />
    return (
      <NavSimplePanel
        key={activeCategory}
        category={activeCategory as 'about' | 'insights' | 'contact' | 'calculator'}
      />
    )
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div style={{ height: '100%', pointerEvents: 'none', display: 'flex', flexDirection: 'column' }}>

      {/* ── Logo / CTA row spacer (78px) ─────────────────────
       *  Height = island height (52px) + 26px breathing room.
       *  The border-bottom acts as the visual divider between
       *  the nav bar row and the menu content below it.
       */}
      <div
        style={{
          height: '96px',
          flexShrink: 0,
          borderBottom: '1px solid rgba(10,15,26,0.07)',
        }}
      />

      {/* ── 2-column content grid (flex:1) ───────────────────
       *  flex:1 + minHeight:0 fills exactly the remaining space
       *  without overflowing. overflow:hidden clips any panel
       *  content that exceeds the available height.
       */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '28% 1fr',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          pointerEvents: isExpanded ? 'auto' : 'none',
        }}
      >
        {/* ── Left Column — Category rail ──────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '2px',
            padding: '16px 24px 16px 12px',
            borderRight: '1px solid rgba(10,15,26,0.07)',
            overflow: 'hidden',
          }}
        >
          {CATEGORIES.map((cat, i) => {
            const isActive = activeCategory === cat.id

            return (
              <button
                key={cat.id}
                ref={el => { itemEls.current[i] = el }}
                onMouseEnter={() => handleHover(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-lg)',
                  background: isActive ? 'rgba(27,79,216,0.07)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  opacity: 0,
                  outline: 'none',
                  transition: 'background 200ms ease',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '10px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    color: isActive ? 'var(--blue-500)' : 'var(--text-subtle)',
                    flexShrink: 0,
                    width: '18px',
                    transition: 'color 200ms ease',
                  }}
                >
                  {cat.index}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-xl)',
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: '-0.025em',
                    lineHeight: 1.2,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    flex: 1,
                    transition: 'color 180ms ease',
                  }}
                >
                  {cat.label}
                </span>
                <ArrowRight
                  size={13}
                  aria-hidden="true"
                  style={{
                    color: 'var(--blue-500)',
                    flexShrink: 0,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateX(0px)' : 'translateX(-6px)',
                    transition: 'opacity 200ms ease, transform 200ms ease',
                  }}
                />
              </button>
            )
          })}
        </div>

        {/* ── Right Column — Content stage ─────────────────── */}
        <div
          ref={rightColRef}
          style={{
            position: 'relative',
            padding: '24px 32px 20px 40px',
            overflow: 'hidden',
            opacity: 0,
          }}
        >
          {renderPanel()}
        </div>
      </div>

      {/* ── Premium footer strip (44px) ──────────────────────
       *  Fades in last in the stagger sequence (delay 0.76s).
       *  pointer-events toggled with isExpanded so links are
       *  unreachable when the panel is closed.
       */}
      <div
        ref={footerRef}
        style={{
          height: '44px',
          flexShrink: 0,
          borderTop: '1px solid rgba(10,15,26,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingInline: '20px',
          opacity: 0,
          pointerEvents: isExpanded ? 'auto' : 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            color: 'var(--text-subtle)',
            letterSpacing: '0.01em',
          }}
        >
          Rated 4.8 stars across 708 verified reviews
        </span>
        <Link
          href="/contact"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--blue-600)',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            transition: 'opacity 160ms ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.7' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
        >
          Free Consultation <ArrowRight size={10} />
        </Link>
      </div>
    </div>
  )
}

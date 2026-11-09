// ═══════════════════════════════════════════════════════════
// NAV ISLAND — RIGHT
// Layered architecture matching NavIslandLeft.
// ─────────────────────────────────────────────────────────
// Expand state:
//  - bgLayerRef fades to opacity 0 (glass disappears)
//  - Phone + WhatsApp icons stay visible — float natively on
//    the expanded mega-panel at their exact position
//  - Rolling CTA pauses on "Get in Touch" and resumes cleanly
//    on collapse without losing the timeline state
// ─────────────────────────────────────────────────────────
// 3-D roll: perspective on the clip window + rotateX lean on
// the track during each y-transition gives barrel-drum depth.
// ═══════════════════════════════════════════════════════════

'use client'

import { useEffect, useRef } from 'react'
import { Phone } from 'lucide-react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'

// ── Constants ──────────────────────────────────────────────────
const ITEM_HEIGHT = 44   // px — height of each CTA slide
const ROLL_HOLD   = 2.8  // seconds each CTA is held
const ROLL_SPEED  = 0.65 // seconds per transition

const SHADOW_MD = '0 4px 12px rgba(10,15,26,0.08), 0 2px 4px rgba(10,15,26,0.04)'

// ── CTA data ───────────────────────────────────────────────────
const CTAS = [
  { id: 'contact',    label: 'Get in Touch',   href: '/contact',    bg: 'var(--blue-600)' },
  { id: 'calculator', label: 'Calculate Cost', href: '/calculator', bg: 'var(--teal-500)' },
] as const

// ── WhatsApp SVG ───────────────────────────────────────────────
function WhatsAppIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

// ── Types ──────────────────────────────────────────────────────
interface NavIslandRightProps {
  isExpanded: boolean
}

// ── Component ──────────────────────────────────────────────────
export default function NavIslandRight({ isExpanded }: NavIslandRightProps) {
  const bgLayerRef = useRef<HTMLDivElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)
  const tlRef      = useRef<gsap.core.Timeline | null>(null)

  // ── Infinite upward slot-machine timeline ───────────────────
  // Each transition applies a rotateX lean for barrel-drum depth.
  // The timeline is never killed — only paused/restarted — so
  // it can always be safely resumed after the mega menu closes.
  useEffect(() => {
    if (!trackRef.current) return

    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const tl    = gsap.timeline({ repeat: -1 })

      // First roll: show "Calculate Cost"
      tl.to(track, {
          y: -ITEM_HEIGHT,
          rotateX: -10,
          duration: ROLL_SPEED,
          ease: 'power2.inOut',
          delay: ROLL_HOLD,
        })
        .to(track, { rotateX: 0, duration: 0.2, ease: 'power2.out' })

      // Second roll: loop back to "Get in Touch"
      tl.to(track, {
          y: -(ITEM_HEIGHT * 2),
          rotateX: -10,
          duration: ROLL_SPEED,
          ease: 'power2.inOut',
          delay: ROLL_HOLD,
        })
        .to(track, { rotateX: 0, duration: 0.2, ease: 'power2.out' })
        .set(track, { y: 0, rotateX: 0 })

      tlRef.current = tl
    })

    return () => {
      ctx.revert()
      tlRef.current = null
    }
  }, [])

  // ── Pause / resume CTA roll with mega menu state ────────────
  // Uses tl.progress(0) instead of gsap.killTweensOf so the
  // timeline's internal tweens stay intact and restart() works.
  useEffect(() => {
    const tl = tlRef.current
    if (!tl) return

    if (isExpanded) {
      tl.pause()
      tl.progress(0)   // seek to start (y:0) without destroying tweens
    } else {
      tl.restart()
    }
  }, [isExpanded])

  // ── Fade glass bg to transparent on expand ─────────────────
  useEffect(() => {
    if (!bgLayerRef.current) return
    gsap.to(bgLayerRef.current, {
      opacity: isExpanded ? 0 : 1,
      duration: isExpanded ? 0.35 : 0.55,
      ease: 'power2.inOut',
    })
  }, [isExpanded])

  // ── Icon hover micro-interactions ───────────────────────────
  const handleIconEnter = (
    e: React.MouseEvent<HTMLAnchorElement>,
    color: string,
    bg: string,
  ) => {
    const el = e.currentTarget
    el.style.color      = color
    el.style.background = bg
  }

  const handleIconLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    el.style.color      = 'var(--text-tertiary)'
    el.style.background = 'transparent'
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>

      {/* ── Layer 1: Glass background (fades out on expand) ─── */}
      <div
        ref={bgLayerRef}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255,255,255,0.80)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.65)',
          boxShadow: SHADOW_MD,
        }}
      />

      {/* ── Layer 2: Content ─────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          height: '52px',
          paddingLeft: '12px',
          paddingRight: '8px',
        }}
      >
        {/* Phone + WhatsApp icons — always visible including when expanded */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <a
            href="tel:+97100000000"
            aria-label="Call Avyanco"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              color: 'var(--text-tertiary)',
              flexShrink: 0,
              transition: 'color 180ms ease, background 180ms ease',
              textDecoration: 'none',
            }}
            onMouseEnter={e => handleIconEnter(e, 'var(--blue-600)', 'var(--blue-50)')}
            onMouseLeave={handleIconLeave}
          >
            <Phone size={15} strokeWidth={1.75} />
          </a>

          <a
            href="https://wa.me/97100000000"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Avyanco"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              color: 'var(--text-tertiary)',
              flexShrink: 0,
              transition: 'color 180ms ease, background 180ms ease',
              textDecoration: 'none',
            }}
            onMouseEnter={e => handleIconEnter(e, '#25D366', '#f0fdf4')}
            onMouseLeave={handleIconLeave}
          >
            <WhatsAppIcon size={15} />
          </a>

          <div
            style={{
              width: '1px',
              height: '20px',
              background: 'var(--neutral-200)',
              marginInline: '6px',
              flexShrink: 0,
            }}
          />
        </div>

        {/* ── Rolling CTA (always visible) ────────────────── */}
        {/*
         * perspective on the clip container gives the barrel-drum
         * 3-D depth. transformStyle preserve-3d on the track lets
         * the rotateX tweens render with real perspective foreshortening.
         */}
        <div
          style={{
            height: `${ITEM_HEIGHT}px`,
            minWidth: '150px',
            overflow: 'hidden',
            borderRadius: 'var(--radius-full)',
            flexShrink: 0,
            perspective: '350px',
          }}
          onMouseEnter={() => tlRef.current?.pause()}
          onMouseLeave={() => { if (!isExpanded) tlRef.current?.resume() }}
        >
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              willChange: 'transform',
              transformStyle: 'preserve-3d',
            }}
          >
            {[...CTAS, ...CTAS].map((cta, index) => (
              <Link
                key={`${cta.id}-${index}`}
                href={cta.href}
                aria-hidden={index >= CTAS.length ? true : undefined}
                tabIndex={index >= CTAS.length ? -1 : 0}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: `${ITEM_HEIGHT}px`,
                  paddingInline: '22px',
                  background: cta.bg,
                  color: '#ffffff',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                }}
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// NAV ISLAND — LEFT
//
// Two-layer background architecture:
//
//   pillBgRef  — glass pill, always at inset:0 (pill dimensions).
//                Handles hover scale + teal border. Fades out on expand.
//
//   panelBgRef — full-size panel div, always at its final pixel
//                dimensions. Hidden behind a clip-path that starts in
//                pill shape and opens to full panel on expand.
//                Because it is never scaled, border-radius (26px) and
//                border-width (1px) are always visually exact.
//
// Why clip-path instead of transform:scale?
//   scale() distorts border-radius and border-width proportionally to
//   scaleX/scaleY — a 1px border on a 10x-scaled element looks 10px.
//   clip-path clips a correctly-dimensioned element: no math compensation
//   needed. GPU-composited, zero layout cost, responsive by design.
//
// Stacking (all relative to the fixed header's stacking context):
//   pillBgRef / panelBgRef  — no z-index  (below mega-menu z:1)
//   megaMenuRef             — z: 1
//   rightWrapRef            — z: 2
//   content layer here      — z: 3        (above everything)
// ═══════════════════════════════════════════════════════════

'use client'

import { useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { NAV_EDGE_MARGIN, NAV_EXPANDED_HEIGHT } from '@/lib/nav-constants'

// ── Constants ─────────────────────────────────────────────────

const EDGE_MARGIN     = NAV_EDGE_MARGIN
const EXPANDED_HEIGHT = NAV_EXPANDED_HEIGHT

const SHADOW_MD = '0 4px 12px rgba(10,15,26,0.08), 0 2px 4px rgba(10,15,26,0.04)'

const EXPANDED_BG  = '#EEF4FF'
const COLLAPSED_BG = 'rgba(255,255,255,0.80)'

// Explicit rgba so GSAP CSSPlugin can interpolate without resolving CSS vars
const GLASS_BORDER = 'rgba(255,255,255,0.65)'
const TEAL_BORDER  = 'rgba(6,182,212,0.75)'

// Pill radius: CSS 9999px → capped visually to height/2 = 26px.
// EXPANDED_RADIUS matches that visual cap so pill and panel feel identical.
const PILL_RADIUS     = 9999
const EXPANDED_RADIUS = 26  // = island height (52px) / 2

// ── Types ──────────────────────────────────────────────────────

interface NavIslandLeftProps {
  isExpanded: boolean
  onToggle: () => void
}

// ── Component ──────────────────────────────────────────────────

export default function NavIslandLeft({ isExpanded, onToggle }: NavIslandLeftProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pillBgRef    = useRef<HTMLDivElement>(null)
  const panelBgRef   = useRef<HTMLDivElement>(null)

  // Stable dim cache — avoids recomputing inside every GSAP tween callback
  const panelDimsRef  = useRef({ panelW: 0, rightClip: 0, bottomClip: 0 })
  // Lets the resize handler know the current expanded state without a closure
  const isExpandedRef = useRef(false)
  // Guards the isExpanded effect so it skips the initial mount render
  const mountedRef    = useRef(false)

  useEffect(() => { isExpandedRef.current = isExpanded }, [isExpanded])

  // ── Measure + position panelBgRef ──────────────────────────
  // Runs on mount and every resize. Wrapped in useCallback so the
  // resize listener reference is stable and can be properly removed.
  const measurePanel = useCallback(() => {
    const container = containerRef.current
    const panelBg   = panelBgRef.current
    if (!container || !panelBg) return

    const rect       = container.getBoundingClientRect()
    const panelW     = window.innerWidth - EDGE_MARGIN - rect.left
    const rightClip  = panelW - rect.width
    const bottomClip = EXPANDED_HEIGHT - rect.height

    panelDimsRef.current = { panelW, rightClip, bottomClip }

    // Set element dimensions and correct clip for whichever state is active
    gsap.set(panelBg, {
      width:  panelW,
      height: EXPANDED_HEIGHT,
      clipPath: isExpandedRef.current
        ? `inset(0px 0px 0px 0px round ${EXPANDED_RADIUS}px)`
        : `inset(0px ${rightClip}px ${bottomClip}px 0px round ${PILL_RADIUS}px)`,
    })
  }, []) // no deps — reads stable refs + browser APIs only

  useEffect(() => {
    measurePanel()
    window.addEventListener('resize', measurePanel)
    return () => window.removeEventListener('resize', measurePanel)
  }, [measurePanel])

  // ── Expansion / Collapse ────────────────────────────────────
  useEffect(() => {
    // Skip on initial mount — panelBgRef is already set by measurePanel
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }

    const pillBg  = pillBgRef.current
    const panelBg = panelBgRef.current
    if (!pillBg || !panelBg) return

    const { rightClip, bottomClip } = panelDimsRef.current

    if (isExpanded) {
      // Stop any in-flight hover tween on the pill
      gsap.killTweensOf(pillBg)

      // Pill fades out beneath the emerging panel
      gsap.to(pillBg, { opacity: 0, duration: 0.28, ease: 'power2.in' })

      // Panel: reset to pill clip then animate open
      gsap.set(panelBg, {
        opacity:  1,
        clipPath: `inset(0px ${rightClip}px ${bottomClip}px 0px round ${PILL_RADIUS}px)`,
      })
      gsap.to(panelBg, {
        clipPath: `inset(0px 0px 0px 0px round ${EXPANDED_RADIUS}px)`,
        duration: 0.68,
        ease:     'power3.inOut',
      })

      // Border trace — bottom + right first (visually "draws" the frame)
      gsap.to(panelBg, {
        borderBottomColor: TEAL_BORDER,
        borderRightColor:  TEAL_BORDER,
        duration: 0.3,
        delay:    0.18,
        ease:     'power2.inOut',
      })
      // Top + left complete the perimeter
      gsap.to(panelBg, {
        borderTopColor:  TEAL_BORDER,
        borderLeftColor: TEAL_BORDER,
        duration: 0.25,
        delay:    0.46,
        ease:     'power2.inOut',
      })

    } else {
      // Panel clips back to pill shape
      gsap.to(panelBg, {
        clipPath: `inset(0px ${rightClip}px ${bottomClip}px 0px round ${PILL_RADIUS}px)`,
        duration: 0.52,
        ease:     'power3.inOut',
        onComplete: () => {
          // Hide panel and reset borders so the next expand starts clean
          gsap.set(panelBg, {
            opacity:           0,
            borderTopColor:    GLASS_BORDER,
            borderRightColor:  GLASS_BORDER,
            borderBottomColor: GLASS_BORDER,
            borderLeftColor:   GLASS_BORDER,
          })
        },
      })

      // Pill fades back in, resetting any hover-scale that may have been active
      gsap.to(pillBg, {
        opacity:           1,
        scaleX:            1,
        scaleY:            1,
        borderRadius:      PILL_RADIUS,
        borderBottomColor: GLASS_BORDER,
        borderRightColor:  GLASS_BORDER,
        borderBottomWidth: '1px',
        borderRightWidth:  '1px',
        duration: 0.35,
        delay:    0.22,
        ease:     'power2.out',
      })
    }
  }, [isExpanded])

  // ── Hover: expand pill to bottom-right (collapsed state only) ─
  const handleMouseEnter = () => {
    if (isExpanded) return
    const pillBg    = pillBgRef.current
    const container = containerRef.current
    if (!pillBg || !container) return

    const w = container.offsetWidth
    const h = container.offsetHeight

    gsap.to(pillBg, {
      scaleX:            (w + 22) / w,
      scaleY:            (h + 12) / h,
      borderRadius:      '9999px 9999px 0px 9999px',
      borderBottomColor: TEAL_BORDER,
      borderRightColor:  TEAL_BORDER,
      borderBottomWidth: '1.5px',
      borderRightWidth:  '1.5px',
      duration: 0.36,
      ease:     'power2.out',
    })
  }

  const handleMouseLeave = () => {
    if (isExpanded) return
    const pillBg = pillBgRef.current
    if (!pillBg) return

    gsap.to(pillBg, {
      scaleX:            1,
      scaleY:            1,
      borderRadius:      PILL_RADIUS,
      borderBottomColor: GLASS_BORDER,
      borderRightColor:  GLASS_BORDER,
      borderBottomWidth: '1px',
      borderRightWidth:  '1px',
      duration: 0.32,
      ease:     'power2.out',
    })
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        display:  'inline-flex',
        alignItems: 'center',
      }}
    >

      {/* ── Layer 1: Glass pill ─────────────────────────────── *
       *  inset:0 keeps it exactly pill-sized.
       *  transformOrigin top-left lets hover scale expand toward
       *  the bottom-right corner.
       */}
      <div
        ref={pillBgRef}
        style={{
          position: 'absolute',
          inset:    0,
          borderRadius: PILL_RADIUS,
          background:         COLLAPSED_BG,
          backdropFilter:     'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop:    `1px solid ${GLASS_BORDER}`,
          borderRight:  `1px solid ${GLASS_BORDER}`,
          borderBottom: `1px solid ${GLASS_BORDER}`,
          borderLeft:   `1px solid ${GLASS_BORDER}`,
          boxShadow:    SHADOW_MD,
          transformOrigin: 'top left',
          willChange:  'transform',
        }}
      />

      {/* ── Layer 2: Full panel bg ──────────────────────────── *
       *  Sized to full panel dimensions via measurePanel() on mount.
       *  Never scaled — border-radius and border-width are always
       *  their true pixel values. clip-path morphs it from pill to panel.
       *  opacity:0 prevents any flash before measurement runs.
       */}
      <div
        ref={panelBgRef}
        style={{
          position: 'absolute',
          top:  0,
          left: 0,
          // width / height set by measurePanel after mount
          borderRadius: EXPANDED_RADIUS,
          background:   EXPANDED_BG,
          borderTop:    `1px solid ${GLASS_BORDER}`,
          borderRight:  `1px solid ${GLASS_BORDER}`,
          borderBottom: `1px solid ${GLASS_BORDER}`,
          borderLeft:   `1px solid ${GLASS_BORDER}`,
          opacity:       0,
          pointerEvents: 'none',
          // Shadow fades in with opacity — no separate tween needed
          boxShadow: '0 20px 64px rgba(10,15,26,0.11), 0 8px 24px rgba(10,15,26,0.07)',
          // Failsafe clip so the element is invisible before measurePanel runs
          clipPath: 'inset(0px 100% 100% 0px round 9999px)',
        }}
      />

      {/* ── Layer 3: Content ────────────────────────────────── *
       *  zIndex:3 places this above megaMenuRef (z:1) and
       *  rightWrapRef (z:2) within the header's stacking context.
       */}
      <div
        style={{
          position:  'relative',
          zIndex:    3,
          display:   'flex',
          alignItems: 'center',
          gap:       '18px',
          height:    '52px',
          paddingLeft:  isExpanded ? '24px' : '18px',
          paddingRight: '10px',
          transition: 'padding-left 0.45s cubic-bezier(0.76,0,0.24,1)',
        }}
      >
        {/* Logo: icon + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <Image
            src="/logo/avyanco_icon_only.svg"
            alt="Avyanco icon"
            width={21}
            height={28}
            priority
            style={{ display: 'block' }}
          />
          <Image
            src="/logo/avyanco_wordmark.svg"
            alt="Avyanco"
            width={86}
            height={22}
            priority
            style={{ display: 'block' }}
          />
        </div>

        {/* Separator */}
        <div
          style={{
            width:      '1px',
            alignSelf:  'stretch',
            marginBlock: '12px',
            background: 'var(--neutral-200)',
            flexShrink: 0,
          }}
        />

        {/* Hamburger / Close — crossfade via CSS transition */}
        <button
          onClick={onToggle}
          aria-label={isExpanded ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isExpanded}
          style={{
            position:        'relative',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            width:           '36px',
            height:          '36px',
            borderRadius:    '50%',
            background:      'transparent',
            border:          'none',
            cursor:          'pointer',
            flexShrink:      0,
            outline:         'none',
          }}
        >
          <span
            style={{
              position:  'absolute',
              display:   'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color:     'var(--text-secondary)',
              opacity:   isExpanded ? 0 : 1,
              transform: isExpanded ? 'rotate(90deg) scale(0.6)' : 'rotate(0deg) scale(1)',
              transition: 'opacity 220ms ease, transform 220ms ease',
            }}
          >
            <Menu size={18} strokeWidth={1.75} />
          </span>

          <span
            style={{
              position:  'absolute',
              display:   'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color:     'var(--blue-600)',
              opacity:   isExpanded ? 1 : 0,
              transform: isExpanded ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.6)',
              transition: 'opacity 220ms ease, transform 220ms ease',
            }}
          >
            <X size={18} strokeWidth={2} />
          </span>
        </button>
      </div>
    </div>
  )
}

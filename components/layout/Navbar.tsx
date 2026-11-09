// ═══════════════════════════════════════════════════════════
// NAVBAR — ROOT  (Phase 3 upgrade)
// Adds mega menu container, opacity animation, and
// click-outside collapse handler to the Phase 1 base.
// ═══════════════════════════════════════════════════════════

'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { gsap } from '@/lib/gsap'
import { useLenis } from '@/providers/SmoothScrollProvider'
import NavIslandLeft from './NavIslandLeft'
import NavIslandRight from './NavIslandRight'
import NavMegaMenu from './NavMegaMenu'
import {
  NAV_EDGE_MARGIN,
  NAV_TOP,
  NAV_EXPANDED_HEIGHT,
  NAV_SCROLL_THRESHOLD,
} from '@/lib/nav-constants'

// ── Component ─────────────────────────────────────────────────

export default function Navbar() {
  // ── Refs ────────────────────────────────────────────────────
  const leftWrapRef = useRef<HTMLDivElement>(null)
  const rightWrapRef = useRef<HTMLDivElement>(null)

  /*
   * megaMenuRef — absolutely positioned inside the fixed header.
   * It overlays the SAME coordinate space as the expanded Left Island
   * bg layer, making the content appear to live inside the panel.
   *
   * pointer-events on the container stays 'none' permanently so
   * the Right Island (a sibling) always intercepts its own clicks.
   * The NavMegaMenu inner grid re-enables pointer-events internally.
   */
  const megaMenuRef = useRef<HTMLDivElement>(null)

  // ── State ───────────────────────────────────────────────────
  const [isExpanded, setIsExpanded] = useState(false)

  // ── Refs for stale-closure–free callbacks ───────────────────
  const isHiddenRef = useRef(false)
  const isExpandedRef = useRef(false)

  useEffect(() => { isExpandedRef.current = isExpanded }, [isExpanded])

  const lenis = useLenis()

  // ── Slide islands off-screen ────────────────────────────────
  const hideIslands = useCallback(() => {
    if (isHiddenRef.current) return
    isHiddenRef.current = true
    gsap.to(leftWrapRef.current, { x: '-160%', duration: 0.65, ease: 'power3.inOut' })
    gsap.to(rightWrapRef.current, { x: '160%', duration: 0.65, ease: 'power3.inOut' })
  }, [])

  // ── Slide islands back into view ────────────────────────────
  const showIslands = useCallback(() => {
    if (!isHiddenRef.current) return
    isHiddenRef.current = false
    gsap.to(leftWrapRef.current, { x: '0%', duration: 0.6, ease: 'power3.out' })
    gsap.to(rightWrapRef.current, { x: '0%', duration: 0.6, ease: 'power3.out' })
  }, [])

  // ── Collapse (shared: scroll, outside-click, etc.) ──────────
  // justCollapsedRef gives a 600ms grace window after a scroll-triggered
  // collapse so the islands don't immediately slide away.
  const justCollapsedRef = useRef(false)
  const collapseMenu = useCallback(() => {
    setIsExpanded(false)
    justCollapsedRef.current = true
    window.setTimeout(() => { justCollapsedRef.current = false }, 600)
  }, [])

  // ── Lenis scroll listener ───────────────────────────────────
  useEffect(() => {
    if (!lenis) return

    const onScroll = () => {
      const scroll = lenis.scroll
      const direction = lenis.direction

      if (isExpandedRef.current) {
        collapseMenu()
        return  // scroll continues freely; collapse animation plays in NavIslandLeft
      }

      if (scroll > NAV_SCROLL_THRESHOLD && direction === 1 && !justCollapsedRef.current) {
        hideIslands()
      } else if (direction === -1) {
        showIslands()
      } else if (scroll < 40) {
        showIslands()
      }
    }

    lenis.on('scroll', onScroll)
    return () => lenis.off('scroll', onScroll)
  }, [lenis, hideIslands, showIslands, collapseMenu])

  // ── Mega menu container fade ────────────────────────────────
  useEffect(() => {
    const mm = megaMenuRef.current
    if (!mm) return

    if (isExpanded) {
      // Fade in after the Left Island bg scale has started (0.48s offset).
      // overwrite:true kills any in-flight collapse tween before expanding.
      gsap.to(mm, {
        opacity: 1,
        duration: 0.35,
        delay: 0.48,
        ease: 'power2.out',
        overwrite: true,
      })
    } else {
      gsap.to(mm, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        overwrite: true,
      })
    }
  }, [isExpanded])

  // ── Click-outside collapse ──────────────────────────────────
  useEffect(() => {
    if (!isExpanded) return

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node
      const insideLeft = leftWrapRef.current?.contains(target) ?? false
      const insideRight = rightWrapRef.current?.contains(target) ?? false
      const insideMega = megaMenuRef.current?.contains(target) ?? false

      if (!insideLeft && !insideRight && !insideMega) {
        collapseMenu()
      }
    }

    // Delay attachment so the same click that opened the menu
    // does not immediately close it.
    const timer = window.setTimeout(
      () => document.addEventListener('click', handleOutsideClick),
      150,
    )

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [isExpanded, collapseMenu])

  // ── Toggle handler ──────────────────────────────────────────
  const handleToggle = useCallback(() => setIsExpanded(prev => !prev), [])

  // ── Render ───────────────────────────────────────────────────
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        paddingTop: `${NAV_TOP}px`,
        paddingLeft: `${NAV_EDGE_MARGIN}px`,
        paddingRight: `${NAV_EDGE_MARGIN}px`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        // Header itself is click-through; islands + mega menu re-enable
        pointerEvents: 'none',
      }}
    >
      {/* ── Left Island ────────────────────────────────────── */}
      {/* No wrapper zIndex here! We let NavIslandLeft's internal layers
           participate in the header's stacking context so panelBgRef
           can sit BELOW megaMenuRef while the logo stays ABOVE. */}
      <div ref={leftWrapRef} style={{ pointerEvents: 'auto', position: 'relative' }}>
        <NavIslandLeft isExpanded={isExpanded} onToggle={handleToggle} />
      </div>

      {/* ── Right Island ───────────────────────────────────── */}
      <div ref={rightWrapRef} style={{ pointerEvents: 'auto', position: 'relative' }}>
        <NavIslandRight isExpanded={isExpanded} />
      </div>

      {/*
       * ── Mega Menu Container ─────────────────────────────
       *
       * position: absolute inside position: fixed header →
       *   top / left / right are relative to the header's
       *   border-box, which starts at the viewport origin (0,0).
       *
       * So  top: NAV_TOP (28px)   → viewport y = 28px  ✓  (matches islands)
       *     left: NAV_EDGE_MARGIN → viewport x = 40px  ✓
       *     right: NAV_EDGE_MARGIN → right edge at window.innerWidth - 40px  ✓
       *
       * pointer-events: none (permanent) keeps the Right Island
       * always reachable. NavMegaMenu re-enables internally.
       *
       * zIndex: 1 → paints below the island wrappers (zIndex: 2).
       * This ensures the islands always render above the content grid.
       */}
      <div
        ref={megaMenuRef}
        style={{
          position: 'absolute',
          top: `${NAV_TOP}px`,
          left: `${NAV_EDGE_MARGIN}px`,
          right: `${NAV_EDGE_MARGIN}px`,
          height: `${NAV_EXPANDED_HEIGHT}px`,
          // Transparent — panelBgRef inside NavIslandLeft owns the background,
          // border, shadow, and blur. This is a content-only container.
          overflow: 'hidden',
          borderRadius: 26,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <NavMegaMenu isExpanded={isExpanded} />
      </div>
    </header>
  )
}

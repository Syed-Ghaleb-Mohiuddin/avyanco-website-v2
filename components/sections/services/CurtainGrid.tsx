'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CURTAIN_TRACKS } from '@/lib/constants'
import type { CurtainTrack, CurtainContentCard } from '@/lib/constants'

// ── Card geometry (must match CSS tokens) ─────────────────────────────────────
// UAE/Singapore: lg(440)+gap(8)+sm(240)+gap(8)+md(340)+gap(8)+country(180) = 1224px
const TALLEST_TRACK_H = 1224
const COUNTRY_CARD_H = 180

// ── Per-track parallax extra y ────────────────────────────────────────────────
// Outer tracks gain a small upward boost over the section scroll span.
// Amplifies the natural U-valley created by track height differences.
// Kept at ±30px max so the gap between track bottoms and content stays minimal.
const PARALLAX_Y: Record<number, number> = {
  0: -30,  // UAE       — outer-left, fastest
  1: -20,  // Saudi
  2: -10,  // BVI
  3: 0,  // Cayman    — center, base speed (map highlighted/hidden last)
  4: -10,  // Mauritius
  5: -20,  // HK
  6: -30,  // Singapore — outer-right, fastest
}

// ── Rich Content Card ─────────────────────────────────────────────────────────

function ContentCard({ card }: { card: CurtainContentCard }) {
  return (
    <div className={`curtain__card curtain__card--kw curtain__card--${card.size}`}>
      <div className="curtain__kw-content">
        {card.type === 'trust' && <span className="curtain__kw-type-trust">{card.content}</span>}
        {card.type === 'metric' && <span className="curtain__kw-type-metric">{card.content}</span>}
        {card.type === 'flag' && <span className="curtain__kw-type-flag" aria-hidden="true">{card.content}</span>}
        {card.type === 'keyword' && <span className="curtain__kw-type-kw">{card.content}</span>}
        {card.subtext && <span className="curtain__kw-subtext">{card.subtext}</span>}
      </div>
    </div>
  )
}

// ── Country Card ──────────────────────────────────────────────────────────────

interface CountryCardProps {
  track: CurtainTrack
  isActive: boolean
  onClick: () => void
}

function CountryCard({ track, isActive, onClick }: CountryCardProps) {
  return (
    <button
      className={`curtain__card curtain__card--country ${isActive ? 'is-active' : ''}`}
      data-country-id={track.countryId}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <span className="curtain__country-flag" aria-hidden="true">{track.flag}</span>
      <span className="curtain__country-short">{track.countryShort}</span>
      <span className="curtain__country-label">{track.countryLabel}</span>
    </button>
  )
}

// ── CurtainGrid ───────────────────────────────────────────────────────────────
//
// ARCHITECTURE:
//  The curtain lives in normal document flow. Since hero is position:sticky,
//  the services section rises naturally over it as the user scrolls — no GSAP
//  is needed for the basic upward lift.
//
//  The natural U-valley comes from track HEIGHT differences (align-items:flex-end):
//    UAE/Singapore (1224px) → top at 0px   — appear first
//    Saudi/HK      ( 976px) → top at 248px
//    BVI/Mauritius ( 876px) → top at 348px
//    Cayman        ( 528px) → top at 696px — appears last, hero map hidden last ✓
//
//  GSAP adds two scroll-driven layers on top of this:
//  1. Per-track parallax: subtle extra y per track, amplifies the U-valley.
interface CurtainGridProps {
  sectionRef: React.RefObject<HTMLElement | null>
  onCountryChange?: (countryId: string) => void
}

export default function CurtainGrid({ sectionRef, onCountryChange }: CurtainGridProps) {
  const curtainRef = useRef<HTMLDivElement>(null)
  const trackRefs = useRef<(HTMLDivElement | null)[]>([])

  const navRef = useRef<HTMLDivElement>(null)
  const navRefs = useRef<(HTMLDivElement | null)[]>([])

  // Phase 5: Dynamic state
  const [activeCountryId, setActiveCountryId] = useState<string>('cayman')
  // Ref keeps the live value accessible inside GSAP callbacks (closures capture stale state)
  const activeCountryRef = useRef<string>('cayman')

  // Bubble up selection to parent (Services content)
  useEffect(() => {
    activeCountryRef.current = activeCountryId
    if (onCountryChange) onCountryChange(activeCountryId)
  }, [activeCountryId, onCountryChange])

  // Handle click — must target the same navTrack divs that GSAP is animating flexGrow on.
  // overwrite: true kills the active scrub so CSS/React state can take over cleanly.
  const handleCountryClick = (id: string, index: number) => {
    setActiveCountryId(id)

    const tracks = navRefs.current.filter(Boolean) as HTMLElement[]
    if (tracks.length > 0) {
      gsap.to(tracks, {
        flexGrow: (i) => (i === index ? 4 : 0.5),
        duration: 0.6,
        ease: 'power3.out',
        overwrite: true,
      })
    }
  }

  useEffect(() => {
    const section = sectionRef.current
    const curtain = curtainRef.current
    const tracks = trackRefs.current as HTMLDivElement[]
    const nav = navRef.current
    const navTr = navRefs.current as HTMLDivElement[]

    if (!section || tracks.some((t) => !t) || navTr.some((n) => !n)) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {

      // ── 1. Parallax Convergence Rise (0 - 120vh) ─────────────────────────────────────────────
      // Both the glass track layer and the sticky nav layer animate simultaneously.
      // We animate them FROM variable bottom offsets TO strict y:0 convergence.
      const navContainer = navRef.current
      if (!navContainer) return

      for (let i = 0; i < 7; i++) {
        const glassTracker = trackRefs.current[i]
        const navTracker = navRefs.current[i]

        if (glassTracker && navTracker) {
          // PARALLAX_Y is e.g. [-30, -20, -10, 0]. We abs() and multiply by 10 to get [300, 200, 100, 0].
          // Outer tracks start pushed down further, so they rise faster to reach 0 at the same time.
          const initialParallaxStart = Math.abs(PARALLAX_Y[i] || 0) * 10

          gsap.from([glassTracker, navTracker], {
            y: initialParallaxStart,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              // Start the parallax rise exactly when the section enters the bottom of the monitor
              start: 'top bottom',
              // Resolve parallax precisely to 0 exactly when the navbar hits the ceiling
              endTrigger: navContainer,
              end: 'top top',
              scrub: 1.2,
            }
          })
        }
      }

      // ── 2. The Anchor & Accordion Shrink (120vh - 140vh) ──────────────────────────────────────────────
      // Now that the cards converged at y:0, the sticky CSS catches them securely.
      // We trigger the accordion shrink and initial expansion with GSAP scrub so they
      // animate reliably on first approach (CSS transition has no "from" state on initial lock).
      const countryCards = gsap.utils.toArray('.curtain__card--country') as HTMLElement[]
      const navTracks = navRefs.current.filter(Boolean) as HTMLElement[]

      if (countryCards.length > 0 && navTracks.length > 0) {
        // Height collapse over 20vh — untouched
        gsap.to(countryCards, {
          height: 84,
          ease: 'none',
          scrollTrigger: {
            trigger: navContainer,
            start: 'top top',
            end: `+=${window.innerHeight * 0.2}`,
            scrub: 1.2,
          },
        })

        // Accordion expansion — driven imperatively via onEnter/onEnterBack so it always
        // reads activeCountryRef.current (live ref, never a stale closure).
        // onLeaveBack resets widths ONLY — state is preserved so re-entry expands the correct country.
        const applyExpansion = () => {
          const activeIdx = CURTAIN_TRACKS.findIndex((t) => t.countryId === activeCountryRef.current)
          gsap.to(navTracks, {
            flexGrow: (i) => (i === activeIdx ? 4 : 0.5),
            duration: 0.55,
            ease: 'power2.out',
            overwrite: true,
          })
        }

        ScrollTrigger.create({
          trigger: navContainer,
          start: 'top top',
          end: `+=${window.innerHeight * 3}`,
          toggleClass: { targets: navContainer, className: 'is-accordion-locked' },
          onEnter: applyExpansion,
          onEnterBack: applyExpansion,
          onLeaveBack: () => {
            // Reset widths to equal — do NOT touch state, user's selection is preserved
            gsap.to(navTracks, {
              flexGrow: 1,
              duration: 0.4,
              ease: 'power2.inOut',
              overwrite: true,
            })
          },
        })
      }

    }, section)

    return () => ctx.revert()
  }, [sectionRef])

  return (
    <>
      {/* ── Layer 1: Glass Curtain ── */}
      {/* overflow:hidden clips the GSAP-pushed outer tracks at the glass layer's natural
          document-flow boundary, preventing them from visually bleeding into the sticky nav zone. */}
      <div ref={curtainRef} className="curtain curtain--glass-layer" style={{ overflow: 'hidden' }}>
        <div className="curtain__tracks">
          {CURTAIN_TRACKS.map((track, idx) => (
            <div
              key={track.countryId}
              ref={(el) => { trackRefs.current[idx] = el }}
              className="curtain__track"
            >
              {track.upperCards.map((card) => (
                <ContentCard key={card.id} card={card} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Layer 2: The Anchor Row (Sticky Navbar) ── */}
      {/* Uses native CSS to lock securely to the viewport ceiling. */}
      <div
        ref={navRef}
        className="curtain-navbar-wrapper"
        style={{ position: 'sticky', top: 0, zIndex: 10 }}
      >
        {/* Fog gradient — TEMPORARILY commented out for overlap diagnosis */}
        {/* <div
          className="curtain-navbar-fog"
          style={{
            position: 'absolute',
            left: 0, right: 0, bottom: '100%', height: '20vh',
            background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: -1
          }}
        /> */}

        <div className="curtain__tracks" style={{ alignItems: 'flex-start' }}>
          {CURTAIN_TRACKS.map((track, idx) => (
            <div
              key={track.countryId}
              ref={(el) => { navRefs.current[idx] = el }}
              className="curtain__track"
              data-active={activeCountryId === track.countryId ? 'true' : 'false'}
            >
              <CountryCard
                track={track}
                isActive={activeCountryId === track.countryId}
                onClick={() => handleCountryClick(track.countryId, idx)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

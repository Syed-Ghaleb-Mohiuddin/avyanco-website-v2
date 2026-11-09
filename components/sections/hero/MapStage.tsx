'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import ServiceLabel from './ServiceLabel'

interface MapStageProps {
  mapFile: string
  primaryService: string
  labelOffset?: { x: string; y: string }
  onCycleComplete: () => void
}

interface SvgData {
  d: string
  viewBox: string
}

function parseSvg(text: string): SvgData | null {
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'image/svg+xml')

  const svgEls = doc.querySelectorAll('svg')
  const mainSvg = svgEls[svgEls.length - 1] || doc.querySelector('svg')

  const paths = Array.from(doc.querySelectorAll('path'))
  const pathEl = paths.sort((a, b) => {
    return (b.getAttribute('d')?.length || 0) - (a.getAttribute('d')?.length || 0)
  })[0]

  if (!mainSvg || !pathEl) return null

  return {
    d: pathEl.getAttribute('d') ?? '',
    viewBox: mainSvg.getAttribute('viewBox') ?? '0 0 1000 1000',
  }
}

export default function MapStage({ mapFile, primaryService, labelOffset, onCycleComplete }: MapStageProps) {
  const [svgData, setSvgData] = useState<SvgData | null>(null)

  const tiltRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  // Cursor parallax: all writes happen inside RAF — no state, no re-renders
  const mouseTarget = useRef({ x: 0, y: 0 })
  const mouseCurrent = useRef({ x: 0, y: 0 })
  const rafId = useRef<number>(0)

  // Base CSS tilt values — keep in sync with .hero__map-tilt in globals.css
  const BASE_ROTATE_X = 40
  const BASE_ROTATE_Y = 0
  // Parallax range added on top of base
  const MAX_X = 8   // ±8deg rotateX from mouse
  const MAX_Y = 12  // ±12deg rotateY from mouse

  // Keep latest onCycleComplete without triggering effect re-runs
  const onCompleteRef = useRef(onCycleComplete)
  useEffect(() => {
    onCompleteRef.current = onCycleComplete
  }, [onCycleComplete])

  // ── Phase 6: Cursor Parallax Tilt ───────────────────────────
  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const onMouseMove = (e: MouseEvent) => {
      // Normalize to -1 → +1 across the full viewport
      mouseTarget.current.x = (e.clientY / window.innerHeight) * 2 - 1  // top→bottom drives rotateX
      mouseTarget.current.y = (e.clientX / window.innerWidth) * 2 - 1   // left→right drives rotateY
    }

    const animate = () => {
      const cur = mouseCurrent.current
      const tgt = mouseTarget.current

      // Smooth lerp — factor 0.06 = buttery, never snappy
      cur.x = lerp(cur.x, tgt.x, 0.06)
      cur.y = lerp(cur.y, tgt.y, 0.06)

      const rx = BASE_ROTATE_X + cur.x * MAX_X
      const ry = BASE_ROTATE_Y + cur.y * MAX_Y

      if (tiltRef.current) {
        // Single transform write per frame — no layout reads
        tiltRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
      }

      rafId.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId.current)
    }
  }, []) // runs once — refs are stable

  // 1. Fetch file when mapFile changes
  useEffect(() => {
    let cancelled = false

    fetch(`/maps/${mapFile}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`)
        return r.text()
      })
      .then((text) => {
        if (cancelled) return
        const parsed = parseSvg(text)
        if (parsed) {
          setSvgData(parsed)
        } else {
          onCompleteRef.current()
        }
      })
      .catch((e) => {
        console.warn(`Could not load /maps/${mapFile}:`, e)
        if (!cancelled) onCompleteRef.current()
      })

    return () => {
      cancelled = true
    }
  }, [mapFile])

  // 2. Animate path when it renders
  useEffect(() => {
    const path = pathRef.current
    const container = containerRef.current
    if (!path || !container || !svgData) return

    // Auto-crop the SVG to perfectly frame whatever path was extracted
    // This solves the Mapchart issue where the paths are tiny inside a massive empty grid
    const bbox = path.getBBox()
    const paddingX = bbox.width * 0.08
    const paddingY = bbox.height * 0.08
    const newViewBox = `${bbox.x - paddingX} ${bbox.y - paddingY} ${bbox.width + paddingX * 2} ${bbox.height + paddingY * 2}`

    // Target the parent SVG element and seamlessly snap its viewport to tight-fit the country
    const parentSvg = path.ownerSVGElement
    if (parentSvg) {
      parentSvg.setAttribute('viewBox', newViewBox)
    }

    // Calculate length
    const totalLength = path.getTotalLength()

    // Setup initial state
    gsap.set(path, {
      strokeDasharray: totalLength,
      strokeDashoffset: totalLength,
    })

    const tl = gsap.timeline({
      onComplete: () => {
        // Clear data so we don't re-animate the old path before new fetch
        setSvgData(null)
        onCompleteRef.current()
      }
    })

    // Draw phase (4s)
    tl.to(path, {
      strokeDashoffset: 0,
      duration: 4,
      ease: 'power2.inOut',
    })

    // Label rises up exactly when draw finishes
    tl.fromTo(labelRef.current,
      { clipPath: 'inset(100% 0 0 0)', y: 20 },
      { clipPath: 'inset(0% 0 0 0)', y: 0, duration: 0.8, ease: 'power3.out' },
      4 // precise seconds insert: exactly at the end of draw
    )

    // Wait until 1.5s passes holding, then label drops down
    tl.to(labelRef.current, {
      clipPath: 'inset(100% 0 0 0)',
      y: 20,
      duration: 0.6,
      ease: 'power3.inOut'
    }, '+=1.5')

    // Retrace phase (2s) runs exactly right after label drops down
    tl.to(path, {
      strokeDashoffset: totalLength,
      duration: 2,
      ease: 'power2.inOut',
    }, '>')

    // IntersectionObserver to pause/play timeline when off-screen
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tl.play()
        } else {
          tl.pause()
        }
      })
    }, { threshold: 0.1 })

    observer.observe(container)

    return () => {
      observer.disconnect()
      tl.kill()
    }
  }, [svgData])

  return (
    <div ref={containerRef} className="hero__map-stage" aria-hidden="true">
      <div ref={tiltRef} className="hero__map-tilt">
        <svg
          className="hero__map-svg"
          viewBox={svgData?.viewBox ?? '0 0 1000 1000'}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          {svgData?.d && (
            <path
              ref={pathRef}
              d={svgData.d}
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {/* Service text perfectly synced to the timeline inside the tilted staging area */}
        <ServiceLabel ref={labelRef} text={primaryService} offset={labelOffset} />
      </div>
    </div>
  )
}

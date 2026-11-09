// ═══════════════════════════════════════════════════════════
// SMOOTH SCROLL PROVIDER
// Syncs Lenis with GSAP ticker.
// Wrap the entire app in this — once, in layout.tsx.
// Never instantiate Lenis anywhere else.
// ═══════════════════════════════════════════════════════════

'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

// ── LENIS CONTEXT ────────────────────────────────────────────
// Stored in state (not just a ref) so consumers re-render
// once the Lenis instance becomes available after mount.

const LenisContext = createContext<Lenis | null>(null)

export function useLenis(): Lenis | null {
    return useContext(LenisContext)
}

// ── PROVIDER ─────────────────────────────────────────────────

export default function SmoothScrollProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const lenisRef = useRef<Lenis | null>(null)
    const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null)

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        })

        lenisRef.current = lenis
        setLenisInstance(lenis)

        // Sync Lenis scroll with ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update)

        // Sync Lenis with GSAP ticker — critical for smooth animations
        const tickerHandler = (time: number) => {
            lenis.raf(time * 1000)
        }

        gsap.ticker.add(tickerHandler)
        gsap.ticker.lagSmoothing(0)

        return () => {
            gsap.ticker.remove(tickerHandler)
            lenis.destroy()
            lenisRef.current = null
            setLenisInstance(null)
        }
    }, [])

    return (
        <LenisContext.Provider value={lenisInstance}>
            {children}
        </LenisContext.Provider>
    )
}
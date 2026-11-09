// ═══════════════════════════════════════════════════════════
// NAV COUNTRIES PANEL  (Phase 4)
// Asymmetric layout:
//   - UAE: tall feature card on the left (premium navy gradient)
//   - 6 others: 3 × 2 compact grid on the right
//
// Countries shown: UAE, Saudi, BVI, Cayman, Mauritius, HK, Singapore
// ═══════════════════════════════════════════════════════════

'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { COUNTRIES } from '@/lib/constants'

// ── Filter to the 7 active jurisdictions ───────────────────────
const ACTIVE_IDS   = ['uae', 'saudi', 'bvi', 'cayman', 'mauritius', 'hongkong', 'singapore'] as const
const PANEL_COUNTRIES = ACTIVE_IDS.map(id => COUNTRIES.find(c => c.id === id)!).filter(Boolean)
const FEATURED     = PANEL_COUNTRIES[0]   // UAE
const GRID_COUNTRIES = PANEL_COUNTRIES.slice(1)  // 6 remaining

// ── Component ─────────────────────────────────────────────────
export default function NavCountriesPanel() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '14px',
        height: '100%',
        overflow: 'hidden',   // clip cards at right-column boundary
        animation: 'nav-fade-up 0.22s ease forwards',
      }}
    >

      {/* ── UAE featured card ──────────────────────────────── */}
      <Link
        href={`/countries/${FEATURED.id}`}
        style={{
          width: '210px',
          flexShrink: 0,
          borderRadius: '16px',
          background: 'linear-gradient(155deg, #091830 0%, #1240B0 60%, #1B4FD8 100%)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 200ms ease, box-shadow 200ms ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(-2px)'
          el.style.boxShadow = '0 16px 40px rgba(10, 15, 40, 0.22)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Decorative ambient glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'rgba(27, 79, 216, 0.45)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        {/* Flag */}
        <span style={{ fontSize: '2.4rem', lineHeight: 1 }}>
          {FEATURED.flag}
        </span>

        {/* Country info — pushed to the bottom */}
        <div style={{ marginTop: 'auto' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '4px',
            }}
          >
            {FEATURED.short}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.02em',
              marginBottom: '10px',
            }}
          >
            {FEATURED.name}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.60)',
              lineHeight: 1.5,
              marginBottom: '16px',
            }}
          >
            {FEATURED.description}
          </p>

          {/* Explore CTA */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.90)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Explore <ArrowRight size={10} />
          </div>
        </div>
      </Link>

      {/* ── 6-country grid: 3 columns × 2 rows ─────────────── */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: '10px',
        }}
      >
        {GRID_COUNTRIES.map(country => (
          <Link
            key={country.id}
            href={`/countries/${country.id}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(10, 15, 26, 0.07)',
              textDecoration: 'none',
              transition: 'background 180ms ease, border-color 180ms ease, transform 180ms ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(27, 79, 216, 0.07)'
              el.style.borderColor = 'rgba(27, 79, 216, 0.20)'
              el.style.transform   = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background   = 'rgba(255,255,255,0.65)'
              el.style.borderColor  = 'rgba(10, 15, 26, 0.07)'
              el.style.transform    = 'translateY(0)'
            }}
          >
            {/* Top: flag + short name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{country.flag}</span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                }}
              >
                {country.short}
              </span>
            </div>

            {/* Bottom: service label + full name */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'var(--teal-600)',
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  marginBottom: '2px',
                }}
              >
                {country.primaryService}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '11px',
                  color: 'var(--text-subtle)',
                  lineHeight: 1.35,
                }}
              >
                {country.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

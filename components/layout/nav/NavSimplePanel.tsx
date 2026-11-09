// ═══════════════════════════════════════════════════════════
// NAV SIMPLE PANEL  (Phase 4)
// Reusable right-column panel for: About, Insights, Contact,
// and Calculator. Reads from NAV_CONTEXTUAL_CARDS data.
//
// About    → heading + description + 4 key stats + CTA
// Insights → heading + description + CTA
// Contact  → heading + description + office pills + CTA
// Calculator → custom conversion-focused card
// ═══════════════════════════════════════════════════════════

'use client'

import Link from 'next/link'
import { ArrowRight, Calculator } from 'lucide-react'
import { NAV_CONTEXTUAL_CARDS } from '@/lib/constants'
import { WHY_PANEL_STATS } from '@/lib/constants/why'

// ── Types ──────────────────────────────────────────────────────
type SimplePanelCategory = 'about' | 'insights' | 'contact' | 'calculator'

interface NavSimplePanelProps {
  category: SimplePanelCategory
}

// ── Shared CTA button style helper ────────────────────────────
const ctaStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 20px',
  borderRadius: '9999px',
  background: 'var(--blue-600)',
  color: '#ffffff',
  fontFamily: 'var(--font-ui)',
  fontSize: 'var(--text-sm)',
  fontWeight: 600,
  textDecoration: 'none',
  alignSelf: 'flex-start',
  transition: 'background 180ms ease',
}

// ── Component ─────────────────────────────────────────────────
export default function NavSimplePanel({ category }: NavSimplePanelProps) {
  const panelAnim: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    animation: 'nav-fade-up 0.22s ease forwards',
  }

  // ── Calculator ────────────────────────────────────────────────
  if (category === 'calculator') {
    return (
      <div style={panelAnim}>
        <div
          style={{
            padding: '28px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(27,79,216,0.06) 0%, rgba(6,182,212,0.04) 100%)',
            border: '1px solid rgba(27, 79, 216, 0.12)',
            maxWidth: '400px',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'var(--blue-50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <Calculator size={20} style={{ color: 'var(--blue-600)' }} />
          </div>

          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '10px',
            }}
          >
            Calculate Your Cost
          </p>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              lineHeight: 1.65,
              marginBottom: '24px',
            }}
          >
            Get an instant, tailored estimate for company formation across any of our jurisdictions. No commitment required.
          </p>

          <Link
            href="/calculator"
            style={ctaStyle}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--blue-700)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--blue-600)' }}
          >
            Get Instant Estimate <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    )
  }

  // ── About / Insights / Contact ─────────────────────────────
  const card = NAV_CONTEXTUAL_CARDS[category]

  return (
    <div style={panelAnim}>
      {/* Heading */}
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          marginBottom: '12px',
          maxWidth: '340px',
        }}
      >
        {card.label}
      </p>

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          lineHeight: 1.65,
          marginBottom: '24px',
          maxWidth: '380px',
        }}
      >
        {card.description}
      </p>

      {/* ── About: 4 key stats ─────────────────────────────── */}
      {category === 'about' && (
        <div
          style={{
            display: 'flex',
            gap: '28px',
            padding: '16px 0',
            borderTop: '1px solid rgba(10, 15, 26, 0.07)',
            borderBottom: '1px solid rgba(10, 15, 26, 0.07)',
            marginBottom: '24px',
          }}
        >
          {WHY_PANEL_STATS.map(stat => (
            <div key={stat.id}>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '10px',
                  color: 'var(--text-subtle)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginTop: '3px',
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Contact: office city pills ─────────────────────── */}
      {category === 'contact' && (
        <div
          style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}
        >
          {['🇦🇪 Dubai', '🇸🇦 Riyadh', '🇸🇬 Singapore'].map(city => (
            <span
              key={city}
              style={{
                padding: '5px 14px',
                borderRadius: '9999px',
                background: 'rgba(27, 79, 216, 0.07)',
                color: 'var(--blue-700)',
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              {city}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <Link
        href={card.href}
        style={ctaStyle}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--blue-700)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--blue-600)' }}
      >
        {card.cta} <ArrowRight size={14} />
      </Link>
    </div>
  )
}

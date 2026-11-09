// ═══════════════════════════════════════════════════════════
// NAV SERVICES PANEL
//
// Tab row:  numbered segments, hover-activated, with a 2px
//           sliding underline indicator (CSS transition, no GSAP).
//
// Service cards: 2-column icon-accent grid (Option B).
//   Each card: category-coloured accent badge (dot inside rounded
//   square) + service name + micro-label tag + arrow.
//   Accent colours are explicit rgba — CSS vars can't be used
//   in JS color values passed to inline style strings.
// ═══════════════════════════════════════════════════════════

'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'

// ── Types ──────────────────────────────────────────────────────
type ServiceItem     = { id: string; label: string }
type ServiceCategory = { id: string; label: string; items: ReadonlyArray<ServiceItem> }

const SERVICES = NAV_ITEMS[0].categories as ServiceCategory[]

// ── Category accent palette (explicit rgba, not CSS vars) ──────
const CATEGORY_COLORS: Record<string, { bg: string; dot: string }> = {
  'business-setup':     { bg: 'rgba(27,79,216,0.09)',  dot: '#1B4FD8' },
  'corporate-services': { bg: 'rgba(59,130,246,0.09)', dot: '#3B82F6' },
  'finance-accounting': { bg: 'rgba(6,182,212,0.09)',  dot: '#06B6D4' },
  'tax-compliance':     { bg: 'rgba(30,64,175,0.09)',  dot: '#1E40AF' },
  'legal-advisory':     { bg: 'rgba(96,165,250,0.09)', dot: '#60A5FA' },
  'workspace':          { bg: 'rgba(8,145,178,0.09)',  dot: '#0891B2' },
}

// ── Per-item micro-label ───────────────────────────────────────
const ITEM_TAGS: Record<string, string> = {
  'company-formation':  'Formation',
  'liquidation':        'Closure',
  'license-renewal':    'Renewal',
  'visa-services':      'Immigration',
  'bank-account':       'Banking',
  'bank-solutions':     'Banking',
  'pro-services':       'Government',
  'document-clearing':  'Documents',
  'accounting':         'Finance',
  'bookkeeping':        'Finance',
  'internal-audit':     'Audit',
  'external-audit':     'Audit',
  'corporate-tax':      'Tax',
  'vat':                'VAT',
  'ubo':                'Compliance',
  'aml':                'Compliance',
  'trademark':          'IP',
  'consulting':         'Advisory',
  'hot-desk':           'Workspace',
  'event-space':        'Events',
  'private-office':     'Office',
  'meeting-rooms':      'Meetings',
}

// ── Component ─────────────────────────────────────────────────
export default function NavServicesPanel() {
  const [activeTab, setActiveTab] = useState(SERVICES[0].id)
  const switchCount = useRef(0)

  const handleTab = useCallback((id: string) => {
    if (id === activeTab) return
    switchCount.current += 1
    setActiveTab(id)
  }, [activeTab])

  const activeCategory = SERVICES.find(s => s.id === activeTab)!
  const activeIndex    = SERVICES.findIndex(s => s.id === activeTab)
  const segW           = 100 / SERVICES.length
  const colors         = CATEGORY_COLORS[activeTab] ?? CATEGORY_COLORS['business-setup']

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        animation: 'nav-fade-up 0.22s ease forwards',
      }}
    >

      {/* ── Tab row with sliding underline ─────────────────── */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          borderBottom: '1px solid rgba(10,15,26,0.08)',
          marginBottom: '20px',
          flexShrink: 0,
        }}
      >
        {SERVICES.map((cat, i) => {
          const isActive = cat.id === activeTab
          return (
            <button
              key={cat.id}
              onMouseEnter={() => handleTab(cat.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                paddingBottom: '11px',
                paddingRight: i < SERVICES.length - 1 ? '12px' : 0,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                outline: 'none',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '9px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  color: isActive ? 'var(--blue-500)' : 'var(--text-subtle)',
                  marginBottom: '3px',
                  textTransform: 'uppercase',
                  transition: 'color 180ms ease',
                  display: 'block',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '-0.01em',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  transition: 'color 180ms ease',
                  display: 'block',
                }}
              >
                {cat.label}
              </span>
            </button>
          )
        })}

        {/* Sliding indicator — pure CSS transition, no GSAP */}
        <div
          style={{
            position:   'absolute',
            bottom:     0,
            left:       `${activeIndex * segW}%`,
            width:      `${segW}%`,
            height:     '2px',
            background: 'var(--blue-600)',
            borderRadius: '1px 1px 0 0',
            transition: 'left 220ms cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>

      {/* ── Service cards grid — Option B icon-accent design ── *
       * key forces remount on tab switch → fresh nav-fade-up.
       * Each card: accent badge (category dot) + name + micro-
       * label + arrow. Hover lifts with brand-blue border + shadow.
       */}
      <div
        key={`${activeTab}-${switchCount.current}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '7px',
          alignContent: 'start',
          flex: 1,
          overflow: 'hidden',
          animation: 'nav-fade-up 0.18s ease forwards',
        }}
      >
        {activeCategory.items.map(item => (
          <Link
            key={item.id}
            href={`/services/${item.id}`}
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '12px',
              padding:        '11px 14px',
              background:     'rgba(255,255,255,0.72)',
              border:         '1px solid rgba(10,15,26,0.07)',
              borderRadius:   '12px',
              textDecoration: 'none',
              transition:     'background 150ms ease, border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background  = '#ffffff'
              el.style.borderColor = 'rgba(27,79,216,0.18)'
              el.style.transform   = 'translateY(-1px)'
              el.style.boxShadow   = '0 4px 16px rgba(27,79,216,0.10)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background  = 'rgba(255,255,255,0.72)'
              el.style.borderColor = 'rgba(10,15,26,0.07)'
              el.style.transform   = 'translateY(0)'
              el.style.boxShadow   = 'none'
            }}
          >
            {/* Accent badge: category-coloured rounded square + dot */}
            <div
              aria-hidden="true"
              style={{
                width:          '30px',
                height:         '30px',
                borderRadius:   '8px',
                background:     colors.bg,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
              }}
            >
              <div
                style={{
                  width:        '6px',
                  height:       '6px',
                  borderRadius: '50%',
                  background:   colors.dot,
                }}
              />
            </div>

            {/* Service name + micro-label */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily:    'var(--font-display)',
                  fontSize:      '13px',
                  fontWeight:    500,
                  color:         'var(--text-primary)',
                  letterSpacing: '-0.01em',
                  lineHeight:    1.2,
                  whiteSpace:    'nowrap',
                  overflow:      'hidden',
                  textOverflow:  'ellipsis',
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily:    'var(--font-ui)',
                  fontSize:      '10px',
                  fontWeight:    500,
                  color:         'var(--text-subtle)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginTop:     '2px',
                }}
              >
                {ITEM_TAGS[item.id] ?? ''}
              </div>
            </div>

            {/* Arrow — category accent colour */}
            <ArrowUpRight
              size={12}
              aria-hidden="true"
              style={{ color: colors.dot, opacity: 0.35, flexShrink: 0 }}
            />
          </Link>
        ))}
      </div>

      {/* ── Category CTA ───────────────────────────────────── */}
      <Link
        href={`/services#${activeCategory.id}`}
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          gap:            '5px',
          marginTop:      '14px',
          flexShrink:     0,
          textDecoration: 'none',
          color:          'var(--blue-600)',
          fontFamily:     'var(--font-ui)',
          fontSize:       '11px',
          fontWeight:     600,
          letterSpacing:  '0.07em',
          textTransform:  'uppercase',
          transition:     'opacity 160ms ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.7' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
      >
        View all {activeCategory.label}
        <ArrowUpRight size={10} />
      </Link>
    </div>
  )
}

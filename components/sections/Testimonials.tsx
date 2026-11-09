'use client'

import { useEffect, useRef } from 'react'
import { TESTIMONIALS_DATA } from '@/lib/constants'
import type { Testimonial } from '@/lib/constants'

// ─────────────────────────────────────────────────────────────
// Single testimonial card
// ─────────────────────────────────────────────────────────────
function TestimonialCard({
  item,
  index,
}: {
  item: Testimonial
  index: number
}) {
  const cardRef = useRef<HTMLQuoteElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Staggered reveal based on card index
          setTimeout(() => {
            el.classList.add('is-visible')
          }, index * 90)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <blockquote
      ref={cardRef}
      className={`testimonial-card${item.featured ? ' testimonial-card--featured' : ''}`}
      aria-label={`Testimonial from ${item.name}, ${item.title} at ${item.company}`}
    >
      {/* Decorative large quote mark */}
      <span className="testimonial-card__glyph" aria-hidden="true">&ldquo;</span>

      <p className="testimonial-card__quote">{item.quote}</p>

      <footer className="testimonial-card__footer">
        {/* Initials avatar */}
        <div
          className="testimonial-card__avatar"
          style={{ background: item.accent }}
          aria-hidden="true"
        >
          <span>{item.initials}</span>
        </div>

        <div className="testimonial-card__meta">
          <cite className="testimonial-card__name">{item.name}</cite>
          <span className="testimonial-card__role">
            {item.title} · {item.company}
          </span>
          <span className="testimonial-card__region">{item.region}</span>
        </div>
      </footer>
    </blockquote>
  )
}

// ─────────────────────────────────────────────────────────────
// Section header — fades in on scroll
// ─────────────────────────────────────────────────────────────
function SectionHeader() {
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={headerRef} className="testimonials__header reveal-block">
      <p className="testimonials__eyebrow">{TESTIMONIALS_DATA.eyebrow}</p>
      <h2 className="testimonials__heading">{TESTIMONIALS_DATA.heading}</h2>
      <p className="testimonials__subheading">{TESTIMONIALS_DATA.subheading}</p>
      {/* Decorative rule */}
      <div className="testimonials__rule" aria-hidden="true" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────
export default function Testimonials() {
  const items = TESTIMONIALS_DATA.items as unknown as Testimonial[]
  const featured = items[0]
  const rest = items.slice(1)

  return (
    <section
      id="testimonials"
      className="testimonials-section"
      aria-label="Client testimonials"
    >
      {/* Decorative background grid lines */}
      <div className="testimonials__grid-lines" aria-hidden="true" />

      <div className="testimonials__inner">
        <SectionHeader />

        {/* Featured testimonial — full width, large */}
        <div className="testimonials__featured">
          <TestimonialCard item={featured} index={0} />
        </div>

        {/* 4-card 2×2 grid */}
        <div className="testimonials__grid">
          {rest.map((item, i) => (
            <TestimonialCard key={item.id} item={item} index={i + 1} />
          ))}
        </div>
      </div>

      {/* Bottom stat bar */}
      <div className="testimonials__stat-bar" aria-label="Trust statistics">
        {[
          { value: '#1', label: 'Ranked in the UAE' },
          { value: '708', label: 'Verified reviews' },
          { value: '4.8 / 5', label: 'Average client rating' },
          { value: 'Global', label: 'Jurisdictions' },
        ].map((s) => (
          <div key={s.label} className="testimonials__stat">
            <span className="testimonials__stat-value">{s.value}</span>
            <span className="testimonials__stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

'use client'

import { useRef, useEffect } from 'react'
import { CTA_DATA } from '@/lib/constants'

export default function CTA() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
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
    <section className="cta-section" aria-label="Call to Action">
      {/* Subtle institutional grid background */}
      <div className="cta__bg-grid" aria-hidden="true" />
      
      <div className="cta__inner">
        <div ref={containerRef} className="cta__card reveal-block-up">
          {/* Decorative architectural frame inside the card */}
          <div className="cta__card-frame" aria-hidden="true">
            <div className="cta__frame-corner cta__frame-corner--tl"></div>
            <div className="cta__frame-corner cta__frame-corner--tr"></div>
            <div className="cta__frame-corner cta__frame-corner--bl"></div>
            <div className="cta__frame-corner cta__frame-corner--br"></div>
          </div>

          <div className="cta__content">
            <p className="cta__eyebrow">{CTA_DATA.eyebrow}</p>
            <h2 className="cta__heading">{CTA_DATA.heading}</h2>
            <p className="cta__subheading">{CTA_DATA.subheading}</p>
            
            <div className="cta__actions">
              <button className="cta__btn cta__btn--primary">
                <span className="cta__btn-text">{CTA_DATA.primaryButton}</span>
                <span className="cta__btn-hover-fill"></span>
              </button>
              <button className="cta__btn cta__btn--secondary">
                <span className="cta__btn-text">{CTA_DATA.secondaryButton}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

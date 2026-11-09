'use client'

import { useRef, useEffect } from 'react'
import { FOOTER_DATA } from '@/lib/constants'

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <footer ref={footerRef} className="footer reveal-block-up" aria-label="Site Footer">
      {/* Massive subtle watermark in the background */}
      <div className="footer__watermark" aria-hidden="true">A</div>
      
      <div className="footer__inner">
        {/* Ornamental top line */}
        <div className="footer__ornament" aria-hidden="true">
          <div className="footer__ornament-line"></div>
          <div className="footer__ornament-diamond"></div>
          <div className="footer__ornament-line"></div>
        </div>

        <div className="footer__top">
          {/* Brand Column */}
          <div className="footer__brand-col">
            <div className="footer__logo-lockup">
              <img 
                src="/logo/avyanco_wordmark.svg" 
                alt="Avyanco" 
                className="footer__logo-image"
              />
            </div>
            <p className="footer__description">{FOOTER_DATA.brand.description}</p>
            <div className="footer__contact-info">
              <p>{FOOTER_DATA.brand.address}</p>
              <p><a href={`mailto:${FOOTER_DATA.brand.email}`}>{FOOTER_DATA.brand.email}</a></p>
              <p><a href={`tel:${FOOTER_DATA.brand.phone.replace(/\s+/g, '')}`}>{FOOTER_DATA.brand.phone}</a></p>
            </div>
          </div>

          {/* Links Columns */}
          <div className="footer__links-wrapper">
            {FOOTER_DATA.columns.map((col, index) => (
              <div key={index} className="footer__nav-col">
                <h4 className="footer__nav-title">{col.title}</h4>
                <ul className="footer__nav-list">
                  {col.links.map((link, idx) => (
                    <li key={idx}>
                      <a href={link.href} className="footer__nav-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__legal">
            <p className="footer__copyright">
              &copy; {new Date().getFullYear()} Avyanco Corporate Services. All rights reserved.
            </p>
            <ul className="footer__legal-links">
              {FOOTER_DATA.legal.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__socials">
            {FOOTER_DATA.socials.map((social, idx) => (
              <a key={idx} href={social.href} className="footer__social-link" aria-label={social.platform}>
                {social.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { FAQ_DATA } from '@/lib/constants'

function FAQItem({
  item,
  index,
  isOpen,
  onClick,
}: {
  item: typeof FAQ_DATA.items[number]
  index: number
  isOpen: boolean
  onClick: () => void
}) {
  const [isVisible, setIsVisible] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = itemRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 80)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <div
      ref={itemRef}
      className={`faq-item reveal-block-up ${isVisible ? 'is-visible' : ''} ${isOpen ? 'is-open' : ''}`}
    >
      <button
        className="faq-item__trigger"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="faq-item__question">{item.question}</span>
        <span className="faq-item__icon" aria-hidden="true">
          <span className="faq-item__icon-h"></span>
          <span className="faq-item__icon-v"></span>
        </span>
      </button>
      <div className="faq-item__content-wrapper">
        <div className="faq-item__content">
          <p className="faq-item__answer">{item.answer}</p>
        </div>
      </div>
    </div>
  )
}

function FAQHeader() {
  const [isVisible, setIsVisible] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={headerRef} className={`faq__header reveal-block-up ${isVisible ? 'is-visible' : ''}`}>
      <p className="faq__eyebrow">{FAQ_DATA.eyebrow}</p>
      <h2 className="faq__heading">{FAQ_DATA.heading}</h2>
      <p className="faq__subheading">{FAQ_DATA.subheading}</p>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0) // First open by default

  return (
    <section id="faq" className="faq-section" aria-label="Frequently Asked Questions">
      <div className="faq__inner">
        
        {/* Left Column: Heading */}
        <FAQHeader />

        {/* Right Column: Accordion */}
        <div className="faq__accordion">
          {FAQ_DATA.items.map((item, index) => (
            <FAQItem
              key={item.id}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}


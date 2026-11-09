import React, { forwardRef } from 'react'

interface ServiceLabelProps {
  text: string
  offset?: { x: string; y: string }
}

const ServiceLabel = forwardRef<HTMLDivElement, ServiceLabelProps>(
  ({ text, offset }, ref) => {
    const style = offset
      ? { transform: `translate(calc(-50% + ${offset.x}), calc(-50% + ${offset.y}))` }
      : undefined

    return (
      <div ref={ref} className="service-label" style={style} aria-hidden="true">
        <h2 className="service-label__text">{text}</h2>
      </div>
    )
  }
)

ServiceLabel.displayName = 'ServiceLabel'
export default ServiceLabel

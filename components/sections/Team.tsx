'use client'

import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import Image from 'next/image'
import { TEAM_DATA } from '@/lib/constants'
import type { TeamMember } from '@/lib/constants'

// ─────────────────────────────────────────────────────────────
// Layout — V-formation
// CEO (index 0) foreground-centre; 8 members fan back on each side.
// X in vw for full-width spread. Y offsets create depth levels.
// ─────────────────────────────────────────────────────────────
export interface PedestalLayout {
  x: string      // vw offset from centre
  finalY: string // GSAP y at rest — negative = up from bottom:0 anchor
  scale: number
  zIndex: number
  riseDelay: number
}

export const PEDESTAL_LAYOUT: PedestalLayout[] = [
  // CEO — foreground, highest, centre
  { x: '0vw',   finalY: '-38vh', scale: 1.00, zIndex: 9, riseDelay: 0.00 },
  // Near L / R
  { x: '-14vw', finalY: '-29vh', scale: 0.88, zIndex: 7, riseDelay: 0.07 },
  { x: '14vw',  finalY: '-29vh', scale: 0.88, zIndex: 7, riseDelay: 0.07 },
  // Mid L / R
  { x: '-27vw', finalY: '-21vh', scale: 0.78, zIndex: 5, riseDelay: 0.14 },
  { x: '27vw',  finalY: '-21vh', scale: 0.78, zIndex: 5, riseDelay: 0.14 },
  // Far L / R
  { x: '-38vw', finalY: '-14vh', scale: 0.70, zIndex: 3, riseDelay: 0.21 },
  { x: '38vw',  finalY: '-14vh', scale: 0.70, zIndex: 3, riseDelay: 0.21 },
  // Outer L / R
  { x: '-48vw', finalY: '-8vh',  scale: 0.63, zIndex: 1, riseDelay: 0.28 },
  { x: '48vw',  finalY: '-8vh',  scale: 0.63, zIndex: 1, riseDelay: 0.28 },
]

// ─────────────────────────────────────────────────────────────
// Imperative handle — exposes all DOM refs to the parent (why.tsx)
// so the single master GSAP context can target them directly.
// ─────────────────────────────────────────────────────────────
export interface TeamHandle {
  teamEl: HTMLDivElement | null
  spotlightEl: HTMLDivElement | null
  headlineEl: HTMLDivElement | null
  stageEl: HTMLDivElement | null
  radiantEl: HTMLDivElement | null
  memberEls: (HTMLDivElement | null)[]
  pedestalEls: (HTMLDivElement | null)[]
  labelEls: (HTMLDivElement | null)[]
}

// ─────────────────────────────────────────────────────────────
// Single member pedestal
// ─────────────────────────────────────────────────────────────
function PedestalMember({
  member,
  layout,
  memberRef,
  pedestalRef,
  labelRef,
}: {
  member: TeamMember
  layout: PedestalLayout
  memberRef: React.RefCallback<HTMLDivElement>
  pedestalRef: React.RefCallback<HTMLDivElement>
  labelRef: React.RefCallback<HTMLDivElement>
}) {
  const isCeo = member.isCeo === true
  // CEO portrait larger; others scale down proportionally
  const baseH  = isCeo ? 460 : 380
  const portraitH = Math.round(baseH * layout.scale)
  const pedestalW = Math.round(220 * layout.scale)
  const pedestalH = Math.round(28  * layout.scale)

  return (
    <div
      ref={memberRef}
      className="team-member"
      style={{
        '--member-x': layout.x,
        '--member-scale': layout.scale,
        zIndex: layout.zIndex,
      } as React.CSSProperties}
    >
      {/* Floor shadow — shifts with mouse parallax */}
      <div className="team-member__shadow" aria-hidden="true" />

      {/* Cut-out portrait */}
      <div
        className="team-member__portrait"
        style={{ height: portraitH }}
      >
        <Image
          src={member.image}
          alt={`${member.name}, ${member.role}`}
          fill
          className="team-member__img"
          sizes="(max-width: 768px) 160px, 280px"
          priority={isCeo}
        />
      </div>

      {/* Glowing glass pedestal disc */}
      <div
        ref={pedestalRef}
        className={`team-member__pedestal${isCeo ? ' team-member__pedestal--ceo' : ''}`}
        style={{ width: pedestalW, height: pedestalH }}
        aria-hidden="true"
      />

      {/* Name + role label — floats beside portrait */}
      <div
        ref={labelRef}
        className={`team-member__label${isCeo ? ' team-member__label--ceo' : ''}`}
        aria-hidden="true"
      >
        <span className="team-member__name">{member.name}</span>
        <span className="team-member__role">{member.role}</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main export — pure render, no effects, refs exposed via handle
// ─────────────────────────────────────────────────────────────
const Team = forwardRef<TeamHandle>(function Team(_props, ref) {
  const teamRef       = useRef<HTMLDivElement>(null)
  const spotlightRef  = useRef<HTMLDivElement>(null)
  const headlineRef   = useRef<HTMLDivElement>(null)
  const stageRef      = useRef<HTMLDivElement>(null)
  const radiantRef    = useRef<HTMLDivElement>(null)
  const memberRefs    = useRef<(HTMLDivElement | null)[]>([])
  const pedestalRefs  = useRef<(HTMLDivElement | null)[]>([])
  const labelRefs     = useRef<(HTMLDivElement | null)[]>([])

  useImperativeHandle(ref, () => ({
    get teamEl()      { return teamRef.current },
    get spotlightEl() { return spotlightRef.current },
    get headlineEl()  { return headlineRef.current },
    get stageEl()     { return stageRef.current },
    get radiantEl()   { return radiantRef.current },
    get memberEls()   { return memberRefs.current },
    get pedestalEls() { return pedestalRefs.current },
    get labelEls()    { return labelRefs.current },
  }), [])

  return (
    <div ref={teamRef} className="team-section" aria-label="Leadership team">

      {/* Glowing floor spotlight — inherits from wipe morph */}
      <div ref={spotlightRef} className="team-spotlight" aria-hidden="true" />

      {/* Giant architectural typography — background, subdued */}
      <div ref={headlineRef} className="team-headline" aria-hidden="true">
        {TEAM_DATA.headline}
      </div>

      {/* Stage — all pedestals and portraits */}
      <div ref={stageRef} className="team-stage">
        {TEAM_DATA.members.map((member, i) => (
          <PedestalMember
            key={member.id}
            member={member}
            layout={PEDESTAL_LAYOUT[i]}
            memberRef={(n) => { memberRefs.current[i] = n }}
            pedestalRef={(n) => { pedestalRefs.current[i] = n }}
            labelRef={(n) => { labelRefs.current[i] = n }}
          />
        ))}
      </div>

      {/* Bright ivory radiant wash — exit transition */}
      <div ref={radiantRef} className="team-radiant" aria-hidden="true" />

    </div>
  )
})

export default Team

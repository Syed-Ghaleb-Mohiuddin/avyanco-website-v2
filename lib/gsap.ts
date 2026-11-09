// ═══════════════════════════════════════════════════════════
// GSAP — CENTRAL REGISTRATION
// Import from here everywhere. Never register plugins
// individually in components.
// ═══════════════════════════════════════════════════════════

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(
    ScrollTrigger,
    MorphSVGPlugin,
    DrawSVGPlugin,
    SplitText
)

export { gsap, ScrollTrigger, MorphSVGPlugin, DrawSVGPlugin, SplitText }
// ═══════════════════════════════════════════════════════════
// AVYANCO — SITE DATA
// Single source of truth for all content.
// Never hardcode any of this in components.
// ═══════════════════════════════════════════════════════════

// ── NAVIGATION ───────────────────────────────────────────────

export const NAV_ITEMS = [
    {
        id: 'services',
        label: 'Services',
        hasMenu: true,
        categories: [
            {
                id: 'business-setup',
                label: 'Business Setup',
                items: [
                    { id: 'company-formation', label: 'Company Formation' },
                    { id: 'liquidation', label: 'Liquidation' },
                    { id: 'license-renewal', label: 'Renewal of License' },
                ],
            },
            {
                id: 'corporate-services',
                label: 'Corporate Services',
                items: [
                    { id: 'visa-services', label: 'Visa Services' },
                    { id: 'bank-account', label: 'Bank Account Opening' },
                    { id: 'bank-solutions', label: 'Bank Solutions' },
                    { id: 'pro-services', label: 'PRO Services' },
                    { id: 'document-clearing', label: 'Document Clearing' },
                ],
            },
            {
                id: 'finance-accounting',
                label: 'Finance & Accounting',
                items: [
                    { id: 'accounting', label: 'Accounting Services' },
                    { id: 'bookkeeping', label: 'Bookkeeping' },
                    { id: 'internal-audit', label: 'Internal Audit' },
                    { id: 'external-audit', label: 'External Audit' },
                ],
            },
            {
                id: 'tax-compliance',
                label: 'Tax & Compliance',
                items: [
                    { id: 'corporate-tax', label: 'Corporate Tax Registration' },
                    { id: 'vat', label: 'VAT Registration' },
                    { id: 'ubo', label: 'UBO Disclosure' },
                    { id: 'aml', label: 'AML Services' },
                ],
            },
            {
                id: 'legal-advisory',
                label: 'Legal & Advisory',
                items: [
                    { id: 'trademark', label: 'Trademark Registration' },
                    { id: 'consulting', label: 'Consulting & Advisory' },
                ],
            },
            {
                id: 'workspace',
                label: 'Workspace',
                items: [
                    { id: 'hot-desk', label: 'Hot Desk' },
                    { id: 'event-space', label: 'Event Space' },
                    { id: 'private-office', label: 'Private Office' },
                    { id: 'meeting-rooms', label: 'Meeting & Board Rooms' },
                ],
            },
        ],
    },
    {
        id: 'countries',
        label: 'Countries',
        hasMenu: true,
        categories: [],
    },
    {
        id: 'about',
        label: 'Why Avyanco',
        hasMenu: false,
        categories: [],
    },
    {
        id: 'insights',
        label: 'Insights',
        hasMenu: false,
        categories: [],
    },
    {
        id: 'contact',
        label: 'Contact',
        hasMenu: false,
        categories: [],
    },
    {
        id: 'calculate-cost',
        label: 'Calculate Cost',
        hasMenu: false,
        categories: [],
        isUtility: true,
        href: '/calculator',
    },
]

// ── NAV CONTEXTUAL CARDS (items with no sub-menu) ───────────

export const NAV_CONTEXTUAL_CARDS = {
    about: {
        label: 'Why Avyanco',
        description:
            '#1 ranked in UAE. Rated 4.8 stars across 708 verified reviews.',
        cta: 'Why Choose Us',
        href: '/about',
    },
    insights: {
        label: 'Latest Insights',
        description:
            'Market updates, regulatory changes, and expert guides across GCC jurisdictions.',
        cta: 'Browse Insights',
        href: '/insights',
    },
    contact: {
        label: 'Get in Touch',
        description:
            'Speak with a specialist today. Offices in Dubai, Riyadh, and Singapore.',
        cta: 'Contact Us',
        href: '/contact',
    },
} as const

// ── COUNTRIES ────────────────────────────────────────────────

export const COUNTRIES = [
    {
        id: 'uae',
        name: 'United Arab Emirates',
        short: 'UAE',
        flag: '🇦🇪',
        mapFile: 'uae.svg',
        primaryService: 'Business Setup',
        description: 'The gateway to the Middle East. Free zones, mainland, and offshore company formation.',
    },
    {
        id: 'saudi',
        name: 'Saudi Arabia',
        short: 'KSA',
        flag: '🇸🇦',
        mapFile: 'saudi.svg',
        primaryService: 'Market Entry',
        description: 'Vision 2030 opens unprecedented opportunities for global businesses.',
    },
    {
        id: 'qatar',
        name: 'Qatar',
        short: 'QAT',
        flag: '🇶🇦',
        mapFile: 'qatar.svg',
        primaryService: 'Corporate Services',
        description: 'A rapidly growing economy with strong investment incentives.',
    },
    {
        id: 'oman',
        name: 'Oman',
        short: 'OMN',
        flag: '🇴🇲',
        mapFile: 'oman.svg',
        primaryService: 'Tax & Compliance',
        description: 'Strategic location bridging GCC and South Asia markets.',
    },
    {
        id: 'bahrain',
        name: 'Bahrain',
        short: 'BHR',
        flag: '🇧🇭',
        mapFile: 'bahrain.svg',
        primaryService: 'Accounting & Bookkeeping',
        description: 'The financial hub of the Gulf with a liberal business environment.',
    },
    {
        id: 'bvi',
        name: 'British Virgin Islands',
        short: 'BVI',
        flag: '🇻🇬',
        mapFile: 'bvi.svg',
        primaryService: 'Offshore Formation',
        description: 'Leading offshore jurisdiction for international business structures.',
    },
    {
        id: 'cayman',
        name: 'Cayman Islands',
        short: 'CAY',
        flag: '🇰🇾',
        mapFile: 'cayman.svg',
        primaryService: 'Offshore Formation',
        description: 'Premier offshore financial centre for global investment structures.',
    },
    {
        id: 'mauritius',
        name: 'Mauritius',
        short: 'MUS',
        flag: '🇲🇺',
        mapFile: 'mauritius.svg',
        primaryService: 'Corporate Services',
        description: 'Africa\'s leading investment gateway with strong double tax treaties.',
    },
    {
        id: 'hongkong',
        name: 'Hong Kong',
        short: 'HK',
        flag: '🇭🇰',
        mapFile: 'hongkong.svg',
        primaryService: 'Company Formation',
        description: 'Asia\'s world city — the premier gateway to Chinese and Asian markets.',
    },
    {
        id: 'singapore',
        name: 'Singapore',
        short: 'SGP',
        flag: '🇸🇬',
        mapFile: 'singapore.svg',
        primaryService: 'Market Entry',
        description: 'Southeast Asia\'s business capital with world-class infrastructure.',
    },
]

// ── STATS ────────────────────────────────────────────────────

export const STATS = [
    { id: 'reviews', value: '708', label: 'Verified Reviews' },
    { id: 'rating', value: '4.8', label: 'Star Rating' },
    { id: 'ranked', value: '#1', label: 'Ranked in UAE' },
    { id: 'countries', value: 'Global', label: 'Jurisdictions' },
    { id: 'services', value: 'End to End', label: 'Corporate Services' },
]

// ── TRUST CHIPS (Hero) ───────────────────────────────────────

export const TRUST_CHIPS = [
    { id: 'rating', text: '★ 4.8 · 708 Reviews' },
    { id: 'ranked', text: '✓ #1 in UAE' },
    { id: 'countries', text: '→ Global Jurisdictions' },
    { id: 'services', text: '◎ End to End Services' },
]

// ── NAVBAR CTA (Rolling) ─────────────────────────────────────

export const NAVBAR_CTAS = [
    { id: 'contact', label: 'Get in Touch', href: '/contact' },
    { id: 'calculator', label: 'Calculate Cost', href: '/calculator' },
]

// ── WHY AVYANCO ──────────────────────────────────────────────

export const DIFFERENTIATORS = [
    {
        id: 'ranked',
        title: '#1 Ranked',
        description: 'Ranked number one business setup consultancy in the UAE.',
    },
    {
        id: 'verified',
        title: '708 Verified Reviews',
        description: 'A 4.8 star rating across 708 verified reviews.',
    },
    {
        id: 'global',
        title: 'Global Reach',
        description: 'Local expertise in every jurisdiction the firm covers.',
    },
    {
        id: 'endtoend',
        title: 'End to End',
        description: 'From formation to compliance, accounting to advisory — one firm, everything covered.',
    },
]

// ── HERO ─────────────────────────────────────────────────────

export interface HeroTrustElement {
    id: string
    type: 'badge' | 'pill' | 'avatars'
    label: string
    sublabel: string
    position: {
        top?: string
        bottom?: string
        left?: string
        right?: string
    }
    floatDelay: number
}

export const HERO_COUNTRY_IDS = [
    'uae',
    'saudi',
    'bvi',
    'cayman',
    'mauritius',
    'hongkong',
    'singapore',
] as const

export type HeroCountryId = typeof HERO_COUNTRY_IDS[number]

export const HERO_COUNTRIES = HERO_COUNTRY_IDS.map(
    (id) => COUNTRIES.find((c) => c.id === id)!
)

// Per-country label offset — tweak x/y to reposition the service text
// relative to the default center of the map stage.
// x: positive = right, negative = left (e.g. '40px', '-20px')
// y: positive = down, negative = up (e.g. '30px', '-10px')
export const HERO_LABEL_OFFSETS: Record<HeroCountryId, { x: string; y: string }> = {
    uae: { x: '0px', y: '-1200px' },
    saudi: { x: '0px', y: '0px' },
    bvi: { x: '0px', y: '-350px' },
    cayman: { x: '0px', y: '0px' },
    mauritius: { x: '0px', y: '0px' },
    hongkong: { x: '0px', y: '0px' },
    singapore: { x: '0px', y: '-300px' },
}

export const HERO_TRUST_ELEMENTS: HeroTrustElement[] = [
    {
        id: 'ranked',
        type: 'badge',
        label: '#1 in UAE',
        sublabel: 'Business Setup Consultancy',
        position: { top: '18%', left: '5%' },
        floatDelay: 0,
    },
    {
        id: 'rating',
        type: 'pill',
        label: '★ 4.8',
        sublabel: '708 Verified Reviews',
        position: { top: '12%', right: '7%' },
        floatDelay: 0.9,
    },
    {
        id: 'experience',
        type: 'pill',
        label: 'Global',
        sublabel: 'Jurisdictions',
        position: { top: '38%', left: '4%' },
        floatDelay: 1.8,
    },
    {
        id: 'companies',
        type: 'avatars',
        label: 'Founders',
        sublabel: 'and Investors',
        position: { top: '55%', right: '4%' },
        floatDelay: 2.7,
    },
]

// ── FAQ ──────────────────────────────────────────────────────

export const FAQS = [
    {
        id: 'how-long',
        question: 'How long does it take to set up a company in UAE?',
        answer: 'Depending on the jurisdiction and type, company formation can take anywhere from 1 to 10 business days.',
    },
    {
        id: 'free-zone',
        question: 'What is the difference between Free Zone and Mainland?',
        answer: 'Free Zone companies enjoy 100% foreign ownership and tax exemptions but have trading restrictions. Mainland companies can trade freely across the UAE.',
    },
    {
        id: 'cost',
        question: 'How much does it cost to set up a business in UAE?',
        answer: 'Costs vary by jurisdiction, activity, and visa requirements. Use our cost calculator for an instant estimate tailored to your needs.',
    },
    {
        id: 'visa',
        question: 'Can I get a UAE residence visa through my company?',
        answer: 'Yes. A UAE trade license entitles you to apply for investor and employee visas based on your office space and company type.',
    },
    {
        id: 'offshore',
        question: 'What are the benefits of an offshore company?',
        answer: 'Offshore companies offer privacy, asset protection, tax efficiency, and simplified international business structures.',
    },
]

// ── SERVICES SECTION ──────────────────────────────────────────
// Derived from NAV_ITEMS[0].categories — single source of truth.
// Add icon, accent, and summary here for the Services section display.

export interface ServiceCategory {
    id: string
    label: string
    icon: string          // emoji or text symbol — swap for SVG later
    accent: string        // CSS colour token used for the category card
    summary: string       // 1-line description shown in the placeholder block
    bgImage: string       // Unsplash URL for the panel background
    items: { id: string; label: string }[]
}

export const SERVICES_CATEGORIES: ServiceCategory[] = [
    {
        id: 'business-setup',
        label: 'Business Setup',
        icon: '🏢',
        accent: 'var(--blue-600)',
        summary: 'Company formation, licensing, and full lifecycle management across all UAE jurisdictions.',
        bgImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop',
        items: [
            { id: 'company-formation', label: 'Company Formation' },
            { id: 'liquidation', label: 'Liquidation' },
            { id: 'license-renewal', label: 'Renewal of License' },
        ],
    },
    {
        id: 'corporate-services',
        label: 'Corporate Services',
        icon: '⚖️',
        accent: 'var(--blue-500)',
        summary: 'End-to-end visa processing, banking facilitation, PRO services and document management.',
        bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
        items: [
            { id: 'visa-services', label: 'Visa Services' },
            { id: 'bank-account', label: 'Bank Account Opening' },
            { id: 'bank-solutions', label: 'Bank Solutions' },
            { id: 'pro-services', label: 'PRO Services' },
            { id: 'document-clearing', label: 'Document Clearing' },
        ],
    },
    {
        id: 'finance-accounting',
        label: 'Finance & Accounting',
        icon: '📊',
        accent: 'var(--teal-500)',
        summary: 'IFRS-compliant accounting, bookkeeping, and audit services tailored to your jurisdiction.',
        bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
        items: [
            { id: 'accounting', label: 'Accounting Services' },
            { id: 'bookkeeping', label: 'Bookkeeping' },
            { id: 'internal-audit', label: 'Internal Audit' },
            { id: 'external-audit', label: 'External Audit' },
        ],
    },
    {
        id: 'tax-compliance',
        label: 'Tax & Compliance',
        icon: '🛡️',
        accent: 'var(--blue-700)',
        summary: 'Corporate tax, VAT, UBO disclosure and AML advisory to keep your business fully compliant.',
        bgImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop',
        items: [
            { id: 'corporate-tax', label: 'Corporate Tax Registration' },
            { id: 'vat', label: 'VAT Registration' },
            { id: 'ubo', label: 'UBO Disclosure' },
            { id: 'aml', label: 'AML Services' },
        ],
    },
    {
        id: 'legal-advisory',
        label: 'Legal & Advisory',
        icon: '📜',
        accent: 'var(--blue-400)',
        summary: 'IP protection, trademark registration, and strategic consulting from senior advisors.',
        bgImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop',
        items: [
            { id: 'trademark', label: 'Trademark Registration' },
            { id: 'consulting', label: 'Consulting & Advisory' },
        ],
    },
    {
        id: 'workspace',
        label: 'Workspace',
        icon: '🏙️',
        accent: 'var(--teal-600)',
        summary: 'Premium hot desks, private offices, event spaces, and board rooms in premium UAE locations.',
        bgImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop',
        items: [
            { id: 'hot-desk', label: 'Hot Desk' },
            { id: 'event-space', label: 'Event Space' },
            { id: 'private-office', label: 'Private Office' },
            { id: 'meeting-rooms', label: 'Meeting & Board Rooms' },
        ],
    },
]

// Country-service availability — which categories each jurisdiction offers.
// Used in Phase 5 for filtering. true = offered, false = not offered.
export const COUNTRY_SERVICES: Record<string, Record<string, boolean>> = {
    uae: { 'business-setup': true, 'corporate-services': true, 'finance-accounting': true, 'tax-compliance': true, 'legal-advisory': true, workspace: true },
    saudi: { 'business-setup': true, 'corporate-services': true, 'finance-accounting': true, 'tax-compliance': true, 'legal-advisory': true, workspace: false },
    bvi: { 'business-setup': true, 'corporate-services': true, 'finance-accounting': true, 'tax-compliance': false, 'legal-advisory': true, workspace: false },
    cayman: { 'business-setup': true, 'corporate-services': true, 'finance-accounting': true, 'tax-compliance': false, 'legal-advisory': true, workspace: false },
    mauritius: { 'business-setup': true, 'corporate-services': true, 'finance-accounting': true, 'tax-compliance': true, 'legal-advisory': true, workspace: false },
    hongkong: { 'business-setup': true, 'corporate-services': true, 'finance-accounting': false, 'tax-compliance': true, 'legal-advisory': true, workspace: false },
    singapore: { 'business-setup': true, 'corporate-services': false, 'finance-accounting': true, 'tax-compliance': true, 'legal-advisory': true, workspace: false },
}

// ── SERVICES CURTAIN GRID ─────────────────────────────────────
// The 7-track glass card grid that rises over the Hero on scroll.
// Country card is FIRST in each track — it arrives at the ceiling first
// during the upward scroll, enabling the staggered pin in Phase 4.

export type CurtainCardType = 'keyword' | 'metric' | 'flag' | 'trust'

export interface CurtainContentCard {
    id: string
    type: CurtainCardType
    size: 'sm' | 'md' | 'lg'
    content: string         // The main text or flag emoji
    subtext?: string        // Optional descriptive text
}

export interface CurtainTrack {
    countryId: string
    countryLabel: string
    countryShort: string
    flag: string
    upperCards: CurtainContentCard[] // Rendered BEFORE the country card in DOM
}

export const CURTAIN_TRACKS: CurtainTrack[] = [
    {
        // ── Track 1: UAE (outer-left — most cards) ────────────────
        countryId: 'uae',
        countryLabel: 'United Arab Emirates',
        countryShort: 'UAE',
        flag: '🇦🇪',
        upperCards: [
            { id: 't1-1', type: 'metric', size: 'lg', content: 'Global', subtext: 'Clients' },
            { id: 't1-2', type: 'keyword', size: 'sm', content: 'Free Zones' },
            { id: 't1-3', type: 'flag', size: 'md', content: '🇺🇸', subtext: 'USA Structures' },
        ],
    },
    {
        // ── Track 2: Saudi ─────────────────────────────────────────
        countryId: 'saudi',
        countryLabel: 'Saudi Arabia',
        countryShort: 'KSA',
        flag: '🇸🇦',
        upperCards: [
            { id: 't2-1', type: 'keyword', size: 'md', content: 'Vision 2030' },
            { id: 't2-2', type: 'trust', size: 'lg', content: '★ 4.8', subtext: 'Average Rating' },
        ],
    },
    {
        // ── Track 3: BVI ───────────────────────────────────────────
        countryId: 'bvi',
        countryLabel: 'British Virgin Islands',
        countryShort: 'BVI',
        flag: '🇻🇬',
        upperCards: [
            { id: 't3-1', type: 'metric', size: 'lg', content: '< 24hr', subtext: 'Fast Formation' },
            { id: 't3-2', type: 'keyword', size: 'sm', content: 'Asset Protection' },
        ],
    },
    {
        // ── Track 4: Cayman (center — fewest cards for deepest valley) ─
        countryId: 'cayman',
        countryLabel: 'Cayman Islands',
        countryShort: 'Cayman',
        flag: '🇰🇾',
        upperCards: [
            { id: 't4-1', type: 'keyword', size: 'md', content: 'Tax Neutral' },
        ],
    },
    {
        // ── Track 5: Mauritius ─────────────────────────────────────
        countryId: 'mauritius',
        countryLabel: 'Mauritius',
        countryShort: 'Mauritius',
        flag: '🇲🇺',
        upperCards: [
            { id: 't5-1', type: 'flag', size: 'sm', content: '🇬🇧', subtext: 'UK Connectivity' },
            { id: 't5-2', type: 'metric', size: 'lg', content: '0%', subtext: 'Corporate Tax' },
        ],
    },
    {
        // ── Track 6: Hong Kong ─────────────────────────────────────
        countryId: 'hongkong',
        countryLabel: 'Hong Kong',
        countryShort: 'HK',
        flag: '🇭🇰',
        upperCards: [
            { id: 't6-1', type: 'keyword', size: 'lg', content: 'Asia Pacific Hub' },
            { id: 't6-2', type: 'trust', size: 'md', content: 'Regional', subtext: 'Expertise' },
        ],
    },
    {
        // ── Track 7: Singapore (outer-right — most cards) ──────────
        countryId: 'singapore',
        countryLabel: 'Singapore',
        countryShort: 'Singapore',
        flag: '🇸🇬',
        upperCards: [
            { id: 't7-1', type: 'keyword', size: 'sm', content: 'Strong IP Laws' },
            { id: 't7-2', type: 'metric', size: 'md', content: 'Asset', subtext: 'Structuring' },
            { id: 't7-3', type: 'flag', size: 'lg', content: '🇪🇺', subtext: 'European Expansion' },
        ],
    },
]

// ── ABOUT SECTION ─────────────────────────────────────────
// "The Architectural Reveal" — all copy lives here.

export interface AboutStat {
    id: string
    value: string
    label: string
}

export interface AboutData {
    grandStatement: string[]          // split into two halves that part like doors
    monolithHeadline: string
    monolithBody: string
    monolithMission: string
    stats: AboutStat[]
    caption: string
}

export const ABOUT_DATA: AboutData = {
    grandStatement: ['Not Just an Agency.', 'The Architects of Global Enterprise.'],
    monolithHeadline: 'Avyanco Business Consultancy',
    monolithBody:
        'Avyanco guides entrepreneurs, SMEs, and multinationals through the UAE\'s evolving regulatory landscape — from the first license to full-scale global expansion. We are not a transactional service provider. We are the advisory partner that stays.',
    monolithMission:
        'Our mission is simple: empower every founder and investor with the precise guidance they need to build, protect, and scale their business in the world\'s most dynamic markets.',
    stats: [
        { id: 'rating', value: '4.8', label: 'Average Rating' },
        { id: 'reviews', value: '708', label: 'Verified Reviews' },
        { id: 'ranking', value: '#1', label: 'Ranked in UAE' },
        { id: 'countries', value: 'Global', label: 'Jurisdictions' },
    ],
    caption:
        'Trusted by founders, investors, and global businesses entering strategic markets.',
}

// ── TEAM SECTION ──────────────────────────────────────────
// "The Focus Pedestals" — 1 CEO + 8 Members

export interface TeamMember {
    id: string
    name: string
    role: string
    image: string
    isCeo?: boolean
}

export const TEAM_DATA: { headline: string; members: TeamMember[] } = {
    headline: 'THE BOARD',
    members: [
        {
            id: 'ceo',
            name: 'Team Member',
            role: 'Founder & CEO',
            image: '/images/team-photos/placeholder.svg',
            isCeo: true,
        },
        {
            id: 'm1',
            name: 'Team Member',
            role: 'Managing Partner',
            image: '/images/team-photos/placeholder.svg',
        },
        {
            id: 'm2',
            name: 'Team Member',
            role: 'Head of Corporate Structuring',
            image: '/images/team-photos/placeholder.svg',
        },
        {
            id: 'm3',
            name: 'Team Member',
            role: 'Director of Compliance',
            image: '/images/team-photos/placeholder.svg',
        },
        {
            id: 'm4',
            name: 'Team Member',
            role: 'Government Liaison',
            image: '/images/team-photos/placeholder.svg',
        },
        {
            id: 'm5',
            name: 'Team Member',
            role: 'Tax Advisory Lead',
            image: '/images/team-photos/placeholder.svg',
        },
        {
            id: 'm6',
            name: 'Team Member',
            role: 'Client Success Manager',
            image: '/images/team-photos/placeholder.svg',
        },
        {
            id: 'm7',
            name: 'Team Member',
            role: 'Legal Advisor',
            image: '/images/team-photos/placeholder.svg',
        },
        {
            id: 'm8',
            name: 'Team Member',
            role: 'Chief Financial Officer',
            image: '/images/team-photos/placeholder.svg',
        },
    ],
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────
export interface Testimonial {
    id: string
    quote: string
    name: string
    title: string
    company: string
    region: string
    initials: string
    /** Tailored accent colour per card — brand-harmonious */
    accent: string
    featured?: boolean
}

export const TESTIMONIALS_DATA = {
    eyebrow: 'Client Testimonials',
    heading: 'Sample Testimonials',
    subheading:
        'From Silicon Valley to the Gulf, Avyanco has guided ambitious businesses through the complexities of international expansion.',
    items: [
        {
            id: 't1',
            quote:
                'Sample review text. It stands in for a client review so the featured card can be seen with realistic content.',
            name: 'Sample Client',
            title: 'Job Title',
            company: 'Example Company',
            region: 'Region',
            initials: 'SC',
            accent: '#1A3A5C',
            featured: true,
        },
        {
            id: 't2',
            quote:
                'Sample review text. The final site would show a review supplied by the client here.',
            name: 'Sample Client',
            title: 'Job Title',
            company: 'Example Company',
            region: 'Region',
            initials: 'SC',
            accent: '#2E6B4F',
        },
        {
            id: 't3',
            quote:
                'Sample review text. This placeholder keeps the grid balanced while the cards animate in.',
            name: 'Sample Client',
            title: 'Job Title',
            company: 'Example Company',
            region: 'Region',
            initials: 'SC',
            accent: '#7C4A2B',
        },
        {
            id: 't4',
            quote:
                'Sample review text. A placeholder of this length shows how a card handles two or three lines.',
            name: 'Sample Client',
            title: 'Job Title',
            company: 'Example Company',
            region: 'Region',
            initials: 'SC',
            accent: '#1A3A5C',
        },
        {
            id: 't5',
            quote:
                'Sample review text. No real client, company or result is described on this card.',
            name: 'Sample Client',
            title: 'Job Title',
            company: 'Example Company',
            region: 'Region',
            initials: 'SC',
            accent: '#2E6B4F',
        },
    ],
} as const

// ─────────────────────────────────────────────────────────────
// FAQ SECTION
// ─────────────────────────────────────────────────────────────
export interface FAQItem {
    id: string
    question: string
    answer: string
}

export const FAQ_DATA = {
    eyebrow: 'Clarity & Counsel',
    heading: 'Common Enquiries',
    subheading: 'Addressing the most critical questions business leaders have when establishing or restructuring their presence in the UAE.',
    items: [
        {
            id: 'faq1',
            question: 'How long does the entire business setup process typically take?',
            answer: 'While mainland and free zone timelines vary, a standard free zone license can be issued within 3-5 working days. Corporate bank account opening typically takes an additional 2-4 weeks depending on the compliance requirements of the chosen institution.'
        },
        {
            id: 'faq2',
            question: 'Do I need a local sponsor to establish a mainland company?',
            answer: 'Recent legislative changes in the UAE allow 100% foreign ownership for over 1,000 commercial and industrial activities on the mainland. A Local Service Agent (LSA) is only required for specific professional activities, and we structure this to ensure you retain total operational and financial control.'
        },
        {
            id: 'faq3',
            question: 'How does the new UAE Corporate Tax impact my setup decision?',
            answer: 'The 9% Corporate Tax applies to mainland entities and certain free zone activities. However, Qualifying Free Zone Persons may still benefit from a 0% tax rate. Our advisory team evaluates your specific revenue streams to recommend the most tax-efficient jurisdiction.'
        },
        {
            id: 'faq4',
            question: 'Can Avyanco handle all visa processing for my employees and family?',
            answer: 'Absolutely. Our dedicated PRO services division handles everything from initial entry permits and medical fitness tests to Emirates ID typing and family sponsorships, ensuring a frictionless transition for your entire team.'
        },
        {
            id: 'faq5',
            question: 'What ongoing compliance is required after my company is formed?',
            answer: 'Post-setup, you must maintain proper financial records, file VAT returns (if applicable), register for Corporate Tax, and ensure Economic Substance Regulations (ESR) and Ultimate Beneficial Owner (UBO) declarations are filed accurately. We offer comprehensive annual retainers to manage all of this on your behalf.'
        }
    ]
} as const

// ─────────────────────────────────────────────────────────────
// CTA SECTION
// ─────────────────────────────────────────────────────────────
export const CTA_DATA = {
    eyebrow: 'Your Next Step',
    heading: 'Establish Your Legacy in the UAE.',
    subheading: 'Join the leaders who have chosen Avyanco for seamless, compliant, and strategic business setup.',
    primaryButton: 'Schedule a Consultation',
    secondaryButton: 'Explore Jurisdictions',
} as const

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────
export const FOOTER_DATA = {
    brand: {
        description: 'Avyanco is the UAE’s premier corporate services firm, delivering institutional-grade business setup, tax advisory, and compliance solutions.',
        address: 'Dubai, UAE',
        email: 'hello@example.com',
        phone: '+971 4 000 0000',
    },
    columns: [
        {
            title: 'Services',
            links: [
                { label: 'Mainland Setup', href: '#' },
                { label: 'Free Zone Setup', href: '#' },
                { label: 'Corporate Tax', href: '#' },
                { label: 'Accounting & Audit', href: '#' },
                { label: 'PRO Services', href: '#' },
            ]
        },
        {
            title: 'Jurisdictions',
            links: [
                { label: 'Dubai (IFZA, DMCC)', href: '#' },
                { label: 'Abu Dhabi (ADGM)', href: '#' },
                { label: 'Sharjah (SPC)', href: '#' },
                { label: 'Ras Al Khaimah (RAKEZ)', href: '#' },
                { label: 'Saudi Arabia Setup', href: '#' },
            ]
        },
        {
            title: 'Firm',
            links: [
                { label: 'About Avyanco', href: '#' },
                { label: 'The Board', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Insights & News', href: '#' },
                { label: 'Contact Us', href: '#' },
            ]
        }
    ],
    legal: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
    ],
    socials: [
        { platform: 'LinkedIn', href: '#' },
        { platform: 'Twitter', href: '#' },
        { platform: 'Instagram', href: '#' },
    ]
} as const

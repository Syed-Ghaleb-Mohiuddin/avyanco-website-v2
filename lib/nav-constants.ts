// ═══════════════════════════════════════════════════════════
// NAV CONSTANTS — single source of truth for layout values
// shared between Navbar, NavIslandLeft, and NavMegaMenu.
// ═══════════════════════════════════════════════════════════

/** px from each screen edge — determines island positions and expansion target */
export const NAV_EDGE_MARGIN = 40

/** px from viewport top — islands sit at this vertical offset */
export const NAV_TOP = 18

/** px — fixed height of the expanded mega-menu panel */
export const NAV_EXPANDED_HEIGHT = 560

/** px — scrollY threshold before islands slide off-screen */
export const NAV_SCROLL_THRESHOLD = 260

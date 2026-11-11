/**
 * What the homepage ticket cards show when nobody has edited them in
 * /admin/offers. Kept outside the two card components (both 'use client')
 * so the admin pages, which are server components, can read the same values
 * and show the owner exactly what is on the site today.
 */

/** The large card at the top (TicketCards). */
export const FEATURED_PRODUCT_KEY = 'featured';

export const FEATURED_IMAGES: Record<string, string> = {
  'visitor-pack':        '/images/ticket-skip-the-line.webp',
  'skip-the-line':       '/images/ticket-skip-the-line.webp',
  'guided-tour':         '/images/gallery/bahia-palace-octagonal-cedar-ceiling-carved-wood.jpg',
  'private-tour':        '/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg',
  'combo-saadian-tombs': '/images/gallery/bahia-palace-inner-courtyard-central-fountain-stucco.jpg',
};

/**
 * skip-the-line's booking path while PAYMENTS_HALTED is true, on the owner's
 * instruction: the featured card leads to the same Viator product, at the same
 * price, as its match in the grid (GRID_VIATOR_LINKS['skip-the-line']).
 */
export const FEATURED_SKIP_THE_LINE_URL =
  'https://www.viator.com/tours/Marrakech/Marrakech-Bahia-Palace-Skip-the-Line-Ticket-With-Audio-Guide/d5408-5670595P2?pid=P00316815&mcid=42383&medium=link&campaign=visitbahiapalace-ticketcards';

/** The grid of four (TicketOptions), cheapest to most expensive. */
export const GRID_SLUGS = ['skip-the-line', 'private-guide-only', 'guided-tour', 'private-tour'] as const;
export type GridSlug = (typeof GRID_SLUGS)[number];

/** Key of each product's texts under `tickets` in messages/<locale>.json. */
export const GRID_NAME_KEYS: Record<GridSlug, string> = {
  'skip-the-line':      'skipTheLine',
  'guided-tour':        'guidedTour',
  'private-guide-only': 'privateGuideOnly',
  'private-tour':       'privateTour',
};

/**
 * Viator affiliate links for the grid. Only products confirmed, on their own
 * Viator page, to include Bahia Palace admission (see the history of
 * TicketOptions.tsx for the checks behind each one).
 */
export const GRID_VIATOR_LINKS: Partial<Record<GridSlug, string>> = {
  'skip-the-line':
    'https://www.viator.com/tours/Marrakech/Marrakech-Bahia-Palace-Skip-the-Line-Ticket-With-Audio-Guide/d5408-5670595P2?pid=P00316815&mcid=42383&medium=link&campaign=visitbahiapalace-opt-skipline',
  'guided-tour':
    'https://www.viator.com/tours/Marrakech/Marrakech-Saadian-Tombs-Bahia-Palace-Medina-and-Souk-Tour/d5408-467170P4?pid=P00316815&mcid=42383&medium=link&campaign=visitbahiapalace-opt-expert',
  'private-guide-only':
    'https://www.viator.com/tours/Marrakech/Marrakech-local-guide-historical-tour/d5408-199649P3?pid=P00316815&mcid=42383&medium=link&campaign=visitbahiapalace-opt-privateguide',
  'private-tour':
    'https://www.viator.com/tours/Marrakech/Marrakech-Highlights-Private-4hr-City-Tour/d5408-326890P2?pid=P00316815&mcid=42383&medium=link&campaign=visitbahiapalace-opt-privatetour',
};

/** One photograph per grid product, from the same shoot as the gallery. */
export const GRID_IMAGES: Record<GridSlug, string> = {
  'skip-the-line':      '/images/ticket-skip-the-line.webp',
  'guided-tour':        '/images/gallery/bahia-palace-octagonal-cedar-ceiling-carved-wood.jpg',
  'private-guide-only': '/images/gallery/bahia-palace-grand-reception-room.webp',
  'private-tour':       '/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg',
};

/** A field set to this in the admin hides that element (ribbon, badge, note…). */
export const HIDE_MARK = '-';

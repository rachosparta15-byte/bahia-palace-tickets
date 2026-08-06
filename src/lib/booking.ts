export const BOOKING_URL = 'https://e-services.minculture.gov.ma/fr/tickets/palais-bahia';

/**
 * The digital audio guide included in the Complete Visitor Pack.
 *
 * Shown ONLY on a confirmed (paid) booking — it is part of what the pack
 * buys, so linking it from anywhere a visitor can reach without paying gives
 * the paid product away.
 *
 * NOTE: this bare URL is no longer enough on its own. The guide now refuses
 * to open without a signed access token appended as `?k=…`. Build the real
 * link with `buildGuideAccessUrl()` from src/lib/guide-token.ts — this
 * constant is the base it appends to, and the ungated address it used to be.
 */
export const AUDIO_GUIDE_URL = 'https://guide.visitbahiapalace.com/';

/**
 * Which booking partner the ticket buttons send visitors to.
 *
 * Set by the owner in /admin/settings ("Booking partner"), stored in
 * SiteSetting under BOOKING_MODE_KEY, read by the site through
 * /api/booking-mode. It exists because the Viator supplier sometimes closes
 * days on its calendar, and the owner has to be able to move the buttons to
 * GetYourGuide and back without a deploy.
 *
 *   normal      today on GetYourGuide, every later day on Viator
 *   three_days  today and the next two days on GetYourGuide, later on Viator
 *   all_gyg     every button on GetYourGuide, whatever the date
 *
 * Shared by the server route and the client provider, so nothing here may
 * import the database.
 */
import { VIATOR_LEAD_TIME_DAYS } from '@/config/booking-partners';

export type BookingMode = 'normal' | 'three_days' | 'all_gyg';

export const BOOKING_MODE_KEY = 'booking_partner_mode';

/*
 * Used until the owner has saved a choice, and whenever the setting cannot be
 * read. three_days because that is what the site was doing when the switch
 * was added (2026-10-04, supplier closed three days): shipping the switch
 * must not change where anyone is sent.
 */
export const DEFAULT_BOOKING_MODE: BookingMode = 'three_days';

export const BOOKING_MODES: Array<{ value: BookingMode; label: string }> = [
  { value: 'normal', label: 'Normal: today on GetYourGuide, other days on Viator' },
  { value: 'three_days', label: 'Today + next 2 days on GetYourGuide, later days on Viator' },
  { value: 'all_gyg', label: 'Everything on GetYourGuide (all buttons, all dates)' },
];

export function parseBookingMode(value: unknown): BookingMode {
  return value === 'normal' || value === 'three_days' || value === 'all_gyg'
    ? value
    : DEFAULT_BOOKING_MODE;
}

/**
 * Days, counted from today, that go to GetYourGuide rather than Viator.
 * A chosen date `d` days ahead goes to GetYourGuide when d < this number.
 */
export function gygLeadDays(mode: BookingMode): number {
  if (mode === 'all_gyg') return Number.POSITIVE_INFINITY;
  if (mode === 'three_days') return 3;
  return VIATOR_LEAD_TIME_DAYS;
}

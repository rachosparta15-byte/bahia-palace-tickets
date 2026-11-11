import { TicketOptions } from './TicketOptions';
import { getOfferCards } from '@/lib/offer-cards';

/** Loads the owner's edits from /admin/offers for the grid of ticket cards. */
export async function TicketOptionsSection() {
  const offers = await getOfferCards();
  return <TicketOptions offers={offers} />;
}

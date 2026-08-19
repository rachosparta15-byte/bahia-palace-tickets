import { abandonedCandidates, crossSellCandidates, ABANDONED_AFTER_HOURS } from '@/lib/follow-up';
import { FollowUpList, type Candidate } from './FollowUpList';

export const dynamic = 'force-dynamic';

/**
 * The follow-up screen: who is eligible, who you have picked, one button.
 *
 * The list is rendered before the button on purpose. These are people who did
 * not ask to hear from us, and an operator who has read the names is the
 * difference between a follow-up and a mailshot. Nothing here runs on a
 * schedule, and nothing goes out without a tick beside it.
 */
function toCandidate(b: {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  visitDate: Date;
  adults: number;
  children: number;
  totalAmount: number;
}): Candidate {
  return {
    id: b.id,
    reference: b.reference,
    name: b.customerName,
    email: b.customerEmail,
    visitDate: b.visitDate.toISOString().slice(0, 10),
    party:
      `${b.adults} adult${b.adults === 1 ? '' : 's'}` +
      (b.children > 0 ? ` + ${b.children} child${b.children === 1 ? '' : 'ren'}` : ''),
    total: b.totalAmount,
  };
}

export default async function FollowUpPage() {
  const [abandoned, crossSell] = await Promise.all([abandonedCandidates(), crossSellCandidates()]);

  return (
    <div className="p-8">
      <h1
        className="text-2xl font-bold text-[#3D2817] mb-2"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Follow-up emails
      </h1>
      <p className="text-sm text-[#8B6344] mb-8 max-w-2xl">
        Nothing here sends itself. Untick anyone you would rather leave alone, then press the button
        &mdash; and each person appears on a list exactly once, because sending is recorded against
        the booking.
      </p>

      <FollowUpList
        kind="abandoned"
        title="Did not finish paying"
        note={`Reached the payment step, never paid, at least ${ABANDONED_AFTER_HOURS} hours ago, visit date still ahead, never reminded, not opted out.`}
        rows={abandoned.map(toCandidate)}
      />

      <FollowUpList
        kind="crossSell"
        title="Bought — could hear about El Badi and the Saadian Tombs"
        note="Ticket already delivered, visit date still ahead, never sent this before, not opted out. The email says the other two are a ten-minute walk away, so it only makes sense before they travel home."
        rows={crossSell.map(toCandidate)}
      />
    </div>
  );
}

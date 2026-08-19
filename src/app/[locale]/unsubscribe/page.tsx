import prisma from '@/lib/db';
import { tokenMatches } from '@/lib/follow-up';

export const dynamic = 'force-dynamic';

/**
 * The opt-out the follow-up emails promise.
 *
 * It has to work without a login and without a reply, because the person using
 * it is annoyed already. One click from the email, no form, no "are you sure",
 * no offer to stay.
 *
 * It does NOT stop transactional mail. Someone who opts out of suggestions has
 * not opted out of the ticket they paid for, and `emailOptOut` is only ever
 * read by the follow-up selection.
 */
export default async function UnsubscribePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ e?: string; t?: string }>;
}) {
  await params;
  const { e, t } = await searchParams;

  let state: 'done' | 'invalid' = 'invalid';

  if (e && t && (await tokenMatches(e, t))) {
    /*
     * Every booking on that address, not just the one the link came from. A
     * person unsubscribing means "stop writing to me", and honouring it for
     * one row while another row keeps them on the list is not honouring it.
     */
    await prisma.booking.updateMany({
      where: { customerEmail: e.toLowerCase() },
      data: { emailOptOut: true },
    });
    state = 'done';
  }

  return (
    <div className="min-h-screen bg-[#1C1108] flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full rounded-2xl border border-[rgba(232,163,61,0.2)] bg-[#251A0F] p-8 text-center">
        {state === 'done' ? (
          <>
            <h1 className="text-xl font-bold text-[#F5E8CC]">You are unsubscribed</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#C4A882]">
              We will not send you any more suggestions or reminders. Anything to do with a booking
              you have paid for — your ticket, a refund, an answer to a question — still reaches you.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-[#F5E8CC]">This link is not valid</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#C4A882]">
              It may have been cut short by your email app. Reply to any of our emails with the word
              &ldquo;stop&rdquo; and a person will take you off the list.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Clears the numbers left over from building and testing, so the first real
 * week of trading starts from a clean baseline.
 *
 * DRY RUN BY DEFAULT. It counts what it would delete and stops. Nothing is
 * removed until you pass --yes, and there is no undo.
 *
 *   # see what would go
 *   node --env-file=.env.prod --experimental-strip-types \
 *     --import ./scripts/ts-resolve.mjs scripts/reset-test-data.mts
 *
 *   # actually do it
 *   I_KNOW_THIS_WRITES_TO_PRODUCTION=yes node --env-file=.env.prod \
 *     --experimental-strip-types --import ./scripts/ts-resolve.mjs \
 *     scripts/reset-test-data.mts --yes --leads --pending --analytics
 *
 * Deliberately a script and not a button in the admin. An endpoint that empties
 * three tables is one stray click, or one stolen session, away from doing it
 * for real — and this needs doing roughly once.
 *
 * WHAT IT WILL NOT DELETE, EVER: a booking that was paid for.
 *
 * A confirmed booking is a financial record. It is the only thing linking a
 * PayPal capture to a customer, a visit date and the terms they accepted, and
 * it is the evidence that answers a chargeback months later — our own Terms
 * promise we hold it. Tidying a dashboard is not worth trading that for.
 */
import prisma from '../src/lib/db/index.ts';

const has = (f: string) => process.argv.includes(`--${f}`);

const apply = has('yes');
const wantLeads = has('leads');
const wantPending = has('pending');
const wantAnalytics = has('analytics');

if (!wantLeads && !wantPending && !wantAnalytics) {
  console.log(`
  Nothing selected. Choose what to clear:

    --leads      leads that never became a paid booking
    --pending    bookings nobody paid for (abandoned checkouts)
    --analytics  page views and events

    --yes        actually delete; without it this only counts
`);
  process.exit(0);
}

const line = (s = '') => console.log(s);

line(`\n${apply ? '── DELETING' : '── DRY RUN — nothing will be deleted'}\n`);

/*
 * Counted before anything is touched, and printed together. Deleting table by
 * table while reporting as you go leaves no single moment where the full scope
 * is visible — which is exactly when someone realises they meant something
 * narrower, one table too late.
 */
const [leadsTotal, leadsPaid, pendingCount, confirmedCount, views, events] = await Promise.all([
  prisma.lead.count(),
  prisma.lead.count({ where: { status: 'paid' } }),
  prisma.booking.count({ where: { status: 'pending' } }),
  prisma.booking.count({ where: { status: { not: 'pending' } } }),
  prisma.pageView.count(),
  prisma.event.count(),
]);

line(`  leads               ${leadsTotal}  (${leadsPaid} became a paid booking — kept)`);
line(`  pending bookings    ${pendingCount}`);
line(`  paid bookings       ${confirmedCount}  ← never deleted`);
line(`  page views          ${views}`);
line(`  events              ${events}`);
line('');

if (wantLeads) line(`  will clear ${leadsTotal - leadsPaid} lead(s)`);
if (wantPending) line(`  will clear ${pendingCount} pending booking(s)`);
if (wantAnalytics) line(`  will clear ${views} page view(s) and ${events} event(s)`);
line('');

if (!apply) {
  line('  Add --yes to carry this out.\n');
  process.exit(0);
}

if (wantPending) {
  /*
   * Only ever `pending`, as an explicit equality rather than "not confirmed".
   * A status added later — 'refunded', 'disputed' — would fall inside a
   * negative filter and be destroyed by a flag whose name says abandoned
   * checkouts.
   */
  const r = await prisma.booking.deleteMany({ where: { status: 'pending' } });
  line(`  deleted ${r.count} pending booking(s)`);
}

if (wantLeads) {
  // Leads that became a paid booking are kept: that row records where a real
  // customer came from, the one piece of attribution worth having once money
  // is involved.
  const r = await prisma.lead.deleteMany({ where: { status: { not: 'paid' } } });
  line(`  deleted ${r.count} lead(s)`);
}

if (wantAnalytics) {
  const [v, e] = await Promise.all([prisma.pageView.deleteMany({}), prisma.event.deleteMany({})]);
  line(`  deleted ${v.count} page view(s) and ${e.count} event(s)`);
}

line('\n  Done. Paid bookings were not touched.\n');

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
const wantMock = has('mock');
const wantAnalytics = has('analytics');

if (!wantLeads && !wantPending && !wantMock && !wantAnalytics) {
  console.log(`
  Nothing selected. Choose what to clear:

    --leads      leads that never became a paid booking
    --pending    bookings nobody paid for (abandoned checkouts)
    --mock       bookings marked "paid" by the mock provider — demo rows
                 where no money ever moved. These are what make the
                 dashboard show revenue that does not exist.
    --analytics  page views and events  ⚠️  see the warning it prints

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
/*
 * "Paid" is not the same as "somebody paid".
 *
 * The mock provider marks bookings paid without money moving — demo rows and
 * pipeline tests. Left in place they are counted as revenue, which is the
 * exact confusion this script exists to remove, and the first rule here
 * ("delete nothing that is not pending") would have preserved every one of
 * them. A real payment is one a real provider captured.
 */
const REAL_PROVIDERS = ['paypal', 'stripe'];

const [leadsTotal, leadsPaid, pendingCount, mockPaid, realPaid, views, events] = await Promise.all([
  prisma.lead.count(),
  prisma.lead.count({ where: { status: 'paid' } }),
  prisma.booking.count({ where: { status: 'pending' } }),
  prisma.booking.count({
    where: { status: { not: 'pending' }, paymentProvider: { notIn: REAL_PROVIDERS } },
  }),
  prisma.booking.count({
    where: { status: { not: 'pending' }, paymentProvider: { in: REAL_PROVIDERS } },
  }),
  prisma.pageView.count(),
  prisma.event.count(),
]);

line(`  leads                    ${leadsTotal}  (${leadsPaid} became a paid booking — kept)`);
line(`  pending bookings         ${pendingCount}`);
line(`  "paid" but mock          ${mockPaid}  ← demo rows, no money ever moved`);
line(`  really paid              ${realPaid}  ← never deleted`);
line(`  page views               ${views}`);
line(`  events                   ${events}`);
line('');

if (wantLeads) line(`  will clear ${leadsTotal - leadsPaid} lead(s)`);
if (wantPending) line(`  will clear ${pendingCount} pending booking(s)`);
if (wantMock) line(`  will clear ${mockPaid} mock "paid" booking(s)`);
if (wantAnalytics) {
  line(`  will clear ${views} page view(s) and ${events} event(s)`);
  const first = await prisma.pageView.findFirst({ orderBy: { createdAt: 'asc' } });
  line('');
  line('  ⚠️  Those page views are real visitors, not test data.');
  if (first) {
    line(`      They go back to ${first.createdAt.toISOString().slice(0, 10)} and are the only`);
    line('      record of where your traffic came from. Analytics is the one');
    line('      thing here worth keeping — clearing it does not make the');
    line('      numbers honest, it makes them empty.');
  }
}
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

if (wantMock) {
  /*
   * Only rows no real provider ever touched. A booking whose provider is
   * paypal or stripe is a financial record even if its status looks odd, and
   * is never in scope here.
   */
  const r = await prisma.booking.deleteMany({
    where: { status: { not: 'pending' }, paymentProvider: { notIn: REAL_PROVIDERS } },
  });
  line(`  deleted ${r.count} mock "paid" booking(s)`);
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

line('\n  Done. Bookings paid through PayPal or Stripe were not touched.\n');

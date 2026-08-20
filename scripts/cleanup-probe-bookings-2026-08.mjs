/**
 * The throttle probes, removed.
 *
 * Ten Booking rows were created against production while testing the
 * submission rate limit — all on probe@example.invalid, a reserved TLD that
 * cannot receive mail. They sit in the follow-up list ticked by default, so
 * pressing send would put ten hard bounces into a single batch of seventeen.
 *
 * On a young sending domain that is not a small thing: a 59% failure rate in
 * one batch is what gets a Resend account suspended and what teaches Gmail to
 * file everything from this domain under spam — including the ticket somebody
 * paid for.
 *
 * Scoped to the exact address and to unpaid rows only. A paid booking is never
 * deleted by a cleanup script, whatever address it carries.
 *
 * Run with --apply to delete. Without it, lists what it would remove.
 */
import { createClient } from '@libsql/client';
import fs from 'node:fs';

for (const line of fs.readFileSync('.env.prod', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^"|"$/g, '');
}

const PROBE = 'probe@example.invalid';
const apply = process.argv.includes('--apply');
const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const { rows } = await c.execute({
  sql: 'SELECT reference, customerName, customerEmail, status, totalAmount, createdAt FROM Booking WHERE customerEmail = ?',
  args: [PROBE],
});

for (const r of rows) {
  console.log(`  ${r.reference}  ${r.status.padEnd(10)} ${String(r.customerName).padEnd(14)} ${r.createdAt}`);
}

const paid = rows.filter((r) => r.status !== 'pending');
if (paid.length) {
  console.error(`\nREFUSING: ${paid.length} row(s) on this address are not pending. Nothing deleted.`);
  await c.close();
  process.exit(1);
}

console.log(`\n${rows.length} probe row(s), all pending, total ${rows.reduce((s, r) => s + Number(r.totalAmount || 0), 0).toFixed(2)} EUR of fake orders`);

if (apply) {
  const res = await c.execute({ sql: 'DELETE FROM Booking WHERE customerEmail = ? AND status = ?', args: [PROBE, 'pending'] });
  console.log(`DELETED ${res.rowsAffected} row(s)`);
  const left = await c.execute({ sql: 'SELECT count(*) n FROM Booking WHERE customerEmail = ?', args: [PROBE] });
  console.log(`remaining on that address: ${left.rows[0].n}`);
} else {
  console.log('DRY RUN — nothing deleted');
}
await c.close();

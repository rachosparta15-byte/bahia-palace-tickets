/**
 * Four unpaid rows that must never be emailed.
 *
 *   1@gmail.com     "sevsev —"
 *   x@gmail.com     "xxx yyy"
 *   x@gmx.ch        "xxx yyy"
 *   a@b.com         "A B"
 *
 * OPTED OUT, NOT DELETED. Deleting was the first instinct and it is the wrong
 * one twice over. These are not my rows — unlike the throttle probes, which I
 * created and removed — they are real submissions to a live form, and how many
 * of those arrive is a fact about the site worth being able to count. And the
 * addresses are the reason to be careful rather than casual: 1@gmail.com,
 * x@gmail.com and a@b.com are all plausibly somebody's real mailbox. The risk
 * is not a bounce. It is a stranger receiving "you didn't finish your booking"
 * for a booking they never made.
 *
 * emailOptOut is read only by the follow-up query, never by a confirmation or
 * a delivery, so if one of these ever does pay, their ticket still reaches
 * them.
 *
 * Listed by reference rather than matched by pattern. No rule for "looks like
 * junk" is worth writing here: the cost of a false positive is a real customer
 * silently dropped from every future list, and nobody would notice.
 *
 * Run with --apply to write.
 */
import { createClient } from '@libsql/client';
import fs from 'node:fs';

for (const line of fs.readFileSync('.env.prod', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^"|"$/g, '');
}

const REFS = ['BHA-MPKG74', 'BHA-CL8WQ4', 'BHA-RGHTP9', 'BHA-5BDHNP'];

const apply = process.argv.includes('--apply');
const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const { rows } = await c.execute({
  sql: `SELECT reference, customerName, customerEmail, status, emailOptOut, totalAmount
          FROM Booking WHERE reference IN (${REFS.map(() => '?').join(',')})`,
  args: REFS,
});

if (rows.length !== REFS.length) {
  console.error(`expected ${REFS.length} rows, found ${rows.length} — nothing changed`);
  await c.close();
  process.exit(1);
}

const paid = rows.filter((r) => r.status !== 'pending');
if (paid.length) {
  console.error(`REFUSING: ${paid.map((r) => r.reference).join(', ')} are not pending. Nothing changed.`);
  await c.close();
  process.exit(1);
}

for (const r of rows) {
  console.log(`  ${r.reference}  ${String(r.customerName).padEnd(14)} ${String(r.customerEmail).padEnd(26)} optOut ${r.emailOptOut} -> 1`);
}

if (apply) {
  const res = await c.execute({
    sql: `UPDATE Booking SET emailOptOut = 1 WHERE reference IN (${REFS.map(() => '?').join(',')}) AND status = 'pending'`,
    args: REFS,
  });
  console.log(`\nAPPLIED — ${res.rowsAffected} row(s) opted out`);
} else {
  console.log('\nDRY RUN — nothing written');
}
await c.close();

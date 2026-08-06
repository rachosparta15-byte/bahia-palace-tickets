/**
 * Exercises the one-code-one-device rule against the real database.
 *
 * Written against the actual Prisma client rather than a mock, because the rule
 * that matters most here — two devices racing for the same fresh code — lives in
 * the `deviceId: null` guard on an UPDATE, and a mock would happily let both
 * through while telling me the code was correct.
 */
import assert from 'node:assert/strict';

// The app's own client. Prisma 7 needs an adapter, and this is where it is
// configured — building a second client here would test a different database.
const { default: prisma } = await import('../src/lib/db/index.ts');
const { issueGuideCodes, redeemGuideCode, unlockGuideCode } = await import(
  '../src/lib/guide-access.ts'
);

const REF = 'TEST-GUIDE-' + Math.random().toString(36).slice(2, 8).toUpperCase();
const BOOKING_ID = 'test-booking-' + Math.random().toString(36).slice(2, 10);

let pass = 0;
let fail = 0;
const check = (name, fn) => {
  try {
    fn();
    console.log('  ok   ' + name);
    pass++;
  } catch (e) {
    console.log('  FAIL ' + name + ' — ' + e.message);
    fail++;
  }
};

// Two paying adults and one free child. Children under twelve are not charged
// and must not draw a code, or one adult plus twenty children buys twenty-one.
const codes = await issueGuideCodes({ id: BOOKING_ID, reference: REF, adults: 2, children: 1 });
check('codes follow the PAID seats, not the head count', () => assert.equal(codes.length, 2));
check('every code is distinct', () => assert.equal(new Set(codes).size, 2));
check('codes are 16 characters', () => codes.forEach((c) => assert.equal(c.length, 16)));

// Re-issuing must not mint more.
const again = await issueGuideCodes({ id: BOOKING_ID, reference: REF, adults: 2, children: 1 });
check('re-issuing is idempotent', () => assert.deepEqual([...again].sort(), [...codes].sort()));

const freeloader = await issueGuideCodes({
  id: BOOKING_ID + '-kids', reference: REF + 'K', adults: 1, children: 20,
});
check('one adult and twenty children still buys exactly one code', () =>
  assert.equal(freeloader.length, 1));

// First device claims.
const first = await redeemGuideCode(codes[0], 'device-alpha');
check('an unclaimed code admits the first device', () => {
  assert.equal(first.ok, true);
  assert.equal(first.state, 'claimed');
  assert.equal(first.reference, REF);
});

// Same device, again and again.
const repeat = await redeemGuideCode(codes[0], 'device-alpha');
check('the owning device is admitted again', () => {
  assert.equal(repeat.ok, true);
  assert.equal(repeat.state, 'returning');
});

// A stranger.
const stranger = await redeemGuideCode(codes[0], 'device-beta');
check('a second device is refused', () => {
  assert.equal(stranger.ok, false);
  assert.equal(stranger.reason, 'other_device');
});

// The refusal must not have stolen the code from its owner.
const ownerStill = await redeemGuideCode(codes[0], 'device-alpha');
check('a refusal does not disturb the owner', () => assert.equal(ownerStill.ok, true));

// The other seats are untouched by all of that.
const secondSeat = await redeemGuideCode(codes[1], 'device-beta');
check('a different seat still admits a different device', () => {
  assert.equal(secondSeat.ok, true);
  assert.equal(secondSeat.state, 'claimed');
});

// Formatting, case and confusable characters all resolve to the same row.
const dashed = codes[1].replace(/(.{4})/g, '$1-').replace(/-$/, '');
const messy = dashed.toLowerCase().replace(/0/g, 'O').replace(/1/g, 'l');
// Seat two is already held by device-beta, so this asserts the LOOKUP survives
// mangling — a resolved code that refuses the wrong device, not a 404.
const viaMessy = await redeemGuideCode(messy, 'device-gamma');
check('a dashed, lowercased, confusable-mangled code still resolves to its row', () =>
  assert.equal(viaMessy.reason, 'other_device'));

// Nonsense.
const nonsense = await redeemGuideCode('NOTAREALCODE0000', 'device-delta');
check('an unknown code is unknown, not merely refused', () => {
  assert.equal(nonsense.ok, false);
  assert.equal(nonsense.reason, 'unknown_code');
});
const short = await redeemGuideCode('ABC', 'device-delta');
check('a fragment cannot match a row', () => assert.equal(short.reason, 'unknown_code'));

/*
 * The race. Both requests see an unclaimed code and both try to take it.
 * Exactly one must win — this is the assertion the whole design rests on.
 */
const [raceA, raceB] = await Promise.all([
  redeemGuideCode(codes[0], 'race-one'),
  redeemGuideCode(codes[0], 'race-two'),
]);
check('two devices racing a claimed code both lose', () => {
  assert.equal(raceA.ok, false);
  assert.equal(raceB.ok, false);
});

const fresh = await issueGuideCodes({
  id: BOOKING_ID + '-race',
  reference: REF + 'R',
  adults: 1,
  children: 0,
});
const [r1, r2] = await Promise.all([
  redeemGuideCode(fresh[0], 'race-alpha'),
  redeemGuideCode(fresh[0], 'race-beta'),
]);
check('racing an UNCLAIMED code, exactly one wins', () => {
  assert.equal([r1.ok, r2.ok].filter(Boolean).length, 1);
});

// Support unlock.
const unlocked = await unlockGuideCode(codes[0]);
check('support can clear a binding', () => assert.equal(unlocked, true));
const afterUnlock = await redeemGuideCode(codes[0], 'device-replacement');
check('a cleared code admits a new device', () => {
  assert.equal(afterUnlock.ok, true);
  assert.equal(afterUnlock.state, 'claimed');
});
const row = await prisma.guideCode.findUnique({ where: { code: codes[0] } });
check('the unlock is counted, not silent', () => assert.equal(row.unlockCount, 1));

console.log(`\n  ${pass} passed, ${fail} failed`);

await prisma.guideCode.deleteMany({ where: { reference: { startsWith: 'TEST-GUIDE-' } } });
await prisma.$disconnect();
process.exit(fail ? 1 : 0);

/**
 * Fix all mojibake patterns in messages/en.json and messages/it.json
 * caused by PowerShell reading UTF-8 files as Windows-1252.
 * Uses binary Buffer operations to avoid any encoding ambiguity.
 *
 * Pattern: UTF-8 bytes for a char were re-encoded as UTF-8 of Windows-1252 codepoints.
 * e.g. — (U+2014, bytes E2 80 94):
 *   E2 (byte) → Windows-1252 â (U+00E2) → UTF-8 C3 A2
 *   80 (byte) → Windows-1252 € (U+20AC) → UTF-8 E2 82 AC
 *   94 (byte) → Windows-1252 " (U+201D) → UTF-8 E2 80 9D
 * Result bytes: C3 A2 E2 82 AC E2 80 9D  (vs. correct E2 80 94)
 */
import { readFileSync, writeFileSync } from 'fs';

// [bad_bytes, good_bytes] — both as arrays of hex values
const PATTERNS = [
  // — em dash (U+2014, E2 80 94)
  [[0xC3,0xA2, 0xE2,0x82,0xAC, 0xE2,0x80,0x9D], [0xE2,0x80,0x94]],
  // – en dash (U+2013, E2 80 93)
  [[0xC3,0xA2, 0xE2,0x82,0xAC, 0xE2,0x80,0x9C], [0xE2,0x80,0x93]],
  // ' right single quote (U+2019, E2 80 99)
  [[0xC3,0xA2, 0xE2,0x82,0xAC, 0xE2,0x84,0xA2], [0xE2,0x80,0x99]],
  // ' left single quote (U+2018, E2 80 98)
  [[0xC3,0xA2, 0xE2,0x82,0xAC, 0xCB,0x9C],       [0xE2,0x80,0x98]],
  // " left double quote (U+201C, E2 80 9C)
  [[0xC3,0xA2, 0xE2,0x82,0xAC, 0xC5,0x93],       [0xE2,0x80,0x9C]],
  // … ellipsis (U+2026, E2 80 A6)
  [[0xC3,0xA2, 0xE2,0x82,0xAC, 0xC2,0xA6],       [0xE2,0x80,0xA6]],
  // • bullet (U+2022, E2 80 A2)
  [[0xC3,0xA2, 0xE2,0x82,0xAC, 0xC2,0xA2],       [0xE2,0x80,0xA2]],
  // ™ trade mark (U+2122, E2 84 A2)
  [[0xC3,0xA2, 0xE2,0x80,0x9E, 0xC2,0xA2],       [0xE2,0x84,0xA2]],
  // Â + non-breaking space → NBSP (U+00A0, C2 A0)
  [[0xC3,0x82, 0xC2,0xA0],                        [0xC2,0xA0]],
];

function fixBuffer(buf) {
  let result = buf;
  let totalFixed = 0;
  for (const [badArr, goodArr] of PATTERNS) {
    const bad = Buffer.from(badArr);
    const good = Buffer.from(goodArr);
    const parts = [];
    let prev = 0;
    let idx;
    let count = 0;
    while ((idx = result.indexOf(bad, prev)) >= 0) {
      parts.push(result.slice(prev, idx));
      parts.push(good);
      prev = idx + bad.length;
      count++;
    }
    if (count > 0) {
      parts.push(result.slice(prev));
      result = Buffer.concat(parts);
      totalFixed += count;
      const char = Buffer.from(goodArr).toString('utf8');
      console.log(`    ${count}× ${char} (U+${goodArr.map(b => b.toString(16).padStart(2,'0')).join('').toUpperCase()})`);
    }
  }
  return { result, totalFixed };
}

for (const file of ['messages/en.json', 'messages/it.json']) {
  const orig = readFileSync(file);
  console.log(`\n${file}:`);
  const { result, totalFixed } = fixBuffer(orig);
  if (totalFixed > 0) {
    writeFileSync(file, result);
    console.log(`  → Fixed ${totalFixed} total chars, wrote file`);
  } else {
    console.log('  → Nothing to fix');
  }
}

// Quick sanity: parse both as JSON to confirm they're valid
for (const file of ['messages/en.json', 'messages/it.json']) {
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8'));
    console.log(`\n✅  ${file} is valid JSON (${Object.keys(parsed).length} top-level keys)`);
  } catch (e) {
    console.error(`\n❌  ${file} JSON parse error:`, e.message);
  }
}

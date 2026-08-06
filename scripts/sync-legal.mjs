/**
 * Pulls the legal documents from marrakechlocal.com into this repository.
 *
 * WHY THE POLICIES LIVE ON THIS DOMAIN:
 *
 * A card acquirer underwrites the domain the payment happens on. Customers pay
 * on visitbahiapalace.com, so this domain must carry the terms, the refund
 * policy, the delivery policy, the payments statement, the privacy policy and
 * the trader identification.
 *
 * WHY THEY REPLACED THE HAND-WRITTEN TEXT THAT USED TO BE HERE:
 *
 * src/content/legal/terms.ts named a different selling entity from the rest of
 * the network. Two companies cannot both be the counterparty to one order, one
 * Stripe account belongs to one legal entity, and a customer who reads "your
 * contract is with X" and is charged by Y has been misled about who they are
 * dealing with. The whole hand-written layer was removed rather than edited,
 * because the risk is not one stale name — it is a second copy of the rules
 * that drifts from the one quoted in the consent record taken at checkout.
 *
 *   npm run sync:legal
 *   npm run sync:legal -- --origin=http://localhost:3100
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SITE_ID = 'visitbahiapalace';

/** Mirrors src/i18n/routing.ts. This site does not serve ar, nl or pt. */
// Kept in step with src/i18n/routing.ts by hand: this script runs under plain
// node, before any bundler, so it cannot import the TypeScript routing module.
const LOCALES = ['en', 'fr', 'it', 'de', 'es', 'ar', 'pt'];

const SLUGS = [
  'terms',
  'refunds',
  'delivery',
  'payments',
  'privacy',
  'cookies',
  'accessibility',
  'notice',
  'affiliate-disclosure',
];

const originArg = process.argv.find((a) => a.startsWith('--origin='));
const ORIGIN = originArg ? originArg.split('=')[1] : 'https://marrakechlocal.com';

const OUT_DIR = path.join(process.cwd(), 'src', 'content', 'legal');

async function fetchDoc(slug, locale) {
  const url = `${ORIGIN}/api/legal/${slug}?site=${SITE_ID}&locale=${locale}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`${slug}/${locale}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

await mkdir(OUT_DIR, { recursive: true });

let written = 0;
const failures = [];

for (const locale of LOCALES) {
  const bundle = {};

  for (const slug of SLUGS) {
    try {
      const doc = await fetchDoc(slug, locale);
      // A document that came back branded as another site means the site id is
      // wrong upstream, and we would publish a sister brand's copy here.
      if (doc.site !== SITE_ID) {
        throw new Error(`expected site "${SITE_ID}", got "${doc.site}"`);
      }
      bundle[slug] = doc;
    } catch (error) {
      failures.push(`${slug}/${locale}: ${error.message}`);
    }
  }

  if (Object.keys(bundle).length === SLUGS.length) {
    await writeFile(
      path.join(OUT_DIR, `${locale}.json`),
      JSON.stringify(bundle, null, 2) + '\n',
      'utf8',
    );
    written += 1;
    console.log(`  ${locale}: ${SLUGS.length} documents`);
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length} document(s) failed:`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(`\nSynced ${written}/${LOCALES.length} locales from ${ORIGIN}`);
console.log('Commit src/content/legal/*.json — the build reads it, not the network.');

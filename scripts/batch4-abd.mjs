/**
 * Batch 4: A + B + D
 * A — Differentiate opening-hours vs best-time; sharpen tips seoTitle
 * B — Add internal links (history→entrance-fee, safety-guide fixes)
 * D — Unpublish redirected EN-slug history posts; site-wide stale-link audit+fix
 */
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const log  = (msg) => console.log(msg);
const warn = (msg) => console.warn('⚠️  ' + msg);
let totalUpdated = 0;

async function getPost(slug, locale) {
  const r = await client.execute({
    sql: 'SELECT content, seoTitle, seoDesc FROM BlogPost WHERE slug = ? AND locale = ?',
    args: [slug, locale],
  });
  return r.rows[0] ?? null;
}

async function updatePost(slug, locale, updates) {
  const now = new Date().toISOString();
  const sets = [];
  const vals = [];
  for (const [col, val] of Object.entries(updates)) {
    sets.push(`${col} = ?`);
    vals.push(val);
  }
  sets.push('updatedAt = ?');
  vals.push(now, slug, locale);
  await client.execute({
    sql: `UPDATE BlogPost SET ${sets.join(', ')} WHERE slug = ? AND locale = ?`,
    args: vals,
  });
  totalUpdated++;
  log(`✅  Updated ${locale}/${slug}: [${Object.keys(updates).join(', ')}]`);
}

// ──────────────────────────────────────────────────────────────────────────────
// A1 — opening-hours: update EN seoTitle + add best-time cross-link (5 locales)
// ──────────────────────────────────────────────────────────────────────────────
log('\n=== A1: OPENING-HOURS ===');

const OPENING_HOURS_H2 = {
  en: '<h2>When Is the Best Time to Visit Bahia Palace?</h2>',
  fr: '<h2>Meilleure heure pour visiter</h2>',
  de: '<h2>Beste Besuchszeit</h2>',
  it: '<h2>Miglior orario per visitare</h2>',
  es: '<h2>Mejor hora para visitar</h2>',
};

const BEST_TIME_XLINK = {
  en: '\n<p>For a full seasonal breakdown — including the best months, crowd patterns, and shoulder-season tips — see the dedicated <a href="/en/blog/best-time-to-visit-bahia-palace">best time to visit Bahia Palace guide</a>. The section below covers daily timing windows only.</p>',
  fr: '\n<p>Pour une analyse saisonnière complète — meilleurs mois, affluence et conseils pour la basse saison — consultez le <a href="/fr/blog/best-time-to-visit-bahia-palace">guide sur le meilleur moment pour visiter le Palais Bahia</a>. La section ci-dessous porte uniquement sur les créneaux horaires quotidiens.</p>',
  de: '\n<p>Für eine vollständige saisonale Analyse — beste Monate, Besucherzahlen und Tipps für die Nebensaison — lesen Sie den <a href="/de/blog/best-time-to-visit-bahia-palace">Ratgeber zur besten Besuchszeit</a>. Der folgende Abschnitt behandelt nur die täglichen Zeitfenster.</p>',
  it: '\n<p>Per un\'analisi stagionale completa — mesi migliori, flussi di visitatori e consigli per la bassa stagione — consulta la <a href="/it/blog/best-time-to-visit-bahia-palace">guida al momento migliore per visitare Palazzo Bahia</a>. La sezione seguente riguarda solo le fasce orarie giornaliere.</p>',
  es: '\n<p>Para un análisis estacional completo — mejores meses, afluencia de turistas y consejos para temporada baja — consulta la <a href="/es/blog/best-time-to-visit-bahia-palace">guía sobre el mejor momento para visitar el Palacio Bahía</a>. La siguiente sección cubre únicamente las ventanas horarias diarias.</p>',
};

const OPENING_HOURS_EN_SEO_TITLE = 'Bahia Palace Opening Hours 2026: Full Schedule, Holidays & Ramadan';

for (const locale of ['en', 'fr', 'de', 'it', 'es']) {
  const row = await getPost('bahia-palace-opening-hours-2026', locale);
  if (!row) { warn(`opening-hours/${locale} not found`); continue; }

  let content = row.content ?? '';
  const h2    = OPENING_HOURS_H2[locale];
  const xlink = BEST_TIME_XLINK[locale];
  const updates = {};

  if (content.includes('/blog/best-time-to-visit-bahia-palace')) {
    log(`⏭️   opening-hours/${locale} already has best-time link`);
  } else if (!content.includes(h2)) {
    warn(`opening-hours/${locale}: H2 not found — "${h2}"`);
  } else {
    updates.content = content.replace(h2, h2 + xlink);
    log(`     opening-hours/${locale}: will insert best-time cross-link`);
  }

  if (locale === 'en' && row.seoTitle !== OPENING_HOURS_EN_SEO_TITLE) {
    updates.seoTitle = OPENING_HOURS_EN_SEO_TITLE;
  }

  if (Object.keys(updates).length > 0) {
    await updatePost('bahia-palace-opening-hours-2026', locale, updates);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// A2 — best-time: add opening-hours blog cross-link (5 locales)
// ──────────────────────────────────────────────────────────────────────────────
log('\n=== A2: BEST-TIME ===');

const OPENING_HOURS_XLINK = {
  en: '<p>For the complete day-by-day schedule, Ramadan adjustments, and holiday closures, see the <a href="/en/blog/bahia-palace-opening-hours-2026">full Bahia Palace opening hours guide</a>.</p>\n',
  fr: '<p>Pour le calendrier complet, les ajustements du Ramadan et les fermetures des jours fériés, consultez le <a href="/fr/blog/bahia-palace-opening-hours-2026">guide complet des horaires du Palais Bahia</a>.</p>\n',
  de: '<p>Für den vollständigen Tagesplan, Ramadan-Anpassungen und Feiertagsschließungen, lesen Sie den <a href="/de/blog/bahia-palace-opening-hours-2026">vollständigen Öffnungszeiten-Ratgeber</a>.</p>\n',
  it: '<p>Per il calendario completo giorno per giorno, gli aggiustamenti del Ramadan e le chiusure festive, consulta la <a href="/it/blog/bahia-palace-opening-hours-2026">guida completa degli orari di apertura del Palazzo Bahia</a>.</p>\n',
  es: '<p>Para el calendario completo día a día, los ajustes del Ramadán y los cierres festivos, consulta la <a href="/es/blog/bahia-palace-opening-hours-2026">guía completa de horarios de apertura del Palacio Bahía</a>.</p>\n',
};

for (const locale of ['en', 'fr', 'de', 'it', 'es']) {
  const row = await getPost('best-time-to-visit-bahia-palace', locale);
  if (!row) { warn(`best-time/${locale} not found`); continue; }

  let content = row.content ?? '';
  const xlink = OPENING_HOURS_XLINK[locale];

  if (content.includes('/blog/bahia-palace-opening-hours-2026')) {
    log(`⏭️   best-time/${locale} already has opening-hours blog link`);
    continue;
  }

  // Insert before the SECOND <h2> tag so the link sits at the end of the first section
  const h2Matches = [...content.matchAll(/<h2[^>]*>/g)];
  if (h2Matches.length >= 2) {
    const idx = h2Matches[1].index;
    content = content.slice(0, idx) + xlink + content.slice(idx);
    await updatePost('best-time-to-visit-bahia-palace', locale, { content });
  } else {
    // Fallback: after first </ul>
    const ulEnd = content.indexOf('</ul>');
    if (ulEnd > -1) {
      content = content.slice(0, ulEnd + 5) + '\n' + xlink + content.slice(ulEnd + 5);
      await updatePost('best-time-to-visit-bahia-palace', locale, { content });
    } else {
      warn(`best-time/${locale}: no second H2 or </ul> found — skipping`);
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// A3 — tips seoTitle (EN only)
// ──────────────────────────────────────────────────────────────────────────────
log('\n=== A3: TIPS seoTitle ===');
{
  const row = await getPost('bahia-palace-tips-before-visiting', 'en');
  if (!row) {
    warn('tips-before-visiting/en not found');
  } else {
    const newTitle = '10 Must-Know Tips Before Visiting Bahia Palace (2026 Guide)';
    if (row.seoTitle === newTitle) {
      log('⏭️   tips/en seoTitle already correct');
    } else {
      await updatePost('bahia-palace-tips-before-visiting', 'en', { seoTitle: newTitle });
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// B1 — history → entrance-fee blog link
//       EN: bahia-palace-history
//       FR/DE/IT/ES: native-slug canonicals
// ──────────────────────────────────────────────────────────────────────────────
log('\n=== B1: HISTORY → entrance-fee link ===');

const NATIVE_HISTORY_SLUGS = {
  en: 'bahia-palace-history',
  fr: 'palais-de-la-bahia-marrakech-histoire',
  de: 'palast-bahia-marrakesch-geschichte',
  it: 'palazzo-bahia-marrakech-storia',
  es: 'palacio-bahia-marrakech-historia',
};

const ENTRANCE_FEE_BLOG_SENTENCE = {
  en: ' For a full breakdown of ticket categories and family pricing, see the <a href="/en/blog/bahia-palace-entrance-fee-2026">2026 entrance fee guide</a>.',
  fr: ' Pour un aperçu complet des tarifs et réductions, consultez le <a href="/fr/blog/bahia-palace-entrance-fee-2026">guide des tarifs d\'entrée 2026</a>.',
  de: ' Eine vollständige Aufschlüsselung der Ticketkategorien und Familienpreise finden Sie im <a href="/de/blog/bahia-palace-entrance-fee-2026">Eintrittspreis-Ratgeber 2026</a>.',
  it: ' Per un quadro completo delle categorie di biglietti e dei prezzi familiari, consulta la <a href="/it/blog/bahia-palace-entrance-fee-2026">guida al prezzo d\'ingresso 2026</a>.',
  es: ' Para un desglose completo de categorías de entradas y precios familiares, consulta la <a href="/es/blog/bahia-palace-entrance-fee-2026">guía de precios de entrada 2026</a>.',
};

for (const [locale, slug] of Object.entries(NATIVE_HISTORY_SLUGS)) {
  const row = await getPost(slug, locale);
  if (!row) { warn(`${slug}/${locale} not found`); continue; }

  let content = row.content ?? '';

  if (content.includes('/blog/bahia-palace-entrance-fee-2026')) {
    log(`⏭️   ${slug}/${locale} already has entrance-fee blog link`);
    continue;
  }

  const entranceFeePageLink = `/${locale}/entrance-fee`;
  const idx = content.indexOf(entranceFeePageLink);
  if (idx > -1) {
    // Find </p> that closes this paragraph
    const paraEnd = content.indexOf('</p>', idx);
    if (paraEnd > -1) {
      content = content.slice(0, paraEnd) +
        ENTRANCE_FEE_BLOG_SENTENCE[locale] +
        content.slice(paraEnd);
      await updatePost(slug, locale, { content });
    } else {
      warn(`${slug}/${locale}: no </p> after /${locale}/entrance-fee`);
    }
  } else {
    // Fallback: find "500 000" or "500.000" visitor count paragraph
    const visitor = content.indexOf('500 000') > -1 ? '500 000'
                  : content.indexOf('500.000') > -1 ? '500.000'
                  : null;
    if (visitor) {
      const paraEnd = content.indexOf('</p>', content.indexOf(visitor));
      if (paraEnd > -1) {
        content = content.slice(0, paraEnd) +
          ENTRANCE_FEE_BLOG_SENTENCE[locale] +
          content.slice(paraEnd);
        await updatePost(slug, locale, { content });
      }
    } else {
      warn(`${slug}/${locale}: no entrance-fee link or visitor count found — skipping`);
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// B2 — safety guide EN: fix "six scenarios" → "eight" + skip-the-line link
// ──────────────────────────────────────────────────────────────────────────────
log('\n=== B2: SAFETY GUIDE EN ===');
{
  const row = await getPost('marrakech-safety-guide', 'en');
  if (!row) {
    warn('marrakech-safety-guide/en not found');
  } else {
    let content = row.content ?? '';
    let changed = false;

    // Fix "six scenarios" → "eight scenarios"
    if (content.includes('The six scenarios described in this guide')) {
      content = content.replace(
        'The six scenarios described in this guide',
        'The eight scenarios described in this guide'
      );
      log('     Fixed "six" → "eight" scenarios');
      changed = true;
    } else if (content.includes('The eight scenarios described in this guide')) {
      log('⏭️   Already says "eight scenarios"');
    } else {
      warn('safety-guide/en: "six/eight scenarios" phrase not found');
    }

    // Add skip-the-line explicit link
    if (content.includes('/en/tickets/skip-the-line')) {
      log('⏭️   Skip-the-line link already present');
    } else if (content.includes('href="/en/tickets"')) {
      // Upgrade generic /tickets link to /tickets/skip-the-line
      content = content.replaceAll('href="/en/tickets"', 'href="/en/tickets/skip-the-line"');
      log('     Upgraded /en/tickets → /en/tickets/skip-the-line');
      changed = true;
    } else {
      // Find the booking note paragraph and append the link
      const anchor = 'Purchasing your Bahia Palace entrance';
      const idx = content.indexOf(anchor);
      if (idx > -1) {
        const paraEnd = content.indexOf('</p>', idx);
        if (paraEnd > -1) {
          content = content.slice(0, paraEnd) +
            ' Book via <a href="/en/tickets/skip-the-line">skip-the-line tickets</a> for instant confirmation and to avoid the entrance queue entirely.' +
            content.slice(paraEnd);
          log('     Added skip-the-line link in booking note');
          changed = true;
        }
      } else {
        warn('safety-guide/en: booking note anchor not found — link not added');
      }
    }

    if (changed) {
      await updatePost('marrakech-safety-guide', 'en', { content });
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// D1 — Unpublish redirected EN-slug history posts in FR/DE/IT/ES
//      These 301 to native-slug canonicals and should not be in the sitemap
// ──────────────────────────────────────────────────────────────────────────────
log('\n=== D1: UNPUBLISH redirected EN-slug history posts ===');
for (const locale of ['fr', 'de', 'it', 'es']) {
  const r = await client.execute({
    sql: "UPDATE BlogPost SET published = 0, updatedAt = ? WHERE slug = 'bahia-palace-history' AND locale = ? AND published = 1",
    args: [new Date().toISOString(), locale],
  });
  if (r.rowsAffected > 0) {
    log(`✅  Unpublished bahia-palace-history/${locale} (301 → native slug)`);
    totalUpdated++;
  } else {
    log(`⏭️   bahia-palace-history/${locale} already unpublished or not found`);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// D2 — Site-wide stale link audit + auto-fix
// ──────────────────────────────────────────────────────────────────────────────
log('\n=== D2: SITE-WIDE STALE LINK AUDIT ===');

const REDIRECTED_SLUG_MAP = {
  // All-locale
  'how-to-get-to-bahia-palace':   'how-to-get-to-bahia-palace-marrakech',
  'history-of-bahia-palace':      'bahia-palace-history',
  'marrakech-tourist-scams-guide':'marrakech-safety-guide',
  'bahia-palace-who-built-it':    'bahia-palace-history',
  // EN-only duplicates (listed here so we catch inbound links in any locale's content)
  'bahia-palace-history-marrakech':                    'bahia-palace-history',
  'who-built-bahia-palace-history-ba-ahmed':           'bahia-palace-history',
  'bahia-palace-entrance-fee-2026-tickets-prices':     'bahia-palace-entrance-fee-2026',
  'how-to-get-to-bahia-palace-from-jemaa-el-fna':     'how-to-get-to-bahia-palace-marrakech',
  'is-bahia-palace-worth-visiting-honest-review-2026': 'is-bahia-palace-worth-visiting',
  'what-to-wear-bahia-palace-marrakech-dress-code':    'bahia-palace-dress-code',
  'bahia-palace-photography-guide-best-spots-tips':    'bahia-palace-photography-guide',
  'what-to-see-inside-bahia-palace-room-by-room':      'bahia-palace-room-by-room-guide',
  'bahia-palace-opening-hours-best-time-to-visit':     'bahia-palace-opening-hours-2026',
  'best-time-to-visit-bahia-palace-marrakech-2026':    'best-time-to-visit-bahia-palace',
  'bahia-palace-vs-badi-palace-which-to-visit':        'bahia-palace-vs-badi-palace-marrakech',
  'bahia-palace-vs-saadian-tombs-comparison':          'bahia-palace-vs-saadian-tombs-which-to-visit',
  'jardin-majorelle-vs-bahia-palace-marrakech':        'bahia-palace-vs-majorelle-garden',
  'how-to-avoid-tourist-scams-marrakech-safety-guide-2026':                      'marrakech-safety-guide',
  'how-to-avoid-scams-in-the-souks-of-marrakech-complete-guide-for-travelers':  'marrakech-safety-guide',
  '2-days-in-marrakech-perfect-weekend-itinerary-2026': 'marrakech-2-day-itinerary',
};

const allPublished = await client.execute({
  sql: 'SELECT slug, locale, content FROM BlogPost WHERE published = 1',
  args: [],
});

const toFix = new Map(); // key = `${locale}/${slug}` → { locale, slug, content }
for (const post of allPublished.rows) {
  const c = post.content ?? '';
  for (const oldSlug of Object.keys(REDIRECTED_SLUG_MAP)) {
    if (c.includes(`/blog/${oldSlug}`)) {
      const key = `${post.locale}/${post.slug}`;
      if (!toFix.has(key)) toFix.set(key, { locale: post.locale, slug: post.slug, content: c });
      log(`  Stale link: ${key} → /blog/${oldSlug}`);
    }
  }
}

if (toFix.size === 0) {
  log('✅  No stale links in published posts');
} else {
  log(`\n  Auto-fixing ${toFix.size} post(s)...`);
  const LOCALES = ['en', 'fr', 'de', 'it', 'es'];
  for (const { locale, slug, content } of toFix.values()) {
    let fixed = content;
    for (const [oldSlug, newSlug] of Object.entries(REDIRECTED_SLUG_MAP)) {
      for (const l of LOCALES) {
        fixed = fixed.replaceAll(`/${l}/blog/${oldSlug}`, `/${l}/blog/${newSlug}`);
      }
    }
    if (fixed !== content) {
      await updatePost(slug, locale, { content: fixed });
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────────
log('\n══════════════════════════════════════════');
log(`DONE — ${totalUpdated} DB rows updated`);
log('══════════════════════════════════════════');
await client.close();

import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const url = process.env.DATABASE_URL ?? 'file:./dev.db';
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, ...(authToken ? { authToken } : {}) });
const prisma = new PrismaClient({ adapter });

const COVER = 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1400&q=80';
const COVER_WATER = 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1400&q=80';
const COVER_MEDINA = 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1400&q=80';
const COVER_HEAT = 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1400&q=80';

async function seed(slug: string, data: object) {
  await prisma.blogPost.upsert({
    where: { slug_locale: { slug, locale: 'en' } },
    update: data as any,
    create: { slug, locale: 'en', ...(data as any) },
  });
  console.log('✓ EN:', slug);
}

async function main() {

  /* ─── 1. Tap water ─────────────────────────────────────────── */
  await seed('can-you-drink-tap-water-marrakech-2026', {
    title: 'Can You Drink Tap Water in Marrakech? (Honest 2026 Answer)',
    category: 'safety',
    excerpt: 'Short answer: no. But here\'s exactly what to do instead — and why most stomach problems in Marrakech have nothing to do with the tap.',
    seoTitle: 'Can You Drink Tap Water in Marrakech? 2026 Honest Guide',
    seoDesc: 'Is tap water safe in Marrakech? Honest 2026 answer: what to drink, what to avoid, and how to not get sick during your visit.',
    coverImage: COVER_WATER,
    ogImage: COVER_WATER,
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date('2026-05-23'),
    content: `
<p class="intro">This is one of the most Googled questions before a trip to Marrakech, and the honest answer is: <strong>don't drink the tap water</strong>. Not because it's toxic — it isn't — but because your stomach isn't used to a different bacterial profile, and the adjustment can ruin two days of your holiday.</p>

<h2>Is Marrakech tap water safe?</h2>

<p>Technically, yes — Marrakech tap water is treated and meets Moroccan national standards set by ONEE (the national water utility). Locals drink it without issue because their bodies are adapted to it. For tourists arriving from Europe, North America, or elsewhere, the problem isn't contamination — it's the <strong>different mineral content and bacteria</strong> that your digestive system has never encountered.</p>

<p>The result: stomach cramps, loose stools, and nausea for 1–2 days. Not dangerous, but not how you want to spend your trip.</p>

<h2>What should you drink instead?</h2>

<ul>
  <li><strong>Bottled water</strong> — available everywhere, costs 3–7 MAD (about €0.30–0.70) for a 1.5L bottle at any hanout (corner shop). Buy in bulk from a supermarket (Carrefour, Label'Vie) for much less.</li>
  <li><strong>Filtered water bottle</strong> — a LifeStraw or GRAYL bottle filters tap water to drinking quality. Better for the environment and cheaper long-term.</li>
  <li><strong>Mint tea</strong> — Moroccan atay is made with boiled water and is completely safe. It's also delicious and offered almost everywhere.</li>
</ul>

<h2>What else to watch for</h2>

<p>Most stomach problems in Marrakech aren't from tap water — they're from:</p>

<ul>
  <li><strong>Raw salads and unpeeled fruit</strong> washed in tap water at cheaper restaurants</li>
  <li><strong>Jemaa el-Fna food stalls</strong> — go where locals eat, avoid the tourist-facing stalls around the square's edge</li>
  <li><strong>Ice in drinks</strong> at budget cafés — made from tap water</li>
  <li><strong>Dairy left unrefrigerated</strong> in summer heat</li>
</ul>

<div class="highlight">
  <strong>Safe rule of thumb:</strong> If the food is freshly cooked and hot, eat it. If it's been sitting out, skip it. Cooked tagines, grilled meats, fresh bread from the oven — all fine. Cold pre-made salads at a cheap buffet — risky.
</div>

<h2>If you do get sick</h2>

<p>Moroccan pharmacies are excellent and well-stocked. Pharmacists typically speak French and often some English. They can give you over-the-counter medications (oral rehydration salts, loperamide) without a prescription. Look for the green crescent sign — there's a pharmacy on almost every main street in Marrakech.</p>

<p>For a short stay of 3–5 days, most visitors have no issues at all with sensible food choices and bottled water. Thousands visit Marrakech every week without any stomach problems.</p>

<h2>Quick checklist before you go</h2>
<ul>
  <li>✓ Drink bottled or filtered water only</li>
  <li>✓ Avoid ice in drinks at budget spots</li>
  <li>✓ Eat hot, freshly cooked food</li>
  <li>✓ Peel all fruit yourself</li>
  <li>✓ Bring oral rehydration sachets just in case</li>
  <li>✓ Save the nearest pharmacy address on Google Maps</li>
</ul>
`,
  });

  /* ─── 2. Getting lost in the medina ────────────────────────── */
  await seed('getting-lost-marrakech-medina-what-to-do-2026', {
    title: 'Getting Lost in the Marrakech Medina: What Actually Happens (2026)',
    category: 'safety',
    excerpt: 'The medina has no grid, no street signs, and thousands of identical-looking alleyways. Here\'s exactly what to do when you\'re lost — and why it\'s not as scary as it sounds.',
    seoTitle: 'Getting Lost in Marrakech Medina: What To Do (2026 Guide)',
    seoDesc: 'Scared of getting lost in the Marrakech medina? Here\'s what actually happens, how to navigate with Google Maps, and what to do if you\'re truly stuck.',
    coverImage: COVER_MEDINA,
    ogImage: COVER_MEDINA,
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date('2026-05-23'),
    content: `
<p class="intro">The Marrakech medina has no grid system, no logical street plan, and thousands of narrow alleys that look exactly the same. Getting "lost" is basically guaranteed. But here's what experienced visitors know: <strong>it's not actually dangerous</strong>, it's navigable, and with two simple tricks you'll find your way back within 10 minutes every time.</p>

<h2>Why the medina feels like a maze</h2>

<p>The medina of Marrakech is over 1,000 years old. It was designed in an era before cars — or street signs. Streets branch and merge organically. Alleyways (derbs) look identical. Dead ends are everywhere. Even locals who grew up here occasionally take wrong turns.</p>

<p>This is not a bug. It's the architecture. The medina was deliberately layered — public thoroughfares on the outside, progressively more private residential streets as you go deeper. As a tourist, you're navigating a living city, not a theme park with clear signage.</p>

<h2>The two things that make it easy</h2>

<h3>1. Download Google Maps offline before you arrive</h3>

<p>Open Google Maps → search "Marrakech" → tap the download icon. The full offline map fits in about 150MB and works without any data or WiFi. It shows your location via GPS even offline. <strong>Drop a pin on your riad or hotel before you leave in the morning.</strong> That's your anchor — you can always navigate back to it.</p>

<h3>2. Navigate by landmark, not street name</h3>

<p>Street names in the medina are either missing, in Arabic, or irrelevant. But landmarks are everywhere and unmissable: Koutoubia Mosque (the tall minaret visible from most of the medina), Jemaa el-Fna square, the spice market (Rahba Kedima), the tanneries. Orient yourself by these, not by streets.</p>

<div class="highlight">
  <strong>Practical tip:</strong> If you're near Bahia Palace and want to get back to Jemaa el-Fna, just walk generally northwest — the mosque minaret is your compass. Google Maps will do the rest.
</div>

<h2>What actually happens when you get lost</h2>

<p>You end up somewhere unexpected. Maybe a quiet residential alley with kids playing. Maybe a small local café that has no tourists. Maybe a hidden riad courtyard. <strong>In practice, being "lost" in the medina is one of the best ways to see the real city.</strong></p>

<p>Nobody threatens you. Nobody demands you buy something (unless you've wandered into the souks, where vendors will call to you — easily ignored). The medina at all hours is full of locals going about their lives.</p>

<h2>If you're genuinely stuck and your phone is dead</h2>

<ol>
  <li>Walk toward noise and activity — you'll hit a main artery</li>
  <li>Walk toward the Koutoubia minaret (visible from most rooftops and open areas)</li>
  <li>Ask any shopkeeper — say the name of your riad or "Jemaa el-Fna?" Most will point you correctly</li>
  <li>If you accept help from a local to navigate, agree on a price <em>before</em> following them, or just get directions and navigate yourself</li>
</ol>

<h2>The scam to know about</h2>

<p>The one real risk while lost: locals who notice you're confused and offer to "help" — then guide you deep into the souks and into a shop where you feel obligated to buy. The fix: look confident, use your phone, and decline any unsolicited guidance with a polite "la, shukran" (no thanks) without stopping.</p>

<p>Being lost in the medina is not dangerous. It's disorienting. Those are very different things. Download the map, drop a pin on your accommodation, and enjoy the wandering.</p>
`,
  });

  /* ─── 3. Summer heat ────────────────────────────────────────── */
  await seed('marrakech-summer-heat-too-hot-what-to-expect-2026', {
    title: 'Is Marrakech Too Hot in Summer? What to Expect & How to Cope (2026)',
    category: 'safety',
    excerpt: 'July and August in Marrakech regularly hit 40°C. It\'s genuinely intense — but completely manageable with the right approach. Here\'s what to expect and what not to do.',
    seoTitle: 'Marrakech Summer Heat 2026: Is It Too Hot? How to Cope',
    seoDesc: 'Is Marrakech too hot in summer? Honest guide to July–August heat in Marrakech: real temperatures, best times to go out, and how to avoid heatstroke.',
    coverImage: COVER_HEAT,
    ogImage: COVER_HEAT,
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date('2026-05-23'),
    content: `
<p class="intro">Marrakech in July and August is <strong>genuinely, intensely hot</strong>. Average highs of 38–42°C (100–108°F), low humidity, and direct sun that feels physical. People visit and enjoy it every year — but only if they understand what they're dealing with and adjust accordingly.</p>

<h2>What the temperatures actually feel like</h2>

<table style="width:100%; border-collapse:collapse; margin: 1rem 0;">
  <thead>
    <tr style="background:#3D2817; color:white;">
      <th style="padding:10px; text-align:left;">Month</th>
      <th style="padding:10px; text-align:left;">Average High</th>
      <th style="padding:10px; text-align:left;">Reality Check</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #E8D5B7;">
      <td style="padding:10px;">March–April</td>
      <td style="padding:10px;">22–28°C</td>
      <td style="padding:10px;">Pleasant. Best season.</td>
    </tr>
    <tr style="border-bottom:1px solid #E8D5B7; background:#FAF3E7;">
      <td style="padding:10px;">May–June</td>
      <td style="padding:10px;">30–36°C</td>
      <td style="padding:10px;">Warm but manageable.</td>
    </tr>
    <tr style="border-bottom:1px solid #E8D5B7;">
      <td style="padding:10px;">July–August</td>
      <td style="padding:10px;">38–42°C</td>
      <td style="padding:10px;">Intense. Rest midday.</td>
    </tr>
    <tr style="border-bottom:1px solid #E8D5B7; background:#FAF3E7;">
      <td style="padding:10px;">September–October</td>
      <td style="padding:10px;">28–34°C</td>
      <td style="padding:10px;">Good. Still warm.</td>
    </tr>
    <tr>
      <td style="padding:10px;">November–February</td>
      <td style="padding:10px;">18–22°C</td>
      <td style="padding:10px;">Ideal. Evenings cold.</td>
    </tr>
  </tbody>
</table>

<p>The "feels like" in July is often 44–46°C in the souks, where narrow streets trap heat and there's no breeze. Stone and tile radiate heat long after the sun drops.</p>

<h2>The summer schedule that locals follow</h2>

<p>Moroccans don't sightsee at noon in July. They don't move at all between 12:00 and 16:00. This is the blueprint for visiting in summer:</p>

<ul>
  <li><strong>7:00–11:00</strong> — Morning sightseeing. Bahia Palace, souks, monuments. Crowds are thin, temperature is 28–33°C.</li>
  <li><strong>11:00–16:00</strong> — Riad, pool, AC. Read. Nap. This is not wasted time — this is how you don't collapse.</li>
  <li><strong>16:00–20:00</strong> — Afternoon sightseeing resumes. Temperature drops, golden light begins.</li>
  <li><strong>20:00–23:00</strong> — Dinner, Jemaa el-Fna, night market. The city comes alive after dark in summer.</li>
</ul>

<div class="highlight">
  <strong>Bahia Palace in summer:</strong> The palace is best visited right at opening (9:00) before the heat builds. The internal courtyards are shaded and relatively cool. Avoid visiting between 12:00–15:00 when temperature inside the open courtyards peaks.
</div>

<h2>Practical heat survival</h2>

<ul>
  <li><strong>Water constantly</strong> — drink at least 3L per day in summer, more if walking. Dehydration sneaks up fast.</li>
  <li><strong>Loose, light clothing</strong> — natural fabrics (cotton, linen). Modesty and heat protection align: covered shoulders and knees actually protect you from the sun.</li>
  <li><strong>Hat + sunscreen</strong> — non-negotiable. The sun in Marrakech is at a lower latitude than most of Europe; it burns faster.</li>
  <li><strong>Electrolytes</strong> — bring rehydration sachets. Sweating heavily depletes sodium and potassium.</li>
  <li><strong>Book a riad with AC or a pool</strong> — this is not a luxury in July. It's how you recover for the next morning.</li>
</ul>

<h2>Warning signs of heat exhaustion</h2>
<p>Heavy sweating → dizziness → headache → nausea. If this happens: get indoors immediately, drink cold water slowly, cool your neck and wrists. If it progresses to no sweating + confusion = heatstroke = emergency. It's rare in tourists who stay hydrated, but real.</p>

<p>Summer in Marrakech is not for everyone. But if you follow the local rhythm — morning, siesta, evening — it's absolutely doable and the city is beautiful.</p>
`,
  });

  /* ─── 4. Do they speak English ──────────────────────────────── */
  await seed('do-they-speak-english-marrakech-language-guide-2026', {
    title: 'Do They Speak English in Marrakech? A Practical Language Guide (2026)',
    category: 'safety',
    excerpt: 'English works fine in tourist areas. Outside them, it gets patchier. Here\'s exactly where you\'ll be understood, where you won\'t, and the 10 words that open every door.',
    seoTitle: 'Do They Speak English in Marrakech? Language Guide 2026',
    seoDesc: 'Do people speak English in Marrakech? Honest 2026 guide: where English works, where it doesn\'t, and the key Arabic and French phrases every visitor needs.',
    coverImage: COVER,
    ogImage: COVER,
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date('2026-05-23'),
    content: `
<p class="intro">The short answer: <strong>English works fine in tourist areas of Marrakech</strong>. Anyone working in the medina near major monuments — hotels, riads, restaurants, souvenir shops, tour guides — almost certainly speaks some English. Step into a residential neighbourhood or local market and it gets patchier fast.</p>

<h2>The language reality in Marrakech</h2>

<p>Morocco has a layered language situation:</p>

<ul>
  <li><strong>Darija</strong> (Moroccan Arabic) — the everyday spoken language. Not quite the same as standard Arabic — Egyptian or Gulf Arabic speakers need adjustment too.</li>
  <li><strong>French</strong> — the language of administration, education, and business. Most educated Moroccans speak French fluently. It's your best backup if English fails.</li>
  <li><strong>English</strong> — common in tourist-facing jobs. Growing rapidly among younger Moroccans.</li>
  <li><strong>Spanish</strong> — spoken in the north of Morocco (Tangier, Tetouan). Less common in Marrakech.</li>
</ul>

<h2>Where English definitely works</h2>
<ul>
  <li>Riads and hotels (staff are often multilingual)</li>
  <li>Ticket offices at Bahia Palace, Jardin Majorelle, Saadian Tombs</li>
  <li>Restaurants in tourist areas of the medina</li>
  <li>Licensed tour guides and official guides at monuments</li>
  <li>Souvenir and craft shops near major attractions</li>
  <li>Jemaa el-Fna square — vendors will approach you in English</li>
</ul>

<h2>Where French helps more than English</h2>
<ul>
  <li>Pharmacies, banks, post offices</li>
  <li>Local neighbourhood restaurants (not tourist-facing)</li>
  <li>Petit taxi drivers (many speak French not English)</li>
  <li>Municipal offices, train station staff</li>
</ul>

<h2>10 words in Darija that change everything</h2>

<p>You don't need to learn Moroccan Arabic. But 10 words will get you genuine smiles and much better treatment:</p>

<table style="width:100%; border-collapse:collapse; margin: 1rem 0;">
  <thead>
    <tr style="background:#3D2817; color:white;">
      <th style="padding:8px 12px; text-align:left;">Darija</th>
      <th style="padding:8px 12px; text-align:left;">Pronunciation</th>
      <th style="padding:8px 12px; text-align:left;">Meaning</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #E8D5B7;"><td style="padding:8px 12px;">السلام عليكم</td><td style="padding:8px 12px;">Salam alaykoum</td><td style="padding:8px 12px;">Hello (formal, respectful)</td></tr>
    <tr style="border-bottom:1px solid #E8D5B7; background:#FAF3E7;"><td style="padding:8px 12px;">شكرا</td><td style="padding:8px 12px;">Shukran</td><td style="padding:8px 12px;">Thank you</td></tr>
    <tr style="border-bottom:1px solid #E8D5B7;"><td style="padding:8px 12px;">لا شكرا</td><td style="padding:8px 12px;">La, shukran</td><td style="padding:8px 12px;">No thank you (stops touts)</td></tr>
    <tr style="border-bottom:1px solid #E8D5B7; background:#FAF3E7;"><td style="padding:8px 12px;">بصح</td><td style="padding:8px 12px;">Bsaħ</td><td style="padding:8px 12px;">OK / right</td></tr>
    <tr style="border-bottom:1px solid #E8D5B7;"><td style="padding:8px 12px;">بشحال؟</td><td style="padding:8px 12px;">B'shħal?</td><td style="padding:8px 12px;">How much?</td></tr>
    <tr style="border-bottom:1px solid #E8D5B7; background:#FAF3E7;"><td style="padding:8px 12px;">غالي</td><td style="padding:8px 12px;">Ghali</td><td style="padding:8px 12px;">Expensive (useful for haggling)</td></tr>
    <tr style="border-bottom:1px solid #E8D5B7;"><td style="padding:8px 12px;">فين؟</td><td style="padding:8px 12px;">Fin?</td><td style="padding:8px 12px;">Where is…?</td></tr>
    <tr style="border-bottom:1px solid #E8D5B7; background:#FAF3E7;"><td style="padding:8px 12px;">عافاك</td><td style="padding:8px 12px;">'Afak</td><td style="padding:8px 12px;">Please</td></tr>
    <tr style="border-bottom:1px solid #E8D5B7;"><td style="padding:8px 12px;">مزيان</td><td style="padding:8px 12px;">Mzyan</td><td style="padding:8px 12px;">Good / very good</td></tr>
    <tr><td style="padding:8px 12px;">بالساعة</td><td style="padding:8px 12px;">B'ssaʿa</td><td style="padding:8px 12px;">By the meter (taxis)</td></tr>
  </tbody>
</table>

<div class="highlight">
  <strong>Pro tip:</strong> Starting any interaction with "Salam alaykoum" instead of diving straight into English signals respect. The response — "Wa alaykoum salam" — is warm and sets a different tone for the whole conversation.
</div>

<h2>Google Translate in Marrakech</h2>

<p>Download the Arabic language pack offline before you go. The camera translation feature works reasonably well on menus and signs. For spoken conversation, the voice translation is hit-or-miss with Darija (which differs significantly from standard Arabic) but good for French.</p>

<p>The language barrier in Marrakech is much lower than many visitors fear. A willingness to try, a smile, and a "shukran" go further than perfect grammar every time.</p>
`,
  });

  /* ─── 5. Vaccinations ───────────────────────────────────────── */
  await seed('vaccinations-marrakech-morocco-what-you-need-2026', {
    title: 'Do You Need Vaccinations for Marrakech? (2026 Health Guide)',
    category: 'safety',
    excerpt: 'No mandatory vaccines are required to enter Morocco. But there are 3 that doctors consistently recommend. Here\'s what to know and when to book your appointment.',
    seoTitle: 'Vaccinations for Marrakech 2026: What You Actually Need',
    seoDesc: 'Do you need vaccinations to visit Marrakech in 2026? No mandatory jabs required — but here\'s what doctors recommend and the health prep that actually matters.',
    coverImage: COVER,
    ogImage: COVER,
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date('2026-05-23'),
    content: `
<p class="intro"><strong>No vaccinations are legally required to enter Morocco.</strong> There's no mandatory yellow fever shot, no health certificate at the border. But travel medicine doctors consistently recommend a few updates before any trip to North Africa — here's what's actually worth doing.</p>

<h2>No mandatory vaccines required</h2>

<p>Morocco does not require proof of vaccination to enter (except yellow fever if you're arriving from a yellow fever endemic country in sub-Saharan Africa or Latin America). If you're flying from Europe, North America, or most of Asia, you walk through with just your passport.</p>

<h2>Vaccines that doctors commonly recommend</h2>

<h3>1. Hepatitis A — strongly recommended</h3>
<p>Transmitted via contaminated food or water. Marrakech is not high-risk, but hepatitis A exists across North Africa. Most people from Europe/North America are already vaccinated as children — check your records. If not, get it: it's two shots over 6–12 months, or a single shot at least 2 weeks before departure.</p>

<h3>2. Typhoid — recommended for longer stays</h3>
<p>Same transmission as hepatitis A (food/water). For a short city trip to Marrakech (under 2 weeks) with restaurant meals, the risk is low. For longer trips, rural areas, or adventurous eating, it's worth considering. Oral vaccine (3 capsules) or single injection.</p>

<h3>3. Make sure routine vaccines are up to date</h3>
<p>Tetanus-diphtheria-pertussis, MMR (measles-mumps-rubella), and COVID boosters if applicable. These aren't Morocco-specific but travel is a good reminder to check when you last had them.</p>

<h2>What about rabies?</h2>
<p>Stray cats and dogs are common in Marrakech and throughout Morocco. The rabies vaccine is generally recommended for travellers who will be in close contact with animals, especially in rural areas. For a typical tourist stay in the city, it's not routinely recommended. If a cat or dog bites you, seek immediate medical attention regardless of vaccination status — post-exposure treatment is available in Marrakech.</p>

<h2>Malaria — not a concern in Marrakech</h2>
<p>Marrakech and the major Moroccan cities have no malaria risk. No prophylaxis needed. The risk is zero at any time of year.</p>

<h2>What actually causes most health issues in Marrakech</h2>

<p>Not vaccine-preventable diseases. The most common health problems tourists face:</p>
<ul>
  <li><strong>Stomach issues</strong> — from tap water, unpeeled fruit, unrefrigerated food (see our <a href="/blog/can-you-drink-tap-water-marrakech-2026">water safety guide</a>)</li>
  <li><strong>Sunstroke / dehydration</strong> — common in summer, entirely preventable</li>
  <li><strong>Minor injuries</strong> — from the medina's uneven cobblestones (wear flat, closed shoes)</li>
</ul>

<div class="highlight">
  <strong>Timeline:</strong> Book a travel health appointment at least 6–8 weeks before departure. Some vaccines (hepatitis A full course, typhoid oral) require multiple doses or advance time. A single GP or travel clinic appointment handles everything.
</div>

<h2>Travel insurance</h2>
<p>More important than most vaccines for a Marrakech trip. Ensure your policy covers emergency medical repatriation. Medical care in Marrakech is available (Clinique Internationale is the main private hospital used by tourists), but costs can be significant without insurance.</p>

<p>In summary: no jabs required to enter, hepatitis A is worth updating if you haven't had it, and travel insurance is non-negotiable. Everything else is standard common sense.</p>
`,
  });

}

main().catch(console.error).finally(() => prisma.$disconnect());

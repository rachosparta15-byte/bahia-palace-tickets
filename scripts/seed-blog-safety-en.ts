import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const url = process.env.DATABASE_URL ?? 'file:./dev.db';
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, ...(authToken ? { authToken } : {}) });
const prisma = new PrismaClient({ adapter });

const COVER = 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1400&q=80';

async function seed(slug: string, data: object) {
  await prisma.blogPost.upsert({
    where: { slug_locale: { slug, locale: 'en' } },
    update: data as any,
    create: { slug, locale: 'en', ...(data as any) },
  });
  console.log('✓ EN:', slug);
}

async function main() {
  await seed('marrakech-tourist-fears-taxi-scam-fake-guide-2026', {
    title: 'Marrakech Safety 2026: Honest Answers to What Tourists Fear Most',
    category: 'safety',
    excerpt: 'Fake taxis, fake guides, henna traps, monkey photos — these are the fears first-time visitors post about before every trip. Here\'s exactly what happens, and exactly what to do.',
    seoTitle: 'Marrakech Tourist Fears 2026: Taxi Scams, Fake Guides & Real Safety Tips',
    seoDesc: 'Scared about visiting Marrakech? We answer the exact fears first-time tourists post on Reddit: fake taxis, fake guides, henna traps, snake photos, and more. Honest 2026 guide.',
    coverImage: COVER,
    ogImage: COVER,
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date('2026-05-23'),
    content: `
<p class="intro">Every week, hundreds of first-time visitors post the same questions before their trip to Marrakech: <em>"Is it really that bad with scammers?"</em> <em>"What do I do if a taxi driver refuses the meter?"</em> <em>"Someone put a snake on my neck and demanded money — is that real?"</em></p>

<p>Yes, these things happen. No, they are not dangerous. And once you know the exact script each scam follows, you'll handle every single one calmly — without ruining your trip.</p>

<p>Here are the 8 most common fears, explained honestly.</p>

<h2>1. "The taxi driver refused to use the meter and demanded 200 MAD for a short ride"</h2>

<p>This is <strong>the single most-reported frustration</strong> in every Marrakech travel forum. It happens at the airport, outside major hotels, and near Jemaa el-Fna.</p>

<p><strong>What actually happens:</strong> A petit taxi (small red taxi) quotes you a flat rate — usually 3–5× the meter price. When you ask for the meter, the driver says it's "broken" or ignores you.</p>

<p><strong>The real prices (2026):</strong></p>
<ul>
  <li>Airport → Medina: <strong>100–120 MAD</strong> by meter (day). Drivers will quote 250–400 MAD.</li>
  <li>Jemaa el-Fna → Bahia Palace: <strong>15–25 MAD</strong> by meter. Drivers will quote 80–100 MAD.</li>
  <li>Any ride within the medina walls: rarely more than 30 MAD by meter.</li>
</ul>

<div class="highlight">
  <strong>What to do:</strong> Before getting in, say "b'ssaʿa" (بالساعة) — it means "by the meter." If they refuse, close the door and walk to the next taxi. There are always more. Alternatively, use <strong>inDriver</strong> or <strong>Careem</strong> — app-based taxis with fixed prices, no negotiation needed.
</div>

<h2>2. "A friendly local offered to show me around, then led me into shops for 2 hours"</h2>

<p>This is Marrakech's most famous scam, and it works because it doesn't feel like a scam at first. A young, well-dressed person approaches near the entrance to the medina or Jemaa el-Fna. They speak excellent English or French. They seem genuinely helpful.</p>

<p><strong>The script is always the same:</strong></p>
<ol>
  <li>"The main entrance is closed today — I'll show you a shortcut."</li>
  <li>"I'm a student, I just want to practice my English."</li>
  <li>"Don't worry, I don't want money — I just enjoy meeting tourists."</li>
</ol>

<p>Forty minutes later you're deep in the medina, in a carpet shop, being served mint tea, and feeling social pressure to buy something at 10× its real value. The "friendly local" gets a 30–50% commission from the shop.</p>

<div class="highlight">
  <strong>What to do:</strong> The only effective response is a polite but firm "La, shukran" (لا، شكرًا — No, thank you) and keep walking without stopping. Do not engage, do not explain yourself, do not argue. The moment you stop walking, the pitch begins. Use Google Maps offline — the medina is navigable. You will not actually get lost.
</div>

<h2>3. "A woman grabbed my hand and started drawing henna before I could say no"</h2>

<p>This happens near Jemaa el-Fna and outside popular monuments. A woman — sometimes with a young child — approaches and begins applying henna to your hand before you've agreed to anything.</p>

<p>When the design is finished, they demand 200–500 MAD (sometimes more). If you refuse to pay or pay less, they follow you, shout, and create a scene designed to embarrass you into paying.</p>

<div class="highlight">
  <strong>What to do:</strong> Keep your hands to yourself near crowded areas. If someone touches your hand, withdraw it immediately and say "La" firmly. If you want henna, agree on the full price AND the exact design before sitting down. A simple design should cost 20–50 MAD from a reputable stall.
</div>

<h2>4. "Someone put a snake around my neck / a monkey on my shoulder for a photo"</h2>

<p>Around Jemaa el-Fna square, performers operate with snakes (cobras), monkeys in costumes, and other animals. The trap: they place the animal on you without your consent, someone takes a photo, and then demands €20–50 (or more) before you can leave.</p>

<p>The animals are often distressed and in poor condition. This is also a welfare issue, not just a tourist trap.</p>

<div class="highlight">
  <strong>What to do:</strong> Walk past with purpose. If you want to photograph the performers from a distance, keep moving after. Never let anyone place an animal on you or hand you something without first agreeing on the price. Once the photo is taken, your negotiating leverage is zero.
</div>

<h2>5. "Someone told me my riad / hotel was closed and redirected me"</h2>

<p>This scam targets tourists arriving on foot in the medina with luggage. A local approaches and claims your booked accommodation has "closed," "moved," or "had a fire last week." They offer to take you to a better place — which pays them a commission.</p>

<div class="highlight">
  <strong>What to do:</strong> Ignore anyone making these claims. Call your riad directly from the street — they will send someone to guide you, or confirm the address. Every legitimate riad has staff who can meet you. Your booking exists; the claim that it doesn't is false.
</div>

<h2>6. "I was invited for tea in a shop and felt I had to buy something"</h2>

<p>In the souks, shop owners — especially carpet and textile sellers — invite tourists for mint tea. It's genuinely hospitable Moroccan culture. It is also a calculated sales technique.</p>

<p>After 20 minutes of tea and conversation, carpets are unfurled in front of you, prices quoted, and the social obligation of having accepted hospitality creates real pressure to buy.</p>

<div class="highlight">
  <strong>What to do:</strong> You are under zero obligation to buy anything because someone gave you tea. It is completely acceptable to say "It's beautiful, but not for me today" and leave. The tactic only works if you feel guilty about it. Don't.
</div>

<h2>7. "Someone offered me drugs then a 'policeman' appeared and demanded a fine"</h2>

<p>A stranger offers kif (cannabis) or other substances casually, and moments later an accomplice posing as a plainclothes police officer appears and demands an on-the-spot "fine" of 500–2,000 MAD to avoid arrest.</p>

<p>There are no real police involved. Both people are scammers.</p>

<div class="highlight">
  <strong>What to do:</strong> Decline any offer of substances from a stranger immediately, regardless of how friendly or casual it seems. If you're ever approached by someone claiming to be police, ask to be taken to the official police station (commissariat). Real police will comply. Scammers will immediately back off.
</div>

<h2>8. "Is it safe to walk in the medina at night, especially as a solo woman?"</h2>

<p>This is the most-asked question in every Marrakech travel forum, and the honest answer is: <strong>yes, with common-sense precautions.</strong></p>

<p>Violent crime against tourists is rare. Marrakech's main squares and the principal medina streets are busy with locals, families, and tourists until late at night. The real risk is persistent verbal pestering, not physical danger.</p>

<p>Solo women report more unwanted attention and more persistence from touts. This doesn't mean it's unsafe — it means walking with purpose, using earphones as a social signal, and having a map ready reduces friction significantly.</p>

<div class="highlight">
  <strong>Practical tips for solo travellers:</strong>
  <ul style="margin-top: 8px; padding-left: 16px;">
    <li>Stick to lit streets and avoid deserted alleyways at night</li>
    <li>Dress modestly (shoulders and knees covered) — it reduces unsolicited attention</li>
    <li>Walk with purpose; hesitation signals uncertainty and attracts touts</li>
    <li>If someone follows you, walk into any shop or restaurant and ask staff for help</li>
    <li>Save the tourist police number: <strong>0524 38 46 01</strong></li>
  </ul>
</div>

<h2>The one thing that changes everything</h2>

<p>Every single scam above relies on one thing: <strong>you being uncertain</strong>. Uncertainty about prices, about whether the taxi meter is legally required (it is), about whether you're obligated to buy something because someone was nice to you (you're not).</p>

<p>The tourists who leave Marrakech saying "it was fine, nothing happened to us" are not lucky — they just knew the scripts in advance. Now you do too.</p>

<h2>Practical quick-reference</h2>

<ul>
  <li><strong>Taxi meter refused?</strong> Say "b'ssaʿa" or get out, find another, or use inDriver/Careem app</li>
  <li><strong>Fake guide?</strong> "La, shukran" and keep walking without stopping</li>
  <li><strong>Henna ambush?</strong> Withdraw hand immediately, agree price BEFORE any design starts</li>
  <li><strong>Animal photo trap?</strong> Never let anyone place anything on you before agreeing a price</li>
  <li><strong>Riad "closed"?</strong> Call your riad directly — the claim is false</li>
  <li><strong>Fake police?</strong> Ask to go to the official commissariat — scammers will disappear</li>
  <li><strong>Emergency?</strong> Tourist police: <strong>0524 38 46 01</strong> — Brigade Touristique: <strong>19</strong></li>
</ul>

<p>Marrakech is genuinely one of the most extraordinary cities you'll ever visit. The souks, the architecture, the food, the light — none of that is a scam. Go prepared, and you'll come back wanting to return.</p>
`,
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());

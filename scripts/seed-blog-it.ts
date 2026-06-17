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
    where: { slug_locale: { slug, locale: 'it' } },
    update: data as any,
    create: { slug, locale: 'it', ...(data as any) },
  });
  console.log('✓ IT:', slug);
}

async function main() {
  await seed('palazzo-bahia-marrakech-storia', {
    title: 'Palazzo Bahia Marrakech: Storia, Segreti e Guida alla Visita 2026',
    category: 'history',
    excerpt: 'Scopri la storia affascinante del palazzo più bello di Marrakech — tra ambizione politica, storia d\'amore e segreti di corte.',
    seoTitle: 'Palazzo Bahia Marrakech: Storia, Segreti & Visita 2026',
    seoDesc: 'La storia affascinante del Palazzo Bahia a Marrakech: segreti del Gran Visir Ba Ahmed, storia d\'amore, orari, prezzi e consigli per la visita 2026.',
    coverImage: COVER,
    ogImage: COVER,
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date('2026-05-22'),
    content: `
<p class="intro">Se stai pianificando di visitare il <strong>Palazzo Bahia a Marrakech</strong>, ti aspetta molto più di un bel edificio. Dietro le sue mura color ocra si nasconde una storia affascinante di potere, amore e tragedia che ha segnato il Marocco moderno.</p>

<h2>Chi ha costruito il Palazzo Bahia? L'ascesa di Ba Ahmed</h2>

<p>Per capire la grandiosità di questo <strong>palazzo storico di Marrakech</strong>, bisogna conoscere il suo creatore: <strong>Ahmed ben Moussa</strong>, noto come <strong>Ba Ahmed</strong>.</p>

<p>Figlio di un servitore di corte del sultano, Ba Ahmed aveva un aspetto poco attraente, ma la sua astuzia politica era straordinaria. Dopo la morte del Sultano Hassan I nel 1894, installò il giovane erede <strong>Moulay Abdelaziz</strong> (allora solo 14 anni) sul trono, proclamandosi Gran Visir — l'uomo più potente e ricco del Regno del Marocco.</p>

<div class="highlight">
  <strong>Lo sapevi?</strong> Oggi il Palazzo Bahia si estende su 8 ettari e conta quasi 150 stanze, rendendolo uno dei più vasti palazzi storici del Marocco.
</div>

<h2>Chi era "Bahia"? La favorita del Gran Visir</h2>

<p>Contrariamente a quanto si crede, <strong>"Bahia" non è un nome di famiglia</strong>, ma il nome di una donna. Ba Ahmed aveva un ampio harem con 4 mogli legittime e 24 concubine. Tra queste, una si distingueva per la sua straordinaria bellezza e grazia: <strong>Lalla Boura</strong>.</p>

<p>Il Gran Visir era perdutamente innamorato di lei. Per esprimere la sua passione, decise di dare il nome della sua creazione più bella in suo onore.</p>

<div class="highlight">
  In arabo, <strong>Al-Bahia</strong> significa <em>"La Splendente"</em> o <em>"La Magnifica"</em>. Il Palazzo Bahia è quindi, in origine, un'immensa dichiarazione d'amore architettonica.
</div>

<h2>Quanto è durata la costruzione?</h2>

<p>I lavori sono durati circa <strong>6 anni, dal 1894 al 1900</strong>. Fu un cantiere faraónico e ininterrotto.</p>

<p>Il palazzo fu concepito come un <strong>labirinto senza un piano architettonico globale prestabilito</strong>. Perché? Semplicemente perché Ba Ahmed acquistava continuamente nuovi terreni e aggiungeva nuove stanze, cortili interni e appartamenti privati ogni volta che una nuova moglie o concubina entrava nel suo harem.</p>

<h2>I segreti di corte: ciò che le guide non raccontano</h2>

<h3>Il tragico saccheggio dopo la morte del Visir</h3>

<p>Nel 1900, l'ossessione di Ba Ahmed si realizza: il palazzo è finalmente completato. Sfortunatamente, il destino è ironico. Il Gran Visir muore nello stesso anno, poche settimane dopo la fine dei lavori.</p>

<p>Non appena fu annunciata la sua morte, il giovane Sultano Moulay Abdelaziz ordinò il <strong>sequestro dei beni del suo ex reggente</strong>. In meno di 48 ore, il palazzo fu completamente saccheggiato da cortigiani, guardie e dalla famiglia reale.</p>

<div class="highlight">
  Tappeti di seta, mobili intarsiati di madreperla, gioielli preziosi e specchi importati dall'Europa furono rubati. È per questo che durante la vostra visita al Palazzo Bahia troverete stanze architettonicamente sontuose, ma <strong>completamente vuote</strong>.
</div>

<h2>L'epoca del Protettorato Francese</h2>

<p>Alcuni anni dopo, nel <strong>1912</strong>, il Marocco passò sotto il protettorato francese. Il <strong>generale Hubert Lyautey</strong>, primo residente generale francese in Marocco, si innamorò della dimora e decise di farne la sua residenza ufficiale a Marrakech.</p>

<h2>Informazioni pratiche per il 2026</h2>

<ul>
  <li><strong>Indirizzo:</strong> Rue Riad Zitoun el-Jedid, Medina di Marrakech</li>
  <li><strong>Orari:</strong> Tutti i giorni 9:00–17:00</li>
  <li><strong>Prezzo adulti stranieri:</strong> 100 MAD (≈ 9 €)</li>
  <li><strong>Bambini stranieri (7–13 anni):</strong> 50 MAD</li>
  <li><strong>Bambini sotto i 7 anni:</strong> Gratuito</li>
  <li><strong>Durata consigliata:</strong> 1–1,5 ore (2 ore con guida)</li>
  <li><strong>Momento migliore:</strong> Presto al mattino (9h) o dopo le 15h</li>
</ul>

<h2>Domande frequenti</h2>

<h3>Perché le stanze del palazzo sono vuote?</h3>
<p>Alla morte di Ba Ahmed nel 1900, il Sultano Moulay Abdelaziz ordinò il sequestro dei suoi beni. Il palazzo fu <strong>completamente saccheggiato in meno di 48 ore</strong>.</p>

<h3>Sono disponibili tour guidati in italiano?</h3>
<p>Sì, i nostri tour guidati sono disponibili in inglese, francese, spagnolo, italiano e tedesco.</p>

<h3>Vale la pena visitare il Palazzo Bahia?</h3>
<p>Assolutamente. È considerato uno dei migliori esempi di architettura e artigianato marocchino del XIX secolo. La scala, i dettagli e l'atmosfera lo rendono un punto culminante di qualsiasi itinerario a Marrakech.</p>
`,
  });

  await seed('salta-fila-palazzo-bahia-marrakech-biglietti-2026', {
    title: 'Salta la Fila al Palazzo Bahia — Biglietti Marrakech 2026',
    category: 'visit-tips',
    excerpt: 'Tutto quello che devi sapere sui biglietti del Palazzo Bahia 2026 — prezzi, opzioni salta fila, orari di apertura e consigli insider.',
    seoTitle: 'Salta Fila Palazzo Bahia — Biglietti Marrakech 2026',
    seoDesc: 'Acquista biglietti salta fila per Palazzo Bahia Marrakech. Prezzi, orari, tour guidati & consigli insider per il 2026. Nessuna coda, conferma immediata.',
    coverImage: COVER,
    ogImage: COVER,
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date('2026-05-22'),
    content: `
<p class="intro">Stai pianificando di visitare il <strong>Palazzo Bahia a Marrakech</strong>? Acquistare i biglietti in anticipo è la mossa più intelligente che puoi fare. Le lunghe code all'ingresso possono rubare 30–45 minuti del tuo prezioso tempo di vacanza — ecco come saltarle completamente.</p>

<h2>Prezzi Biglietti Palazzo Bahia 2026</h2>

<p>Il prezzo di ingresso standard è <strong>100 MAD</strong> per gli adulti stranieri (circa 9 € / 10 $). Bambini stranieri di 7–13 anni: 50 MAD. I bambini sotto i 7 anni entrano gratis. Per i visitatori che desiderano un'esperienza più ricca, sono disponibili tour guidati e opzioni salta fila a partire da <strong>10 €</strong>.</p>

<h2>Perché acquistare biglietti salta fila?</h2>

<p>Il Palazzo Bahia è uno dei <strong>monumenti più visitati del Marocco</strong>, con oltre 500.000 visitatori all'anno. Durante la stagione di punta (marzo–maggio e settembre–novembre), le code all'ingresso possono raggiungere 45 minuti o più. Con un biglietto salta fila prenotato in anticipo, entri direttamente — nessuna attesa, nessuno stress.</p>

<h2>Cosa è incluso in ogni tipo di biglietto</h2>

<h3>Ingresso Salta Fila Standard</h3>
<p>Biglietto di ingresso pre-validato che ti permette di bypassare la coda al cancello principale. Valido per la data che scegli. Include accesso a tutte le aree aperte del palazzo.</p>

<h3>Tour Guidato con Esperto</h3>
<p>Tutto nel biglietto salta fila più una guida locale certificata. Durata: circa 2 ore.</p>

<h3>Tour Privato</h3>
<p>Un'esperienza privata esclusiva per coppie, famiglie o piccoli gruppi. Perfetto per gli amanti della fotografia e gli appassionati di storia.</p>

<h2>Orari di apertura</h2>

<ul>
  <li><strong>Lunedì – Domenica:</strong> 09:00 – 17:00</li>
  <li>Ultimo ingresso: 16:30</li>
  <li>Chiuso durante la preghiera del venerdì (12:00–14:00 il venerdì)</li>
</ul>

<h2>Consigli insider</h2>

<ul>
  <li><strong>Vestiti in modo sobrio</strong> — spalle e ginocchia dovrebbero essere coperte per rispetto delle usanze locali.</li>
  <li><strong>Porta una macchina fotografica</strong> — i soffitti in cedro intagliato e i mosaici di zellige sono tra i più fotogenici di tutto il Marocco.</li>
  <li><strong>Combina la tua visita</strong> con il Palazzo Badi e le Tombe Saadiane nelle vicinanze per un'intera giornata di storia di Marrakech.</li>
  <li><strong>Prenota in anticipo</strong> — specialmente durante il Ramadan o le vacanze scolastiche.</li>
</ul>

<h2>Domande frequenti</h2>

<h3>Posso acquistare biglietti alla cassa?</h3>
<p>Sì, ma rischi di aspettare fino a 45 minuti durante i periodi di punta. La prenotazione anticipata garantisce il tuo orario di ingresso e salta completamente la coda.</p>

<h3>Vale la pena visitare il Palazzo Bahia?</h3>
<p>Assolutamente. È considerato uno dei migliori esempi di architettura e artigianato marocchino del XIX secolo.</p>

<h3>Sono disponibili tour guidati in italiano?</h3>
<p>Sì, i nostri tour guidati sono disponibili in inglese, francese, spagnolo, italiano e tedesco.</p>
`,
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());

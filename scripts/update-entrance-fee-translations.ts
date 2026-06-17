import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const NOW = new Date();
const SLUG = 'bahia-palace-entrance-fee-2026';

const translations = [
  {
    locale: 'fr',
    title: 'Tarif entrée Bahia Palace 2026 : prix, réductions et bons plans',
    seoTitle: 'Tarif entrée Bahia Palace 2026 : prix et bons plans',
    seoDesc: "Tarif d'entrée Bahia Palace 2026 : prix officiel 100 MAD, remises, options skip-the-line et comment économiser. Tout ce qu'il faut savoir avant d'y aller.",
    excerpt: "Tarif d'entrée Bahia Palace 2026 : prix officiel 100 MAD, remises, options skip-the-line et comment économiser. Tout ce qu'il faut savoir avant d'y aller.",
    content: `<p>Le tarif officiel d'entrée à Bahia Palace est de 100 MAD — soit environ 10 $ ou 9 €. À l'échelle internationale, c'est une aubaine pour l'un des palais islamiques les mieux préservés au monde. Mais le chiffre sur le billet n'est pas le vrai coût. Le vrai coût, c'est les 30 à 45 minutes passées à faire la queue à l'unique guichet, en pleine chaleur, à regarder votre fenêtre de visite se rétrécir.</p>

<h2>Tarif d'entrée officiel</h2>
<p>En 2026, le tarif d'entrée standard fixé par le Ministère de la Culture du Maroc est :</p>
<table>
  <thead><tr><th>Catégorie</th><th>Prix</th></tr></thead>
  <tbody>
    <tr><td>Adultes (visiteurs étrangers)</td><td>100 MAD (~10 $ / 9 €)</td></tr>
    <tr><td>Enfants étrangers (7–13 ans)</td><td>50 MAD</td></tr>
    <tr><td>Adultes marocains</td><td>30 MAD</td></tr>
    <tr><td>Enfants marocains (7–13 ans)</td><td>10 MAD</td></tr>
    <tr><td>Enfants de moins de 7 ans</td><td>Gratuit</td></tr>
  </tbody>
</table>
<p>Le paiement à la caisse est <strong>en espèces uniquement</strong>. Il n'y a pas de lecteur de carte au guichet. Les distributeurs les plus proches se trouvent à quelques minutes à pied, près de la Rue Riad Zitoun el Kedim. Venez avec des dirhams.</p>

<h2>Y a-t-il des réductions ?</h2>
<h3>Enfants</h3>
<p>Les enfants de moins de 7 ans entrent gratuitement. Les enfants étrangers de 7 à 13 ans paient 50 MAD (la moitié du tarif adulte). Les enfants marocains paient 10 MAD. Une famille de deux adultes étrangers et deux enfants de 7–13 ans dépense 300 MAD au total.</p>
<h3>Nationaux et visiteurs étrangers</h3>
<p>Le Maroc applique un double tarif dans de nombreux sites culturels gérés par l'État. Bahia Palace ne fait pas exception : les adultes marocains paient 30 MAD (enfants : 10 MAD) contre 100 MAD pour les adultes étrangers.</p>
<h3>Réductions de groupe</h3>
<p>Il n'existe pas de réduction de groupe officielle au guichet standard pour les visiteurs étrangers. Si vous voyagez de manière indépendante, attendez-vous à payer 100 MAD par adulte quelle que soit la taille du groupe.</p>

<h2>Billet skip-the-line : en vaut-il la peine ?</h2>
<p>La réponse honnête : <strong>oui, surtout entre mars et novembre.</strong></p>
<p>Pendant la haute saison touristique à Marrakech, la file d'attente à l'unique guichet de Bahia Palace peut durer 30 à 45 minutes. Un <a href="/fr/tickets/skip-the-line">billet skip-the-line</a> vous permet de contourner entièrement cette file.</p>

<h2>Qu'est-ce qui est inclus dans le billet ?</h2>
<p>Que vous achetiez à la caisse ou en ligne, votre billet comprend l'accès complet aux principaux cours, salles de réception, jardins et aux anciens quartiers du harem — visite libre à votre rythme.</p>

<h2>Questions fréquemment posées</h2>
<h3>Combien coûte l'entrée à Bahia Palace ?</h3>
<p>Le tarif d'entrée standard est de 100 MAD pour les adultes étrangers (environ 10 $ / 9 € en 2026). Les enfants étrangers de 7 à 13 ans paient 50 MAD. Les adultes marocains paient 30 MAD ; les enfants marocains paient 10 MAD. Les enfants de moins de 7 ans entrent gratuitement. Le paiement à la caisse est en espèces uniquement.</p>
<h3>Est-il moins cher d'acheter les billets à la caisse ou en ligne ?</h3>
<p>Le prix de base du billet est le même. Les <a href="/fr/tickets/skip-the-line">billets skip-the-line</a> en ligne peuvent inclure de petits frais de réservation, mais ils vous font économiser 30 à 45 minutes de file d'attente — cela vaut largement le coup en haute saison.</p>`,
  },
  {
    locale: 'it',
    title: 'Biglietto Bahia Palace 2026: prezzi, sconti e come risparmiare',
    seoTitle: 'Biglietto Bahia Palace 2026: prezzi e come risparmiare',
    seoDesc: "Biglietto d'ingresso Bahia Palace 2026: prezzo ufficiale 100 MAD, sconti, opzione skip-the-line e consigli per risparmiare tempo e denaro a Marrakech.",
    excerpt: "Biglietto d'ingresso Bahia Palace 2026: prezzo ufficiale 100 MAD, sconti, opzione skip-the-line e consigli per risparmiare tempo e denaro a Marrakech.",
    content: `<p>Il prezzo ufficiale del biglietto d'ingresso a Bahia Palace è 100 MAD — circa 10 $ o 9 €. In termini internazionali, è un ottimo affare per uno dei palazzi islamici meglio conservati al mondo. Ma il numero sul biglietto non è il vero costo. Il vero costo sono i 30-45 minuti trascorsi in fila all'unico sportello, sotto il sole, mentre la vostra finestra di visita si riduce.</p>

<h2>Tariffa d'ingresso ufficiale</h2>
<p>Nel 2026, la tariffa d'ingresso standard fissata dal Ministero della Cultura del Marocco è:</p>
<table>
  <thead><tr><th>Categoria</th><th>Prezzo</th></tr></thead>
  <tbody>
    <tr><td>Adulti (visitatori stranieri)</td><td>100 MAD (~10 $ / 9 €)</td></tr>
    <tr><td>Bambini stranieri (7–13 anni)</td><td>50 MAD</td></tr>
    <tr><td>Adulti marocchini</td><td>30 MAD</td></tr>
    <tr><td>Bambini marocchini (7–13 anni)</td><td>10 MAD</td></tr>
    <tr><td>Bambini sotto i 7 anni</td><td>Gratuito</td></tr>
  </tbody>
</table>
<p>Il pagamento alla biglietteria è <strong>solo in contanti</strong>. Non ci sono terminali POS allo sportello. I bancomat più vicini si trovano a breve distanza a piedi, vicino a Rue Riad Zitoun el Kedim.</p>

<h2>Esistono sconti?</h2>
<h3>Bambini</h3>
<p>I bambini sotto i 7 anni entrano gratuitamente. I bambini stranieri tra i 7 e i 13 anni pagano 50 MAD (la metà della tariffa adulta). I bambini marocchini pagano 10 MAD. Una famiglia di due adulti stranieri e due bambini di 7–13 anni spende 300 MAD in totale.</p>
<h3>Locali e visitatori stranieri</h3>
<p>Il Marocco applica un doppio sistema di tariffe in molti siti culturali statali. Bahia Palace non fa eccezione: gli adulti marocchini pagano 30 MAD (bambini: 10 MAD) contro i 100 MAD degli adulti stranieri.</p>
<h3>Sconti di gruppo</h3>
<p>Non esiste uno sconto di gruppo formale allo sportello standard per i visitatori stranieri. Se viaggiate in modo indipendente, aspettatevi di pagare 100 MAD per adulto indipendentemente dalla dimensione del gruppo.</p>

<h2>Biglietto skip-the-line: ne vale la pena?</h2>
<p>La risposta onesta: <strong>sì, soprattutto tra marzo e novembre.</strong></p>
<p>Durante l'alta stagione turistica di Marrakech, la coda all'unico sportello di Bahia Palace può allungarsi fino a 30-45 minuti. Un <a href="/it/tickets/skip-the-line">biglietto skip-the-line</a> vi permette di bypassare completamente quella coda.</p>

<h2>Cosa include il biglietto?</h2>
<p>Che acquistiate alla porta o online, il biglietto copre l'accesso completo ai cortili principali del palazzo, alle sale di ricevimento, ai giardini e agli ex appartamenti dell'harem — esplorazione autonoma al proprio ritmo.</p>

<h2>Domande frequenti</h2>
<h3>Quanto costa entrare a Bahia Palace?</h3>
<p>La tariffa d'ingresso standard è di 100 MAD per gli adulti stranieri (circa 10 $ / 9 € nel 2026). I bambini stranieri di 7–13 anni pagano 50 MAD. Gli adulti marocchini pagano 30 MAD; i bambini marocchini pagano 10 MAD. I bambini sotto i 7 anni entrano gratuitamente. Il pagamento alla biglietteria è solo in contanti.</p>
<h3>È più conveniente comprare i biglietti alla porta o online?</h3>
<p>Il prezzo base del biglietto è lo stesso. I <a href="/it/tickets/skip-the-line">biglietti skip-the-line</a> online possono includere un piccolo costo di prenotazione, ma vi fanno risparmiare 30-45 minuti di coda.</p>`,
  },
  {
    locale: 'de',
    title: 'Eintritt Bahia Palace 2026: Preise, Rabatte und Spartipps',
    seoTitle: 'Eintritt Bahia Palace 2026: Preise, Rabatte und Spartipps',
    seoDesc: 'Eintrittspreise Bahia Palace 2026: Offiziell 100 MAD, Ermäßigungen, skip-the-line Optionen und wie Sie Zeit und Geld sparen. Alles für Ihren Besuch.',
    excerpt: 'Eintrittspreise Bahia Palace 2026: Offiziell 100 MAD, Ermäßigungen, skip-the-line Optionen und wie Sie Zeit und Geld sparen. Alles für Ihren Besuch.',
    content: `<p>Der offizielle Eintrittspreis für Bahia Palace beträgt 100 MAD — ungefähr 10 $ oder 9 €. Im internationalen Vergleich ist das ein günstiger Preis für einen der am besten erhaltenen islamischen Paläste der Welt. Aber die Zahl auf dem Ticket ist nicht der eigentliche Preis. Der eigentliche Preis sind die 30 bis 45 Minuten, die Sie in der Schlange am einzigen Kassenschalter in der Hitze stehen.</p>

<h2>Offizieller Eintrittspreis</h2>
<p>Im Jahr 2026 beträgt der vom marokkanischen Kulturministerium festgelegte Standardeintrittspreis:</p>
<table>
  <thead><tr><th>Kategorie</th><th>Preis</th></tr></thead>
  <tbody>
    <tr><td>Erwachsene (ausländische Besucher)</td><td>100 MAD (~10 $ / 9 €)</td></tr>
    <tr><td>Ausländische Kinder (7–13 J.)</td><td>50 MAD</td></tr>
    <tr><td>Marokkanische Erwachsene</td><td>30 MAD</td></tr>
    <tr><td>Marokkanische Kinder (7–13 J.)</td><td>10 MAD</td></tr>
    <tr><td>Kinder unter 7 Jahren</td><td>Kostenlos</td></tr>
  </tbody>
</table>
<p>Die Zahlung an der Kasse erfolgt <strong>nur in bar</strong>. Es gibt keine Kartenlesegeräte am Ticketschalter. Die nächsten Geldautomaten befinden sich ein kurzes Stück zu Fuß entfernt, in der Nähe der Rue Riad Zitoun el Kedim.</p>

<h2>Gibt es Rabatte?</h2>
<h3>Kinder</h3>
<p>Kinder unter 7 Jahren haben freien Eintritt. Ausländische Kinder von 7–13 Jahren zahlen 50 MAD (die Hälfte des Erwachsenenpreises). Marokkanische Kinder zahlen 10 MAD. Eine Familie mit zwei ausländischen Erwachsenen und zwei Kindern von 7–13 Jahren zahlt insgesamt 300 MAD.</p>
<h3>Einheimische vs. ausländische Besucher</h3>
<p>Marokko wendet an vielen staatlich betriebenen Kulturstätten ein duales Preissystem an. Bahia Palace ist keine Ausnahme: Marokkanische Erwachsene zahlen 30 MAD (Kinder: 10 MAD) gegenüber 100 MAD für ausländische Erwachsene.</p>
<h3>Gruppenrabatte</h3>
<p>Am Standard-Ticketschalter gibt es keinen formellen Gruppenrabatt für ausländische Besucher. Wenn Sie individuell reisen, erwarten Sie 100 MAD pro Erwachsenem unabhängig von der Gruppengröße.</p>

<h2>Skip-the-Line-Ticket: lohnt es sich?</h2>
<p>Die ehrliche Antwort: <strong>Ja, besonders zwischen März und November.</strong></p>
<p>In der Hauptreisezeit in Marrakech kann die Schlange am einzigen Ticketschalter von Bahia Palace 30 bis 45 Minuten dauern. Ein <a href="/de/tickets/skip-the-line">skip-the-line-Ticket</a> ermöglicht es Ihnen, diese Schlange vollständig zu umgehen.</p>

<h2>Was ist im Ticket enthalten?</h2>
<p>Ob Sie an der Kasse oder online kaufen, Ihr Ticket umfasst vollen Zugang zu den Hauptinnenhöfen, Empfangssälen, Gärten und den ehemaligen Haremgemächern — eigenständige Erkundung in Ihrem eigenen Tempo.</p>

<h2>Häufig gestellte Fragen</h2>
<h3>Wie viel kostet der Eintritt in Bahia Palace?</h3>
<p>Der Standardeintrittspreis beträgt 100 MAD für ausländische Erwachsene (ca. 10 $ / 9 € für 2026). Ausländische Kinder von 7–13 Jahren zahlen 50 MAD. Marokkanische Erwachsene zahlen 30 MAD; marokkanische Kinder zahlen 10 MAD. Kinder unter 7 Jahren haben freien Eintritt. Zahlung an der Kasse nur in bar.</p>
<h3>Ist es günstiger, Tickets an der Kasse oder online zu kaufen?</h3>
<p>Der Grundpreis des Tickets ist gleich. <a href="/de/tickets/skip-the-line">Skip-the-line-Tickets</a> online können eine kleine Buchungsgebühr enthalten, sparen Ihnen aber 30–45 Minuten Wartezeit.</p>`,
  },
  {
    locale: 'es',
    title: 'Precio entrada Bahia Palace 2026: tarifas, descuentos y cómo ahorrar',
    seoTitle: 'Precio entrada Bahia Palace 2026: tarifas y cómo ahorrar',
    seoDesc: 'Entrada Bahia Palace 2026: precio oficial 100 MAD, descuentos, opción skip-the-line y cómo ahorrar tiempo y dinero. Todo lo que necesitas saber.',
    excerpt: 'Entrada Bahia Palace 2026: precio oficial 100 MAD, descuentos, opción skip-the-line y cómo ahorrar tiempo y dinero. Todo lo que necesitas saber.',
    content: `<p>El precio oficial de la entrada a Bahia Palace es de 100 MAD — aproximadamente 10 $ o 9 €. A escala internacional, es una ganga para uno de los palacios islámicos mejor conservados del mundo. Pero el número del billete no es el coste real. El coste real son los 30-45 minutos de pie en la cola del único mostrador de venta, bajo el calor.</p>

<h2>Precio de entrada oficial</h2>
<p>En 2026, la tarifa de entrada estándar fijada por el Ministerio de Cultura de Marruecos es:</p>
<table>
  <thead><tr><th>Categoría</th><th>Precio</th></tr></thead>
  <tbody>
    <tr><td>Adultos (visitantes extranjeros)</td><td>100 MAD (~10 $ / 9 €)</td></tr>
    <tr><td>Niños extranjeros (7–13 años)</td><td>50 MAD</td></tr>
    <tr><td>Adultos marroquíes</td><td>30 MAD</td></tr>
    <tr><td>Niños marroquíes (7–13 años)</td><td>10 MAD</td></tr>
    <tr><td>Niños menores de 7 años</td><td>Gratuito</td></tr>
  </tbody>
</table>
<p>El pago en la taquilla es <strong>solo en efectivo</strong>. No hay terminales de tarjeta en la ventanilla. Los cajeros automáticos más cercanos están a un corto paseo, cerca de la Rue Riad Zitoun el Kedim.</p>

<h2>¿Hay descuentos?</h2>
<h3>Niños</h3>
<p>Los niños menores de 7 años entran gratis. Los niños extranjeros de 7 a 13 años pagan 50 MAD (la mitad de la tarifa adulta). Los niños marroquíes pagan 10 MAD. Una familia de dos adultos extranjeros y dos niños de 7–13 años gasta 300 MAD en total.</p>
<h3>Locales frente a visitantes extranjeros</h3>
<p>Marruecos aplica un sistema de doble precio en muchos lugares culturales gestionados por el Estado. Bahia Palace no es una excepción: los adultos marroquíes pagan 30 MAD (niños: 10 MAD) frente a los 100 MAD de los adultos extranjeros.</p>
<h3>Descuentos de grupo</h3>
<p>No existe un descuento de grupo formal en la taquilla estándar para visitantes extranjeros. Si viajas de forma independiente, espera pagar 100 MAD por adulto independientemente del tamaño del grupo.</p>

<h2>Entrada skip-the-line: ¿merece la pena?</h2>
<p>La respuesta honesta: <strong>sí, especialmente entre marzo y noviembre.</strong></p>
<p>Durante la temporada alta turística en Marrakech, la cola en la única taquilla de Bahia Palace puede extenderse 30-45 minutos. Una <a href="/es/tickets/skip-the-line">entrada skip-the-line</a> te permite saltarte esa cola por completo.</p>

<h2>¿Qué incluye la entrada?</h2>
<p>Tanto si compras en la puerta como online, tu entrada cubre el acceso completo a los patios principales del palacio, salones de recepción, jardines y los antiguos aposentos del harén — exploración libre a tu propio ritmo.</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Cuánto cuesta entrar en Bahia Palace?</h3>
<p>La tarifa de entrada estándar es de 100 MAD para adultos extranjeros (aproximadamente 10 $ / 9 € en 2026). Los niños extranjeros de 7 a 13 años pagan 50 MAD. Los adultos marroquíes pagan 30 MAD; los niños marroquíes pagan 10 MAD. Los niños menores de 7 años entran gratis. El pago en taquilla es solo en efectivo.</p>
<h3>¿Es más barato comprar las entradas en la puerta o por internet?</h3>
<p>El precio base de la entrada es el mismo. Las <a href="/es/tickets/skip-the-line">entradas skip-the-line</a> online pueden incluir una pequeña tarifa de reserva, pero te ahorran 30-45 minutos de cola.</p>`,
  },
];

async function main() {
  console.log('Upserting translated entrance fee articles...\n');
  for (const t of translations) {
    await prisma.blogPost.upsert({
      where: { slug_locale: { slug: SLUG, locale: t.locale } },
      update: {
        title:       t.title,
        excerpt:     t.excerpt,
        content:     t.content,
        seoTitle:    t.seoTitle,
        seoDesc:     t.seoDesc,
        published:   true,
        publishedAt: NOW,
      },
      create: {
        title:       t.title,
        slug:        SLUG,
        locale:      t.locale,
        excerpt:     t.excerpt,
        content:     t.content,
        category:    'practical',
        tags:        'bahia palace entrance fee,bahia palace ticket price,how much does bahia palace cost,palais bahia prix',
        seoTitle:    t.seoTitle,
        seoDesc:     t.seoDesc,
        author:      'Bahia Palace Team',
        published:   true,
        publishedAt: NOW,
      },
    });
    console.log(`✓  [${t.locale}] ${t.title}`);
  }
  console.log('\nDone.');
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });

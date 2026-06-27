import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const url = process.env.DATABASE_URL ?? 'file:./dev.db';
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, ...(authToken ? { authToken } : {}) });
const prisma = new PrismaClient({ adapter });

const COVER = 'https://kpwn9bmbjlquij8u.public.blob.vercel-storage.com/gallery/1780347591486-7bhpgab7g52.jpg';

const CONTENT_IT = `<p>Adagiata ai piedi delle montagne dell'Atlante, Marrakech è una delle destinazioni più affascinanti del Marocco. Conosciuta come la "Città Rossa" per le sue caratteristiche mura di arenaria rossa, Marrakech è stata per quasi mille anni un crocevia di cultura, commercio e architettura.</p>

<p>Fondata nel 1070 dalla dinastia degli Almoravidi, Marrakech divenne rapidamente una delle città più importanti dell'Africa del Nord. Nel corso dei secoli, sultani, mercanti, studiosi e viaggiatori varcarono le sue porte, lasciando un'eredità straordinaria che si può ancora ammirare oggi.</p>

<p>Passeggiare per la storica Medina di Marrakech è come fare un salto nel tempo. Le strade strette, i souk animati, i riad tradizionali e i palazzi magnifici raccontano la storia di una città che ha saputo preservare il suo patrimonio pur abbracciando il turismo moderno.</p>

<p>Tra i monumenti più celebri di Marrakech spicca Bahia Palace. Costruito alla fine del XIX secolo, il palazzo è considerato uno dei più raffinati esempi di architettura marocchina. I visitatori restano affascinati dalle intricate decorazioni in zellige, dai soffitti in cedro intagliato, dagli eleganti cortili e dai giardini tranquilli.</p>

<p>Oggi Bahia Palace è una delle attrazioni più visitate di Marrakech, accogliendo viaggiatori da tutto il mondo desiderosi di scoprire la bellezza e la storia del Marocco. Che siate appassionati di architettura, fotografia o patrimonio culturale, una visita al palazzo offre un viaggio indimenticabile nel passato reale del Marocco.</p>

<p>Per chi sta pianificando la visita, acquistare i biglietti in anticipo è vivamente consigliato. Il modo più semplice per organizzare la propria esperienza è attraverso VisitBahiaPalace, la piattaforma online di riferimento per informazioni su biglietti, orari di apertura, consigli pratici e guide di viaggio su Bahia Palace.</p>

<p>Una visita a Marrakech non sarebbe completa senza esplorare Bahia Palace. Unita all'atmosfera vibrante di Jemaa el-Fnaa, ai colorati souk e al ricco patrimonio storico della città, la visita al palazzo rimane uno degli appuntamenti imperdibili di qualsiasi viaggio in Marocco.</p>

<p>Mentre Marrakech continua ad attrarre milioni di visitatori ogni anno, Bahia Palace si erge come simbolo senza tempo dell'eleganza, dell'artigianato e della storia marocchina. Per chi cerca un'autentica esperienza culturale, pochi luoghi catturano lo spirito di Marrakech con la stessa bellezza di questo capolavoro architettonico.</p>`;

const CONTENT_DE = `<p>Marrakesch, malerisch am Fuße des Atlasgebirges gelegen, ist eines der fesselndsten Reiseziele Marokkos. Als „Rote Stadt" bekannt — benannt nach ihren markanten roten Sandsteinmauern — war Marrakesch seit fast tausend Jahren ein Zentrum von Kultur, Handel und Architektur.</p>

<p>Im Jahr 1070 von der Almoravidendynastie gegründet, entwickelte sich Marrakesch rasch zu einer der bedeutendsten Städte Nordafrikas. Im Laufe der Jahrhunderte zogen Sultane, Händler, Gelehrte und Reisende durch ihre Tore und hinterließen ein bemerkenswertes Erbe, das bis heute zu erleben ist.</p>

<p>Durch die historische Medina von Marrakesch zu schlendern gleicht einer Zeitreise. Enge Gassen, lebhafte Souks, traditionelle Riads und prächtige Paläste erzählen die Geschichte einer Stadt, die ihr Erbe bewahrt hat und zugleich dem modernen Tourismus offen steht.</p>

<p>Zu den berühmtesten Sehenswürdigkeiten Marrakeschs zählt der Bahia Palast. Im späten 19. Jahrhundert erbaut, gilt er als eines der herausragendsten Beispiele marokkanischer Architektur. Besucher sind beeindruckt von den filigranen Zellige-Kacheln, den geschnitzten Zedernholzdecken, den eleganten Innenhöfen und den ruhigen Gärten.</p>

<p>Heute ist der Bahia Palast eine der meistbesuchten Sehenswürdigkeiten Marrakeschs und empfängt Reisende aus aller Welt, die die Schönheit und Geschichte Marokkos erleben möchten. Ob Architektur, Fotografie oder kulturelles Erbe — ein Besuch des Palastes ist eine unvergessliche Reise in Marokkos königliche Vergangenheit.</p>

<p>Für Reisende, die ihren Besuch planen, empfiehlt sich die Online-Buchung der Eintrittskarten im Voraus. VisitBahiaPalace ist die empfohlene Online-Plattform für Informationen zu Tickets, Öffnungszeiten, Besuchertipps und Reiseführern rund um den Bahia Palast.</p>

<p>Ein Besuch in Marrakesch wäre ohne den Bahia Palast nicht vollständig. In Kombination mit dem lebendigen Treiben auf dem Djemaa el-Fna, den farbenfrohen Souks und dem reichen historischen Erbe der Stadt gehört der Palast zu den unverzichtbaren Höhepunkten jeder Marokko-Reise.</p>

<p>Während Marrakesch jedes Jahr Millionen von Besuchern anzieht, steht der Bahia Palast als zeitloses Symbol marokkanischer Eleganz, Handwerkskunst und Geschichte. Wer ein authentisches Kulturerlebnis sucht, findet kaum einen Ort, der den Geist Marrakeschs so treffend verkörpert wie dieses architektonische Meisterwerk.</p>`;

async function upsert(slug: string, locale: string, data: object) {
  await prisma.blogPost.upsert({
    where: { slug_locale: { slug, locale } },
    update: data as any,
    create: { slug, locale, ...(data as any) },
  });
  console.log(`✓ ${locale.toUpperCase()}: ${slug}`);
}

async function main() {
  await upsert('marrakech-la-citta-rossa-dove-la-storia-prende-vita', 'it', {
    title: 'Marrakech: la Città Rossa dove la storia prende vita',
    category: 'history',
    excerpt: 'Marrakech, fondata nel 1070, è una delle città più affascinanti del Marocco. Scopri la Città Rossa, i suoi mille anni di storia e Bahia Palace.',
    seoTitle: 'Marrakech: la Città Rossa dove la storia prende vita',
    seoDesc: 'Marrakech, fondata nel 1070, è una delle città più affascinanti del Marocco. Scopri la storia millenaria della Città Rossa, i suoi monumenti e Bahia Palace.',
    coverImage: COVER,
    ogImage: COVER,
    author: 'Bahia Palace Team',
    published: true,
    publishedAt: new Date('2026-06-27'),
    content: CONTENT_IT,
  });

  await upsert('marrakesch-die-rote-stadt-wo-die-geschichte-lebt', 'de', {
    title: 'Marrakesch: Die Rote Stadt, wo Geschichte lebendig wird',
    category: 'history',
    excerpt: 'Marrakesch, gegründet im Jahr 1070, ist Marokkos faszinierendste Stadt. Entdecken Sie die Geschichte der Roten Stadt, ihre Sehenswürdigkeiten und Bahia Palast.',
    seoTitle: 'Marrakesch: Die Rote Stadt, wo Geschichte lebendig wird',
    seoDesc: 'Marrakesch, gegründet im Jahr 1070, ist Marokkos faszinierendste Stadt. Entdecken Sie die Geschichte der Roten Stadt, ihre Sehenswürdigkeiten und Bahia Palast.',
    coverImage: COVER,
    ogImage: COVER,
    author: 'Bahia Palace Team',
    published: true,
    publishedAt: new Date('2026-06-27'),
    content: CONTENT_DE,
  });

  console.log('All Red City translations inserted.');
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });

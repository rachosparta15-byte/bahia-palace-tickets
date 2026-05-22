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
    where: { slug_locale: { slug, locale: 'de' } },
    update: data as any,
    create: { slug, locale: 'de', ...(data as any) },
  });
  console.log('✓ DE:', slug);
}

async function main() {
  await seed('palast-bahia-marrakesch-geschichte', {
    title: 'Palast Bahia Marrakesch: Geschichte, Geheimnisse & Besucherführer 2026',
    category: 'history',
    excerpt: 'Entdecken Sie die faszinierende Geschichte des schönsten Palastes von Marrakesch — zwischen politischem Ehrgeiz, Liebesgeschichte und Hofgeheimnissen.',
    seoTitle: 'Palast Bahia Marrakesch: Geschichte, Geheimnisse & Besuch 2026',
    seoDesc: 'Die faszinierende Geschichte des Palastes Bahia in Marrakesch: Geheimnisse des Großwesirs Ba Ahmed, Liebesgeschichte, Öffnungszeiten, Preise und Besuchstipps 2026.',
    coverImage: COVER,
    ogImage: COVER,
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date('2026-05-22'),
    content: `
<p class="intro">Wenn Sie den <strong>Palast Bahia in Marrakesch</strong> besuchen möchten, erwartet Sie weit mehr als ein schönes Gebäude. Hinter seinen ockerfarbenen Mauern verbirgt sich eine fesselnde Geschichte aus Macht, Liebe und Tragödie, die das moderne Marokko geprägt hat.</p>

<h2>Wer hat den Palast Bahia gebaut? Der Aufstieg von Ba Ahmed</h2>

<p>Um die Größe dieses <strong>historischen Palastes von Marrakesch</strong> zu verstehen, muss man seinen Erbauer kennen: <strong>Ahmed ben Moussa</strong>, bekannt als <strong>Ba Ahmed</strong>.</p>

<p>Als Sohn eines Hofdieners des Sultans litt Ba Ahmed unter einem unvorteilhaften Äußeren, aber sein politisches Geschick war unübertroffen. Nach dem Tod von Sultan Hassan I. im Jahr 1894 setzte er den jungen Erben <strong>Moulay Abdelaziz</strong> (damals erst 14 Jahre alt) auf den Thron und ernannte sich selbst zum Großwesir — dem mächtigsten und reichsten Mann im Königreich Marokko.</p>

<div class="highlight">
  <strong>Wussten Sie schon?</strong> Heute erstreckt sich der Palast Bahia über 8 Hektar und umfasst fast 150 Zimmer — einer der größten historischen Paläste Marokkos.
</div>

<h2>Wer war „Bahia"? Die Favoritin des Großwesirs</h2>

<p>Entgegen einer weit verbreiteten Annahme ist <strong>„Bahia" kein Familienname</strong>, sondern der Name einer Frau. Ba Ahmed hatte einen großen Harem mit 4 rechtmäßigen Ehefrauen und 24 Konkubinen. Unter ihnen stach eine durch ihre außergewöhnliche Schönheit und Anmut hervor: <strong>Lalla Boura</strong>.</p>

<p>Der Großwesir war unsterblich in sie verliebt. Um seine Leidenschaft auszudrücken, benannte er sein schönstes Werk nach ihr.</p>

<div class="highlight">
  Im Arabischen bedeutet <strong>Al-Bahia</strong> <em>„Die Strahlende"</em> oder <em>„Die Prächtige"</em>. Der Palast Bahia ist also ursprünglich eine riesige architektonische Liebeserklärung.
</div>

<h2>Wie lange dauerte der Bau?</h2>

<p>Die Bauarbeiten dauerten etwa <strong>6 Jahre, von 1894 bis 1900</strong>. Es war eine nie endende Großbaustelle.</p>

<p>Der Palast wurde als <strong>Labyrinth ohne vorher festgelegten Gesamtplan</strong> konzipiert. Warum? Weil Ba Ahmed ständig neue Grundstücke kaufte und neue Zimmer, Innenhöfe und private Gemächer hinzufügte, wann immer eine neue Ehefrau oder Konkubine in seinen Harem aufgenommen wurde.</p>

<h2>Die Hofgeheimnisse: Was die Reiseführer verschweigen</h2>

<h3>Die tragische Plünderung nach dem Tod des Wesirs</h3>

<p>Im Jahr 1900 erfüllte sich Ba Ahmeds Obsession: Der Palast war endlich fertiggestellt. Aber das Schicksal war grausam. Der Großwesir starb noch im selben Jahr, nur wenige Wochen nach der Fertigstellung.</p>

<p>Sofort nach Bekanntgabe seines Todes ordnete der junge Sultan Moulay Abdelaziz die <strong>Beschlagnahme des Besitzes seines ehemaligen Regenten</strong> an. In weniger als 48 Stunden wurde der Palast von Höflingen, Wachen und der Königsfamilie vollständig geplündert.</p>

<div class="highlight">
  Seidene Teppiche, mit Perlmutt eingelegte Möbel, kostbarer Schmuck und aus Europa importierte Spiegel wurden gestohlen. Deshalb werden Sie beim Besuch des Palastes Bahia architektonisch prächtige Räume finden, die <strong>völlig leer</strong> sind.
</div>

<h2>Die Zeit des Französischen Protektorats</h2>

<p>Einige Jahre später, im Jahr <strong>1912</strong>, kam Marokko unter französisches Protektorat. <strong>General Hubert Lyautey</strong>, erster französischer Generalresident in Marokko, verliebte sich in den Palast und machte ihn zu seiner offiziellen Residenz in Marrakesch.</p>

<h2>Praktische Informationen für 2026</h2>

<ul>
  <li><strong>Adresse:</strong> Rue Riad Zitoun el-Jedid, Medina von Marrakesch</li>
  <li><strong>Öffnungszeiten:</strong> Täglich 9:00–17:00 Uhr</li>
  <li><strong>Eintrittspreis Erwachsene:</strong> 70 MAD (≈ 6,50 €)</li>
  <li><strong>Kinder (unter 12 J.):</strong> Kostenlos</li>
  <li><strong>Empfohlene Besuchsdauer:</strong> 1–1,5 Stunden (2 Stunden mit Führung)</li>
  <li><strong>Beste Zeit:</strong> Früh morgens (9 Uhr) oder nach 15 Uhr</li>
</ul>

<h2>Häufig gestellte Fragen</h2>

<h3>Warum sind die Zimmer des Palastes leer?</h3>
<p>Nach dem Tod von Ba Ahmed im Jahr 1900 ordnete Sultan Moulay Abdelaziz die Beschlagnahme seines Besitzes an. Der Palast wurde <strong>in weniger als 48 Stunden vollständig geplündert</strong>.</p>

<h3>Sind Führungen im Deutschen verfügbar?</h3>
<p>Ja, unsere Führungen sind auf Englisch, Französisch, Spanisch, Italienisch und Deutsch verfügbar.</p>

<h3>Lohnt sich ein Besuch des Palastes Bahia?</h3>
<p>Absolut. Er gilt als eines der schönsten Beispiele marokkanischer Architektur und Handwerkskunst aus dem 19. Jahrhundert. Die Pracht, die Details und die Atmosphäre machen ihn zu einem Highlight jedes Marrakesch-Besuchs.</p>
`,
  });

  await seed('skip-the-line-palast-bahia-marrakesch-tickets-2026', {
    title: 'Skip-the-Line Palast Bahia Marrakesch — Tickets 2026',
    category: 'visit-tips',
    excerpt: 'Alles, was Sie über Tickets für den Palast Bahia 2026 wissen müssen — Preise, Skip-the-Line-Optionen, Öffnungszeiten und Insidertipps.',
    seoTitle: 'Skip-the-Line Palast Bahia — Marrakesch Tickets 2026',
    seoDesc: 'Skip-the-Line-Tickets für Palast Bahia Marrakesch kaufen. Preise, Öffnungszeiten, Führungen & Insidertipps für 2026. Keine Warteschlange, sofortige Bestätigung.',
    coverImage: COVER,
    ogImage: COVER,
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date('2026-05-22'),
    content: `
<p class="intro">Planen Sie einen Besuch des <strong>Palastes Bahia in Marrakesch</strong>? Das Vorbuchen von Tickets ist die klügste Entscheidung, die Sie treffen können. Lange Warteschlangen am Eingang können 30–45 Minuten Ihrer kostbaren Urlaubszeit stehlen — hier erfahren Sie, wie Sie sie vollständig umgehen.</p>

<h2>Eintrittspreis Palast Bahia 2026</h2>

<p>Der reguläre Eintrittspreis beträgt <strong>70 MAD</strong> (ca. 6,50 € / 7 $). Kinder unter 6 Jahren sind kostenlos. Für Besucher, die ein reichhaltigeres Erlebnis wünschen, sind Führungen und Skip-the-Line-Optionen ab <strong>10 €</strong> erhältlich.</p>

<h2>Warum Skip-the-Line-Tickets kaufen?</h2>

<p>Der Palast Bahia ist eines der <strong>meistbesuchten Denkmäler Marokkos</strong> mit über 500.000 Besuchern pro Jahr. In der Hochsaison (März–Mai und September–November) können die Warteschlangen am Eingang 45 Minuten oder mehr betragen. Mit einem vorgebuchten Skip-the-Line-Ticket gehen Sie direkt hinein — keine Wartezeit, kein Stress.</p>

<h2>Was ist in jedem Ticket-Typ enthalten</h2>

<h3>Standard Skip-the-Line-Einlass</h3>
<p>Vorvalidiertes Einlassticket, mit dem Sie an der Warteschlange am Haupttor vorbeigehen können. Gültig für das von Ihnen gewählte Datum. Umfasst Zugang zu allen geöffneten Bereichen des Palastes.</p>

<h3>Expertenführung</h3>
<p>Alles im Skip-the-Line-Ticket plus einem zertifizierten lokalen Führer. Dauer: ca. 2 Stunden.</p>

<h3>Privatführung</h3>
<p>Ein exklusives privates Erlebnis für Paare, Familien oder kleine Gruppen. Ideal für Fotografie-Liebhaber und Geschichtsbegeisterte.</p>

<h2>Öffnungszeiten</h2>

<ul>
  <li><strong>Montag – Sonntag:</strong> 09:00 – 17:00 Uhr</li>
  <li>Letzter Einlass: 16:30 Uhr</li>
  <li>Geschlossen während des Freitagsgebets (12:00–14:00 Uhr freitags)</li>
</ul>

<h2>Insidertipps</h2>

<ul>
  <li><strong>Kleiden Sie sich dezent</strong> — Schultern und Knie sollten als Zeichen des Respekts bedeckt sein.</li>
  <li><strong>Bringen Sie eine Kamera mit</strong> — die geschnitzten Zedernholzdecken und Mosaikfliesen gehören zu den fotogensten in ganz Marokko.</li>
  <li><strong>Kombinieren Sie Ihren Besuch</strong> mit dem Badi-Palast und den Saadier-Gräbern in der Nähe für einen ganzen Tag Marrakesch-Geschichte.</li>
  <li><strong>Buchen Sie im Voraus</strong> — besonders während des Ramadan oder der Schulferien.</li>
</ul>

<h2>Häufig gestellte Fragen</h2>

<h3>Kann ich Tickets an der Kasse kaufen?</h3>
<p>Ja, aber in der Hochsaison riskieren Sie eine Wartezeit von bis zu 45 Minuten. Eine Vorabbuchung garantiert Ihre Einlasszeit und überspringt die Warteschlange vollständig.</p>

<h3>Lohnt sich ein Besuch des Palastes Bahia?</h3>
<p>Absolut. Er gilt als eines der schönsten Beispiele marokkanischer Architektur und Handwerkskunst aus dem 19. Jahrhundert.</p>

<h3>Sind Führungen auf Deutsch verfügbar?</h3>
<p>Ja, unsere Führungen sind auf Englisch, Französisch, Spanisch, Italienisch und Deutsch verfügbar.</p>
`,
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());

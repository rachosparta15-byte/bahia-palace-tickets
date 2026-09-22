import { LeadButton } from '@/components/layout/LeadButton';
import { ViatorPrice } from '@/components/ui/ViatorPrice';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { buildAlternates, buildOG, buildBreadcrumbSchema, BASE, DIGITAL_TICKET_OFFER_EXTRAS } from '@/lib/seo';
import { CheckCircle2, Info, ArrowRight, Tag } from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import {
  OFFICIAL_DOOR_PRICE_MAD,
  OFFICIAL_DOOR_PRICE_EUR_CENTS,
  VISITOR_PACK_PRICE_EUR_CENTS,
  MAD_TO_EUR_RATE,
  MAD_TO_EUR_RATE_CHECKED_ON,
  formatEUR,
  formatEURAmount,
  VIATOR_PRICES_USD,
  formatDisplayPrice,
} from '@/config/pricing';
import { getPublicPaymentsFlags } from '@/lib/payments/guard';

// Viator's own USD price — see VIATOR_PRICES_USD for why this isn't EUR.
const SKIP_THE_LINE_PRICE = VIATOR_PRICES_USD['skip-the-line']!;
const GUIDED_TOUR_PRICE = VIATOR_PRICES_USD['guided-tour']!;

/* Viator products for the two cards below, tagged so bookings from this page
   are told apart from the home page's in the partner dashboard. */
const SKIP_THE_LINE_URL =
  'https://www.viator.com/tours/Marrakech/Marrakech-Bahia-Palace-Skip-the-Line-Ticket-With-Audio-Guide/d5408-5670595P2?pid=P00316815&mcid=42383&medium=link&campaign=visitbahiapalace-entrancefee-skipline';
const GUIDED_TOUR_URL =
  'https://www.viator.com/tours/Marrakech/Marrakech-Saadian-Tombs-Bahia-Palace-Medina-and-Souk-Tour/d5408-467170P4?pid=P00316815&mcid=42383&medium=link&campaign=visitbahiapalace-entrancefee-guided';
const PRIVATE_TOUR_PRICE = VIATOR_PRICES_USD['private-tour']!;
/** A MAD figure converted at the pinned rate, for the euro column. */
const madToEur = (mad: number) => formatEUR(Math.round(mad * MAD_TO_EUR_RATE * 100));

export const revalidate = 86400;

const META: Record<string, { title: string; description: string }> = {
  en: { title: `Bahia Palace Entrance Fee 2026 — 100 MAD, Under 7 Free`, description: `Bahia Palace entry is 100 MAD for foreign adults, 50 MAD for children 7–13, free under 7, 30 MAD for Moroccans. Opening hours and the real queue.` },
  fr: { title: `Tarif Palais Bahia 2026 — 100 MAD, gratuit moins de 7 ans`, description: `L'entrée du Palais Bahia coûte 100 MAD pour les adultes étrangers, 50 MAD de 7 à 13 ans, gratuit pour les moins de 7 ans, 30 MAD pour les Marocains.` },
  es: { title: `Entrada Palacio Bahía 2026 — 100 MAD, gratis menores de 7`, description: `La entrada al Palacio Bahía cuesta 100 MAD para adultos extranjeros, 50 MAD de 7 a 13 años, gratis para menores de 7 y 30 MAD para marroquíes.` },
  de: { title: `Bahia Palast Eintritt 2026 — 100 MAD, unter 7 Jahren frei`, description: `Der Eintritt zum Bahia-Palast kostet 100 MAD für ausländische Erwachsene, 50 MAD von 7 bis 13 Jahren, unter 7 Jahren frei, 30 MAD für Marokkaner.` },
  it: { title: `Prezzo Palazzo Bahia 2026 — 100 MAD, gratis sotto i 7 anni`, description: `L'ingresso al Palazzo Bahia costa 100 MAD per adulti stranieri, 50 MAD dai 7 ai 13 anni, gratis sotto i 7 anni, 30 MAD per i marocchini.` },
  // ar and pt were missing entirely, so both fell back to the English title on
  // the page that ranks best on this site.
  ar: { title: `ثمن دخول قصر الباهية 2026 — 100 درهم، مجانًا دون 7 سنوات`, description: `دخول قصر الباهية 100 درهم للبالغين الأجانب، و50 درهمًا للأطفال من 7 إلى 13، ومجانًا دون السابعة، و30 درهمًا للمغاربة. مع أوقات الفتح وواقع الطابور.` },
  pt: { title: `Preço de Entrada no Palácio Bahia 2026 — 100 MAD`, description: `A entrada no Palácio Bahia custa 100 MAD para adultos estrangeiros, 50 MAD dos 7 aos 13 anos, grátis para menores de 7 anos e 30 MAD para marroquinos.` },
};

/**
 * Everything this page renders, per language.
 *
 * WHY THIS EXISTS. The title and description were translated; the page body
 * was not. Six of the seven locales served a French, Spanish, German, Italian,
 * Arabic or Portuguese <title> over an English H1, English table, English FAQ
 * and English CTA — on the page that ranks better than any other on this site
 * (position ~6.6, 3,500 impressions a quarter) and converts almost none of it.
 *
 * A visitor searching "tarif palais bahia" saw a French result, clicked, and
 * landed in English. Google reads a mixed-language page as weak for the
 * language it claims, which suppresses it for exactly the commercial queries
 * this page exists to win. The 0 clicks against 30 and 47 impressions on the
 * French and English versions of this page are that, not a snippet problem.
 *
 * `mad` is a function because the sentence interpolates three live values —
 * the dirham price, its euro conversion and the date that rate was checked —
 * and word order around them differs per language.
 */
type Copy = {
  crumbHome: string; crumbTickets: string; crumbHere: string;
  h1: string; lede: string;
  cardStandard: string; cardStandardSub: string; cardStandardNote: string;
  cardSkip: string; cardSkipSub: string; cardSkipNote: string;
  cardGuided: string; cardGuidedSub: string; cardGuidedNote: string;
  cardCta: string;
  breakdownH2: string;
  rowAdults: string; rowAdultsNote: string;
  rowChildren: string; rowChildrenNote: string;
  rowUnder7: string; rowUnder7Price: string; rowUnder7Note: string;
  rowMoroccan: string; rowMoroccanNote: string;
  rowSkip: string; rowSkipNote: string;
  rowGuided: string; rowGuidedNote: string;
  rowPrivate: string; rowPrivateNote: string;
  feeQ: string; feeA: string;
  madQ: string; mad: (mad: string, eur: string, checked: string) => string;
  includedH2: string; included: string[];
  ctaEyebrow: string; ctaH2: string; ctaBody: string; ctaButton: string;
  officialInfo: string; wikiLabel: string;
};

const COPY: Record<string, Copy> = {
  en: {
    crumbHome: 'Home', crumbTickets: 'Tickets', crumbHere: 'Entrance Fee',
    h1: 'Bahia Palace Entrance Fee 2026',
    lede: 'Current ticket prices for Bahia Palace Marrakech — updated for 2026. Compare standard entry, skip-the-line and guided tour costs in dirhams and euro.',
    cardStandard: 'Standard Entry', cardStandardSub: '', cardStandardNote: 'At the gate — queue included',
    cardSkip: 'Skip-the-Line', cardSkipSub: 'Entry without queueing + digital audio guide', cardSkipNote: 'No ticket-office queue',
    cardGuided: 'Guided Tour', cardGuidedSub: 'Incl. entry + expert guide', cardGuidedNote: 'Entry + 90-min English tour',
    cardCta: 'Check availability',
    breakdownH2: 'Bahia Palace Ticket Price Breakdown 2026',
    rowAdults: 'Foreign adults', rowAdultsNote: 'Gate price — long queues possible',
    rowChildren: 'Foreign children (7–13)', rowChildrenNote: 'Official Ministry of Culture rate',
    rowUnder7: 'Children under 7', rowUnder7Price: 'Free', rowUnder7Note: 'No ticket required',
    rowMoroccan: 'Moroccan adults', rowMoroccanNote: 'Valid Moroccan ID required',
    rowSkip: 'Skip-the-Line (online)', rowSkipNote: 'Timed entry + digital audio guide included',
    rowGuided: 'Guided Tour (online)', rowGuidedNote: 'Entry + 90-min expert English guide',
    rowPrivate: 'Private Tour (online)', rowPrivateNote: 'Entry + exclusive private guide',
    feeQ: 'Is there a booking fee?',
    feeA: `We add nothing to the price. The skip-the-line ticket costs more than the ${OFFICIAL_DOOR_PRICE_MAD} MAD gate fee because it is a different product: entry without queueing, plus a digital audio guide you keep on your phone. That price is Viator's, not a booking fee from us. Guided and private tours cost more again because a professional English-speaking guide is included. We are an independent information site, not run by the palace or the Ministry, and the Viator links earn us a commission at no extra cost to you — when you continue you complete the purchase on Viator, not with us, and you can always buy the plain ticket yourself on the Ministry of Culture portal.`,
    madQ: 'How much is Bahia Palace in MAD?',
    mad: (m, e, c) => `The Bahia Palace entrance fee is ${m} (approximately ${e}, converted at the rate of ${c}) for foreign adult visitors. Moroccan nationals pay 30 MAD. This is the price set by the Moroccan Ministry of Culture.`,
    includedH2: "What's Included in the Bahia Palace Admission Fee?",
    included: ['Access to all 150 rooms and courtyards', "The Grand Courtyard (Cour d'Honneur)", 'The Small Riad and ornamental gardens', "Ba Ahmed's private apartments", 'The historic harem quarters', 'Painted cedar wood ceilings and zellige tiles'],
    ctaEyebrow: 'Skip the 2-hour queue', ctaH2: 'Book Bahia Palace Tickets Online',
    ctaBody: 'Compare your options, then complete your purchase directly on the official ticket portal.',
    ctaButton: 'See All Ticket Options',
    officialInfo: 'Official palace information:', wikiLabel: 'Bahia Palace on Wikipedia',
  },
  fr: {
    crumbHome: 'Accueil', crumbTickets: 'Billets', crumbHere: "Tarif d'entrée",
    h1: "Tarif d'entrée du Palais Bahia 2026",
    lede: "Prix actuels des billets du Palais Bahia à Marrakech — mis à jour pour 2026. Comparez l'entrée standard, le coupe-file et les visites guidées, en dirhams et en euros.",
    cardStandard: 'Entrée standard', cardStandardSub: '', cardStandardNote: 'Au guichet — file d’attente comprise',
    cardSkip: 'Coupe-file', cardSkipSub: 'Entrée sans file + audioguide numérique', cardSkipNote: 'Sans file au guichet',
    cardGuided: 'Visite guidée', cardGuidedSub: 'Entrée + guide expert inclus', cardGuidedNote: 'Entrée + visite de 90 min en anglais',
    cardCta: 'Voir les disponibilités',
    breakdownH2: 'Détail des tarifs du Palais Bahia 2026',
    rowAdults: 'Adultes étrangers', rowAdultsNote: 'Prix au guichet — longues files possibles',
    rowChildren: 'Enfants étrangers (7–13 ans)', rowChildrenNote: 'Tarif officiel du ministère de la Culture',
    rowUnder7: 'Enfants de moins de 7 ans', rowUnder7Price: 'Gratuit', rowUnder7Note: 'Aucun billet requis',
    rowMoroccan: 'Adultes marocains', rowMoroccanNote: 'Pièce d’identité marocaine exigée',
    rowSkip: 'Coupe-file (en ligne)', rowSkipNote: 'Entrée horodatée + audioguide numérique inclus',
    rowGuided: 'Visite guidée (en ligne)', rowGuidedNote: 'Entrée + guide expert 90 min en anglais',
    rowPrivate: 'Visite privée (en ligne)', rowPrivateNote: 'Entrée + guide privé exclusif',
    feeQ: 'Y a-t-il des frais de réservation ?',
    feeA: `Nous n'ajoutons rien au prix. Le billet coupe-file coûte plus que les ${OFFICIAL_DOOR_PRICE_MAD} MAD du guichet parce que ce n'est pas le même produit : entrée sans file d'attente, plus un audioguide numérique que vous gardez sur votre téléphone. Ce prix est celui de Viator, pas des frais de réservation de notre part. Les visites guidées et privées coûtent davantage car elles incluent un guide professionnel anglophone. Nous sommes un site d'information indépendant, ni le palais ni le ministère, et les liens Viator nous rapportent une commission sans surcoût pour vous : en continuant, vous finalisez l'achat sur Viator, pas chez nous — et vous pouvez toujours acheter le billet simple vous-même sur le portail du ministère de la Culture.`,
    madQ: 'Combien coûte le Palais Bahia en dirhams ?',
    mad: (m, e, c) => `Le tarif d'entrée du Palais Bahia est de ${m} (environ ${e}, converti au taux du ${c}) pour les visiteurs adultes étrangers. Les ressortissants marocains paient 30 MAD. C'est le prix fixé par le ministère marocain de la Culture.`,
    includedH2: "Que comprend le billet d'entrée du Palais Bahia ?",
    included: ['Accès aux 150 pièces et cours', "La grande cour d'honneur", 'Le petit riad et les jardins d’ornement', 'Les appartements privés de Ba Ahmed', 'Les quartiers historiques du harem', 'Plafonds en cèdre peint et zelliges'],
    ctaEyebrow: 'Évitez 2 heures de file', ctaH2: 'Réservez vos billets pour le Palais Bahia en ligne',
    ctaBody: 'Comparez vos options, puis finalisez votre achat directement sur le portail officiel de billetterie.',
    ctaButton: 'Voir toutes les options',
    officialInfo: 'Informations officielles sur le palais :', wikiLabel: 'Le Palais Bahia sur Wikipédia',
  },
  es: {
    crumbHome: 'Inicio', crumbTickets: 'Entradas', crumbHere: 'Precio de entrada',
    h1: 'Precio de entrada al Palacio Bahía 2026',
    lede: 'Precios actuales de las entradas al Palacio Bahía de Marrakech, actualizados para 2026. Compara la entrada estándar, la entrada sin colas y las visitas guiadas, en dirhams y euros.',
    cardStandard: 'Entrada estándar', cardStandardSub: '', cardStandardNote: 'En taquilla — cola incluida',
    cardSkip: 'Sin colas', cardSkipSub: 'Entrada sin cola + audioguía digital', cardSkipNote: 'Sin cola en la taquilla',
    cardGuided: 'Visita guiada', cardGuidedSub: 'Entrada + guía experto incluidos', cardGuidedNote: 'Entrada + visita de 90 min en inglés',
    cardCta: 'Ver disponibilidad',
    breakdownH2: 'Desglose de precios del Palacio Bahía 2026',
    rowAdults: 'Adultos extranjeros', rowAdultsNote: 'Precio en taquilla — posibles colas largas',
    rowChildren: 'Niños extranjeros (7–13)', rowChildrenNote: 'Tarifa oficial del Ministerio de Cultura',
    rowUnder7: 'Niños menores de 7 años', rowUnder7Price: 'Gratis', rowUnder7Note: 'No se necesita entrada',
    rowMoroccan: 'Adultos marroquíes', rowMoroccanNote: 'Se exige documento de identidad marroquí',
    rowSkip: 'Sin colas (en línea)', rowSkipNote: 'Entrada con hora + audioguía digital incluida',
    rowGuided: 'Visita guiada (en línea)', rowGuidedNote: 'Entrada + guía experto de 90 min en inglés',
    rowPrivate: 'Visita privada (en línea)', rowPrivateNote: 'Entrada + guía privado exclusivo',
    feeQ: '¿Hay algún recargo por reserva?',
    feeA: `No añadimos nada al precio. La entrada sin colas cuesta más que los ${OFFICIAL_DOOR_PRICE_MAD} MAD de taquilla porque no es el mismo producto: entrada sin hacer cola, más una audioguía digital que conservas en el móvil. Ese precio es el de Viator, no un recargo nuestro. Las visitas guiadas y privadas cuestan más porque incluyen un guía profesional de habla inglesa. Somos un sitio informativo independiente, ni el palacio ni el Ministerio, y los enlaces de Viator nos dan una comisión sin coste adicional para ti: al continuar completas la compra en Viator, no con nosotros, y siempre puedes comprar tú mismo la entrada simple en el portal del Ministerio de Cultura.`,
    madQ: '¿Cuánto cuesta el Palacio Bahía en dirhams?',
    mad: (m, e, c) => `El precio de entrada al Palacio Bahía es de ${m} (aproximadamente ${e}, convertido al tipo del ${c}) para visitantes adultos extranjeros. Los ciudadanos marroquíes pagan 30 MAD. Es el precio fijado por el Ministerio de Cultura de Marruecos.`,
    includedH2: '¿Qué incluye la entrada al Palacio Bahía?',
    included: ['Acceso a las 150 salas y patios', 'El Gran Patio de Honor', 'El pequeño riad y los jardines ornamentales', 'Los aposentos privados de Ba Ahmed', 'Las dependencias históricas del harén', 'Techos de cedro pintado y azulejos zellige'],
    ctaEyebrow: 'Evita 2 horas de cola', ctaH2: 'Reserva tus entradas al Palacio Bahía en línea',
    ctaBody: 'Compara tus opciones y luego completa la compra directamente en el portal oficial de entradas.',
    ctaButton: 'Ver todas las opciones',
    officialInfo: 'Información oficial del palacio:', wikiLabel: 'El Palacio Bahía en Wikipedia',
  },
  de: {
    crumbHome: 'Startseite', crumbTickets: 'Tickets', crumbHere: 'Eintrittspreis',
    h1: 'Eintrittspreis Bahia-Palast 2026',
    lede: 'Aktuelle Ticketpreise für den Bahia-Palast in Marrakesch — aktualisiert für 2026. Vergleichen Sie Standardeintritt, Skip-the-Line und Führungen in Dirham und Euro.',
    cardStandard: 'Standardeintritt', cardStandardSub: '', cardStandardNote: 'An der Kasse — Warteschlange inklusive',
    cardSkip: 'Skip-the-Line', cardSkipSub: 'Eintritt ohne Anstehen + digitaler Audioguide', cardSkipNote: 'Keine Schlange am Ticketschalter',
    cardGuided: 'Führung', cardGuidedSub: 'Inkl. Eintritt + Experten-Guide', cardGuidedNote: 'Eintritt + 90-minütige Führung auf Englisch',
    cardCta: 'Verfügbarkeit prüfen',
    breakdownH2: 'Ticketpreise Bahia-Palast 2026 im Detail',
    rowAdults: 'Ausländische Erwachsene', rowAdultsNote: 'Kassenpreis — lange Schlangen möglich',
    rowChildren: 'Ausländische Kinder (7–13)', rowChildrenNote: 'Offizieller Tarif des Kulturministeriums',
    rowUnder7: 'Kinder unter 7 Jahren', rowUnder7Price: 'Kostenlos', rowUnder7Note: 'Kein Ticket erforderlich',
    rowMoroccan: 'Marokkanische Erwachsene', rowMoroccanNote: 'Gültiger marokkanischer Ausweis nötig',
    rowSkip: 'Skip-the-Line (online)', rowSkipNote: 'Zeitfenster-Eintritt + digitaler Audioguide inklusive',
    rowGuided: 'Führung (online)', rowGuidedNote: 'Eintritt + 90 Min. Experten-Guide auf Englisch',
    rowPrivate: 'Private Führung (online)', rowPrivateNote: 'Eintritt + exklusiver privater Guide',
    feeQ: 'Fallen Buchungsgebühren an?',
    feeA: `Wir schlagen nichts auf den Preis auf. Das Skip-the-Line-Ticket kostet mehr als die ${OFFICIAL_DOOR_PRICE_MAD} MAD an der Kasse, weil es ein anderes Produkt ist: Eintritt ohne Anstehen, dazu ein digitaler Audioguide, der auf Ihrem Telefon bleibt. Dieser Preis ist der von Viator, keine Buchungsgebühr von uns. Führungen und private Touren kosten mehr, weil ein professioneller englischsprachiger Guide enthalten ist. Wir sind eine unabhängige Informationsseite, weder der Palast noch das Ministerium, und die Viator-Links bringen uns eine Provision ohne Aufpreis für Sie: Wenn Sie fortfahren, schließen Sie den Kauf bei Viator ab, nicht bei uns — und Sie können das einfache Ticket jederzeit selbst auf dem Portal des Kulturministeriums kaufen.`,
    madQ: 'Wie viel kostet der Bahia-Palast in Dirham?',
    mad: (m, e, c) => `Der Eintritt zum Bahia-Palast beträgt ${m} (etwa ${e}, umgerechnet zum Kurs vom ${c}) für ausländische erwachsene Besucher. Marokkanische Staatsangehörige zahlen 30 MAD. Diesen Preis legt das marokkanische Kulturministerium fest.`,
    includedH2: 'Was ist im Eintrittspreis des Bahia-Palasts enthalten?',
    included: ['Zugang zu allen 150 Räumen und Höfen', 'Der große Ehrenhof (Cour d’Honneur)', 'Der kleine Riad und die Ziergärten', 'Die Privatgemächer von Ba Ahmed', 'Die historischen Haremsräume', 'Bemalte Zederndecken und Zellij-Fliesen'],
    ctaEyebrow: 'Sparen Sie sich 2 Stunden Schlange', ctaH2: 'Tickets für den Bahia-Palast online buchen',
    ctaBody: 'Vergleichen Sie Ihre Optionen und schließen Sie den Kauf dann direkt auf dem offiziellen Ticketportal ab.',
    ctaButton: 'Alle Ticketoptionen ansehen',
    officialInfo: 'Offizielle Informationen zum Palast:', wikiLabel: 'Bahia-Palast auf Wikipedia',
  },
  it: {
    crumbHome: 'Home', crumbTickets: 'Biglietti', crumbHere: "Prezzo d'ingresso",
    h1: "Prezzo d'ingresso del Palazzo Bahia 2026",
    lede: "Prezzi aggiornati dei biglietti per il Palazzo Bahia di Marrakech — edizione 2026. Confronta ingresso standard, salta-fila e visite guidate, in dirham e in euro.",
    cardStandard: 'Ingresso standard', cardStandardSub: '', cardStandardNote: 'Alla biglietteria — fila inclusa',
    cardSkip: 'Salta-fila', cardSkipSub: 'Ingresso senza fila + audioguida digitale', cardSkipNote: 'Nessuna fila alla biglietteria',
    cardGuided: 'Visita guidata', cardGuidedSub: 'Ingresso + guida esperta inclusi', cardGuidedNote: 'Ingresso + visita di 90 min in inglese',
    cardCta: 'Vedi disponibilità',
    breakdownH2: 'Dettaglio dei prezzi del Palazzo Bahia 2026',
    rowAdults: 'Adulti stranieri', rowAdultsNote: 'Prezzo alla biglietteria — possibili lunghe file',
    rowChildren: 'Bambini stranieri (7–13)', rowChildrenNote: 'Tariffa ufficiale del Ministero della Cultura',
    rowUnder7: 'Bambini sotto i 7 anni', rowUnder7Price: 'Gratis', rowUnder7Note: 'Nessun biglietto necessario',
    rowMoroccan: 'Adulti marocchini', rowMoroccanNote: 'Richiesto documento marocchino valido',
    rowSkip: 'Salta-fila (online)', rowSkipNote: 'Ingresso a orario + audioguida digitale inclusa',
    rowGuided: 'Visita guidata (online)', rowGuidedNote: 'Ingresso + guida esperta 90 min in inglese',
    rowPrivate: 'Visita privata (online)', rowPrivateNote: 'Ingresso + guida privata esclusiva',
    feeQ: 'Ci sono costi di prenotazione?',
    feeA: `Non aggiungiamo nulla al prezzo. Il biglietto salta-fila costa più dei ${OFFICIAL_DOOR_PRICE_MAD} MAD della biglietteria perché è un prodotto diverso: ingresso senza fare la fila, più un'audioguida digitale che resta sul tuo telefono. Quel prezzo è di Viator, non una commissione nostra. Le visite guidate e private costano di più perché includono una guida professionista di lingua inglese. Siamo un sito informativo indipendente, non il palazzo né il Ministero, e i link Viator ci fanno guadagnare una commissione senza costi aggiuntivi per te: proseguendo completi l'acquisto su Viator, non con noi, e puoi sempre acquistare da solo il biglietto semplice sul portale del Ministero della Cultura.`,
    madQ: 'Quanto costa il Palazzo Bahia in dirham?',
    mad: (m, e, c) => `Il prezzo d'ingresso al Palazzo Bahia è di ${m} (circa ${e}, convertito al cambio del ${c}) per i visitatori adulti stranieri. I cittadini marocchini pagano 30 MAD. È il prezzo fissato dal Ministero della Cultura marocchino.`,
    includedH2: "Cosa comprende il biglietto d'ingresso al Palazzo Bahia?",
    included: ['Accesso a tutte le 150 sale e ai cortili', "Il Grande Cortile d'Onore", 'Il piccolo riad e i giardini ornamentali', 'Gli appartamenti privati di Ba Ahmed', "Gli storici quartieri dell'harem", 'Soffitti in cedro dipinto e piastrelle zellige'],
    ctaEyebrow: 'Evita 2 ore di fila', ctaH2: 'Prenota online i biglietti per il Palazzo Bahia',
    ctaBody: "Confronta le opzioni, poi completa l'acquisto direttamente sul portale ufficiale dei biglietti.",
    ctaButton: 'Vedi tutte le opzioni',
    officialInfo: 'Informazioni ufficiali sul palazzo:', wikiLabel: 'Il Palazzo Bahia su Wikipedia',
  },
  ar: {
    crumbHome: 'الرئيسية', crumbTickets: 'التذاكر', crumbHere: 'ثمن الدخول',
    h1: 'ثمن دخول قصر الباهية 2026',
    lede: 'الأسعار الحالية لتذاكر قصر الباهية بمراكش — محدّثة لسنة 2026. قارن بين الدخول العادي، وتخطّي الطابور، والجولات المرشدة، بالدرهم وباليورو.',
    cardStandard: 'الدخول العادي', cardStandardSub: '', cardStandardNote: 'عند الشبّاك — الطابور محسوب',
    cardSkip: 'تخطّي الطابور', cardSkipSub: 'دخول بلا طابور + دليل صوتي رقمي', cardSkipNote: 'بلا طابور عند شبّاك التذاكر',
    cardGuided: 'جولة مرشدة', cardGuidedSub: 'تشمل الدخول ومرشدًا خبيرًا', cardGuidedNote: 'الدخول + جولة 90 دقيقة بالإنجليزية',
    cardCta: 'تحقق من التوفر',
    breakdownH2: 'تفصيل أسعار تذاكر قصر الباهية 2026',
    rowAdults: 'البالغون الأجانب', rowAdultsNote: 'ثمن الشبّاك — قد تطول الطوابير',
    rowChildren: 'الأطفال الأجانب (7–13)', rowChildrenNote: 'التعريفة الرسمية لوزارة الثقافة',
    rowUnder7: 'الأطفال دون 7 سنوات', rowUnder7Price: 'مجانًا', rowUnder7Note: 'لا تلزم تذكرة',
    rowMoroccan: 'البالغون المغاربة', rowMoroccanNote: 'تلزم بطاقة تعريف مغربية سارية',
    rowSkip: 'تخطّي الطابور (عبر الإنترنت)', rowSkipNote: 'دخول بموعد + دليل صوتي رقمي مشمول',
    rowGuided: 'جولة مرشدة (عبر الإنترنت)', rowGuidedNote: 'الدخول + مرشد خبير 90 دقيقة بالإنجليزية',
    rowPrivate: 'جولة خاصة (عبر الإنترنت)', rowPrivateNote: 'الدخول + مرشد خاص حصري',
    feeQ: 'هل هناك رسوم حجز؟',
    feeA: `لا نضيف شيئًا إلى الثمن. تذكرة تخطّي الطابور أغلى من ${OFFICIAL_DOOR_PRICE_MAD} درهم الشبّاك لأنها منتوج مختلف: دخول بلا وقوف في الطابور، ومعه دليل صوتي رقمي يبقى على هاتفك. وهذا ثمن Viator، وليس رسوم حجز منّا. أمّا الجولات المرشدة والخاصة فأغلى لأنها تشمل مرشدًا محترفًا ناطقًا بالإنجليزية. نحن موقع معلومات مستقلّ، لسنا القصر ولا الوزارة، وروابط Viator تدرّ علينا عمولة دون تكلفة إضافية عليك: عند المتابعة تُتمّ الشراء على Viator وليس عندنا، ويمكنك دائمًا أن تشتري التذكرة العادية بنفسك من بوابة وزارة الثقافة.`,
    madQ: 'كم يكلّف قصر الباهية بالدرهم؟',
    mad: (m, e, c) => `ثمن دخول قصر الباهية هو ${m} (نحو ${e}، بسعر الصرف المعتمد في ${c}) للزوّار البالغين الأجانب. أمّا المواطنون المغاربة فيؤدّون 30 درهمًا. وهذا هو الثمن الذي تحدّده وزارة الثقافة المغربية.`,
    includedH2: 'ماذا تشمل تذكرة دخول قصر الباهية؟',
    included: ['الدخول إلى القاعات والأفنية الـ150 كلّها', 'فناء الشرف الكبير', 'الرياض الصغير والحدائق المزيّنة', 'الأجنحة الخاصة بباحماد', 'أقسام الحريم التاريخية', 'أسقف الأرز المزخرفة وزليج الجدران'],
    ctaEyebrow: 'تجنّب ساعتين من الطابور', ctaH2: 'احجز تذاكر قصر الباهية عبر الإنترنت',
    ctaBody: 'قارن بين خياراتك، ثم أتمم الشراء مباشرةً على بوابة التذاكر الرسمية.',
    ctaButton: 'اطّلع على كل الخيارات',
    officialInfo: 'معلومات رسمية عن القصر:', wikiLabel: 'قصر الباهية على ويكيبيديا',
  },
  pt: {
    crumbHome: 'Início', crumbTickets: 'Bilhetes', crumbHere: 'Preço de entrada',
    h1: 'Preço de entrada no Palácio Bahia 2026',
    lede: 'Preços atuais dos bilhetes para o Palácio Bahia em Marraquexe — atualizados para 2026. Compare a entrada normal, o acesso sem fila e as visitas guiadas, em dirhams e em euros.',
    cardStandard: 'Entrada normal', cardStandardSub: '', cardStandardNote: 'Na bilheteira — fila incluída',
    cardSkip: 'Sem fila', cardSkipSub: 'Entrada sem fila + audioguia digital', cardSkipNote: 'Sem fila na bilheteira',
    cardGuided: 'Visita guiada', cardGuidedSub: 'Inclui entrada + guia especializado', cardGuidedNote: 'Entrada + visita de 90 min em inglês',
    cardCta: 'Ver disponibilidade',
    breakdownH2: 'Detalhe dos preços do Palácio Bahia 2026',
    rowAdults: 'Adultos estrangeiros', rowAdultsNote: 'Preço na bilheteira — filas longas possíveis',
    rowChildren: 'Crianças estrangeiras (7–13)', rowChildrenNote: 'Tarifa oficial do Ministério da Cultura',
    rowUnder7: 'Crianças com menos de 7 anos', rowUnder7Price: 'Grátis', rowUnder7Note: 'Não é necessário bilhete',
    rowMoroccan: 'Adultos marroquinos', rowMoroccanNote: 'Documento marroquino válido exigido',
    rowSkip: 'Sem fila (online)', rowSkipNote: 'Entrada com hora marcada + audioguia digital incluído',
    rowGuided: 'Visita guiada (online)', rowGuidedNote: 'Entrada + guia especializado 90 min em inglês',
    rowPrivate: 'Visita privada (online)', rowPrivateNote: 'Entrada + guia privado exclusivo',
    feeQ: 'Existe alguma taxa de reserva?',
    feeA: `Não acrescentamos nada ao preço. O bilhete sem fila custa mais do que os ${OFFICIAL_DOOR_PRICE_MAD} MAD da bilheteira porque é um produto diferente: entrada sem esperar na fila, mais um audioguia digital que fica no seu telemóvel. Esse preço é da Viator, não uma taxa de reserva nossa. As visitas guiadas e privadas custam mais porque incluem um guia profissional de língua inglesa. Somos um site de informação independente e sem afiliação: ao continuar conclui a compra na Viator, e não connosco — e pode sempre comprar o bilhete simples no portal do Ministério da Cultura.`,
    madQ: 'Quanto custa o Palácio Bahia em dirhams?',
    mad: (m, e, c) => `O preço de entrada no Palácio Bahia é de ${m} (aproximadamente ${e}, convertido à taxa de ${c}) para visitantes adultos estrangeiros. Os cidadãos marroquinos pagam 30 MAD. É o preço fixado pelo Ministério da Cultura de Marrocos.`,
    includedH2: 'O que inclui o bilhete de entrada no Palácio Bahia?',
    included: ['Acesso a todas as 150 salas e pátios', 'O Grande Pátio de Honra', 'O pequeno riad e os jardins ornamentais', 'Os aposentos privados de Ba Ahmed', 'Os históricos aposentos do harém', 'Tetos de cedro pintado e azulejos zellige'],
    ctaEyebrow: 'Evite 2 horas de fila', ctaH2: 'Reserve bilhetes para o Palácio Bahia online',
    ctaBody: 'Compare as suas opções e conclua a compra diretamente no portal oficial de bilhetes.',
    ctaButton: 'Ver todas as opções',
    officialInfo: 'Informações oficiais sobre o palácio:', wikiLabel: 'Palácio Bahia na Wikipédia',
  },
};

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale] ?? META.en;
  return {
    title: meta.title,
    description: meta.description,
    alternates: buildAlternates(locale, '/entrance-fee'),
    openGraph: buildOG(meta.title, meta.description, locale, '/entrance-fee'),
  };
}

function getPriceSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: 'Bahia Palace',
    url: `${BASE}/${locale}/entrance-fee`,
    offers: [
      { '@type': 'Offer', name: 'Standard Entry (gate)',     price: (OFFICIAL_DOOR_PRICE_EUR_CENTS / 100).toFixed(2), priceCurrency: 'EUR', availability: 'https://schema.org/InStock', ...DIGITAL_TICKET_OFFER_EXTRAS },
      { '@type': 'Offer', name: 'Skip-the-Line (online)',   price: SKIP_THE_LINE_PRICE.amount.toFixed(2), priceCurrency: SKIP_THE_LINE_PRICE.currency, availability: 'https://schema.org/InStock', ...DIGITAL_TICKET_OFFER_EXTRAS },
      { '@type': 'Offer', name: 'Guided Tour (online)',      price: GUIDED_TOUR_PRICE.amount.toFixed(2), priceCurrency: GUIDED_TOUR_PRICE.currency, availability: 'https://schema.org/PreOrder', ...DIGITAL_TICKET_OFFER_EXTRAS },
      { '@type': 'Offer', name: 'Private Tour (online)',     price: PRIVATE_TOUR_PRICE.amount.toFixed(2), priceCurrency: PRIVATE_TOUR_PRICE.currency, availability: 'https://schema.org/PreOrder', ...DIGITAL_TICKET_OFFER_EXTRAS },
    ],
  };
}

export default async function EntranceFeePage({ params }: Props) {
  const { locale } = await params;
  /*
   * Same switch as the funnel. OFF is the affiliate path and is what renders
   * today; ON is the paid pack.
   *
   * This comment used to say the OFF branch could honestly claim "no fee",
   * and the copy did. It cannot: the skip-the-line ticket is $13.00 against a
   * 100 MAD gate price, about €11.90 against €9.36. What the difference buys
   * is entry without queueing and a digital audio guide — it is in the
   * product's own name on Viator — so the copy says that instead. Neither
   * branch of this page may describe itself as free of any markup.
   */
  const { enabled: paymentsEnabled } = getPublicPaymentsFlags();
  const t = COPY[locale] ?? COPY.en;
  return (
    <div className="min-h-screen bg-[#1C1108]">
      <JsonLd data={getPriceSchema(locale)} />
      {/* The breadcrumb schema is read by Google, so it is localised with the
          visible one — a French page whose structured data says "Entrance Fee"
          describes a page that is not there. */}
      <JsonLd data={buildBreadcrumbSchema(locale, [
        { name: t.crumbHome, path: '' },
        { name: t.crumbTickets, path: '/tickets' },
        { name: t.crumbHere },
      ])} />

      {/* Header */}
      <div className="bg-[#251A0F] border-b border-[rgba(232,163,61,0.15)] text-white px-6 py-12 md:px-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            <Breadcrumb variant="light" items={[
              { label: t.crumbHome, href: '/' },
              { label: t.crumbTickets, href: '/tickets' },
              { label: t.crumbHere },
            ]} />
            <h1 className="mt-6 font-bold text-white" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
              {t.h1}
            </h1>
            <p className="mt-3 text-white/75 text-lg max-w-2xl">
              {t.lede}
            </p>
          </div>
          <div className="md:w-72 rounded-2xl overflow-hidden shrink-0">
            <Image
              src="/images/gallery/bahia-palace-grand-doorway-zellige.webp"
              alt="Grand decorated doorway with blue zellige tilework, Bahia Palace Marrakech"
              width={600} height={400}
              className="w-full h-48 md:h-64 object-cover"
              loading="lazy"
              sizes="(max-width:768px) 100vw, 18rem"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/*
          Price cards. The two Viator products are the whole card as a link, with
          a visible button so it reads as clickable rather than as a poster. The
          standard 100 MAD card is not a link: that is the ministry's gate price,
          and we do not sell it.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: t.cardStandard, mad: `${OFFICIAL_DOOR_PRICE_MAD} MAD`, usd: `≈ ${madToEur(OFFICIAL_DOOR_PRICE_MAD)}`, note: t.cardStandardNote, highlight: false, href: null },
            { label: t.cardSkip, mad: <ViatorPrice slug="skip-the-line" />, usd: t.cardSkipSub, note: t.cardSkipNote, highlight: true, href: SKIP_THE_LINE_URL },
            { label: t.cardGuided, mad: <ViatorPrice slug="guided-tour" />, usd: t.cardGuidedSub, note: t.cardGuidedNote, highlight: false, href: GUIDED_TOUR_URL },
          ].map(({ label, mad, usd, note, highlight, href }) => {
            const body = (
              <>
                <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${highlight ? 'text-white/70' : 'text-[#C4A882]'}`}>{label}</p>
                <p className={`text-3xl font-bold mb-1 ${highlight ? 'text-white' : 'text-[#C4452D]'}`} style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>{mad}</p>
                <p className={`text-sm mb-3 ${highlight ? 'text-white/80' : 'text-[#C4A882]'}`}>{usd}</p>
                <p className={`text-xs ${highlight ? 'text-white/60' : 'text-[#C4A882]'}`}>{note}</p>
              </>
            );
            const shell = `rounded-2xl border p-6 text-center ${highlight ? 'bg-[#C4452D] border-[#C4452D] text-white shadow-[0_8px_32px_rgba(196,69,45,0.3)]' : 'bg-[#251A0F] border-[rgba(232,163,61,0.13)]'}`;
            if (!href) {
              return <div key={label} className={shell}>{body}</div>;
            }
            return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="sponsored nofollow noopener"
                className={`${shell} group flex flex-col transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A33D] motion-reduce:transform-none motion-reduce:transition-none`}
              >
                {body}
                <span
                  className={`mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${
                    highlight
                      ? 'bg-white text-[#C4452D] group-hover:bg-white/90'
                      : 'bg-[#C4452D] text-white group-hover:bg-[#A93825]'
                  }`}
                >
                  {t.cardCta} <span aria-hidden>→</span>
                </span>
              </a>
            );
          })}
        </div>

        {/* Detailed breakdown */}
        <div className="bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.15)] overflow-hidden">
          <div className="bg-[#2E1F12] px-6 py-4">
            <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {t.breakdownH2}
            </h2>
          </div>
          <div className="divide-y divide-[rgba(232,163,61,0.10)]">
            {[
              { category: t.rowAdults, price: `${OFFICIAL_DOOR_PRICE_MAD} MAD`, usd: madToEur(OFFICIAL_DOOR_PRICE_MAD), note: t.rowAdultsNote },
              { category: t.rowChildren, price: '50 MAD', usd: madToEur(50), note: t.rowChildrenNote },
              { category: t.rowUnder7, price: t.rowUnder7Price, usd: t.rowUnder7Price, note: t.rowUnder7Note },
              { category: t.rowMoroccan, price: '30 MAD', usd: madToEur(30), note: t.rowMoroccanNote },
              { category: t.rowSkip, price: <ViatorPrice slug="skip-the-line" />, usd: formatDisplayPrice(SKIP_THE_LINE_PRICE), note: t.rowSkipNote },
              { category: t.rowGuided, price: <ViatorPrice slug="guided-tour" />, usd: formatDisplayPrice(GUIDED_TOUR_PRICE), note: t.rowGuidedNote },
              { category: t.rowPrivate, price: <ViatorPrice slug="private-tour" />, usd: formatDisplayPrice(PRIVATE_TOUR_PRICE), note: t.rowPrivateNote },
            ].map(({ category, price, note }) => (
              <div key={category} className="grid grid-cols-3 px-6 py-4 text-sm">
                <span className="font-semibold text-[#F5E8CC]">{category}</span>
                <span className="text-[#C4452D] font-bold tabular-nums">{price}</span>
                <span className="text-[#C4A882]">{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#8FA63C]/08 rounded-xl p-5 border border-[#8FA63C]/20">
            <div className="flex items-center gap-2 mb-3">
              <Info size={16} className="text-[#8FA63C]" />
              <h3 className="font-bold text-[#F5E8CC] text-sm">{t.feeQ}</h3>
            </div>
            <p className="text-sm text-[#C4A882] leading-relaxed">
              {/*
                This page ranks better than any other on the site (position ~6.6
                in Search Console, 3,500 impressions a quarter across locales)
                and converted almost none of it: 20 clicks, and the answer box
                used to end by sending the reader to the ministry portal. Our
                strongest SEO asset was pointing at somebody else's checkout.

                It still says plainly that we are not the Ministry -- that is
                required and it stays -- and the portal address remains in the
                footer and the FAQ. What changed is the last line: it now offers
                the reader somewhere to go on this site.
              */}
              {paymentsEnabled ? (
                <>
                  {/*
                    This opened with "No — we add no booking fee", which the
                    go-live checklist lists for removal and which does not
                    survive the arithmetic underneath it. The gate ticket is
                    100 MAD and we charge €11.99; the difference is what pays
                    for buying the ticket, the audio guide and the support. That
                    is a service being sold, and calling it "no fee" is a claim
                    a regulator would read as misleading no matter how carefully
                    the next sentence explains it.

                    Saying what the price is instead costs nothing. Somebody
                    comparing us to the 100 MAD door price is going to do that
                    subtraction anyway, and it is far better that they find the
                    number already explained than feel they caught us at it.
                  */}
                  Our price is not the gate fee.{' '}
                  <strong className="text-[#F5E8CC]">
                    €{formatEURAmount(VISITOR_PACK_PRICE_EUR_CENTS)}
                  </strong>{' '}
                  per person is an all-inclusive service price: it covers the official{' '}
                  {OFFICIAL_DOOR_PRICE_MAD} MAD ticket bought in your name, a digital audio guide,
                  WhatsApp support, and free cancellation until we send it. Nothing is added at
                  checkout — what you see is what you pay. We are an independent booking service,
                  not the Ministry of Culture.{' '}
                  <Link
                    href="/visitor-pack"
                    className="font-semibold text-[#E8A33D] underline underline-offset-4 hover:text-[#F5C96A]"
                  >
                    See everything that is included
                  </Link>
                  .
                </>
              ) : (
                // The affiliate branch, which is the one that renders: payments
                // are off on this domain by choice. Localised in full — this
                // paragraph is the page's answer box and the reason a reader
                // trusts the price above it.
                <>{t.feeA}</>
              )}
            </p>
          </div>
          <div className="bg-[#E8A33D]/08 rounded-xl p-5 border border-[#E8A33D]/20">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={16} className="text-[#E8A33D]" />
              <h3 className="font-bold text-[#F5E8CC] text-sm">{t.madQ}</h3>
            </div>
            <p className="text-sm text-[#C4A882] leading-relaxed">
              {t.mad(
                `${OFFICIAL_DOOR_PRICE_MAD} MAD`,
                `€${formatEURAmount(OFFICIAL_DOOR_PRICE_EUR_CENTS)}`,
                MAD_TO_EUR_RATE_CHECKED_ON,
              )}
            </p>
          </div>
        </div>

        {/* What's included */}
        <div>
          <h2 className="text-2xl font-bold text-[#F5E8CC] mb-5" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t.includedH2}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {t.included.map(item => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-[#C4A882]">
                <CheckCircle2 size={14} className="text-[#8FA63C] shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Entrance sign photo */}
        <div className="rounded-2xl overflow-hidden">
          <Image
            src="/images/gallery/bahia-palace-entrance-sign-marrakech.webp"
            alt="Official Bahia Palace entrance sign (Palais Bahia), Marrakech"
            width={1200} height={600}
            className="w-full h-56 object-cover"
            loading="lazy"
            sizes="(max-width:768px) 100vw, 896px"
          />
        </div>

        {/* CTA */}
        <div className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-8 text-center">
          <p className="text-[#E8A33D] text-xs font-bold uppercase tracking-widest mb-2">{t.ctaEyebrow}</p>
          <h2 className="text-[#F5E8CC] font-bold text-2xl mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t.ctaH2}
          </h2>
          <p className="text-[#C4A882] text-sm mb-5 max-w-md mx-auto">
            {t.ctaBody}
          </p>
          <LeadButton ticketType="skip-the-line" className="inline-flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            {t.ctaButton} <ArrowRight size={16} />
          </LeadButton>
        </div>

        {/* External authority link */}
        <p className="text-xs text-[#C4A882] text-center">
          {t.officialInfo}{' '}
          <a href="https://en.wikipedia.org/wiki/Bahia_Palace" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#F5E8CC]">
            {t.wikiLabel}
          </a>
        </p>
      </div>
    </div>
  );
}

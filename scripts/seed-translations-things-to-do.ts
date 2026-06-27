import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const url = process.env.DATABASE_URL ?? 'file:./dev.db';
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, ...(authToken ? { authToken } : {}) });
const prisma = new PrismaClient({ adapter });

const SLUG = 'things-to-do-near-bahia-palace';
const COVER = '/images/gallery/bahia-palace-aerial-view-marrakech-medina-drone.jpg';
const DATE = new Date('2026-06-27');

// ---------------------------------------------------------------------------
// FRENCH
// ---------------------------------------------------------------------------
const CONTENT_FR = `<p>La réponse courte : le quartier immédiat du Palais Bahia est la zone la plus dense en monuments de Marrakech. En 10 minutes à pied, vous avez deux autres sites payants majeurs (les Tombeaux Saadiens et le Palais El Badi), un quartier juif historique, un musée de l'artisanat, et l'une des meilleures places gratuites de la ville. Vous pouvez construire une solide demi-journée ici sans prendre de taxi, ou une journée complète si vous ajoutez Jemaa el-Fna en fin de parcours.</p>

<p>Ce guide est le hub de référence. Quand un article dédié couvre déjà l'une de ces attractions en profondeur, un lien y renvoie — inutile de répéter un guide de 1 500 mots quand il existe déjà. L'objectif ici est de vous aider à décider ce que vous combinez et dans quel ordre.</p>

<div style="background:#FDF9F3;border:1px solid #E8D5B7;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:2rem 0;">
<strong>À retenir</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.25rem;">
  <li>Les Tombeaux Saadiens (7 min à pied), le Palais El Badi (10 min) et le Musée Dar Si Said (5 min) peuvent tous se combiner avec le Palais Bahia en une seule matinée — coût total des billets 300 MAD pour les trois monuments du ministère de la Culture (Palais Bahia, Tombeaux Saadiens, Palais El Badi) ; Dar Si Said — vérifier l'entrée sur place.</li>
  <li>Le Mellah et la Place des Ferblantiers sont gratuits, immédiats, et généralement oubliés par les visiteurs qui enchaînent les sites payants.</li>
  <li>Jemaa el-Fna est à 15–20 minutes à pied — faisable, mais mieux vaut la garder pour l'après-midi ou le soir quand la place s'anime.</li>
  <li>L'ordre idéal : Palais Bahia en premier (9h00, le plus calme), Tombeaux Saadiens en deuxième, El Badi en troisième. Tout le reste s'insère autour de ces trois ancres.</li>
</ul>
</div>

<h2>Qu'est-ce qui se trouve à distance de marche du Palais Bahia ?</h2>
<p>Toutes les distances ci-dessous sont des temps de marche approximatifs à travers la médina, pas en ligne droite.</p>

<table>
  <thead>
    <tr><th>Attraction</th><th>Marche depuis Bahia Palace</th><th>Entrée (2026)</th><th>Temps de visite</th></tr>
  </thead>
  <tbody>
    <tr><td>Place des Ferblantiers</td><td>4 min (~300 m)</td><td>Gratuit</td><td>15–20 min</td></tr>
    <tr><td>Mellah (quartier juif)</td><td>2–5 min (adjacent)</td><td>Gratuit</td><td>20–45 min</td></tr>
    <tr><td>Musée Dar Si Said</td><td>5 min (~400 m)</td><td>Vérifier sur place</td><td>30–45 min</td></tr>
    <tr><td>Tombeaux Saadiens</td><td>7–10 min (~650 m)</td><td>100 MAD</td><td>30–45 min</td></tr>
    <tr><td>Palais El Badi</td><td>10 min (~800 m)</td><td>100 MAD</td><td>45–60 min</td></tr>
    <tr><td>Mosquée de la Kasbah (extérieur)</td><td>8 min (~600 m)</td><td>Gratuit (ext. seulement)</td><td>5–10 min</td></tr>
    <tr><td>Jemaa el-Fna</td><td>15–20 min (~1,5 km)</td><td>Gratuit</td><td>1–3 h</td></tr>
  </tbody>
</table>
<p style="font-size:0.85rem;color:#5C3D20;margin-top:0.5rem;">Prix 2026 pour adultes étrangers — vérifier avant la visite. Le Palais Bahia et les Tombeaux Saadiens sont en espèces uniquement à l'entrée. Les visiteurs à mobilité réduite entrent gratuitement. Les ressortissants marocains entrent gratuitement chaque vendredi et lors des jours fériés nationaux et religieux.</p>

<figure style="margin:1.5rem 0;text-align:center;">
  <img src="/images/gallery/bahia-palace-aerial-view-marrakech-medina-drone.jpg" alt="Vue aérienne de la médina sud de Marrakech montrant le Palais Bahia, la Kasbah et les rues reliant aux Tombeaux Saadiens et au Palais El Badi" width="1200" height="800" loading="lazy" style="width:100%;max-width:900px;height:auto;border-radius:0.75rem;display:block;margin:0 auto;" />
  <figcaption style="font-size:0.8rem;color:#5C3D20;margin-top:0.5rem;">La médina sud vue du ciel : le Palais Bahia (centre), le Mellah (est) et la Kasbah avec les Tombeaux Saadiens et le Palais El Badi (sud-ouest). Photo : Abdellah / visitbahiapalace.com</figcaption>
</figure>

<h2>Tombeaux Saadiens — 7 minutes à pied</h2>
<p>Le passage incontournable après le Palais Bahia. Les Tombeaux Saadiens sont un mausolée royal du XVIe siècle abritant les sépultures de 66 membres de la dynastie saadienne, édifiés sous le sultan Ahmad al-Mansur. Trois salles de stuc sculpté et de zellige entourent les tombeaux — l'une des plus grandes concentrations de décoration marocaine dans un espace unique. Le site fut muré par le sultan Moulay Ismaïl au XVIIe siècle et ne fut redécouvert qu'en 1917, ce qui explique son état de conservation exceptionnel. Entrée : 100 MAD (adulte étranger). Durée : 30–45 minutes.</p>
<p>L'expérience est très différente du Palais Bahia : petite, concentrée et d'une intensité décorative extrême dans un espace compact plutôt que vaste et varié. Si vous n'en visitez qu'un seul après le Palais Bahia, c'est celui-là.</p>

<h2>Palais El Badi — 10 minutes à pied</h2>
<p>Construit par le même sultan qui commandita les Tombeaux Saadiens, le Palais El Badi fut autrefois considéré comme l'un des plus grands palais du monde. Il fut systématiquement démantelé par le sultan Moulay Ismaïl à la fin du XVIIe siècle — colonnes de marbre, or et pièces ornementales furent prélevées et transportées à Meknès pour y meubler son propre palais. Ce qui reste est une vaste ruine à ciel ouvert : immenses cours ouvertes, jardins en contrebas, nids de cigognes sur chaque tour, et un sentiment d'échelle qui contraste fortement avec l'intimité des Tombeaux Saadiens. Entrée : 100 MAD (adulte étranger). Durée : 45–60 minutes.</p>
<p>El Badi est souvent ignoré parce qu'il se présente comme de "simples ruines". Ce cadrage passe à côté de l'essentiel. Le vide est précisément le sujet — vous vous tenez à l'intérieur d'un palais qui surpassait autrefois Versailles, face au résultat d'une destruction délibérée à l'échelle architecturale.</p>

<h2>Place des Ferblantiers — 4 minutes à pied</h2>
<p>La place des Ferblantiers se trouve entre le Palais Bahia et le Palais El Badi, et la plupart des visiteurs la traversent sans s'y arrêter. Ne faites pas cette erreur. Les ateliers autour de la place produisent encore les lanternes en métal percé présentes dans tout intérieur marocain traditionnel : les artisans les découpent, les martèlent et les soudent à la main dans les petits ateliers du pourtour. C'est gratuit, cela prend 15 minutes, et cela vous offre un contexte artisanal vivant qui manque aux intérieurs des palais. Il y a aussi quelques cafés discrets sur la place — parfaits pour un thé à la menthe entre deux sites.</p>

<h2>Le Mellah — l'ancien quartier juif</h2>
<p>Le Mellah est le quartier historiquement juif de Marrakech, directement à l'est du Palais Bahia. À son apogée au XIXe siècle, il abritait l'une des plus grandes communautés juives du Maroc. Aujourd'hui, c'est un quartier résidentiel et commercial dense, avec un marché couvert, des orfèvres et certains des meilleurs marchands de produits frais de la médina. L'architecture est distincte du reste de la médina : des rues étroites bordées de maisons aux balcons en bois débordant sur la ruelle — un style propre au Mellah.</p>
<p>C'est gratuit et immédiat — vous le traversez entre le Palais Bahia et les Tombeaux Saadiens si vous suivez l'itinéraire direct. Prenez 20 minutes plutôt que de le traverser en courant. Le marché couvert du Mellah vaut particulièrement le coup pour quiconque s'intéresse à la culture alimentaire marocaine : épices, citrons confits, olives, huile d'argan et herbes fraîches vendus par des résidents du quartier.</p>

<h2>Musée Dar Si Said — 5 minutes à pied</h2>
<p>Dar Si Said est un palais du XIXe siècle construit par Si Said, le frère de Ba Ahmed qui édifia le Palais Bahia — la parenté architecturale est immédiatement perceptible. Il fonctionne aujourd'hui comme musée national du Tissage et du Tapis : zellige, stucs sculptés, menuiserie en cèdre, bijoux, textiles et travaux en bois collectés à travers le Maroc. Entrée : vérifier sur place. Durée : 30–45 minutes.</p>
<p>C'est un vrai musée plutôt qu'un monument, ce qui en fait un type de visite différent. La collection est particulièrement forte sur le bois et le zellige — si vous avez passé une heure à admirer l'artisanat de Ba Ahmed au Palais Bahia, le contexte fourni ici est éclairant. Moins fréquenté que les sites principaux et rarement avec une file d'attente.</p>

<h2>Mosquée de la Kasbah — 8 minutes à pied</h2>
<p>La Mosquée de la Kasbah (également appelée Mosquée de Moulay el-Yazid) est l'une des plus anciennes de Marrakech, avec un minaret décoré de zellige et de stucs sculptés qui rivalise avec la Koutoubia pour la qualité ornementale. Les visiteurs non musulmans ne peuvent pas entrer — mais l'extérieur et le minaret sont visibles depuis la rue et valent le court détour. Les Tombeaux Saadiens sont immédiatement adjacents au mur sud de la mosquée ; vous verrez le minaret en vous y rendant.</p>

<h2>Jemaa el-Fna — 15–20 minutes à pied</h2>
<p>La place centrale de Marrakech est classée par l'UNESCO comme Patrimoine culturel immatériel (2001) pour sa tradition vivante de spectacles : musiciens, conteurs, acrobates, tatoueuses au henné et vendeurs de nourriture qui s'installent chaque après-midi et soir. L'entrée est gratuite. La place est tranquille le matin — principalement des stands de jus et quelques artistes — et atteint sa pleine intensité à partir de 18h environ. Si vous combinez avec une visite matinale du Palais Bahia, prévoyez de vous y rendre après le déjeuner et de rester jusqu'au soir.</p>

<h2>Itinéraires recommandés</h2>

<h3>Demi-journée (4–5 heures)</h3>
<p>9h00 : Palais Bahia (75–90 min) → 10h30 : Place des Ferblantiers + Mellah (20 min chacun) → 11h30 : Tombeaux Saadiens (45 min) → 12h30 : déjeuner dans le quartier de la Kasbah, puis fin de matinée.</p>

<h3>Journée complète (7–8 heures)</h3>
<p>9h00 : Palais Bahia → 10h30 : Mellah + Place des Ferblantiers → 11h30 : Tombeaux Saadiens → 12h30 : déjeuner → 14h00 : Palais El Badi (60 min) → 15h30 : Dar Si Said (45 min) → 17h00 : marche vers Jemaa el-Fna pour l'animation du soir.</p>

<figure style="margin:1.5rem 0;text-align:center;">
  <img src="/images/gallery/bahia-palace-arch-view-green-dome-fountain-palm.jpg" alt="Vue à travers une arche du Palais Bahia vers le dôme vert de la Mosquée de la Kasbah avec fontaine et palmier au premier plan, montrant la proximité des deux sites" width="1200" height="800" loading="lazy" style="width:100%;max-width:900px;height:auto;border-radius:0.75rem;display:block;margin:0 auto;" />
  <figcaption style="font-size:0.8rem;color:#5C3D20;margin-top:0.5rem;">Le dôme vert de la Mosquée de la Kasbah visible depuis le Palais Bahia — un rappel de la proximité des sites. Photo : Abdellah / visitbahiapalace.com</figcaption>
</figure>

<div style="background:#F5EDE0;border:1px solid #D4A96A;border-radius:0.75rem;padding:1.5rem;margin:2.5rem 0;text-align:center;">
  <p style="font-weight:700;color:#3D1F00;margin:0 0 0.75rem;">Commencez par le Palais Bahia</p>
  <p style="color:#5C3D20;font-size:0.95rem;margin:0 0 1rem;">Réservez votre billet coupe-file en ligne et profitez de la matinée sans file d'attente.</p>
  <a href="/fr/tickets" style="display:inline-block;background:#C4452D;color:#fff;font-weight:700;padding:0.75rem 2rem;border-radius:0.5rem;text-decoration:none;">Voir les billets →</a>
</div>`;

// ---------------------------------------------------------------------------
// ITALIAN
// ---------------------------------------------------------------------------
const CONTENT_IT = `<p>La risposta breve: il quartiere intorno a Bahia Palace è la zona più densa di monumenti di Marrakech. In 10 minuti a piedi hai altri due grandi siti a pagamento (le Tombe Saadiane e il Palazzo El Badi), un quartiere ebraico storico, un museo di artigianato e una delle migliori piazze gratuite della città. Puoi costruire una solida mezza giornata qui senza prendere un taxi, o una giornata intera se aggiungi Jemaa el-Fna nel tardo pomeriggio.</p>

<p>Questa è la guida di riferimento. Dove un articolo dedicato copre già una di queste attrazioni in profondità, troverai un link — non ha senso ripetere una guida di 1.500 parole quando già esiste. L'obiettivo qui è aiutarti a decidere cosa combinare e in che ordine.</p>

<div style="background:#FDF9F3;border:1px solid #E8D5B7;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:2rem 0;">
<strong>Da tenere a mente</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.25rem;">
  <li>Le Tombe Saadiane (7 min a piedi), il Palazzo El Badi (10 min) e il Museo Dar Si Said (5 min) possono tutti essere combinati con Bahia Palace in una sola mattinata — costo totale 300 MAD per i tre monumenti del Ministero della Cultura (Bahia Palace, Tombe Saadiane, Palazzo El Badi); Dar Si Said — verificare il biglietto sul posto.</li>
  <li>Il Mellah e Place des Ferblantiers sono gratuiti, immediati e generalmente tralasciati dai visitatori che si precipitano tra i siti a pagamento.</li>
  <li>Jemaa el-Fna è a 15–20 minuti a piedi — raggiungibile, ma meglio tenerla per il pomeriggio o la sera quando la piazza prende vita.</li>
  <li>L'ordine ideale: Bahia Palace per primo (9:00, più tranquillo), Tombe Saadiane per secondo, El Badi per terzo. Il resto si inserisce intorno a questi punti fermi.</li>
</ul>
</div>

<h2>Cosa c'è a distanza di cammino da Bahia Palace?</h2>
<p>Tutte le distanze di seguito sono tempi di percorrenza approssimativi attraverso la medina, non in linea retta.</p>

<table>
  <thead>
    <tr><th>Attrazione</th><th>A piedi da Bahia Palace</th><th>Ingresso (2026)</th><th>Tempo necessario</th></tr>
  </thead>
  <tbody>
    <tr><td>Place des Ferblantiers</td><td>4 min (~300 m)</td><td>Gratuito</td><td>15–20 min</td></tr>
    <tr><td>Mellah (Quartiere Ebraico)</td><td>2–5 min (adiacente)</td><td>Gratuito</td><td>20–45 min</td></tr>
    <tr><td>Museo Dar Si Said</td><td>5 min (~400 m)</td><td>Verificare sul posto</td><td>30–45 min</td></tr>
    <tr><td>Tombe Saadiane</td><td>7–10 min (~650 m)</td><td>100 MAD</td><td>30–45 min</td></tr>
    <tr><td>Palazzo El Badi</td><td>10 min (~800 m)</td><td>100 MAD</td><td>45–60 min</td></tr>
    <tr><td>Moschea della Kasbah (esterno)</td><td>8 min (~600 m)</td><td>Gratuito (solo esterno)</td><td>5–10 min</td></tr>
    <tr><td>Jemaa el-Fna</td><td>15–20 min (~1,5 km)</td><td>Gratuito</td><td>1–3 ore</td></tr>
  </tbody>
</table>
<p style="font-size:0.85rem;color:#5C3D20;margin-top:0.5rem;">Prezzi 2026 per adulti stranieri — verificare prima della visita. Bahia Palace e le Tombe Saadiane accettano solo contanti alla cassa. I visitatori con mobilità ridotta entrano gratuitamente. I cittadini marocchini entrano gratuitamente ogni venerdì e nel primo giorno di festività nazionali e religiose.</p>

<h2>Tombe Saadiane — 7 minuti a piedi</h2>
<p>La tappa imperdibile dopo Bahia Palace. Le Tombe Saadiane sono un mausoleo reale del XVI secolo che contiene le sepolture di 66 membri della dinastia saadiana, costruito sotto il sultano Ahmad al-Mansur. Tre stanze di stucco scolpito e zellige circondano le tombe — una delle più grandi concentrazioni di arte decorativa marocchina in un singolo spazio. Il sito fu murato dal sultano Moulay Ismail nel XVII secolo e riscoperto solo nel 1917, il che spiega la sua eccellente conservazione. Ingresso: 100 MAD (adulto straniero). Tempo: 30–45 minuti.</p>
<p>L'esperienza è molto diversa da Bahia Palace: piccola, concentrata e intensamente dettagliata in uno spazio compatto anziché vasta e variegata. Se ne visiti solo uno dopo Bahia Palace, fa' questo.</p>

<h2>Palazzo El Badi — 10 minuti a piedi</h2>
<p>Costruito dallo stesso sultano che commissionò le Tombe Saadiane, il Palazzo El Badi era un tempo considerato uno dei più grandi palazzi del mondo. Fu sistematicamente smantellato dal sultano Moulay Ismail alla fine del XVII secolo — colonne di marmo, oro e pezzi ornamentali furono asportati e trasportati a Meknès. Quello che rimane è una vasta rovina a cielo aperto: enormi cortili aperti, giardini ribassati, nidi di cicogne su ogni torre, e un senso di scala che contrasta nettamente con l'intimità delle Tombe Saadiane. Ingresso: 100 MAD. Tempo: 45–60 minuti.</p>

<h2>Place des Ferblantiers — 4 minuti a piedi</h2>
<p>La Piazza degli Stagnini si trova tra Bahia Palace e il Palazzo El Badi, e la maggior parte dei visitatori la attraversa senza fermarsi. Non fatelo. I laboratori intorno alla piazza producono ancora le lanterne in metallo forato presenti in ogni interno marocchino tradizionale: gli artigiani le tagliano, le martellano e le saldano a mano nei piccoli laboratori del perimetro. È gratuito, richiede 15 minuti e offre un contesto artigianale vivente che manca agli interni dei palazzi. Ci sono anche alcuni caffè discreti sulla piazza — perfetti per un tè alla menta tra un sito e l'altro.</p>

<h2>Il Mellah — l'antico quartiere ebraico</h2>
<p>Il Mellah è il quartiere storicamente ebraico di Marrakech, direttamente a est di Bahia Palace. Al suo apice nel XIX secolo ospitava una delle più grandi comunità ebraiche del Marocco. Oggi è un quartiere residenziale e commerciale denso, con un mercato coperto, bancarelle di argentieri e alcuni dei migliori venditori di prodotti freschi della medina. L'architettura è distinta dal resto della medina: strade strette fiancheggiate da case con balconi in legno che sporgono sul vicolo — uno stile specifico del Mellah.</p>
<p>È gratuito e immediato — lo si attraversa tra Bahia Palace e le Tombe Saadiane seguendo il percorso diretto. Prenditi 20 minuti invece di correre. Il mercato coperto del Mellah in particolare merita una passeggiata lenta per chi è interessato alla cultura alimentare marocchina: spezie, limoni canditi, olive, olio di argan ed erbe fresche vendute da residenti del quartiere.</p>

<h2>Museo Dar Si Said — 5 minuti a piedi</h2>
<p>Dar Si Said è un palazzo del XIX secolo costruito da Si Said, il fratello di Ba Ahmed che costruì Bahia Palace — la parentela architettonica è immediatamente evidente. Funziona ora come museo di arte decorativa marocchina: zellige, stucchi scolpiti, falegnameria in cedro, gioielli, tessuti e lavori in legno raccolti da tutto il Marocco. Ingresso: verificare sul posto. Tempo: 30–45 minuti.</p>

<h2>Moschea della Kasbah — 8 minuti a piedi</h2>
<p>La Moschea della Kasbah (detta anche Moschea di Moulay el-Yazid) è una delle più antiche di Marrakech, con un minareto decorato in zellige e stucco scolpito che rivaleggia con la Koutoubia per qualità ornamentale. I visitatori non musulmani non possono entrare — ma l'esterno e il minareto sono visibili dalla strada e meritano la breve camminata. Le Tombe Saadiane si trovano immediatamente adiacenti al muro meridionale della moschea; vedrai il minareto mentre ci vai.</p>

<h2>Jemaa el-Fna — 15–20 minuti a piedi</h2>
<p>La piazza centrale di Marrakech è patrimonio culturale immateriale dell'UNESCO (2001) per la sua vivente tradizione di spettacolo: musicisti, narratori, acrobati, tatuatori con l'henné e venditori di cibo che si installano ogni pomeriggio e sera. L'ingresso è gratuito. La piazza è tranquilla al mattino e raggiunge la piena intensità dalle 18:00 circa. Se la combini con una visita mattutina a Bahia Palace, pianifica di arrivarci dopo pranzo e di restare fino a sera.</p>

<h2>Itinerari consigliati</h2>

<h3>Mezza giornata (4–5 ore)</h3>
<p>9:00: Bahia Palace (75–90 min) → 10:30: Place des Ferblantiers + Mellah (20 min ciascuno) → 11:30: Tombe Saadiane (45 min) → 12:30: pranzo nel quartiere della Kasbah.</p>

<h3>Giornata intera (7–8 ore)</h3>
<p>9:00: Bahia Palace → 10:30: Mellah + Place des Ferblantiers → 11:30: Tombe Saadiane → 12:30: pranzo → 14:00: Palazzo El Badi (60 min) → 15:30: Dar Si Said (45 min) → 17:00: passeggiata verso Jemaa el-Fna per l'animazione serale.</p>

<div style="background:#F5EDE0;border:1px solid #D4A96A;border-radius:0.75rem;padding:1.5rem;margin:2.5rem 0;text-align:center;">
  <p style="font-weight:700;color:#3D1F00;margin:0 0 0.75rem;">Inizia da Bahia Palace</p>
  <p style="color:#5C3D20;font-size:0.95rem;margin:0 0 1rem;">Prenota il tuo biglietto salta-fila online e goditi la mattinata senza fare la coda.</p>
  <a href="/it/tickets" style="display:inline-block;background:#C4452D;color:#fff;font-weight:700;padding:0.75rem 2rem;border-radius:0.5rem;text-decoration:none;">Vedi i biglietti →</a>
</div>`;

// ---------------------------------------------------------------------------
// GERMAN
// ---------------------------------------------------------------------------
const CONTENT_DE = `<p>Die kurze Antwort: Das unmittelbare Umfeld des Bahia Palasts ist der monumentendichteste Teil Marrakeschs. In 10 Gehminuten haben Sie zwei weitere wichtige kostenpflichtige Sehenswürdigkeiten (die Saadischen Gräber und der El Badi Palast), ein historisches jüdisches Viertel, ein Kunsthandwerksmuseum und einen der besten kostenlosen Plätze der Stadt. Sie können hier eine solide halbe Tagbesichtigung ohne Taxi zusammenstellen oder einen ganzen Tag, wenn Sie Jemaa el-Fna am Ende des Tages hinzufügen.</p>

<p>Dies ist das Überblicks-Hub. Wo ein eigener Artikel eine dieser Sehenswürdigkeiten bereits ausführlich behandelt, finden Sie einen Link — kein Sinn, einen 1.500-Wörter-Leitfaden zu wiederholen, wenn er bereits existiert. Das Ziel hier ist es, Ihnen zu helfen zu entscheiden, was Sie kombinieren und in welcher Reihenfolge.</p>

<div style="background:#FDF9F3;border:1px solid #E8D5B7;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:2rem 0;">
<strong>Das Wichtigste in Kürze</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.25rem;">
  <li>Die Saadischen Gräber (7 Min. zu Fuß), El Badi Palast (10 Min.) und Dar Si Said Museum (5 Min.) können alle mit dem Bahia Palast an einem einzigen Vormittag kombiniert werden — Gesamtticketpreis 300 MAD für die drei Kulturministerium-Monumente (Bahia Palast, Saadische Gräber, El Badi Palast); Dar Si Said — Eintritt vor Ort prüfen.</li>
  <li>Der Mellah und die Place des Ferblantiers sind kostenlos, unmittelbar gelegen und werden meist von Besuchern übergangen, die zwischen kostenpflichtigen Stätten eilen.</li>
  <li>Jemaa el-Fna ist 15–20 Minuten zu Fuß — machbar, aber besser für den Nachmittag oder Abend aufgespart, wenn der Platz zum Leben erwacht.</li>
  <li>Die ideale Reihenfolge: Bahia Palast zuerst (9:00 Uhr, am ruhigsten), dann Saadische Gräber, dann El Badi. Alles andere fügt sich um diese Ankerpunkte ein.</li>
</ul>
</div>

<h2>Was ist zu Fuß vom Bahia Palast aus erreichbar?</h2>
<p>Alle Entfernungen unten sind ungefähre Gehzeiten durch die Medina, nicht in der Luftlinie.</p>

<table>
  <thead>
    <tr><th>Sehenswürdigkeit</th><th>Gehzeit vom Bahia Palast</th><th>Eintritt (2026)</th><th>Benötigte Zeit</th></tr>
  </thead>
  <tbody>
    <tr><td>Place des Ferblantiers</td><td>4 Min. (~300 m)</td><td>Kostenlos</td><td>15–20 Min.</td></tr>
    <tr><td>Mellah (Jüdisches Viertel)</td><td>2–5 Min. (angrenzend)</td><td>Kostenlos</td><td>20–45 Min.</td></tr>
    <tr><td>Dar Si Said Museum</td><td>5 Min. (~400 m)</td><td>Vor Ort prüfen</td><td>30–45 Min.</td></tr>
    <tr><td>Saadische Gräber</td><td>7–10 Min. (~650 m)</td><td>100 MAD</td><td>30–45 Min.</td></tr>
    <tr><td>El Badi Palast</td><td>10 Min. (~800 m)</td><td>100 MAD</td><td>45–60 Min.</td></tr>
    <tr><td>Kasbah-Moschee (Außenansicht)</td><td>8 Min. (~600 m)</td><td>Kostenlos (nur Außen)</td><td>5–10 Min.</td></tr>
    <tr><td>Jemaa el-Fna</td><td>15–20 Min. (~1,5 km)</td><td>Kostenlos</td><td>1–3 Stunden</td></tr>
  </tbody>
</table>
<p style="font-size:0.85rem;color:#5C3D20;margin-top:0.5rem;">Preise 2026 für ausländische Erwachsene — bitte vor dem Besuch prüfen. Bahia Palast und Saadische Gräber sind an der Kasse nur mit Bargeld. Besucher mit eingeschränkter Mobilität haben freien Eintritt. Marokkanische Staatsangehörige haben jeden Freitag sowie am ersten Tag nationaler und religiöser Feiertage freien Eintritt.</p>

<h2>Saadische Gräber — 7 Minuten zu Fuß</h2>
<p>Der wichtigste Stopp nach dem Bahia Palast. Die Saadischen Gräber sind ein königliches Mausoleum aus dem 16. Jahrhundert, das die Grabkammern von 66 Mitgliedern der Saadidendynastie unter Sultan Ahmad al-Mansur enthält. Drei Räume mit geschnitztem Stuck und Zellige-Kacheln umgeben die Gräber — eine der reichsten Konzentrationen marokkanischer Dekorationskunst an einem einzigen Ort. Die Stätte wurde von Sultan Moulay Ismail im 17. Jahrhundert versiegelt und erst 1917 wiederentdeckt, was ihre außergewöhnliche Erhaltung erklärt. Eintritt: 100 MAD. Benötigte Zeit: 30–45 Minuten.</p>
<p>Das Erlebnis ist sehr verschieden vom Bahia Palast: klein, konzentriert und intensiv detailliert auf engem Raum statt weitläufig und abwechslungsreich. Wenn Sie nach dem Bahia Palast nur eine Sehenswürdigkeit besuchen, dann diese.</p>

<h2>El Badi Palast — 10 Minuten zu Fuß</h2>
<p>Erbaut vom selben Sultan, der die Saadischen Gräber in Auftrag gab, galt der El Badi Palast einst als einer der größten Paläste der Welt. Er wurde Ende des 17. Jahrhunderts von Sultan Moulay Ismail systematisch abgerissen — Marmorsäulen, Gold und Zierstücke wurden nach Meknès transportiert. Was bleibt, ist eine weitläufige, dachlose Ruine: riesige offene Innenhöfe, versunkene Gärten, Storchennester auf jedem Turm und ein Gefühl für Dimensionen, das im starken Kontrast zur Intimität der Saadischen Gräber steht. Eintritt: 100 MAD. Zeit: 45–60 Minuten.</p>

<h2>Place des Ferblantiers — 4 Minuten zu Fuß</h2>
<p>Der Schmiederplatz liegt zwischen dem Bahia Palast und dem El Badi Palast, und die meisten Besucher gehen einfach hindurch. Tun Sie das nicht. Die Werkstätten rund um den Platz produzieren noch immer die durchbrochenen Metalllaternen, die in jedem traditionellen marokkanischen Interieur zu finden sind: Handwerker schneiden, hämmern und löten sie in den kleinen Werkstätten am Platzrand. Es ist kostenlos, dauert 15 Minuten und gibt Ihnen einen lebendigen Handwerkskontext, den die Palastinnenräume vermissen lassen. Auf dem Platz gibt es auch einige ruhige Cafés — ideal für einen Minztee zwischen den Sehenswürdigkeiten.</p>

<h2>Mellah — Das historische jüdische Viertel</h2>
<p>Der Mellah ist das historisch jüdische Viertel Marrakeschs, direkt östlich des Bahia Palasts. Auf seinem Höhepunkt im 19. Jahrhundert beherbergte es eine der größten jüdischen Gemeinschaften Marokkos. Heute ist es ein dichtes Wohn- und Geschäftsviertel mit einem überdachten Markt, Silberschmieden und einigen der besten Frischwarenverkäufer der Medina. Die Architektur unterscheidet sich vom Rest der Medina: enge Straßen, gesäumt von Häusern mit Holzbalkonen, die über die Gasse ragen.</p>
<p>Es ist kostenlos und unmittelbar — Sie gehen auf dem direkten Weg zwischen Bahia Palast und Saadischen Gräbern hindurch. Nehmen Sie sich 20 Minuten statt hindurchzuhetzen. Der überdachte Mellah-Markt ist besonders sehenswert für alle, die sich für marokkanische Esskultur interessieren: Gewürze, eingelegte Zitronen, Oliven, Arganöl und frische Kräuter, verkauft von Anwohnern.</p>

<h2>Dar Si Said Museum — 5 Minuten zu Fuß</h2>
<p>Dar Si Said ist ein Palast aus dem 19. Jahrhundert, erbaut von Si Said, dem Bruder von Ba Ahmed, der den Bahia Palast baute — die architektonische Verwandtschaft ist sofort erkennbar. Es fungiert heute als Museum für marokkanisches Kunsthandwerk: Zellige, geschnitzter Stuck, Zedernholzarbeiten, Schmuck, Textilien und Holzarbeiten aus ganz Marokko. Eintritt: vor Ort prüfen. Zeit: 30–45 Minuten.</p>

<h2>Jemaa el-Fna — 15–20 Minuten zu Fuß</h2>
<p>Marrakeschs Hauptplatz steht seit 2001 auf der UNESCO-Liste des immateriellen Kulturerbes für seine lebendige Aufführungstradition: Musiker, Geschichtenerzähler, Akrobaten, Henna-Malerinnen und Essensstände, die sich jeden Nachmittag und Abend aufbauen. Der Eintritt ist kostenlos. Der Platz ist morgens ruhig und erreicht ab etwa 18:00 Uhr seine volle Lebendigkeit.</p>

<h2>Empfohlene Routen</h2>

<h3>Halber Tag (4–5 Stunden)</h3>
<p>9:00 Uhr: Bahia Palast (75–90 Min.) → 10:30 Uhr: Place des Ferblantiers + Mellah (je 20 Min.) → 11:30 Uhr: Saadische Gräber (45 Min.) → 12:30 Uhr: Mittagessen im Kasbah-Viertel.</p>

<h3>Ganzer Tag (7–8 Stunden)</h3>
<p>9:00 Uhr: Bahia Palast → 10:30 Uhr: Mellah + Place des Ferblantiers → 11:30 Uhr: Saadische Gräber → 12:30 Uhr: Mittagessen → 14:00 Uhr: El Badi Palast (60 Min.) → 15:30 Uhr: Dar Si Said (45 Min.) → 17:00 Uhr: Spaziergang zum Jemaa el-Fna für die Abendstimmung.</p>

<div style="background:#F5EDE0;border:1px solid #D4A96A;border-radius:0.75rem;padding:1.5rem;margin:2.5rem 0;text-align:center;">
  <p style="font-weight:700;color:#3D1F00;margin:0 0 0.75rem;">Beginnen Sie mit dem Bahia Palast</p>
  <p style="color:#5C3D20;font-size:0.95rem;margin:0 0 1rem;">Buchen Sie Ihr Skip-the-Line-Ticket online und genießen Sie den Morgen ohne Warteschlange.</p>
  <a href="/de/tickets" style="display:inline-block;background:#C4452D;color:#fff;font-weight:700;padding:0.75rem 2rem;border-radius:0.5rem;text-decoration:none;">Tickets ansehen →</a>
</div>`;

// ---------------------------------------------------------------------------
// SPANISH
// ---------------------------------------------------------------------------
const CONTENT_ES = `<p>La respuesta corta: el barrio inmediato al Palacio Bahia es la zona con mayor densidad de monumentos de Marrakech. En 10 minutos a pie tienes otros dos grandes sitios de pago (las Tumbas Saadíes y el Palacio El Badi), un barrio judío histórico, un museo de artesanía y una de las mejores plazas gratuitas de la ciudad. Puedes construir una sólida media jornada aquí sin tomar un taxi, o una jornada completa si añades la Jemaa el-Fna al final.</p>

<p>Esta es la guía de referencia. Donde ya existe un artículo dedicado que cubre una de estas atracciones en profundidad, encontrarás un enlace — no tiene sentido repetir una guía de 1.500 palabras cuando ya existe. El objetivo aquí es ayudarte a decidir qué combinar y en qué orden.</p>

<div style="background:#FDF9F3;border:1px solid #E8D5B7;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:2rem 0;">
<strong>Lo más importante</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.25rem;">
  <li>Las Tumbas Saadíes (7 min a pie), el Palacio El Badi (10 min) y el Museo Dar Si Said (5 min) pueden combinarse todos con el Palacio Bahia en una sola mañana — coste total de entradas 300 MAD para los tres monumentos del Ministerio de Cultura (Palacio Bahia, Tumbas Saadíes, Palacio El Badi); Dar Si Said — verificar entrada al llegar.</li>
  <li>El Mellah y la Place des Ferblantiers son gratuitos, inmediatos y generalmente pasados por alto por los visitantes que van corriendo entre los sitios de pago.</li>
  <li>La Jemaa el-Fna está a 15–20 minutos a pie — accesible, pero mejor guardada para la tarde o noche cuando la plaza cobra vida.</li>
  <li>El orden ideal: Palacio Bahia primero (9:00, más tranquilo), Tumbas Saadíes segundo, El Badi tercero. Todo lo demás se encaja alrededor de estos tres pilares.</li>
</ul>
</div>

<h2>¿Qué hay a distancia a pie del Palacio Bahia?</h2>
<p>Todas las distancias a continuación son tiempos de caminata aproximados por la medina, no en línea recta.</p>

<table>
  <thead>
    <tr><th>Atracción</th><th>A pie desde Palacio Bahia</th><th>Entrada (2026)</th><th>Tiempo necesario</th></tr>
  </thead>
  <tbody>
    <tr><td>Place des Ferblantiers</td><td>4 min (~300 m)</td><td>Gratis</td><td>15–20 min</td></tr>
    <tr><td>Mellah (Barrio Judío)</td><td>2–5 min (adyacente)</td><td>Gratis</td><td>20–45 min</td></tr>
    <tr><td>Museo Dar Si Said</td><td>5 min (~400 m)</td><td>Verificar al llegar</td><td>30–45 min</td></tr>
    <tr><td>Tumbas Saadíes</td><td>7–10 min (~650 m)</td><td>100 MAD</td><td>30–45 min</td></tr>
    <tr><td>Palacio El Badi</td><td>10 min (~800 m)</td><td>100 MAD</td><td>45–60 min</td></tr>
    <tr><td>Mezquita de la Kasbah (exterior)</td><td>8 min (~600 m)</td><td>Gratis (solo exterior)</td><td>5–10 min</td></tr>
    <tr><td>Jemaa el-Fna</td><td>15–20 min (~1,5 km)</td><td>Gratis</td><td>1–3 horas</td></tr>
  </tbody>
</table>
<p style="font-size:0.85rem;color:#5C3D20;margin-top:0.5rem;">Precios 2026 para adultos extranjeros — verificar antes de visitar. El Palacio Bahia y las Tumbas Saadíes solo aceptan efectivo en taquilla. Los visitantes con movilidad reducida entran gratis. Los ciudadanos marroquíes entran gratis cada viernes y el primer día de festividades nacionales y religiosas.</p>

<h2>Tumbas Saadíes — 7 minutos a pie</h2>
<p>La parada imprescindible después del Palacio Bahia. Las Tumbas Saadíes son un mausoleo real del siglo XVI que contiene las cámaras funerarias de 66 miembros de la dinastía saadí, construidas bajo el sultán Ahmad al-Mansur. Tres salas de estuco tallado y zellige rodean las tumbas — una de las mayores concentraciones de arte decorativo marroquí en un solo espacio. El sitio fue sellado por el sultán Moulay Ismail en el siglo XVII y no fue redescubierto hasta 1917, lo que explica su extraordinaria conservación. Entrada: 100 MAD. Tiempo: 30–45 minutos.</p>
<p>La experiencia es muy diferente al Palacio Bahia: pequeña, concentrada e intensamente detallada en un espacio compacto. Si solo visitas uno después del Palacio Bahia, que sea este.</p>

<h2>Palacio El Badi — 10 minutos a pie</h2>
<p>Construido por el mismo sultán que encargó las Tumbas Saadíes, el Palacio El Badi fue considerado en su día uno de los más grandes del mundo. Fue sistemáticamente desmantelado por el sultán Moulay Ismail a finales del siglo XVII. Lo que queda es una vasta ruina a cielo abierto: enormes patios abiertos, jardines hundidos, nidos de cigüeñas en cada torre y una sensación de escala que contrasta fuertemente con la intimidad de las Tumbas Saadíes. Entrada: 100 MAD. Tiempo: 45–60 minutos.</p>

<h2>Place des Ferblantiers — 4 minutos a pie</h2>
<p>La Plaza de los Caldereros se encuentra entre el Palacio Bahia y el Palacio El Badi, y la mayoría de los visitantes la cruzan sin detenerse. No lo hagas. Los talleres alrededor de la plaza siguen produciendo las linternas de metal perforado presentes en cualquier interior marroquí tradicional: los artesanos las cortan, martillan y sueldan a mano en los pequeños talleres del perímetro. Es gratis, lleva 15 minutos y te ofrece un contexto artesanal vivo que falta en los interiores de los palacios.</p>

<h2>El Mellah — el antiguo barrio judío</h2>
<p>El Mellah es el barrio históricamente judío de Marrakech, directamente al este del Palacio Bahia. En su apogeo en el siglo XIX albergaba una de las mayores comunidades judías de Marruecos. Hoy es un barrio residencial y comercial denso, con un mercado cubierto, puestos de platería y algunos de los mejores vendedores de productos frescos de la medina. La arquitectura es distinta del resto: calles estrechas bordeadas de casas con balcones de madera que se proyectan sobre el callejón.</p>
<p>Es gratis e inmediato — lo cruzas entre el Palacio Bahia y las Tumbas Saadíes si sigues la ruta directa. Tómate 20 minutos en lugar de pasar corriendo. El mercado cubierto del Mellah en particular merece un paseo tranquilo para quien esté interesado en la cultura gastronómica marroquí.</p>

<h2>Jemaa el-Fna — 15–20 minutos a pie</h2>
<p>La plaza central de Marrakech es Patrimonio Cultural Inmaterial de la UNESCO (2001) por su viva tradición de espectáculos: músicos, narradores, acróbatas, pintoras de henna y vendedores de comida que se instalan cada tarde y noche. La entrada es gratuita. La plaza está tranquila por la mañana y alcanza su máxima intensidad a partir de las 18:00 aproximadamente.</p>

<h2>Itinerarios recomendados</h2>

<h3>Media jornada (4–5 horas)</h3>
<p>9:00: Palacio Bahia (75–90 min) → 10:30: Place des Ferblantiers + Mellah (20 min cada uno) → 11:30: Tumbas Saadíes (45 min) → 12:30: almuerzo en el barrio de la Kasbah.</p>

<h3>Jornada completa (7–8 horas)</h3>
<p>9:00: Palacio Bahia → 10:30: Mellah + Place des Ferblantiers → 11:30: Tumbas Saadíes → 12:30: almuerzo → 14:00: Palacio El Badi (60 min) → 15:30: Dar Si Said (45 min) → 17:00: caminata hacia la Jemaa el-Fna para el ambiente nocturno.</p>

<div style="background:#F5EDE0;border:1px solid #D4A96A;border-radius:0.75rem;padding:1.5rem;margin:2.5rem 0;text-align:center;">
  <p style="font-weight:700;color:#3D1F00;margin:0 0 0.75rem;">Empieza por el Palacio Bahia</p>
  <p style="color:#5C3D20;font-size:0.95rem;margin:0 0 1rem;">Reserva tu entrada sin colas online y disfruta de la mañana sin esperar en la puerta.</p>
  <a href="/es/tickets" style="display:inline-block;background:#C4452D;color:#fff;font-weight:700;padding:0.75rem 2rem;border-radius:0.5rem;text-decoration:none;">Ver entradas →</a>
</div>`;

// ---------------------------------------------------------------------------
// SEED
// ---------------------------------------------------------------------------
async function upsert(slug: string, locale: string, data: object) {
  await prisma.blogPost.upsert({
    where: { slug_locale: { slug, locale } },
    update: data as any,
    create: { slug, locale, ...(data as any) },
  });
  console.log(`✓ ${locale.toUpperCase()}: ${slug}`);
}

async function main() {
  await upsert(SLUG, 'fr', {
    title: 'Que faire près du Palais Bahia : tout ce qu\'il y a à voir dans le Kasbah (2026)',
    category: 'guides',
    excerpt: 'Les Tombeaux Saadiens, le Palais El Badi, le Mellah et Dar Si Said : tout à 10 minutes du Palais Bahia. Circuits demi-journée et journée complète dans le Kasbah.',
    seoTitle: 'Que faire près du Palais Bahia Marrakech (2026)',
    seoDesc: 'Tombeaux saadiens, El Badi Palace, le Mellah et Dar Si Said : tout à 10 minutes du Palais Bahia. Circuits demi-journée et journée complète dans le Kasbah.',
    coverImage: COVER, ogImage: COVER, author: 'Abdellah',
    published: true, publishedAt: DATE, content: CONTENT_FR,
  });

  await upsert(SLUG, 'it', {
    title: 'Cosa fare vicino a Bahia Palace: cos\'altro vedere nella Kasbah di Marrakech (2026)',
    category: 'guides',
    excerpt: 'Tombe Saadiane, El Badi Palace, il Mellah e Dar Si Said: tutto a 10 minuti da Bahia Palace. Itinerari di mezza giornata e giornata intera nella Kasbah.',
    seoTitle: 'Cosa fare vicino a Bahia Palace Marrakech (2026)',
    seoDesc: 'Tombe Saadiane, El Badi Palace, il Mellah e Dar Si Said: tutto a 10 minuti da Bahia Palace. Itinerari di mezza giornata e giornata intera nella Kasbah.',
    coverImage: COVER, ogImage: COVER, author: 'Abdellah',
    published: true, publishedAt: DATE, content: CONTENT_IT,
  });

  await upsert(SLUG, 'de', {
    title: 'Sehenswürdigkeiten nahe dem Bahia Palast: Was Sie noch in der Kasbah sehen sollten (2026)',
    category: 'guides',
    excerpt: 'Saadische Gräber, El Badi Palace, der Mellah und Dar Si Said: alles in 10 Minuten vom Bahia Palast. Halb- und Ganztagsrouten für die Kasbah in Marrakesch.',
    seoTitle: 'Was tun nahe dem Bahia Palast Marrakesch (2026)',
    seoDesc: 'Saadische Gräber, El Badi Palace, der Mellah und Dar Si Said: alles in 10 Minuten vom Bahia Palast. Halb- und Ganztagsrouten für die Kasbah in Marrakesch.',
    coverImage: COVER, ogImage: COVER, author: 'Abdellah',
    published: true, publishedAt: DATE, content: CONTENT_DE,
  });

  await upsert(SLUG, 'es', {
    title: 'Qué hacer cerca del Palacio Bahia: qué más ver en la Kasbah de Marrakech (2026)',
    category: 'guides',
    excerpt: 'Tumbas Saadíes, El Badi Palace, el Mellah y Dar Si Said: todo a 10 minutos del Palacio Bahia. Rutas de medio día y jornada completa por la Kasbah de Marrakech.',
    seoTitle: 'Qué hacer cerca del Palacio Bahia Marrakech (2026)',
    seoDesc: 'Tumbas Saadíes, El Badi Palace, el Mellah y Dar Si Said: todo a 10 minutos del Palacio Bahia. Rutas de medio día y jornada completa por la Kasbah de Marrakech.',
    coverImage: COVER, ogImage: COVER, author: 'Abdellah',
    published: true, publishedAt: DATE, content: CONTENT_ES,
  });

  console.log('All things-to-do translations inserted.');
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });

import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const url = process.env.DATABASE_URL ?? 'file:./dev.db';
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, ...(authToken ? { authToken } : {}) });
const prisma = new PrismaClient({ adapter });

const SLUG = 'restaurants-near-bahia-palace';
const COVER = '/images/gallery/bahia-palace-aerial-view-marrakech-medina-drone.jpg';
const DATE = new Date('2026-06-27');

// ---------------------------------------------------------------------------
// FRENCH
// ---------------------------------------------------------------------------
const CONTENT_FR = `<p>Le quartier autour du Palais Bahia est au carrefour de trois zones distinctes de Marrakech : le Mellah (l'ancien quartier juif), la Kasbah, et le corridor de la rue Riad Zitoun el Jedid qui relie la médina sud à Jemaa el-Fna. En 2024, le Maroc a accueilli 17,4 millions de visiteurs internationaux (<a href="https://www.visitmorocco.com" rel="noopener noreferrer" target="_blank">ONMT, Rapport annuel du tourisme marocain 2024</a>), et une part significative mange à quelques centaines de mètres de l'entrée du Palais Bahia. Cette concentration crée une distorsion prévisible : les restaurants les plus visibles sont souvent ceux qui offrent le moins de valeur. Un peu de repérage préalable change tout. Ce guide couvre les meilleures options par catégorie — terrasses, cuisine marocaine traditionnelle, street food et cafés — avec les temps de marche, les fourchettes de prix, et les signes à surveiller avant de vous asseoir.</p>

<div style="background:#FDF9F3;border:1px solid #E8D5B7;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:2rem 0;">
<strong>À retenir</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.25rem;">
  <li>Les restaurants juste en face de l'entrée du Palais Bahia sont les plus chers du quartier. Avancez d'une ou deux rues vers le Mellah ou la Place des Ferblantiers et le rapport qualité-prix s'améliore sensiblement.</li>
  <li>Le Mellah, à 2–5 minutes à l'est du palais, affiche les prix les plus bas du secteur : 15–50 MAD pour un encas, 40–80 MAD pour un plat complet, destinés aux résidents locaux plutôt qu'aux touristes.</li>
  <li>Pour un repas assis, la Kasbah propose des restaurants de riad ($$$), des établissements d'hôtel ($$$$) et de véritables adresses locales ($$) — tous à moins de 12 minutes à pied de l'entrée.</li>
</ul>
</div>

<h2>Quelles sont les meilleures zones pour manger près du Palais Bahia ?</h2>

<p>Les restaurants directement devant l'entrée du Palais Bahia s'adressent à une clientèle de visiteurs fraîchement arrivés et fixent leurs prix en conséquence. Les 100 premiers mètres après la sortie constituent le pire endroit pour choisir un restaurant dans ce quartier. Quatre zones bien meilleures se trouvent toutes à moins de 12 minutes à pied, chacune avec son caractère et ses prix propres.</p>

<table>
  <thead>
    <tr><th>Zone</th><th>Temps depuis le palais</th><th>Type de cuisine</th><th>Gamme de prix</th></tr>
  </thead>
  <tbody>
    <tr><td>Marché du Mellah</td><td>2–5 min</td><td>Street food, jus de fruits, cafés locaux</td><td>$</td></tr>
    <tr><td>Place des Ferblantiers</td><td>4 min</td><td>Terrasses de café, thé à la menthe, en-cas</td><td>$–$$</td></tr>
    <tr><td>Rue Riad Zitoun el Jedid</td><td>0–3 min</td><td>Restaurants marocains touristiques, terrasses</td><td>$$–$$$</td></tr>
    <tr><td>Kasbah (à l'ouest du palais)</td><td>8–12 min</td><td>Restaurants de riad, hôtels, cafés rooftop</td><td>$$–$$$$</td></tr>
  </tbody>
</table>
<p style="font-size:0.85rem;color:#5C3D20;margin-top:0.5rem;">Gammes de prix : $ = moins de 80 MAD / $$ = 80–180 MAD / $$$ = 180–350 MAD / $$$$ = 350 MAD+ par personne. Tarifs approximatifs 2026 — vérifier sur place. Les restaurants de la médina ouvrent et ferment fréquemment : consultez Google Maps avant de vous y rendre.</p>

<figure style="margin:1.5rem 0;text-align:center;">
  <img src="/images/gallery/bahia-palace-aerial-view-marrakech-medina-drone.jpg" alt="Vue aérienne de la médina sud de Marrakech montrant le Palais Bahia au centre, le Mellah à l'est et la Kasbah au sud-ouest où se trouvent les meilleurs restaurants près du Palais Bahia" width="1200" height="800" loading="lazy" style="width:100%;max-width:900px;height:auto;border-radius:0.75rem;display:block;margin:0 auto;" />
  <figcaption style="font-size:0.8rem;color:#5C3D20;margin-top:0.5rem;">La médina sud vue du ciel : le Palais Bahia (centre), le marché du Mellah (est) et la Kasbah (sud-ouest). Les meilleures tables se répartissent dans ces trois zones. Photo : Abdellah / visitbahiapalace.com</figcaption>
</figure>

<h2>Restaurants en terrasse et rooftops près du Palais Bahia</h2>

<p>La Kasbah compte plusieurs cafés rooftop et restaurants en terrasse dont la vue — toits de la médina, minaret vert de la Mosquée de la Kasbah, et par temps clair une ligne de l'Atlas — vaut vraiment le détour pour trouver le bon. La catégorie se divise nettement : une partie sert une vraie cuisine à des prix honnêtes ; l'autre fait payer la vue et vit du flux de passage.</p>

<h3>Café Clock (Kasbah) — $$</h3>
<p>Le Café Clock, 23 rue de la Kasbah (4,4 ★ sur Google Maps), est un restaurant-espace culturel bien établi à 8–10 minutes à pied du Palais Bahia. Il dispose d'une terrasse rooftop et propose une carte allant des classiques marocains (tajine, harira, msemen) aux plats internationaux plus légers. Fourchette de prix : 80–160 MAD par personne. Il est régulièrement cité dans les guides indépendants de Marrakech comme l'une des adresses les plus fiables de ce bout de médina. Des soirées de musique live et de conte se tiennent tout au long de la semaine. Vérifiez les horaires avant de partir — ils peuvent varier selon les saisons.</p>

<h3>Rooftop Eclipse — $$</h3>
<p>Le Rooftop Eclipse est visible sur Google Maps dans le quartier de la Kasbah, près du Café Clock. C'est une autre option rooftop dans ce voisinage. Vérifiez le menu actuel, les horaires et l'ouverture sur Google Maps avant de vous y rendre — comme dans de nombreux restaurants de la médina, la disponibilité évolue.</p>

<h3>À éviter : le « panoramique touristique »</h3>
<p>Le restaurant panoramique agressivement marketé depuis la rue existe en abondance près du Palais Bahia. Ces établissements facturent généralement 150–250 MAD par personne pour une cuisine ordinaire accompagnée de la vue. Les signes révélateurs : aucun client marocain visible à l'intérieur, aucun prix affiché à l'entrée, et un rabatteur qui vous accoste sur le trottoir plutôt que d'attendre à la porte. Le <a href="/fr/blog/marrakech-safety-guide">guide de sécurité Marrakech</a> détaille ce type d'arnaque et bien d'autres.</p>

<h2>Restaurants marocains traditionnels : tajine, couscous, pastilla</h2>

<p>Les meilleurs restaurants marocains avec service assis dans la Kasbah sont pour la plupart attachés à des riads ou des hôtels-boutiques qui les ouvrent aux non-résidents le midi et parfois le soir. Les restaurants indépendants sur le corridor touristique principal (rue Riad Zitoun el Jedid) varient du très bon au franchement médiocre, avec des prix qui ne reflètent pas toujours la qualité. Savoir dans quelle catégorie on s'apprête à entrer avant de s'asseoir économise à la fois de l'argent et une mauvaise surprise.</p>

<h3>La Sultana Marrakech — $$$$</h3>
<p>La Sultana est un riad de luxe rue de la Kasbah, à quelques minutes du Palais Bahia en direction de la Mosquée de la Kasbah. Son restaurant est historiquement ouvert aux non-résidents et propose une cuisine marocaine formelle dans un cadre exceptionnel : stucs sculptés, fontaine de cour intérieure et service attentionné. Dîner à partir de 350 MAD par personne ; le déjeuner est plus accessible. Vérifiez l'ouverture et la politique envers les non-résidents sur Google Maps avant de planifier votre visite.</p>

<h3>Les Jardins de la Medina — $$$</h3>
<p>Un palais du XIXe siècle converti rue de la Bahia, répertorié dans les guides de voyage Michelin, avec un restaurant proposant à la carte et menus. Déjeuner en jardin disponible en saison. Fourchette : 180–300 MAD par personne pour un repas complet. Mieux adapté à un déjeuner tranquille qu'à une pause rapide entre deux sites. Vérifiez l'ouverture sur Google Maps.</p>

<h3>Marocain de quartier (tier local) — $$</h3>
<p>Plusieurs petits restaurants marocains dans les rues adjacentes à la rue Riad Zitoun el Jedid s'adressent à un mélange de travailleurs, résidents et voyageurs indépendants. Pas de décor élaboré, prix inférieurs, tajines servis dans les plats en terre cuite où ils ont cuit : 60–120 MAD par personne. La qualité varie davantage à ce niveau qu'aux restaurants de riads. Un indicateur simple : un restaurant à moitié plein avec un mélange de clients marocains et internationaux à 13h00 est bon signe. Une salle vide à l'heure du déjeuner est généralement vide pour une raison.</p>

<p>Note sur le calendrier : chaque restaurant marocain traditionnel non exclusivement touristique sert du couscous le vendredi, le repas rituel hebdomadaire. Si votre visite tombe un vendredi, c'est le plat à commander partout dans ce quartier.</p>

<h2>Petite faim et déjeuners rapides près du Palais Bahia</h2>

<p>Si vous enchaînez les <a href="/fr/blog/things-to-do-near-bahia-palace">monuments de la Kasbah</a> sans vouloir vous attabler, le marché du Mellah est la bonne option. Il jouxte le Palais Bahia, à 2–5 minutes à l'est, et affiche les prix alimentaires les plus honnêtes du quartier immédiat.</p>

<p>Ce que vous y trouverez : jus d'orange frais pressé (5–10 MAD), msemen chaud (pain marocain feuilleté, 3–5 MAD la pièce), olives et snacks variés au poids, sandwichs et kefta grillée à environ 20–40 MAD. La plupart des étals sont tenus par des vendeurs du quartier qui s'adressent à leur clientèle habituelle, pas aux touristes — les prix le reflètent. Prenez votre temps dans le marché couvert, c'est une des expériences alimentaires les plus authentiques à proximité immédiate du palais.</p>

<h2>Culture du café et du thé à la menthe</h2>

<p>Marrakech n'est pas une ville à dîner mais à grignoter tout au long de la journée. Intégrer quelques pauses cafés dans votre circuit de la Kasbah est à la fois naturel et économique. La Place des Ferblantiers (Place des Ferblantiers, 4 minutes du palais) a plusieurs cafés en terrasse où un verre de thé à la menthe coûte 10–20 MAD. C'est un bon endroit pour souffler entre le Palais Bahia et les Tombeaux Saadiens. Évitez les cafés avec des prix de boissons affichés en euros ou en dollars — le prix du thé exprimé en devises étrangères est un signal de tarification touristique.</p>

<figure style="margin:1.5rem 0;text-align:center;">
  <img src="/images/gallery/bahia-palace-arch-view-green-dome-fountain-palm.jpg" alt="Vue à travers une arche du Palais Bahia vers le dôme vert de la Mosquée de la Kasbah avec fontaine et palmier au premier plan, montrant le quartier où se trouvent les restaurants près du Palais Bahia Marrakech" width="1200" height="800" loading="lazy" style="width:100%;max-width:900px;height:auto;border-radius:0.75rem;display:block;margin:0 auto;" />
  <figcaption style="font-size:0.8rem;color:#5C3D20;margin-top:0.5rem;">Le dôme vert de la Mosquée de la Kasbah vu depuis l'intérieur du Palais Bahia : les restaurants du quartier de la Kasbah sont à moins de 10 minutes. Photo : Abdellah / visitbahiapalace.com</figcaption>
</figure>

<h2>Comment éviter les arnaques dans les restaurants près du Palais Bahia</h2>

<p>La règle de base est simple : plus un restaurant est visible depuis la rue principale et plus son personnel est actif pour vous attirer, moins il est susceptible d'offrir un bon rapport qualité-prix. Les meilleures tables de ce quartier n'ont pas besoin de rabatteurs. Quelques signaux d'alarme supplémentaires à surveiller :</p>
<ul>
  <li><strong>Menus en plastique dans six langues :</strong> signal de cuisine standardisée pour touristes.</li>
  <li><strong>Prix non affichés à l'entrée :</strong> particulièrement sur les rooftops.</li>
  <li><strong>« Première consommation offerte » :</strong> souvent récupérée sur le prix du plat suivant.</li>
  <li><strong>Pas de client marocain visible :</strong> les locaux connaissent les bonnes adresses.</li>
</ul>
<p>Pour aller plus loin : le <a href="/fr/blog/marrakech-safety-guide">guide complet des arnaques à Marrakech</a> couvre les restaurants, les faux guides et les taxis.</p>

<h2>Questions fréquentes</h2>

<h3>Y a-t-il des restaurants halal près du Palais Bahia ?</h3>
<p>Pratiquement tous les restaurants indépendants de la médina de Marrakech sont halal par défaut — la ville est à 99 % musulmane et l'alcool est absent de la quasi-totalité des établissements locaux. Les restaurants des hôtels de luxe peuvent servir de l'alcool.</p>

<h3>Peut-on manger végétarien près du Palais Bahia ?</h3>
<p>Oui. La cuisine marocaine offre naturellement des options végétariennes : harira (soupe aux légumes et légumineuses), couscous aux sept légumes, briouats aux légumes, salades marocaines et msemen. Les restaurants de riads accommodent généralement les demandes végétariennes sur réservation.</p>

<h3>À quelle distance le restaurant le plus proche du Palais Bahia est-il ?</h3>
<p>Il y a des cafés et des vendeurs de rue immédiatement à la sortie de la porte principale. Le premier marché du Mellah est à 2–3 minutes à pied à l'est. Les restaurants assis les plus proches sont sur la rue Riad Zitoun el Jedid, à 1–3 minutes.</p>

<div style="background:#F5EDE0;border:1px solid #D4A96A;border-radius:0.75rem;padding:1.5rem;margin:2.5rem 0;text-align:center;">
  <p style="font-weight:700;color:#3D1F00;margin:0 0 0.75rem;">Prêt à visiter le Palais Bahia ?</p>
  <p style="color:#5C3D20;font-size:0.95rem;margin:0 0 1rem;">Réservez votre billet coupe-file en ligne et passez directement — sans faire la queue à l'entrée.</p>
  <a href="/fr/tickets" style="display:inline-block;background:#C4452D;color:#fff;font-weight:700;padding:0.75rem 2rem;border-radius:0.5rem;text-decoration:none;">Voir les billets →</a>
</div>`;

// ---------------------------------------------------------------------------
// ITALIAN
// ---------------------------------------------------------------------------
const CONTENT_IT = `<p>Il quartiere intorno a Bahia Palace si trova all'incrocio di tre zone distinte di Marrakech: il Mellah (l'antico quartiere ebraico), la Kasbah e il corridoio di Rue Riad Zitoun el Jedid che collega la medina meridionale a Jemaa el-Fna. Nel 2024 il Marocco ha accolto 17,4 milioni di visitatori internazionali (<a href="https://www.visitmorocco.com" rel="noopener noreferrer" target="_blank">ONMT, Rapporto annuale del turismo marocchino 2024</a>), e una quota significativa mangia entro poche centinaia di metri dall'ingresso di Bahia Palace. Questa concentrazione genera una distorsione prevedibile: i ristoranti più visibili spesso offrono il valore più basso. Un po' di orientamento preliminare ripaga. Questa guida copre le opzioni più oneste per categoria — terrazze, cucina marocchina tradizionale, street food e caffè — con tempi di percorrenza, fasce di prezzo e cosa cercare prima di sedersi.</p>

<div style="background:#FDF9F3;border:1px solid #E8D5B7;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:2rem 0;">
<strong>Da tenere a mente</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.25rem;">
  <li>I ristoranti direttamente davanti all'ingresso di Bahia Palace sono i più cari del percorso. Camminate uno o due isolati verso il Mellah o verso Place des Ferblantiers e sia la qualità che il rapporto qualità-prezzo migliorano sensibilmente.</li>
  <li>Il mercato del Mellah, a 2–5 minuti a est del palazzo, ha i prezzi più bassi del quartiere: 15–50 MAD per snack, 40–80 MAD per un piatto completo, rivolto ai residenti locali più che ai turisti.</li>
  <li>Per un pasto seduto, la Kasbah offre ristoranti di riad ($$$), hotel di lusso ($$$$) e autentici locali popolari ($$) — tutti entro 12 minuti a piedi dall'ingresso.</li>
</ul>
</div>

<h2>Quali sono le migliori zone per mangiare vicino a Bahia Palace?</h2>

<p>I ristoranti direttamente davanti all'ingresso di Bahia Palace si rivolgono a un pubblico di visitatori appena arrivati e fissano i prezzi di conseguenza. I primi 100 metri fuori dal cancello sono il posto peggiore dove scegliere un ristorante in questo quartiere. Quattro zone migliori si trovano tutte entro 12 minuti a piedi, ciascuna con carattere e livello di prezzo diversi.</p>

<table>
  <thead>
    <tr><th>Zona</th><th>Minuti dal palazzo</th><th>Tipo di cucina</th><th>Fascia di prezzo</th></tr>
  </thead>
  <tbody>
    <tr><td>Mercato del Mellah</td><td>2–5 min</td><td>Street food, succhi, caffè locali</td><td>$</td></tr>
    <tr><td>Place des Ferblantiers</td><td>4 min</td><td>Terrazze caffè, tè alla menta, spuntini</td><td>$–$$</td></tr>
    <tr><td>Rue Riad Zitoun el Jedid</td><td>0–3 min</td><td>Ristoranti marocchini turistici, terrazze</td><td>$$–$$$</td></tr>
    <tr><td>Kasbah (a ovest del palazzo)</td><td>8–12 min</td><td>Ristoranti riad, hotel, caffè rooftop</td><td>$$–$$$$</td></tr>
  </tbody>
</table>
<p style="font-size:0.85rem;color:#5C3D20;margin-top:0.5rem;">Fasce di prezzo: $ = sotto 80 MAD / $$ = 80–180 MAD / $$$ = 180–350 MAD / $$$$ = 350 MAD+ a persona. Tariffe approssimative 2026 — verificare al momento della visita. I ristoranti della medina aprono e chiudono spesso: controllate su Google Maps prima di andare.</p>

<figure style="margin:1.5rem 0;text-align:center;">
  <img src="/images/gallery/bahia-palace-aerial-view-marrakech-medina-drone.jpg" alt="Vista aerea della medina meridionale di Marrakech con Bahia Palace al centro, il quartiere del Mellah a est e il quartiere della Kasbah a sud-ovest dove si trovano i migliori ristoranti vicino a Bahia Palace" width="1200" height="800" loading="lazy" style="width:100%;max-width:900px;height:auto;border-radius:0.75rem;display:block;margin:0 auto;" />
  <figcaption style="font-size:0.8rem;color:#5C3D20;margin-top:0.5rem;">La medina meridionale dall'alto: Bahia Palace (centro), il mercato del Mellah (est) e la Kasbah (sud-ovest). I migliori ristoranti si distribuiscono tra tutte e tre le zone. Foto: Abdellah / visitbahiapalace.com</figcaption>
</figure>

<h2>Ristoranti con terrazza e rooftop vicino a Bahia Palace</h2>

<p>La Kasbah ha diversi caffè rooftop e ristoranti con terrazza, e la vista — tetti della medina, minareto con tegole verdi della Moschea della Kasbah, e nelle giornate limpide una striscia dell'Atlante — vale davvero la camminata per trovare quello giusto. La categoria si divide nettamente: una parte serve cibo vero a prezzi onesti; l'altra fa pagare per la vista e vive del flusso di passanti.</p>

<h3>Café Clock (Kasbah) — $$</h3>
<p>Café Clock al 23 di Rue de la Kasbah (4,4 ★ su Google Maps) è un ristorante-centro culturale consolidato a 8–10 minuti a piedi da Bahia Palace. Ha una terrazza sul tetto e un menu che spazia dai classici marocchini (tagine, harira, msemen) a piatti internazionali più leggeri. Fascia di prezzo: 80–160 MAD a persona. È citato regolarmente nelle guide indipendenti su Marrakech come uno dei posti più affidabili in questa parte della medina. Serate di musica dal vivo e narrazione si tengono regolarmente durante la settimana. Verificate gli orari di apertura prima di andare.</p>

<h3>Rooftop Eclipse — $$</h3>
<p>Rooftop Eclipse appare su Google Maps nella zona della Kasbah vicino a Café Clock ed è un'altra opzione rooftop in questo quartiere. Verificate menu, orari e stato di apertura su Google Maps prima di visitare.</p>

<h3>Cosa evitare: il rooftop trappola per turisti</h3>
<p>Il "ristorante panoramico" pubblicizzato aggressivamente dalla strada esiste in abbondanza vicino a Bahia Palace. Questi stabilimenti facturano tipicamente 150–250 MAD a persona per cibo mediocre abbinato alla vista. I segnali: nessun cliente marocano visibile all'interno, nessun prezzo esposto all'ingresso, e un addetto che vi avvicina sul marciapiede invece di aspettare alla porta. La <a href="/it/blog/marrakech-safety-guide">guida alla sicurezza di Marrakech</a> tratta questo e altri schemi in dettaglio.</p>

<h2>Ristoranti marocchini tradizionali: tagine, couscous, pastilla</h2>

<p>I migliori ristoranti marocchini con servizio al tavolo nella Kasbah sono per lo più annessi a riad e boutique hotel che li aprono ai non ospiti per il pranzo e talvolta per la cena. I ristoranti indipendanti sul corridoio turistico principale (Rue Riad Zitoun el Jedid) variano dal genuinamente buono al mediocre, con prezzi che non sempre riflettono la qualità.</p>

<h3>La Sultana Marrakech — $$$$</h3>
<p>La Sultana è un riad di lusso in Rue de la Kasbah, a pochi minuti da Bahia Palace verso la Moschea della Kasbah. Il suo ristorante è storicamente aperto ai non ospiti e serve cucina marocchina formale in un ambiente eccezionale. Cena da 350 MAD+ a persona; il pranzo è più accessibile. Verificate l'apertura e la politica verso i non ospiti su Google Maps prima di pianificare.</p>

<h3>Les Jardins de la Medina — $$$</h3>
<p>Un palazzo del XIX secolo convertito in Rue de la Bahia, presente nelle guide di viaggio Michelin, con ristorante à la carte e menu fissi. Pranzo in giardino disponibile in stagione. Fascia di prezzo: 180–300 MAD a persona. Verificate l'apertura su Google Maps.</p>

<h3>Ristorante marocchino di quartiere — $$</h3>
<p>Diversi piccoli ristoranti marocchini nelle strade che si diramano da Rue Riad Zitoun el Jedid servono un mix di lavoratori, residenti e viaggiatori indipendenti. Nessun décor elaborato, prezzi più bassi, tagine serviti nei piatti in terracotta in cui sono stati cotti: 60–120 MAD a persona. Un ristorante mezzo pieno con un mix di clienti marocchini e internazionali alle 13:00 è un buon segnale.</p>

<p>Nota sul calendario: ogni ristorante marocchino tradizionale non esclusivamente turistico serve il couscous il venerdì. Se la vostra visita cade di venerdì, è il piatto da ordinare in qualsiasi posto in questo quartiere.</p>

<h2>Spuntini veloci e pranzi rapidi vicino a Bahia Palace</h2>

<p>Se vi state spostando tra i <a href="/it/blog/things-to-do-near-bahia-palace">monumenti della Kasbah</a> senza volervi sedere, il mercato del Mellah è la scelta giusta. È adiacente a Bahia Palace, a 2–5 minuti a est, e ha i prezzi alimentari più onesti del quartiere immediato.</p>

<p>Cosa trovate: succo d'arancia fresco (5–10 MAD), msemen caldo (3–5 MAD al pezzo), olive e snack vari al peso, panini e kefta alla griglia a circa 20–40 MAD. La maggior parte delle bancarelle è gestita da residenti del quartiere che servono la loro clientela abituale — i prezzi lo riflettono.</p>

<h2>Come evitare le trappole nei ristoranti vicino a Bahia Palace</h2>

<p>La regola di base è semplice: più un ristorante è visibile dalla strada principale e più il suo personale è attivo nel cercare di attrarvi, meno probabilmente offrirà un buon rapporto qualità-prezzo. Alcuni segnali d'allarme aggiuntivi:</p>
<ul>
  <li><strong>Menu plastificati in sei lingue:</strong> segnale di cucina standardizzata per turisti.</li>
  <li><strong>Prezzi non esposti all'ingresso:</strong> particolarmente sui rooftop.</li>
  <li><strong>Nessun cliente marocchino visibile:</strong> i locali conoscono i posti buoni.</li>
</ul>

<div style="background:#F5EDE0;border:1px solid #D4A96A;border-radius:0.75rem;padding:1.5rem;margin:2.5rem 0;text-align:center;">
  <p style="font-weight:700;color:#3D1F00;margin:0 0 0.75rem;">Pronto a visitare Bahia Palace?</p>
  <p style="color:#5C3D20;font-size:0.95rem;margin:0 0 1rem;">Prenota il tuo biglietto salta-fila online e accedi direttamente senza aspettare in coda.</p>
  <a href="/it/tickets" style="display:inline-block;background:#C4452D;color:#fff;font-weight:700;padding:0.75rem 2rem;border-radius:0.5rem;text-decoration:none;">Vedi i biglietti →</a>
</div>`;

// ---------------------------------------------------------------------------
// GERMAN
// ---------------------------------------------------------------------------
const CONTENT_DE = `<p>Das Viertel rund um den Bahia Palast liegt an der Schnittstelle dreier unterschiedlicher Marrakech-Viertel: dem Mellah (dem historischen jüdischen Viertel), der Kasbah und dem Korridor der Rue Riad Zitoun el Jedid, der die südliche Medina mit dem Jemaa el-Fna verbindet. Im Jahr 2024 empfing Marokko 17,4 Millionen internationale Besucher (<a href="https://www.visitmorocco.com" rel="noopener noreferrer" target="_blank">ONMT, Jahresbericht Marokko-Tourismus 2024</a>), und ein erheblicher Teil davon isst in der unmittelbaren Nähe des Bahia Palasts. Diese Konzentration führt zu einer vorhersehbaren Verzerrung: Die sichtbarsten Restaurants bieten oft den schlechtesten Gegenwert. Ein bisschen Orientierung vorab zahlt sich aus. Dieser Leitfaden zeigt die ehrlichsten Optionen nach Kategorie — Dachterrassen, traditionelle marokkanische Küche, Street Food und Cafés — mit Gehzeiten, Preisrahmen und worauf man achten sollte, bevor man Platz nimmt.</p>

<div style="background:#FDF9F3;border:1px solid #E8D5B7;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:2rem 0;">
<strong>Das Wichtigste in Kürze</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.25rem;">
  <li>Die Restaurants direkt vor dem Eingang des Bahia Palasts sind die teuersten auf der Route. Gehen Sie ein oder zwei Straßen weiter in Richtung Mellah oder Place des Ferblantiers — sowohl Qualität als auch Preis-Leistung verbessern sich deutlich.</li>
  <li>Der Mellah-Markt, 2–5 Minuten östlich des Palastes, hat die niedrigsten Preise im Viertel: 15–50 MAD für Snacks, 40–80 MAD für ein vollständiges Gericht — für Anwohner gedacht, nicht für Touristen.</li>
  <li>Für ein Sitzrestaurant bietet die Kasbah Riad-Restaurants ($$$), Hotelrestaurants ($$$$) und echte lokale Spots ($$) — alle innerhalb von 12 Gehminuten vom Eingang.</li>
</ul>
</div>

<h2>Welche Bereiche eignen sich am besten zum Essen in der Nähe des Bahia Palasts?</h2>

<p>Die Restaurants direkt vor dem Eingang des Bahia Palasts richten sich an frisch angekommene Besucher und kalkulieren entsprechend. Die ersten 100 Meter nach dem Ausgang sind der schlechteste Ort, um in diesem Viertel ein Restaurant zu wählen. Vier bessere Zonen liegen alle innerhalb von 12 Gehminuten, jede mit eigenem Charakter und Preisniveau.</p>

<table>
  <thead>
    <tr><th>Zone</th><th>Gehzeit vom Palast</th><th>Küche</th><th>Preiskategorie</th></tr>
  </thead>
  <tbody>
    <tr><td>Mellah-Markt</td><td>2–5 Min.</td><td>Street Food, Saftbars, lokale Cafés</td><td>$</td></tr>
    <tr><td>Place des Ferblantiers</td><td>4 Min.</td><td>Café-Terrassen, Minztee, einfache Snacks</td><td>$–$$</td></tr>
    <tr><td>Rue Riad Zitoun el Jedid</td><td>0–3 Min.</td><td>Touristisch-marokkanische Restaurants, Terrassen</td><td>$$–$$$</td></tr>
    <tr><td>Kasbah (westlich des Palastes)</td><td>8–12 Min.</td><td>Riad-Restaurants, Hotels, Rooftop-Cafés</td><td>$$–$$$$</td></tr>
  </tbody>
</table>
<p style="font-size:0.85rem;color:#5C3D20;margin-top:0.5rem;">Preiskategorien: $ = unter 80 MAD / $$ = 80–180 MAD / $$$ = 180–350 MAD / $$$$ = 350 MAD+ pro Person. Ungefähre Preise 2026 — bitte vor Ort prüfen. Restaurants in der Medina öffnen und schließen häufig: vor dem Besuch auf Google Maps prüfen.</p>

<figure style="margin:1.5rem 0;text-align:center;">
  <img src="/images/gallery/bahia-palace-aerial-view-marrakech-medina-drone.jpg" alt="Luftaufnahme der südlichen Medina von Marrakesch mit dem Bahia Palast im Zentrum, dem Mellah-Viertel im Osten und dem Kasbah-Viertel im Südwesten, wo die besten Restaurants nahe dem Bahia Palast zu finden sind" width="1200" height="800" loading="lazy" style="width:100%;max-width:900px;height:auto;border-radius:0.75rem;display:block;margin:0 auto;" />
  <figcaption style="font-size:0.8rem;color:#5C3D20;margin-top:0.5rem;">Die südliche Medina aus der Vogelperspektive: Bahia Palast (Mitte), Mellah-Markt (Osten) und Kasbah (Südwesten). Die besten Restaurants verteilen sich über alle drei Zonen. Foto: Abdellah / visitbahiapalace.com</figcaption>
</figure>

<h2>Rooftop- und Terrassenrestaurants in der Nähe des Bahia Palasts</h2>

<p>Die Kasbah hat mehrere Rooftop-Cafés und Terrassenrestaurants. Der Ausblick — Medina-Dächer, das grün gedeckte Minarett der Kasbah-Moschee und bei klarem Wetter ein Streifen des Atlasgebirges — ist den Weg wirklich wert, um das richtige zu finden. Die Kategorie teilt sich deutlich: Ein Teil serviert echtes Essen zu fairen Preisen; der andere berechnet für die Aussicht und lebt vom Passantenstrom.</p>

<h3>Café Clock (Kasbah) — $$</h3>
<p>Das Café Clock in der Rue de la Kasbah 23 (4,4 ★ auf Google Maps) ist ein etabliertes Restaurant und Kulturzentrum, etwa 8–10 Gehminuten vom Bahia Palast entfernt. Es verfügt über eine Dachterrasse und eine Speisekarte von marokkanischen Klassikern (Tajine, Harira, Msemen) bis zu leichteren internationalen Gerichten. Preisrahmen: 80–160 MAD pro Person. Es wird regelmäßig in unabhängigen Marrakech-Reiseführern als eine der verlässlichsten Adressen in diesem Teil der Medina erwähnt. Regelmäßige Livemusik- und Erzählabende finden im Laufe der Woche statt. Öffnungszeiten vor dem Besuch prüfen — diese können je nach Saison variieren.</p>

<h3>Rooftop Eclipse — $$</h3>
<p>Das Rooftop Eclipse erscheint auf Google Maps im Kasbah-Bereich nahe dem Café Clock und ist eine weitere Rooftop-Option in diesem Viertel. Aktuelles Menü, Öffnungszeiten und Status auf Google Maps prüfen, bevor Sie hinfahren.</p>

<h3>Was es zu vermeiden gilt: die Touristenfallen-Dachterrasse</h3>
<p>Das von der Straße aus aggressiv beworbene "Panoramadachterrassen-Restaurant" gibt es in der Nähe des Bahia Palasts in großer Zahl. Typischerweise verlangen diese 150–250 MAD pro Person für mittelmäßiges Essen plus Aussicht. Erkennungszeichen: Keine sichtbaren marokkanischen Kunden, keine ausgehängten Preise am Eingang, ein Werber auf dem Gehsteig statt wartend an der Tür. Der <a href="/de/blog/marrakech-safety-guide">Sicherheitsratgeber Marrakesch</a> behandelt dieses und andere Muster ausführlich.</p>

<h2>Traditionelle marokkanische Restaurants: Tajine, Couscous, Pastilla</h2>

<p>Die besten traditionellen Sitzrestaurants in der Kasbah sind meist an Riads und Boutiquehotels angeschlossen, die sie für Nicht-Hotelgäste zum Mittagessen und gelegentlich zum Abendessen öffnen. Die selbstständigen Restaurants auf dem touristischen Hauptkorridor (Rue Riad Zitoun el Jedid) reichen von genuinen bis zu enttäuschenden Erlebnissen, mit Preisen, die nicht immer die Qualität widerspiegeln.</p>

<h3>La Sultana Marrakech — $$$$</h3>
<p>La Sultana ist ein Luxusriad in der Rue de la Kasbah, wenige Minuten vom Bahia Palast in Richtung Kasbah-Moschee. Sein Restaurant ist historisch auch für Nicht-Hotelgäste geöffnet und serviert formelle marokkanische Küche in außergewöhnlichem Ambiente. Abendessen ab 350 MAD pro Person; Mittagessen ist zugänglicher. Öffnungszeiten und Gastpolitik vor Ihrem Besuch auf Google Maps prüfen.</p>

<h3>Les Jardins de la Medina — $$$</h3>
<p>Ein umgebauter Palast aus dem 19. Jahrhundert in der Rue de la Bahia, in Michelin-Reiseführern erwähnt, mit à-la-carte- und Menürestaurant. Gartenterrasse in der Saison verfügbar. Preisrahmen: 180–300 MAD pro Person für ein vollständiges Mahl. Öffnungszeiten auf Google Maps prüfen.</p>

<h3>Lokales marokkanisches Restaurant — $$</h3>
<p>Mehrere kleinere marokkanische Restaurants in den Seitenstraßen der Rue Riad Zitoun el Jedid versorgen eine Mischung aus lokalen Arbeitern, Anwohnern und unabhängigen Reisenden. Keine aufwendige Einrichtung, niedrigere Preise, Tajines in den Tontöpfen serviert, in denen sie gegart wurden: 60–120 MAD pro Person. Ein halb gefülltes Restaurant mit einem Mix aus marokkanischen und internationalen Kunden um 13:00 Uhr ist ein gutes Zeichen.</p>

<p>Hinweis zum Kalender: Jedes traditionelle marokkanische Restaurant, das nicht ausschließlich touristisch ausgerichtet ist, serviert freitags Couscous — das wöchentliche Ritualgericht. Wenn Ihr Besuch auf einen Freitag fällt, ist das in diesem Viertel das Gericht, das Sie bestellen sollten.</p>

<h2>Schnelle Snacks und Mittagessen in der Nähe des Bahia Palasts</h2>

<p>Wenn Sie zwischen den <a href="/de/blog/things-to-do-near-bahia-palace">Sehenswürdigkeiten der Kasbah</a> wechseln und kein vollständiges Sitzrestaurant möchten, ist der Mellah-Markt die richtige Wahl. Er grenzt direkt an den Bahia Palast, 2–5 Minuten östlich, und hat die ehrlichsten Lebensmittelpreise im unmittelbaren Viertel.</p>

<p>Was Sie finden: frisch gepressten Orangensaft (5–10 MAD), warmes Msemen (3–5 MAD pro Stück), Oliven und verschiedene Snacks nach Gewicht, Sandwiches und gegrillte Kefta für ca. 20–40 MAD. Die meisten Stände werden von Anwohnern betrieben, die ihre Stammkunden bedienen — die Preise spiegeln das wider.</p>

<h2>Touristenfallen in Restaurants nahe dem Bahia Palast vermeiden</h2>

<p>Die Grundregel ist einfach: Je sichtbarer ein Restaurant von der Hauptstraße aus ist und je aktiver das Personal darauf aus ist, Sie anzulocken, desto unwahrscheinlicher ist ein gutes Preis-Leistungs-Verhältnis. Weitere Warnsignale:</p>
<ul>
  <li><strong>Laminierte Speisekarten in sechs Sprachen:</strong> Signal für standardisierte Touristenküche.</li>
  <li><strong>Keine Preisliste am Eingang:</strong> besonders auf Rooftops.</li>
  <li><strong>Keine sichtbaren marokkanischen Kunden:</strong> Einheimische kennen die guten Orte.</li>
</ul>

<div style="background:#F5EDE0;border:1px solid #D4A96A;border-radius:0.75rem;padding:1.5rem;margin:2.5rem 0;text-align:center;">
  <p style="font-weight:700;color:#3D1F00;margin:0 0 0.75rem;">Bereit, den Bahia Palast zu besuchen?</p>
  <p style="color:#5C3D20;font-size:0.95rem;margin:0 0 1rem;">Buchen Sie Ihr Skip-the-Line-Ticket online und gehen Sie direkt hinein — ohne Anstehen am Eingang.</p>
  <a href="/de/tickets" style="display:inline-block;background:#C4452D;color:#fff;font-weight:700;padding:0.75rem 2rem;border-radius:0.5rem;text-decoration:none;">Tickets ansehen →</a>
</div>`;

// ---------------------------------------------------------------------------
// SPANISH
// ---------------------------------------------------------------------------
const CONTENT_ES = `<p>El barrio alrededor del Palacio Bahia se encuentra en la confluencia de tres zonas distintas de Marrakech: el Mellah (el antiguo barrio judío), la Kasbah y el corredor de la calle Riad Zitoun el Jedid que une la medina sur con la Jemaa el-Fna. En 2024, Marruecos recibió 17,4 millones de visitantes internacionales (<a href="https://www.visitmorocco.com" rel="noopener noreferrer" target="_blank">ONMT, Informe anual del turismo de Marruecos 2024</a>), y una parte significativa come a pocos cientos de metros de la entrada del Palacio Bahia. Esta concentración genera una distorsión predecible: los restaurantes más visibles suelen ofrecer el menor valor. Un poco de orientación previa vale la pena. Esta guía cubre las opciones más honestas por categoría — terrazas, cocina marroquí tradicional, street food y cafés — con tiempos a pie, rangos de precios y qué buscar antes de sentarse.</p>

<div style="background:#FDF9F3;border:1px solid #E8D5B7;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:2rem 0;">
<strong>Lo más importante</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.25rem;">
  <li>Los restaurantes justo enfrente de la entrada del Palacio Bahia son los más caros del recorrido. Camina uno o dos bloques hacia el Mellah o la Place des Ferblantiers y tanto la calidad como la relación calidad-precio mejoran considerablemente.</li>
  <li>El mercado del Mellah, a 2–5 minutos al este del palacio, tiene los precios más bajos del vecindario: 15–50 MAD para picoteo, 40–80 MAD para un plato completo, dirigido a residentes locales más que a turistas.</li>
  <li>Para una comida sentada, la Kasbah ofrece restaurantes de riad ($$$), restaurantes de hotel ($$$$) y auténticos locales populares ($$) — todos a menos de 12 minutos a pie de la entrada.</li>
</ul>
</div>

<h2>¿Cuáles son las mejores zonas para comer cerca del Palacio Bahia?</h2>

<p>Los restaurantes justo frente a la entrada del Palacio Bahia apuntan a visitantes recién llegados y fijan precios en consecuencia. Los primeros 100 metros fuera de la puerta son el peor lugar para elegir un restaurante en este barrio. Cuatro zonas mejores están todas a menos de 12 minutos a pie, cada una con su propio carácter y nivel de precios.</p>

<table>
  <thead>
    <tr><th>Zona</th><th>Tiempo desde el palacio</th><th>Tipo de cocina</th><th>Rango de precios</th></tr>
  </thead>
  <tbody>
    <tr><td>Mercado del Mellah</td><td>2–5 min</td><td>Street food, zumos, cafés locales</td><td>$</td></tr>
    <tr><td>Place des Ferblantiers</td><td>4 min</td><td>Terrazas de café, té de menta, snacks sencillos</td><td>$–$$</td></tr>
    <tr><td>Calle Riad Zitoun el Jedid</td><td>0–3 min</td><td>Restaurantes marroquíes turísticos, terrazas</td><td>$$–$$$</td></tr>
    <tr><td>Kasbah (al oeste del palacio)</td><td>8–12 min</td><td>Restaurantes de riad, hoteles, cafés rooftop</td><td>$$–$$$$</td></tr>
  </tbody>
</table>
<p style="font-size:0.85rem;color:#5C3D20;margin-top:0.5rem;">Rangos de precios: $ = menos de 80 MAD / $$ = 80–180 MAD / $$$ = 180–350 MAD / $$$$ = 350 MAD+ por persona. Precios aproximados 2026 — verificar en el momento. Los restaurantes de la medina abren y cierran con frecuencia: consulta Google Maps antes de ir.</p>

<figure style="margin:1.5rem 0;text-align:center;">
  <img src="/images/gallery/bahia-palace-aerial-view-marrakech-medina-drone.jpg" alt="Vista aérea de la medina sur de Marrakech con el Palacio Bahia en el centro, el barrio del Mellah al este y la Kasbah al suroeste donde están los mejores restaurantes cerca del Palacio Bahia" width="1200" height="800" loading="lazy" style="width:100%;max-width:900px;height:auto;border-radius:0.75rem;display:block;margin:0 auto;" />
  <figcaption style="font-size:0.8rem;color:#5C3D20;margin-top:0.5rem;">La medina sur desde el aire: el Palacio Bahia (centro), el mercado del Mellah (este) y la Kasbah (suroeste). Los mejores restaurantes se reparten entre las tres zonas. Foto: Abdellah / visitbahiapalace.com</figcaption>
</figure>

<h2>Restaurantes con terraza y rooftop cerca del Palacio Bahia</h2>

<p>La Kasbah tiene varios cafés rooftop y restaurantes con terraza, y la vista — tejados de la medina, el minarete con azulejos verdes de la Mezquita de la Kasbah, y en días despejados una franja del Atlas — merece genuinamente el paseo para encontrar el bueno. La categoría se divide claramente: un subconjunto sirve comida real a precios honestos; el otro cobra por la vista y vive del flujo de turistas.</p>

<h3>Café Clock (Kasbah) — $$</h3>
<p>El Café Clock en el 23 de la Rue de la Kasbah (4,4 ★ en Google Maps) es un restaurante y espacio cultural bien establecido a 8–10 minutos a pie del Palacio Bahia. Tiene una terraza en la azotea y una carta que va desde los clásicos marroquíes (tajine, harira, msemen) hasta platos internacionales más ligeros. Rango de precios: 80–160 MAD por persona. Es citado regularmente en guías independientes de Marrakech como uno de los lugares más fiables en esta parte de la medina. Hay veladas regulares de música en vivo y cuentacuentos durante la semana. Verifica el horario antes de ir.</p>

<h3>Rooftop Eclipse — $$</h3>
<p>El Rooftop Eclipse aparece en Google Maps en la zona de la Kasbah cerca del Café Clock y es otra opción de azotea en este barrio. Verifica el menú actual, los horarios y si está abierto en Google Maps antes de visitarlo.</p>

<h3>Qué evitar: el rooftop trampa para turistas</h3>
<p>El "restaurante panorámico" publicitado agresivamente desde la calle existe en abundancia cerca del Palacio Bahia. Suelen cobrar 150–250 MAD por persona por comida mediocre junto a la vista. Las señales: ningún cliente marroquí visible dentro, precios no expuestos en la entrada, y un captador que se acerca en la acera en lugar de esperar en la puerta. La <a href="/es/blog/marrakech-safety-guide">guía de seguridad de Marrakech</a> cubre este patrón y otros en detalle.</p>

<h2>Restaurantes marroquíes tradicionales: tajine, cuscús, pastilla</h2>

<p>Los mejores restaurantes marroquíes con servicio en mesa en la Kasbah son en su mayoría parte de riads y hoteles boutique que los abren a los no huéspedes para el almuerzo y a veces para la cena. Los restaurantes independientes en el corredor turístico principal (calle Riad Zitoun el Jedid) van desde genuinamente buenos hasta mediocres, con precios que no siempre reflejan la calidad.</p>

<h3>La Sultana Marrakech — $$$$</h3>
<p>La Sultana es un riad de lujo en la Rue de la Kasbah, a pocos minutos del Palacio Bahia hacia la Mezquita de la Kasbah. Su restaurante ha estado históricamente abierto a no huéspedes y sirve cocina marroquí formal en un entorno excepcional. Cena desde 350 MAD por persona; el almuerzo es más accesible. Verifica el horario actual y la política con no huéspedes en Google Maps antes de planificar.</p>

<h3>Les Jardins de la Medina — $$$</h3>
<p>Un palacio del siglo XIX reconvertido en la Rue de la Bahia, mencionado en las guías de viaje Michelin, con restaurante à la carte y menús. Almuerzo en el jardín disponible en temporada. Rango de precios: 180–300 MAD por persona para una comida completa. Verifica el horario en Google Maps.</p>

<h3>Restaurante marroquí de barrio — $$</h3>
<p>Varios restaurantes marroquíes más pequeños en las calles que salen de la calle Riad Zitoun el Jedid atienden a una mezcla de trabajadores locales, residentes y viajeros independientes. Sin decoración elaborada, precios más bajos, tajines servidos en las ollas de barro en que se cocinaron: 60–120 MAD por persona. Un restaurante a mitad de capacidad con una mezcla de clientes marroquíes e internacionales a las 13:00 h es una buena señal.</p>

<p>Nota sobre el calendario: todo restaurante marroquí tradicional no exclusivamente turístico sirve cuscús los viernes. Si tu visita cae en viernes, es el plato que hay que pedir en cualquier lugar de este barrio.</p>

<h2>Comida rápida y almuerzos ligeros cerca del Palacio Bahia</h2>

<p>Si vas saltando entre los <a href="/es/blog/things-to-do-near-bahia-palace">monumentos de la Kasbah</a> sin querer sentarte en un restaurante, el mercado del Mellah es la opción correcta. Está adyacente al Palacio Bahia, a 2–5 minutos al este, y tiene los precios de comida más honestos del barrio inmediato.</p>

<p>Lo que encontrarás: zumo de naranja recién exprimido (5–10 MAD), msemen caliente (3–5 MAD la pieza), aceitunas y snacks variados a granel, bocadillos y kefta a la plancha por unos 20–40 MAD. La mayoría de los puestos los llevan residentes del barrio que atienden a su clientela habitual — los precios lo reflejan.</p>

<h2>Cómo evitar las trampas en los restaurantes cerca del Palacio Bahia</h2>

<p>La regla básica es sencilla: cuanto más visible sea un restaurante desde la calle principal y más activo sea su personal para atraerte, menos probable es que ofrezca buena relación calidad-precio. Más señales de alerta:</p>
<ul>
  <li><strong>Menús plastificados en seis idiomas:</strong> señal de cocina estandarizada para turistas.</li>
  <li><strong>Precios no expuestos en la entrada:</strong> especialmente en los rooftops.</li>
  <li><strong>Ningún cliente marroquí visible:</strong> los locales conocen los buenos sitios.</li>
</ul>

<div style="background:#F5EDE0;border:1px solid #D4A96A;border-radius:0.75rem;padding:1.5rem;margin:2.5rem 0;text-align:center;">
  <p style="font-weight:700;color:#3D1F00;margin:0 0 0.75rem;">¿Listo para visitar el Palacio Bahia?</p>
  <p style="color:#5C3D20;font-size:0.95rem;margin:0 0 1rem;">Reserva tu entrada sin colas online y entra directamente sin esperar en la puerta.</p>
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
    title: 'Où manger près du Palais Bahia : les meilleures adresses du Kasbah (2026)',
    category: 'guides',
    excerpt: "Où manger près du Palais Bahia en 2026 : les meilleures zones par type de cuisine, temps de marche depuis l'entrée, fourchettes de prix et comment repérer les pièges avant de vous asseoir.",
    seoTitle: 'Meilleures tables près du Palais Bahia Marrakech (Guide 2026)',
    seoDesc: "Où manger près du Palais Bahia à Marrakech en 2026 : terrasses du Kasbah, tagines marocains, street food du Mellah, prix honnêtes et pièges à éviter.",
    coverImage: COVER,
    ogImage: COVER,
    author: 'Abdellah',
    published: true,
    publishedAt: DATE,
    content: CONTENT_FR,
  });

  await upsert(SLUG, 'it', {
    title: 'Dove mangiare vicino a Bahia Palace: i migliori ristoranti della Kasbah (2026)',
    category: 'guides',
    excerpt: "Dove mangiare vicino a Bahia Palace nel 2026: le zone migliori per tipo di cucina, tempi di percorrenza dall'ingresso, fasce di prezzo e come riconoscere le trappole turistiche prima di sedersi.",
    seoTitle: 'Dove mangiare vicino a Bahia Palace Marrakech (Guida 2026)',
    seoDesc: 'Dove mangiare vicino a Bahia Palace nel 2026: terrazze del Kasbah, tagine marocchine, street food del Mellah. Guida con prezzi e trappole da evitare.',
    coverImage: COVER,
    ogImage: COVER,
    author: 'Abdellah',
    published: true,
    publishedAt: DATE,
    content: CONTENT_IT,
  });

  await upsert(SLUG, 'de', {
    title: 'Wo essen nahe dem Bahia Palast: beste Restaurants in der Kasbah Marrakesch (2026)',
    category: 'guides',
    excerpt: 'Wo essen nahe dem Bahia Palast Marrakesch 2026: die besten Zonen nach Küche, Laufzeiten vom Eingang, Preiskategorien und wie man Touristenfallen erkennt, bevor man sich setzt.',
    seoTitle: 'Restaurants am Bahia Palast Marrakesch (Reiseführer 2026)',
    seoDesc: 'Wo essen nahe dem Bahia Palast in Marrakesch 2026: Kasbah-Terrassen, marokkanische Tagines, Mellah-Straßenküche und ehrliche Warnungen vor Touristenfallen.',
    coverImage: COVER,
    ogImage: COVER,
    author: 'Abdellah',
    published: true,
    publishedAt: DATE,
    content: CONTENT_DE,
  });

  await upsert(SLUG, 'es', {
    title: 'Dónde comer cerca del Palacio Bahia: los mejores restaurantes del Kasbah (2026)',
    category: 'guides',
    excerpt: 'Dónde comer cerca del Palacio Bahia en Marrakech 2026: las mejores zonas por tipo de comida, tiempos a pie desde la entrada, rangos de precios y cómo detectar las trampas turísticas antes de sentarse.',
    seoTitle: 'Mejores restaurantes cerca del Palacio Bahia Marrakech (Guía 2026)',
    seoDesc: 'Dónde comer cerca del Palacio Bahia en Marrakech 2026: terrazas del Kasbah, tagines marroquíes, street food del Mellah y trampas turísticas que evitar.',
    coverImage: COVER,
    ogImage: COVER,
    author: 'Abdellah',
    published: true,
    publishedAt: DATE,
    content: CONTENT_ES,
  });

  console.log('All restaurants translations inserted.');
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });

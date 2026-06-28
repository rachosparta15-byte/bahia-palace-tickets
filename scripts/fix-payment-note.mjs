import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dir, '..', 'messages');

const replacements = {
  'en.json': {
    old: 'Official ticketing via the Ministry of Culture portal',
    nw:  'Secure skip-the-line tickets — instant confirmation',
  },
  'fr.json': {
    old: 'Billetterie officielle via le portail du Ministère de la Culture',
    nw:  'Billets coupe-file sécurisés — confirmation instantanée',
  },
  'de.json': {
    old: 'Offizielle Tickets über das Kulturministerium-Portal',
    nw:  'Sichere Skip-the-Line-Tickets — sofortige Bestätigung',
  },
  'it.json': {
    old: 'Biglietteria ufficiale tramite il portale del Ministero della Cultura',
    nw:  'Biglietti salta-fila sicuri — conferma immediata',
  },
  'es.json': {
    old: 'Venta oficial de entradas vía el portal del Ministerio de Cultura',
    nw:  'Entradas seguras sin colas — confirmación instantánea',
  },
};

for (const [file, { old: o, nw }] of Object.entries(replacements)) {
  const path = join(messagesDir, file);
  const original = readFileSync(path, 'utf8');
  if (!original.includes(o)) {
    console.warn(`⚠️  "${o}" not found in ${file}`);
    continue;
  }
  const updated = original.replace(o, nw);
  writeFileSync(path, updated, 'utf8');
  console.log(`✅  ${file} updated`);
}

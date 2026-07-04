import { readFileSync, writeFileSync } from 'fs';

const notes = {
  en: 'Free to use — official tickets only',
  fr: 'Gratuit — billets officiels uniquement',
  de: 'Kostenlos — nur offizielle Tickets',
  es: 'Gratis — solo entradas oficiales',
  it: 'Gratis — solo biglietti ufficiali',
};

for (const locale of Object.keys(notes)) {
  const path = `messages/${locale}.json`;
  const m = JSON.parse(readFileSync(path, 'utf8'));
  m.footer.paymentNote = notes[locale];
  writeFileSync(path, JSON.stringify(m, null, 2) + '\n', 'utf8');
  console.log(`${locale}: OK`);
}

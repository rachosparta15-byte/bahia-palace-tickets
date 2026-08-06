"""
12.90 → 13.99 across the site.

Replaces only the digits. Locales disagree about the decimal separator and
about which side the euro sign goes — `12,90 €` in French, `€12.90` in English —
and every one of those spellings is already correct for its language. Touching
anything but the number would silently reformat currency for seven locales.

Counts are asserted per file: this is money, and a partial pass would leave two
different prices on the same site with nothing to flag it.
"""
import io
import os
import sys

EXPECTED = {
    'messages/ar.json': 5, 'messages/de.json': 6, 'messages/en.json': 6,
    'messages/es.json': 6, 'messages/fr.json': 6, 'messages/it.json': 6,
    'messages/pt.json': 5,
    'messages/paid/ar.json': 1, 'messages/paid/de.json': 1, 'messages/paid/en.json': 1,
    'messages/paid/es.json': 1, 'messages/paid/fr.json': 1, 'messages/paid/it.json': 1,
    'messages/paid/pt.json': 1,
    'src/app/style-guide/page.tsx': 1,
    'src/app/[locale]/visitor-pack/page.tsx': 1,
    'src/content/legal/ar.json': 1, 'src/content/legal/de.json': 1,
    'src/content/legal/en.json': 1, 'src/content/legal/es.json': 1,
    'src/content/legal/fr.json': 1, 'src/content/legal/it.json': 1,
    'src/content/legal/pt.json': 1,
}

PAIRS = [('12.90', '13.99'), ('12,90', '13,99')]


def main():
    planned = {}
    for path, expected in EXPECTED.items():
        if not os.path.exists(path):
            print(f'  ABORT missing {path}')
            return 1
        text = io.open(path, encoding='utf-8').read()
        found = sum(text.count(old) for old, _ in PAIRS)
        if found != expected:
            print(f'  ABORT {path}: found {found} price(s), expected {expected}')
            return 1
        for old, new in PAIRS:
            text = text.replace(old, new)
        planned[path] = text

    # The one number that decides what a card is actually charged.
    pricing = 'src/config/pricing.ts'
    text = io.open(pricing, encoding='utf-8').read()
    if text.count('ENTRY_PRICE_EUR_CENTS = 1290') != 1:
        print('  ABORT: ENTRY_PRICE_EUR_CENTS = 1290 not found exactly once')
        return 1
    planned[pricing] = text.replace('ENTRY_PRICE_EUR_CENTS = 1290',
                                    'ENTRY_PRICE_EUR_CENTS = 1399')

    for path, text in planned.items():
        io.open(path, 'w', encoding='utf-8', newline='\n').write(text)

    print(f'  rewrote {sum(EXPECTED.values())} price strings across {len(EXPECTED)} files')
    print('  ENTRY_PRICE_EUR_CENTS 1290 → 1399')
    return 0


if __name__ == '__main__':
    sys.exit(main())

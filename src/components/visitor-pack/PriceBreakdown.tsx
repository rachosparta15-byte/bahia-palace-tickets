'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

/**
 * Compact price note shown under the pack price and at checkout.
 *
 * DESIGN INTENT: deliberately minimal, matching how OTAs (GetYourGuide etc.)
 * present a bundled ticket — one total, one "what's included" line, one fees
 * note. An itemised cost table was tried and rejected as too cluttered for a
 * consumer checkout.
 *
 * WHAT MUST NOT BE REMOVED, and why:
 *   1. The "includes official entry ticket" line. Without it the price reads
 *      as though $14 were the official door price, which it is not — the
 *      official ticket is 100 MAD (~$10), set by the Ministry of Culture.
 *   2. The link to /tickets. Visitors must always be one click from finding
 *      out they can buy the official ticket themselves for 100 MAD.
 *
 * The full cost split lives in the FAQ ("Is this the official Bahia Palace
 * ticket?" and "Can I get in cheaper?") — that is where the detailed
 * disclosure now lives, so keep those answers accurate.
 */
export function PriceBreakdown({ className }: { className?: string }) {
  const t = useTranslations('visitorPack.price');

  return (
    <div className={cn('', className)}>
      <p className="text-sm text-[#F5E8CC] leading-relaxed">{t('includes')}</p>
      <p className="mt-1 text-xs text-[#C4A882]">{t('taxesIncluded')}</p>

      <Link
        href="/tickets"
        className="mt-3 inline-block text-xs text-[#C4A882] underline underline-offset-4 transition-colors hover:text-[#E8A33D]"
      >
        {t('freeAlternative')}
      </Link>
    </div>
  );
}

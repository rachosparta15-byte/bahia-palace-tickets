import { getTranslations } from 'next-intl/server';

import {
  MAD_TO_EUR_RATE_CHECKED_ON,
  OFFICIAL_DOOR_PRICE_MAD,
  VISITOR_PACK_BREAKDOWN_EUR_CENTS,
  formatEUR,
} from '@/config/pricing';

/**
 * What the €12.99 is made of, under the €12.99.
 *
 * Restored 2026-08-22, having been removed on 22/07/2026. It is the same two
 * lines as before and the same numbers — nothing here is new, it had simply
 * stopped being displayed.
 *
 * WHY IT IS BACK. Competitors itemise: Headout shows ticket, booking fee and
 * discount before the total; Cityzore shows adult, child and what you save.
 * Beside a bare "€12.99" those read as the more transparent offer, and the
 * first small number a visitor sees is theirs. Ours is €9.36, and it is the
 * strongest thing on the page: it says what the ministry charges and what we
 * add, in two lines, and it is true.
 *
 * WHY NOT A BOOKING FEE, which is what Headout's third line is. This site
 * promises "No Booking Fees" in its trust badges and in whyUs across en, fr,
 * de and pt. Splitting €1 out of a total that does not change and calling it a
 * booking fee would contradict a promise made four times on the same site, to
 * win a line of layout. The promise is worth more: it is the one thing Headout
 * cannot say back.
 *
 * WHY NO STRUCK-THROUGH "WAS" PRICE either. The pack was €11.99 until
 * 2026-08-19 and is €12.99 now — the price went up. Under the Omnibus
 * Directive a reference price must be the lowest applied in the previous
 * thirty days, which is €11.99, below what we charge today. There is no
 * honest higher figure to strike through, so there is none here.
 *
 * The sum is exact by construction: `service` is the residual after the
 * official ticket, and visitorPackBreakdownIsValid() refuses to sell if the
 * two ever stop adding up to the total.
 */
export async function PriceBreakdown({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'visitorPack.price' });
  const { officialTicket, service } = VISITOR_PACK_BREAKDOWN_EUR_CENTS;

  return (
    <div className="mt-4 border-t border-[rgba(232,163,61,0.15)] pt-4">
      <dl className="space-y-1.5 text-[13px]">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[#C4A882]">
            {t('officialLine', { mad: `${OFFICIAL_DOOR_PRICE_MAD} MAD` })}
          </dt>
          <dd className="tabular-nums text-[#C4A882]">{formatEUR(officialTicket)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[#C4A882]">{t('serviceLine')}</dt>
          <dd className="tabular-nums text-[#C4A882]">{formatEUR(service)}</dd>
        </div>
      </dl>

      {/* The rate is pinned and dated, and saying so is the point: the euro
          figure above is a conversion of a price fixed in dirhams, and a
          visitor who checks it a month from now should find the date it was
          taken rather than a number that has quietly moved. */}
      <p className="mt-3 text-[11px] leading-relaxed text-[#C4A882]/60">
        {t('convertedNote', { date: MAD_TO_EUR_RATE_CHECKED_ON })}
      </p>
    </div>
  );
}

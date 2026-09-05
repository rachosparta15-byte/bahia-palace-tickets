import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

/**
 * The case for booking before you arrive, placed directly under TicketOptions
 * because that is where the visitor is deciding and nowhere else on the page
 * is.
 *
 * Every claim here is one we can stand behind. The queue at the single ticket
 * window is the figure our own entrance-fee article uses; card payment, the
 * 24-hour cancellation window and reviews tied to completed bookings are how
 * the platform actually works. Nothing invents a danger to sell against, and
 * the closing line concedes that walking up to the gate works — because a page
 * that pretends otherwise is not believable, and the visitor can see the gate
 * for themselves.
 *
 * The full scam guide lives at /safety. This block makes the short case and
 * sends anyone who wants the detail there rather than repeating it.
 */
export function WhyBookAhead() {
  const t = useTranslations('whyBook');

  const gate  = [t('gate1'), t('gate2'), t('gate3')];
  const ahead = [t('ahead1'), t('ahead2'), t('ahead3')];

  return (
    <section id="why-book-ahead" className="scroll-mt-24 bg-[#251A0F]">
      <div className="grid gap-0 md:grid-cols-[minmax(0,38%)_minmax(0,62%)]">
        {/* The door you would actually queue at — the sign in the photograph
            reads ENTRÉE PRINCIPALE, which is the whole argument in one image. */}
        <div className="relative min-h-[260px] md:min-h-[520px]">
          <Image
            src="/images/bahia-palace-main-gate-panel.webp"
            alt={t('imageAlt')}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[#251A0F] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#251A0F] rtl:md:bg-gradient-to-l"
          />
        </div>

        <div className="px-6 py-12 sm:px-10 md:py-16 md:ps-12 lg:ps-16">
          <div className="max-w-[46rem]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#E8A33D]">
            {t('badge')}
          </p>

          <h2
            className="mt-3 text-[#FAF3E7]"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)', lineHeight: 1.15 }}
          >
            {t('title')}
          </h2>

          <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-[rgba(250,243,231,0.72)]">
            {t('lead')}
          </p>

          <div className="mt-8 space-y-7">
            {/* Two states of the same decision, told as columns of text rather
                than as two cards: cards would make them look equivalent, and
                the point is that they are not. */}
            <div className="border-s border-[rgba(250,243,231,0.22)] ps-5">
              <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[rgba(250,243,231,0.6)]">
                {t('gateTitle')}
              </h3>
              <ul className="mt-2.5 space-y-1.5">
                {gate.map((line) => (
                  <li key={line} className="text-sm leading-relaxed text-[rgba(250,243,231,0.66)]">
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-s-2 border-[#E8A33D] ps-5">
              <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#E8A33D]">
                {t('aheadTitle')}
              </h3>
              <ul className="mt-2.5 space-y-1.5">
                {ahead.map((line) => (
                  <li key={line} className="text-sm leading-relaxed text-[#FAF3E7]">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 max-w-[52ch] text-xs leading-relaxed text-[rgba(250,243,231,0.5)]">
            {t('closing')}
          </p>

          <Link
            href="/safety"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#E8A33D] underline-offset-4 hover:underline"
          >
            {t('safetyLink')}
            <ArrowRight size={13} className="shrink-0" />
          </Link>

          <div className="mt-7">
            <a
              href="#ticket-options"
              className="inline-flex items-center gap-2 rounded-full bg-[#E8A33D] px-6 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#251A0F] transition-colors hover:bg-[#F0B84E]"
            >
              {t('cta')}
              <ArrowRight size={15} className="shrink-0" />
            </a>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

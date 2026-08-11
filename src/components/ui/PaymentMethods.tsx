import { Lock } from 'lucide-react';

/**
 * Which payment methods this site accepts.
 *
 * WHAT THIS SAYS, AND WHAT IT MUST NOT: "We accept PayPal" is a fact about our
 * checkout. "Supported by PayPal", "PayPal partner", or a badge implying they
 * vouch for us would claim an endorsement that does not exist — the same line
 * this site already holds against implying the Ministry of Culture endorses it.
 * Accepting a company's payments is not being backed by them, and a visitor who
 * later discovers the difference has been misled by us, not by PayPal.
 *
 * The marks are PayPal's own artwork, served from our origin rather than
 * hotlinked: an image that disappears when they reorganise a CDN path is a
 * broken trust badge, which is worse than none.
 *
 * There is no SEO value here and none is claimed — Google does not rank a page
 * higher for showing card logos. Its job is to answer "can I pay with my card?"
 * before the visitor has to click to find out.
 */
export function PaymentMethods({
  className = '',
  label,
}: {
  className?: string;
  /** Short line above the marks. Omit for a bare row. */
  label?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <p className="mb-2 flex items-center justify-center gap-1.5 text-xs text-[#C4A882]">
          <Lock size={11} className="shrink-0 text-[#8FA63C]" aria-hidden="true" />
          {label}
        </p>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element -- a static SVG
          served from /public; next/image would add a loader round-trip for an
          image that is already 13 KB and never resized. */}
      <img
        src="/payment-methods.svg"
        alt="We accept PayPal, Visa, Mastercard and American Express"
        width={140}
        height={20}
        loading="lazy"
        decoding="async"
        className="mx-auto h-5 w-auto"
      />
    </div>
  );
}

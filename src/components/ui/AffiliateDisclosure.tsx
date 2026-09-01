import { useTranslations } from 'next-intl';

/**
 * "Some links here are affiliate links" — said next to the links, not only in
 * /legal/affiliate-disclosure.
 *
 * WHY IT IS ITS OWN COMPONENT. The disclosure has to appear wherever a
 * commission-earning link appears, and that is currently the homepage ticket
 * grid, /tickets and any blog post that links a partner. One component means
 * the wording cannot drift between those places and say something weaker on
 * the page a reviewer happens to open.
 *
 * WHY IT IS VISIBLE RATHER THAN FOOTNOTED. AdSense refused this site under
 * the Misrepresentation policy: the homepage claimed "no resellers, no
 * markups" and "free to use" while charging above the official gate price and
 * earning Viator commission. A disclosure a visitor has to go looking for does
 * not answer that; one sitting under the prices does.
 *
 * `useTranslations` (not `getTranslations`) so this renders in both the client
 * component that holds the ticket grid and the server components that render
 * /tickets and the blog.
 */
export function AffiliateDisclosure({ className = '' }: { className?: string }) {
  const t = useTranslations('affiliate');

  return (
    <p className={`text-[11px] leading-relaxed text-brown-mid/80 ${className}`}>
      {t('disclosure')}
    </p>
  );
}

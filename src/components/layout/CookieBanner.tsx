'use client';

import { useState, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const STORAGE_KEY = 'cookie_consent';

/*
 * Whether the visitor has already answered.
 *
 * This was a useEffect that called setVisible(true) on mount, which is a
 * cascading render and which React's own lint rule rejects — it was the one
 * error in this file before any of the translation work. The question is not
 * really React state: it is "what does storage say", asked once the browser
 * exists. useSyncExternalStore is the shape for that, and its server snapshot
 * of false means the banner is absent from the HTML rather than rendered and
 * then hidden.
 */
const subscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

function alreadyAnswered(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    // Storage blocked: showing the banner is the safer half of the mistake,
    // since the alternative is assuming consent nobody gave.
    return false;
  }
}

function remember(answer: 'accepted' | 'declined'): void {
  try {
    localStorage.setItem(STORAGE_KEY, answer);
  } catch {
    /* nothing can be stored, so the banner returns next time */
  }
}

/*
 * The five strings here were English literals in the markup, shown on all
 * seven locales — including Arabic, right to left, with an English sentence
 * sitting in it. The same fault the hero had.
 *
 * It matters more here than copy usually does. This is the notice that asks
 * permission to run analytics, and a notice the reader cannot read is not
 * consent. A German or Arabic visitor was being asked to agree to something
 * in a language the rest of the page had already accepted they do not read.
 */
export function CookieBanner() {
  const t = useTranslations('cookieBanner');
  const isClient = useIsClient();
  // Only ever set by the two buttons, so this is genuine React state.
  const [answered, setAnswered] = useState(false);

  const accept = () => {
    remember('accepted');
    setAnswered(true);
  };

  const decline = () => {
    remember('declined');
    setAnswered(true);
  };

  if (!isClient || answered || alreadyAnswered()) return null;

  return (
    <div
      role="dialog"
      aria-label={t('label')}
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#2A1B0E] text-white px-4 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.3)]"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/*
          * The link sits inside the sentence rather than after it, because
          * where it belongs is not the same in every language: German and
          * Italian put it at the end, French in the middle. A hard-coded
          * "See our X for details" can only be one of those.
          */}
        <p className="text-sm text-white/85 leading-relaxed flex-1">
          {t.rich('text', {
            link: (chunks) => (
              <Link
                href="/cookies"
                className="underline text-[#E8A33D] hover:text-white transition-colors"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-sm text-white/60 hover:text-white transition-colors px-3 py-2"
          >
            {t('decline')}
          </button>
          <button
            onClick={accept}
            className="text-sm bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * The scam list, as an accordion.
 *
 * WHY NOT ui/Accordion: that one takes a question and a plain string answer,
 * which is the whole shape of an FAQ. A scam has an icon, two labelled halves
 * that must stay visually distinct, and sometimes a call to action underneath.
 * Widening the shared component to carry all of that would push safety-page
 * concerns into the visitor-pack FAQ, so this borrows its interaction and its
 * styling instead — same chevron, same motion timing, same colours — and keeps
 * its own body.
 *
 * ACCESSIBILITY: the header is a real <button>, so Enter, Space and Tab work
 * without any key handling of ours. aria-expanded tracks state, aria-controls
 * points at the panel, and the panel is labelled by its header. The chevron is
 * decorative and hidden from screen readers, which read the state instead.
 *
 * Only one panel is open at a time. Twelve scams is a long page, and letting
 * every one stand open puts the reader back where they started — scrolling a
 * wall of text to find the one that is happening to them.
 */

export interface ScamItem {
  id: string;
  title: string;
  /** What happens. */
  scam: string;
  /** What to do about it. */
  fix: string;
  icon: ReactNode;
  /** Optional CTA, rendered under the fix. Server-rendered and passed in. */
  cta?: ReactNode;
}

interface Props {
  items: ScamItem[];
  labels: { theScam: string; whatToDo: string };
  /** Which item starts open. -1 for none. */
  defaultOpen?: number;
}

export function ScamAccordion({ items, labels, defaultOpen = 0 }: Props) {
  const [open, setOpen] = useState<number>(defaultOpen);

  return (
    <div className="divide-y divide-[rgba(232,163,61,0.15)] rounded-2xl border border-[rgba(232,163,61,0.15)] bg-[#251A0F]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={`scam-h-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`scam-p-${item.id}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="group flex w-full items-center gap-3 px-5 py-4 text-start sm:px-6"
              >
                <span
                  className={cn(
                    'shrink-0 transition-colors',
                    isOpen ? 'text-[#E8A33D]' : 'text-[#C4452D] group-hover:text-[#E8A33D]',
                  )}
                >
                  {item.icon}
                </span>
                <span
                  className="flex-1 font-bold leading-snug text-[#F5E8CC] transition-colors group-hover:text-[#E8A33D]"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}
                >
                  {item.title}
                </span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className={cn(
                    'shrink-0 text-[#E8A33D] transition-transform duration-300 motion-reduce:transition-none',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div
                    id={`scam-p-${item.id}`}
                    role="region"
                    aria-labelledby={`scam-h-${item.id}`}
                    className="space-y-4 px-5 pb-5 sm:px-6 sm:pb-6"
                  >
                    {/* The two halves are separated by a coloured rule and a
                        coloured label, never by colour alone on the body text:
                        the sentences themselves stay at the page's normal
                        reading contrast so neither half is the hard one. */}
                    <div className="border-s-2 border-[#C4452D]/50 ps-3.5">
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#E58A76]">
                        {labels.theScam}
                      </p>
                      <p className="text-sm leading-relaxed text-[#C4A882]">{item.scam}</p>
                    </div>

                    <div className="border-s-2 border-[#8FA63C]/60 ps-3.5">
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#A8BF52]">
                        {labels.whatToDo}
                      </p>
                      <p className="text-sm leading-relaxed text-[#F5E8CC]">{item.fix}</p>
                      {item.cta}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

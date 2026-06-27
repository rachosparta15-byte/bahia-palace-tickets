'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={cn('divide-y divide-[rgba(232,163,61,0.15)]', className)}>
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 py-5 text-left group"
            aria-expanded={openIndex === i}
          >
            <span className="font-semibold text-[#F5E8CC] text-base leading-snug group-hover:text-[#E8A33D] transition-colors">
              {item.question}
            </span>
            <ChevronDown
              size={20}
              className={cn(
                'shrink-0 text-[#E8A33D] transition-transform duration-300',
                openIndex === i && 'rotate-180'
              )}
            />
          </button>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <p className="text-[#C4A882] leading-relaxed pb-5 pr-4 sm:pr-8 border-l-2 border-[#E8A33D]/30 pl-4 ml-1">{item.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

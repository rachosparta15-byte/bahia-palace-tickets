import { cn } from '@/lib/utils';

type Variant = 'default' | 'saffron' | 'majorelle' | 'olive' | 'sand';

interface BadgeProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

const variants: Record<Variant, string> = {
  default:   'bg-[#C4452D]/10 text-[#C4452D]',
  saffron:   'bg-[#E8A33D]/15 text-[#C8882A]',
  majorelle: 'bg-[#2E4A7B]/10 text-[#2E4A7B]',
  olive:     'bg-[#6B7B3A]/10 text-[#4A5A1E]',
  sand:      'bg-[#E8D5B7] text-[#5C3D20]',
};

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  asChild?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[#C4452D] text-white hover:bg-[#A33824] shadow-[0_4px_20px_rgba(196,69,45,0.35)] hover:shadow-[0_6px_28px_rgba(196,69,45,0.45)] hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-transparent text-[#C4452D] border-2 border-[#C4452D] hover:bg-[rgba(196,69,45,0.08)]',
  ghost:
    'bg-transparent text-[#C4A882] hover:text-[#F5E8CC] hover:bg-white/05',
  outline:
    'bg-transparent text-[#F5E8CC] border border-[rgba(232,163,61,0.25)] hover:border-[#C4452D] hover:text-[#C4452D]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-4 py-2.5 gap-1.5 min-h-[44px]',
  md: 'text-base px-6 py-3.5 gap-2 min-h-[44px]',
  lg: 'text-base px-8 py-4 gap-2 min-h-[48px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-lg cursor-pointer transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" size={16} />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

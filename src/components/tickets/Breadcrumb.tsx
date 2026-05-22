import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant?: 'light' | 'dark';
}

export function Breadcrumb({ items, variant = 'dark' }: BreadcrumbProps) {
  const textCls = variant === 'light' ? 'text-white/75' : 'text-[#5C3D20]';
  const linkCls = variant === 'light' ? 'hover:text-white' : 'hover:text-[#C4452D]';
  const curCls  = variant === 'light' ? 'text-white font-medium' : 'text-[#3D2817] font-medium';

  const shadow = variant === 'light' ? { textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.6)' } : {};

  return (
    <nav aria-label="Breadcrumb" style={shadow}>
      <ol className={`flex items-center flex-wrap gap-0.5 text-sm ${textCls}`}>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-0.5">
            {i > 0 && <ChevronRight size={13} className="opacity-50 mx-0.5 shrink-0" />}
            {item.href ? (
              <Link href={item.href as any} className={`transition-colors ${linkCls}`}>
                {item.label}
              </Link>
            ) : (
              <span className={curCls}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

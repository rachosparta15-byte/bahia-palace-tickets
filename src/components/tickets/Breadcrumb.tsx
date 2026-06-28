import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { BASE } from '@/lib/seo';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant?: 'light' | 'dark';
}

export async function Breadcrumb({ items, variant = 'dark' }: BreadcrumbProps) {
  const locale = await getLocale();

  const textCls = variant === 'light' ? 'text-white/75' : 'text-[#C4A882]';
  const linkCls = variant === 'light' ? 'hover:text-white' : 'hover:text-[#E8A33D]';
  const curCls  = variant === 'light' ? 'text-white font-medium' : 'text-[#F5E8CC] font-medium';
  const shadow  = variant === 'light' ? { textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.6)' } : {};

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${BASE}/${locale}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026') }}
      />
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
    </>
  );
}

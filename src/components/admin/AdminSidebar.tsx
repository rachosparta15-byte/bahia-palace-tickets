'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Ticket, FileText, ShieldAlert,
  LogOut, Settings, Star, BookOpen, Images, Mail, BarChart2,
} from 'lucide-react';
import { LogoMark } from '@/components/ui/LogoMark';

const NAV_GROUPS = [
  {
    label: 'Content',
    items: [
      { href: '/admin',         label: 'Dashboard',    icon: LayoutDashboard, style: 'normal'  },
      { href: '/admin/tickets', label: 'Tickets',      icon: Ticket,          style: 'normal'  },
      { href: '/admin/blog',    label: 'Blog',         icon: FileText,        style: 'normal'  },
      { href: '/admin/safety',  label: 'Safety Tips',  icon: ShieldAlert,     style: 'warning' },
      { href: '/admin/reviews', label: 'Reviews',      icon: Star,            style: 'normal'  },
      { href: '/admin/gallery', label: 'Gallery',      icon: Images,          style: 'normal'  },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/admin/bookings',   label: 'Bookings',  icon: BookOpen,  style: 'normal' },
      { href: '/admin/leads',     label: 'Leads',     icon: Mail,      style: 'normal' },
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart2, style: 'normal' },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { href: '/admin/settings', label: 'Settings', icon: Settings, style: 'normal' },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <aside className="w-56 shrink-0 bg-[#3D2817] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
        <LogoMark className="w-9 h-9 shrink-0" />
        <div className="leading-none">
          <div className="text-white font-bold text-base leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Bahia Palace
          </div>
          <div className="text-white/40 text-[10px] mt-0.5 tracking-widest uppercase">Admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-3 mb-1.5">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon, style }) => {
                const active  = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                const warning = style === 'warning';
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? warning ? 'bg-amber-500/20 text-amber-300' : 'bg-white/15 text-white'
                        : warning ? 'text-amber-400/80 hover:bg-amber-500/10 hover:text-amber-300' : 'text-white/60 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

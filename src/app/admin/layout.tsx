import { headers } from 'next/headers';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Playfair_Display, Lato, Merriweather, Poppins, Raleway, Lora } from 'next/font/google';

const playfair    = Playfair_Display({ subsets: ['latin'], weight: ['400','600','700'], variable: '--font-playfair',    display: 'swap' });
const lato        = Lato({            subsets: ['latin'], weight: ['400','700'],        variable: '--font-lato',        display: 'swap' });
const merriweather= Merriweather({    subsets: ['latin'], weight: ['400','700'],        variable: '--font-merriweather',display: 'swap' });
const poppins     = Poppins({         subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-poppins', display: 'swap' });
const raleway     = Raleway({         subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-raleway', display: 'swap' });
const lora        = Lora({            subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-lora',    display: 'swap' });

export const metadata = {
  title: 'Admin — Bahia Palace Tickets',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const pathname = h.get('x-pathname') ?? '';

  // Login page: render without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const fontVars = [playfair.variable, lato.variable, merriweather.variable, poppins.variable, raleway.variable, lora.variable].join(' ');

  return (
    <div className={`flex min-h-screen bg-[#FAF3E7] ${fontVars}`}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

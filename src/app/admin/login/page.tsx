import { LoginForm } from '@/components/admin/LoginForm';

export const metadata = { title: 'Admin Login — Bahia Palace Tickets' };

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF3E7] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="text-[#C4452D] font-bold mb-1"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem' }}
          >
            Bahia Palace
          </div>
          <p className="text-sm text-[#5C3D20]">Admin Dashboard</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8D5B7] shadow-[0_4px_24px_rgba(61,40,23,0.1)] p-8">
          <h1 className="text-xl font-bold text-[#3D2817] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Sign in
          </h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

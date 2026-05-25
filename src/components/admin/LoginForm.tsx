'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export function LoginForm() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        window.location.href = '/admin';
      } else {
        const { error: msg } = await res.json() as { error: string };
        setError(msg ?? 'Invalid credentials');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full border border-[#D4BC96] rounded-lg px-4 py-2.5 text-sm text-[#3D2817] focus:outline-none focus:ring-2 focus:ring-[#C4452D]/30 focus:border-[#C4452D] transition-colors bg-white';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-[#3D2817] mb-1.5">Email</label>
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          autoComplete="email" placeholder="admin@bahia-tickets.com"
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#3D2817] mb-1.5">Password</label>
        <input
          type="password" required value={password} onChange={e => setPassword(e.target.value)}
          autoComplete="current-password" placeholder="••••••••"
          className={inputCls}
        />
      </div>
      {error && (
        <div className="flex items-center gap-2 text-sm text-[#C4452D] bg-[#C4452D]/5 border border-[#C4452D]/20 rounded-lg px-4 py-3">
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </div>
      )}
      <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
        Sign in
      </Button>
    </form>
  );
}

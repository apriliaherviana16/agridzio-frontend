"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess('تم تسجيل الدخول بنجاح');
      // إعادة التوجيه بعد لحظة قصيرة لإتاحة عرض الرسالة
      setTimeout(() => router.push('/'), 500);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white border border-neutral-dark rounded-2xl p-8 shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h2>
      {error && <p className="text-red-600 mb-3 text-center">{error}</p>}
      {success && <p className="text-green-600 mb-3 text-center">{success}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border border-neutral-dark px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full border border-neutral-dark px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-primary-dark py-2 rounded-md font-semibold hover:bg-accent-dark transition-colors"
        >
          دخول
        </button>
      </form>
      <p className="text-center mt-4">
        ليس لديك حساب؟{' '}
        <Link href="/register" className="text-accent hover:underline">إنشاء حساب</Link>
      </p>
    </div>
  );
}
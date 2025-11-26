"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    // signUp with email and password, also set metadata for name
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (signUpError) {
      // توفير رسالة أوضح في حال كان البريد الإلكتروني مستخدماً بالفعل أو أي خطأ آخر
      if (
        signUpError.message.toLowerCase().includes('duplicate') ||
        signUpError.message.toLowerCase().includes('exist')
      ) {
        setError('هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد آخر.');
      } else {
        setError(signUpError.message);
      }
      return;
    }
    // إدراج السجل في جدول المستخدمين. إذا كان السجل موجوداً مسبقاً نتجاهل الخطأ
    try {
      await supabase.from('users').insert({ id: data.user?.id, name, email });
    } catch (err) {
      // تجاهل خطأ التكرار لأن حساب المستخدم ربما تم إنشاؤه مسبقاً
      console.warn('Insert user record failed:', err);
    }
    setSuccess('تم إنشاء الحساب بنجاح');
    // إعادة التوجيه بعد لحظة قصيرة لإتاحة عرض الرسالة
    setTimeout(() => router.push('/'), 1000);
  }

  return (
    <div className="max-w-md mx-auto bg-white border border-neutral-dark rounded-2xl p-8 shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">إنشاء حساب</h2>
      {error && <p className="text-red-600 mb-3 text-center">{error}</p>}
      {success && <p className="text-green-600 mb-3 text-center">{success}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">الاسم الكامل</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full border border-neutral-dark px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
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
          إنشاء
        </button>
      </form>
      <p className="text-center mt-4">
        لديك حساب؟{' '}
        <Link href="/login" className="text-accent hover:underline">تسجيل الدخول</Link>
      </p>
    </div>
  );
}
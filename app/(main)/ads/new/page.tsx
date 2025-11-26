"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CSRF_TOKEN } from '@/lib/csrf';

export default function NewAdPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      // تحقق من صحة البيانات قبل الإرسال
      const priceNumber = parseFloat(price);
      if (!title.trim() || title.trim().length < 3) {
        throw new Error('يجب أن يكون عنوان الإعلان على الأقل 3 أحرف');
      }
      if (!description.trim() || description.trim().length < 10) {
        throw new Error('يجب أن يكون الوصف على الأقل 10 أحرف');
      }
      if (isNaN(priceNumber) || priceNumber <= 0) {
        throw new Error('يرجى إدخال سعر صالح أكبر من صفر');
      }
      if (!location.trim()) {
        throw new Error('المنطقة مطلوبة');
      }
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': CSRF_TOKEN
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          price: priceNumber,
          location: location.trim(),
          category: category?.trim() || null
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'حدث خطأ أثناء إضافة الإعلان');
      }
      // عرض رسالة نجاح و إعادة ضبط النموذج
      setSuccess('تم نشر الإعلان بنجاح');
      setTitle('');
      setDescription('');
      setPrice('');
      setLocation('');
      setCategory('');
      // يمكن إعادة التوجيه عند الحاجة
      // router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white border border-neutral-dark rounded-2xl p-8 shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">إضافة إعلان جديد</h2>
      {error && <p className="text-red-600 mb-3 text-center">{error}</p>}
      {success && <p className="text-green-600 mb-3 text-center">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">عنوان الإعلان</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full border border-neutral-dark px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">الوصف</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="w-full border border-neutral-dark px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            rows={5}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">السعر (دج)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            className="w-full border border-neutral-dark px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">المنطقة / الولاية</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
            className="w-full border border-neutral-dark px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">الفئة (اختياري)</label>
          <input
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full border border-neutral-dark px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-primary-dark py-2 rounded-md font-semibold hover:bg-accent-dark transition-colors"
          disabled={loading}
        >
          {loading ? 'جاري النشر...' : 'نشر'}
        </button>
      </form>
    </div>
  );
}
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CSRF_TOKEN } from '@/lib/csrf';

interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string | null;
}

export default function EditAdPage({ params }: { params: { id: string } }) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadAd() {
      try {
        const res = await fetch(`/api/ads/${params.id}`);
        if (!res.ok) {
          throw new Error('لم يتم العثور على الإعلان');
        }
        const json = await res.json();
        setAd(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAd();
  }, [params.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!ad) return;
    setError(null);
    setSaving(true);
    try {
      if (!ad.title.trim() || ad.title.trim().length < 3) {
        throw new Error('يجب أن يكون عنوان الإعلان على الأقل 3 أحرف');
      }
      if (!ad.description.trim() || ad.description.trim().length < 10) {
        throw new Error('يجب أن يكون الوصف على الأقل 10 أحرف');
      }
      if (isNaN(ad.price) || ad.price <= 0) {
        throw new Error('يرجى إدخال سعر صالح أكبر من صفر');
      }
      if (!ad.location.trim()) {
        throw new Error('المنطقة مطلوبة');
      }
      const res = await fetch(`/api/ads/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': CSRF_TOKEN
        },
        body: JSON.stringify({
          title: ad.title.trim(),
          description: ad.description.trim(),
          price: ad.price,
          location: ad.location.trim(),
          category: ad.category?.trim() || null
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'تعذر تحديث الإعلان');
      }
      router.push(`/ads/${params.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex justify-center py-8">
      <Spinner className="w-8 h-8 text-primary" />
    </div>
  );
  if (error) return <p className="text-red-600">{error}</p>;
  if (!ad) return null;
  return (
    <div className="max-w-2xl mx-auto bg-white border border-neutral-dark rounded-2xl p-8 shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">تعديل الإعلان</h2>
      {error && <p className="text-red-600 mb-3 text-center">{error}</p>}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">عنوان الإعلان</label>
          <input
            type="text"
            value={ad.title}
            onChange={e => setAd({ ...ad!, title: e.target.value })}
            required
            className="w-full border border-neutral-dark px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">الوصف</label>
          <textarea
            value={ad.description}
            onChange={e => setAd({ ...ad!, description: e.target.value })}
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
            value={ad.price}
            onChange={e => setAd({ ...ad!, price: parseFloat(e.target.value) })}
            required
            className="w-full border border-neutral-dark px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">المنطقة / الولاية</label>
          <input
            type="text"
            value={ad.location}
            onChange={e => setAd({ ...ad!, location: e.target.value })}
            required
            className="w-full border border-neutral-dark px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">الفئة (اختياري)</label>
          <input
            type="text"
            value={ad.category || ''}
            onChange={e => setAd({ ...ad!, category: e.target.value })}
            className="w-full border border-neutral-dark px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-primary-dark py-2 rounded-md font-semibold hover:bg-accent-dark transition-colors"
          disabled={saving}
        >
          {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
        </button>
      </form>
    </div>
  );
}
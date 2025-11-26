"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CSRF_TOKEN } from '@/lib/csrf';
import { MapPin, DollarSign, Tag } from 'lucide-react';
import Spinner from '@/components/Spinner';

interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string | null;
  user_id?: string;
}

export default function AdDetails({ params }: { params: { id: string } }) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function loadAd() {
      try {
        const res = await fetch(`/api/ads/${params.id}`);
        if (!res.ok) {
          throw new Error('Not Found');
        }
        const json = await res.json();
        setAd(json);
      } catch (err) {
        router.push('/');
      } finally {
        setLoading(false);
      }
    }
    loadAd();
    // احصل على جلسة المستخدم الحالية لتحديد مالك الإعلان
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      setCurrentUserId(data.session?.user?.id || null);
    }
    loadSession();
  }, [params.id, router]);

  async function handleDelete() {
    if (!ad) return;
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/ads/${ad.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': CSRF_TOKEN
        },
        body: JSON.stringify({})
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'تعذر حذف الإعلان');
      }
      router.push('/');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  if (loading) return (
    <div className="flex justify-center py-8">
      <Spinner className="w-8 h-8 text-primary" />
    </div>
  );
  if (!ad) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white border border-neutral-dark rounded-2xl p-6 shadow-md">
      <h1 className="text-3xl font-bold mb-4">{ad.title}</h1>
      <div className="flex items-center gap-4 mb-4 flex-wrap text-sm">
        <span className="flex items-center gap-1 rtl:flex-row-reverse text-primary font-medium">
          <DollarSign className="w-5 h-5 stroke-2" />
          دج {Number(ad.price).toLocaleString()}
        </span>
        <span className="flex items-center gap-1 rtl:flex-row-reverse text-gray-600">
          <MapPin className="w-5 h-5" />
          {ad.location}
        </span>
        {ad.category && (
          <span className="flex items-center gap-1 rtl:flex-row-reverse text-secondary">
            <Tag className="w-5 h-5" />
            {ad.category}
          </span>
        )}
      </div>
      <p className="whitespace-pre-wrap leading-relaxed text-gray-800 mb-6">{ad.description}</p>
      {/* إذا كان المستخدم هو صاحب الإعلان، عرض روابط التحرير والحذف */}
      {currentUserId && ad.user_id === currentUserId && (
        <div className="mt-4 flex gap-4 rtl:flex-row-reverse">
          <button
            onClick={() => router.push(`/ads/${ad.id}/edit`)}
            className="bg-accent text-primary-dark px-4 py-2 rounded-full font-semibold hover:bg-accent-dark transition-colors"
          >
            تعديل
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {deleteLoading ? 'جاري الحذف...' : 'حذف'}
          </button>
        </div>
      )}
    </div>
  );
}
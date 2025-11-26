"use client";
import { useEffect, useState } from 'react';
import { CSRF_TOKEN } from '@/lib/csrf';
import AdCard from '@/components/AdCard';
import Spinner from '@/components/Spinner';

interface Favorite {
  ad_id: number;
  ads: {
    id: number;
    title: string;
    price: number;
    location: string;
  };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchFavorites() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/favorites');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'حدث خطأ أثناء جلب المفضلة');
      }
      const json = await res.json();
      setFavorites(json || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function removeFavorite(adId: number) {
    try {
      const res = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': CSRF_TOKEN
        },
        body: JSON.stringify({ adId })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'تعذر إزالة الإعلان من المفضلة');
      }
      // تحديث القائمة بعد الحذف
      setFavorites(favs => favs.filter(fav => fav.ad_id !== adId));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }
  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">المفضلة</h2>
      {favorites.length === 0 ? (
        <p>لا توجد إعلانات مفضلة حتى الآن.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(({ ad_id, ads }) => (
            <div key={ad_id} className="relative">
              <AdCard
                ad={{
                  id: ads.id,
                  title: ads.title,
                  description: '',
                  price: ads.price,
                  location: ads.location,
                  category: null
                }}
              />
              <button
                onClick={() => removeFavorite(ad_id)}
                className="absolute top-2 left-2 md:top-3 md:left-3 bg-white text-red-600 rounded-full p-1 shadow hover:bg-red-50"
              >
                إزالة
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
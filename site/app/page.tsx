"use client";
import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import AdCard, { Ad } from '@/components/AdCard';
import Spinner from '@/components/Spinner';

export default function Home() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function loadAds() {
      setLoading(true);
      try {
        const res = await fetch(`/api/ads?page=${page}&limit=9`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'تعذر جلب الإعلانات');
        }
        const { data } = await res.json();
        if (page === 1) {
          setAds(data || []);
        } else {
          setAds(prev => [...prev, ...(data || [])]);
        }
        // إذا كان عدد النتائج أقل من الحد نعتبر أنه لا توجد صفحات إضافية
        if (!data || data.length < 9) {
          setHasMore(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAds();
  }, [page]);

  function loadMore() {
    setPage(p => p + 1);
  }

  return (
    <div>
      {/* Hero section */}
      <Hero />
      {/* Latest ads */}
      <section>
        <h2 className="text-2xl font-bold mb-6">أحدث الإعلانات</h2>
        {loading && page === 1 ? (
          <div className="flex justify-center py-8">
            <Spinner className="w-8 h-8 text-primary" />
          </div>
        ) : ads.length === 0 ? (
          <p>لا توجد إعلانات بعد.</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map(ad => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMore}
                  className="bg-accent text-primary-dark px-6 py-3 rounded-full font-semibold hover:bg-accent-dark disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'جاري التحميل...' : 'عرض المزيد'}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
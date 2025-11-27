"use client";

import Image from 'next/image';
import Link from 'next/link';

/**
 * Hero component
 *
 * This section introduces the AGRIDZIO platform with a high–resolution
 * photograph of rural farmland overlaid with a subtle dark gradient. It
 * presents a headline, a short description and two call‑to‑action buttons.
 *
 * The layout adapts to different screen sizes, stacking the buttons on
 * smaller screens and aligning them horizontally on larger displays. The
 * colours derive from the theme defined in `tailwind.config.js`.
 */
export default function Hero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] rounded-2xl overflow-hidden mb-8 shadow">
      {/* Background image fills the entire section. */}
      <Image
        src="/images/hero.png"
        alt="منظر طبيعي زراعي مع حقول خضراء وجبال في الأفق"
        fill
        priority
        className="object-cover"
      />
      {/* Overlay with content */}
      <div className="absolute inset-0 bg-black/50 backdrop-brightness-75 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          مرحباً بك في منصة <span className="text-accent">AGRIDZIO</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-6 max-w-2xl leading-relaxed">
          اكتشف وسوّق منتجاتك الزراعية بسهولة وابدأ في نشر إعلاناتك في دقائق.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          <Link
            href="/ads/new"
            className="bg-accent text-primary-dark font-semibold py-3 px-6 rounded-full shadow hover:shadow-lg hover:bg-accent-dark transition-colors"
          >
            أنشئ إعلانك الآن
          </Link>
          <Link
            href="/"
            className="bg-white/80 text-primary font-semibold py-3 px-6 rounded-full shadow hover:bg-white transition-colors"
          >
            تصفح الإعلانات
          </Link>
        </div>
      </div>
    </section>
  );
}
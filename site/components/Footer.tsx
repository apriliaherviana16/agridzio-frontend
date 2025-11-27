"use client";

/**
 * Site footer
 *
 * A simple responsive footer that anchors the page with a copyright notice and
 * a small tagline. It uses the dark variant of the primary colour for the
 * background and a slightly lighter neutral tone for contrast. On small
 * screens the elements stack vertically; on larger screens they sit on a
 * single row.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary-dark text-white py-6 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm space-y-2 md:space-y-0">
        <span>&copy; {year} AGRIDZIO. جميع الحقوق محفوظة.</span>
        <span>صُنعت بحُب للزراعة الجزائرية</span>
      </div>
    </footer>
  );
}
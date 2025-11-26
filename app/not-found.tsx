export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-dark px-4">
      <h1 className="text-4xl font-bold mb-4 text-primary">الصفحة غير موجودة</h1>
      <p className="text-gray-700 mb-6 text-center max-w-md">
        عذراً، الصفحة التي تحاول الوصول إليها غير متوفرة أو تم نقلها. تأكد من صحة الرابط أو عد إلى
        الصفحة الرئيسية لاستكشاف المزيد.
      </p>
      <a
        href="/"
        className="bg-accent text-primary-dark px-6 py-3 rounded-full font-semibold hover:bg-accent-dark transition-colors shadow"
      >
        العودة إلى الصفحة الرئيسية
      </a>
    </div>
  );
}
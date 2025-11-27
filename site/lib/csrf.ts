/**
 * مولد رمز CSRF ديناميكي. إذا وُجد متغير NEXT_PUBLIC_CSRF_TOKEN في البيئة
 * فسيستخدمه، وإلا فسيُولد رمزاً عشوائياً في أول تحميل ويخزن في متغير
 * عالمي. هذا يضمن عدم تسريب الرمز عبر الشيفرة المصدرية ويسمح بتغييره
 * عند إعادة تشغيل الخادم. لا تزال هذه الآلية بسيطة وينبغي اعتماد حلول
 * أكثر تعقيداً مثل تخزين الرمز في ملف تعريف ارتباط آمن عند تطوير التطبيق.
 */
const globalAny = globalThis as any;
if (!globalAny.__CSRF_TOKEN) {
  const envToken = process.env.NEXT_PUBLIC_CSRF_TOKEN;
  if (envToken && envToken.length > 0) {
    globalAny.__CSRF_TOKEN = envToken;
  } else {
    // استخدم سلسلة عشوائية من 16 خانة بناءً على Math.random
    globalAny.__CSRF_TOKEN = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  }
}
export const CSRF_TOKEN: string = globalAny.__CSRF_TOKEN;

/**
 * دالة لمقارنة رمز CSRF القادم من الطلب مع الرمز المتوقع.
 * إذا كان الرأس غير موجود أو لا يطابق الرمز المخزن عالمياً، فسيُرفض الطلب.
 */
export function verifyCsrfToken(headerToken: string | null | undefined): boolean {
  if (!headerToken) return false;
  return headerToken === globalAny.__CSRF_TOKEN;
}
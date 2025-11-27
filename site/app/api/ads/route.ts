import { NextResponse } from 'next/server';
import { verifyCsrfToken } from '@/lib/csrf';
import { createClient } from '@supabase/supabase-js';

/**
 * Helper to create a Supabase client for server-side usage.  Rather than
 * instantiating a client at module load, we defer creation until inside
 * handlers.  This prevents referencing undefined environment variables
 * during build time and allows graceful failure when the variables are not
 * provided.  If required environment variables are missing, the returned
 * client may be undefined and should be handled by the caller.
 */
function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

// GET /api/ads - returns a paginated list of ads sorted by created_at desc
export async function GET(request: Request) {
  const serverSupabase = getServerClient();
  if (!serverSupabase) {
    return NextResponse.json({ error: 'Supabase environment variables not set' }, { status: 500 });
  }
  // تحليل معلمات الاستعلام للترقيم
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const currentPage = isNaN(page) || page < 1 ? 1 : page;
  const perPage = isNaN(limit) || limit < 1 ? 10 : limit;
  const start = (currentPage - 1) * perPage;
  const end = start + perPage - 1;
  const { data, error } = await serverSupabase
    .from('ads')
    .select('*')
    .order('created_at', { ascending: false })
    .range(start, end);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ page: currentPage, limit: perPage, data });
}

// POST /api/ads - create a new ad. Expects {title, description, price, location, category}
export async function POST(request: Request) {
  const serverSupabase = getServerClient();
  if (!serverSupabase) {
    return NextResponse.json({ error: 'Supabase environment variables not set' }, { status: 500 });
  }
  // تحقق من رمز CSRF في الرؤوس
  const csrfHeader = request.headers.get('x-csrf-token');
  if (!verifyCsrfToken(csrfHeader)) {
    return NextResponse.json({ error: 'CSRF token mismatch' }, { status: 403 });
  }
  const body = await request.json();
  const { title, description, price, location, category } = body;
  // استخدم جلسة الخادم للحصول على معرف المستخدم. مع مفتاح الخدمة يمكن
  // تمرير معرف المستخدم بشكل صريح في الطلب (يفضل الحصول على session من cookies)
  const {
    data: { session },
    error: sessionError
  } = await serverSupabase.auth.getSession();
  if (sessionError) {
    return NextResponse.json({ error: sessionError.message }, { status: 500 });
  }
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user_id = session.user?.id;
  const { data, error } = await serverSupabase
    .from('ads')
    .insert({
      user_id,
      title,
      description,
      price,
      location,
      category
    })
    .select('*')
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
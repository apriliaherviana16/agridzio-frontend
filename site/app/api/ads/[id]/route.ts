import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyCsrfToken } from '@/lib/csrf';

/**
 * Helper to create a Supabase client for server-side usage.  Returns null
 * if the required environment variables are not provided.  Instantiating
 * the client inside functions prevents errors during build when variables
 * are undefined.
 */
function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

// GET /api/ads/:id - fetches an ad by id with user info
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const serverSupabase = getServerClient();
  if (!serverSupabase) {
    return NextResponse.json({ error: 'Supabase environment variables not set' }, { status: 500 });
  }
  const id = params.id;
  const { data, error } = await serverSupabase
    .from('ads')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  return NextResponse.json(data);
}

// PUT /api/ads/:id - update ad
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const serverSupabase = getServerClient();
  if (!serverSupabase) {
    return NextResponse.json({ error: 'Supabase environment variables not set' }, { status: 500 });
  }
  const csrfHeader = request.headers.get('x-csrf-token');
  if (!verifyCsrfToken(csrfHeader)) {
    return NextResponse.json({ error: 'CSRF token mismatch' }, { status: 403 });
  }
  const id = params.id;
  const body = await request.json();
  const { title, description, price, location, category } = body;
  // تحقق من الجلسة
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
  // تحديث الإعلان بشرط ملكية المستخدم
  const { data, error } = await serverSupabase
    .from('ads')
    .update({ title, description, price, location, category })
    .eq('id', id)
    .eq('user_id', session.user?.id)
    .select('*')
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// DELETE /api/ads/:id - delete ad
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const serverSupabase = getServerClient();
  if (!serverSupabase) {
    return NextResponse.json({ error: 'Supabase environment variables not set' }, { status: 500 });
  }
  const csrfHeader = request.headers.get('x-csrf-token');
  if (!verifyCsrfToken(csrfHeader)) {
    return NextResponse.json({ error: 'CSRF token mismatch' }, { status: 403 });
  }
  const id = params.id;
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
  const { error } = await serverSupabase
    .from('ads')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user?.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}
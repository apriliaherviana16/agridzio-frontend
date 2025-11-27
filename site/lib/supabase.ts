import { createBrowserClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client instance using the public environment variables.
 * When running on the browser, this client will automatically handle auth
 * tokens via localStorage.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
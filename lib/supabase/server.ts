import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = 'https://zdkohzpcwmvgfbripovw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpka29oenBjd212Z2Zicmlwb3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2Mjc5NjUsImV4cCI6MjA5NzIwMzk2NX0.hksU7-Qi7_XJ6S7Mh0vrPsSscT40Cla8hh4uDNRJ904'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpka29oenBjd212Z2Zicmlwb3Z3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTYyNzk2NSwiZXhwIjoyMDk3MjAzOTY1fQ.r_v3mRul6aGAMSp8qenpMyZpLXzCB637I9Njl92qxzw'

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_KEY,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

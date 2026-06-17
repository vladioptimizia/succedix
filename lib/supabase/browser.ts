import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = 'https://zdkohzpcwmvgfbripovw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpka29oenBjd212Z2Zicmlwb3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2Mjc5NjUsImV4cCI6MjA5NzIwMzk2NX0.hksU7-Qi7_XJ6S7Mh0vrPsSscT40Cla8hh4uDNRJ904'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY
  )
}

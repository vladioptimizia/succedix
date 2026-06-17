import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.N8N_WEBHOOK_SECRET && secret !== '6dcadf3e2d1216a787f3ca906454a1b6db15ac04e504b29c131adfefb17517ef') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const out: Record<string, unknown> = {}

  // 1. Env presence
  out.env = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '(missing, using hardcoded)',
    hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasService: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  const supabase = createAdminClient()

  // 2. DB reachability — count businesses
  try {
    const t0 = Date.now()
    const { count, error } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
    out.dbTest = error
      ? { ok: false, error: error.message }
      : { ok: true, businessCount: count, ms: Date.now() - t0 }
  } catch (e: any) {
    out.dbTest = { ok: false, threw: e?.message }
  }

  // 3. Auth admin — list users + check if admin exists
  try {
    const t0 = Date.now()
    const { data, error } = await supabase.auth.admin.listUsers()
    if (error) {
      out.authTest = { ok: false, error: error.message }
    } else {
      const admin = data.users.find(u => u.email === 'vladimir.m.f95@gmail.com')
      out.authTest = {
        ok: true,
        totalUsers: data.users.length,
        ms: Date.now() - t0,
        adminAccountExists: !!admin,
        adminConfirmed: admin ? !!admin.email_confirmed_at : null,
        emails: data.users.map(u => u.email),
      }
    }
  } catch (e: any) {
    out.authTest = { ok: false, threw: e?.message }
  }

  return NextResponse.json(out)
}

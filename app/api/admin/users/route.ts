import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') // 'sellers' | 'buyers' | 'all'
  const supabase = createAdminClient()

  if (type === 'sellers') {
    const { data, error } = await supabase
      .from('users')
      .select('id,email,full_name,user_type,created_at')
      .in('user_type', ['seller', 'vendor'])
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  }

  if (type === 'buyers') {
    const { data: users, error: usersErr } = await supabase
      .from('users')
      .select('id,email,full_name,created_at')
      .eq('user_type', 'buyer')
      .order('created_at', { ascending: false })
    if (usersErr) return NextResponse.json({ error: usersErr.message }, { status: 500 })

    const { data: profiles } = await supabase
      .from('buyer_profiles')
      .select('user_id,capital_min,capital_max,readiness_score')

    const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.user_id, p]))
    const enriched = (users ?? []).map(u => ({ ...u, ...profileMap[u.id] }))
    return NextResponse.json({ data: enriched })
  }

  // all users
  const { data, error } = await supabase
    .from('users')
    .select('id,email,full_name,user_type,created_at')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

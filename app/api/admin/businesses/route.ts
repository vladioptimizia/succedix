import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: user } = await supabase.from('users').select('user_type').eq('id', userId).single()
  if (user?.user_type !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name, sector, canton, city, price_min, price_max, annual_revenue, created_at, vendor_id')
    .eq('status', 'pending_approval')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ businesses })
}

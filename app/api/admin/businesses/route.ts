import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createAdminClient();

  const { data: user } = await supabase
    .from('users')
    .select('user_type')
    .eq('id', userId)
    .single();

  if (user?.user_type !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const page = Math.max(1, Number(req.nextUrl.searchParams.get('page') ?? '1'));
  const from = (page - 1) * PAGE_SIZE;

  const { data: businesses, error, count } = await supabase
    .from('businesses')
    .select('id, name, sector, canton, city, price_min, price_max, annual_revenue, created_at, vendor_id', { count: 'exact' })
    .eq('status', 'pending_approval')
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ businesses, total: count ?? 0, page, pageSize: PAGE_SIZE });
}

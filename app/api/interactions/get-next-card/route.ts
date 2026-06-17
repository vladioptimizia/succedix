import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { SWIPES_PER_DAY } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createAdminClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: counterData } = await supabase
    .from('swipe_counters')
    .select('count')
    .eq('buyer_id', userId)
    .eq('date_counter', today)
    .single();

  const currentCount = counterData?.count ?? 0;
  const swipesRemaining = Math.max(0, SWIPES_PER_DAY - currentCount);

  if (swipesRemaining === 0) {
    return NextResponse.json(
      { error: 'Daily swipe limit reached', limit: SWIPES_PER_DAY, swipesRemaining: 0 },
      { status: 429 }
    );
  }

  const { data: buyerProfile } = await supabase
    .from('buyer_profiles')
    .select('region_main, sectors_interested')
    .eq('user_id', userId)
    .single();

  const { data: interactions } = await supabase
    .from('interactions')
    .select('business_id')
    .eq('buyer_id', userId);

  const seenIds = interactions?.map((i) => i.business_id) ?? [];

  let query = supabase
    .from('businesses')
    .select('id, name, sector, canton, city, price_min, price_max, photos, established_year, description, annual_revenue')
    .eq('status', 'approved');

  if (seenIds.length > 0) {
    query = query.not('id', 'in', `(${seenIds.join(',')})`);
  }

  if (buyerProfile?.region_main) {
    query = query.eq('canton', buyerProfile.region_main);
  }

  const { data: nextCard } = await query.limit(1).single();

  if (!nextCard) {
    return NextResponse.json({ business: null, swipesRemaining, message: 'No more businesses available' });
  }

  return NextResponse.json({
    success: true,
    swipesRemaining,
    business: {
      id: nextCard.id,
      name: nextCard.name,
      sector: nextCard.sector,
      canton: nextCard.canton,
      city: nextCard.city ?? '',
      priceMin: nextCard.price_min,
      priceMax: nextCard.price_max,
      photos: nextCard.photos ?? [],
      establishedYear: nextCard.established_year,
      description: nextCard.description ?? '',
      annualRevenue: nextCard.annual_revenue ?? 0,
    },
  });
}

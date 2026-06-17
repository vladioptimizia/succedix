import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SWIPES_PER_DAY = 5;

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const userId = req.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check daily swipe limit
  const today = new Date().toISOString().split('T')[0];
  const { data: counterData } = await supabase
    .from('swipe_counters')
    .select('count')
    .eq('buyer_id', userId)
    .eq('date_counter', today)
    .single();

  const currentCount = counterData?.count || 0;
  const swipesRemaining = Math.max(0, SWIPES_PER_DAY - currentCount);

  if (swipesRemaining === 0) {
    return NextResponse.json(
      { error: 'Daily swipe limit reached', limit: SWIPES_PER_DAY, swipesRemaining: 0 },
      { status: 429 }
    );
  }

  // Get buyer profile for region filtering
  const { data: buyerProfile } = await supabase
    .from('buyer_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Get already seen business IDs
  const { data: interactions } = await supabase
    .from('interactions')
    .select('business_id')
    .eq('buyer_id', userId);

  const seenIds = interactions?.map((i) => i.business_id) || [];

  let query = supabase
    .from('businesses')
    .select('*')
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
      city: nextCard.city || '',
      priceMin: nextCard.price_min,
      priceMax: nextCard.price_max,
      photos: nextCard.photos || [],
      establishedYear: nextCard.established_year,
      description: nextCard.description || '',
      annualRevenue: nextCard.annual_revenue || 0,
    },
  });
}

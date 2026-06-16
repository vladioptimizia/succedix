import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const userId = req.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: buyerProfile } = await supabase
    .from('buyer_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!buyerProfile) {
    return NextResponse.json({ error: 'Complete profile first' }, { status: 400 });
  }

  const { data: interactions } = await supabase
    .from('interactions')
    .select('business_id')
    .eq('buyer_id', userId);

  const seenBusinessIds = interactions?.map((i) => i.business_id) || [];

  let query = supabase
    .from('businesses')
    .select('*')
    .eq('status', 'approved');

  if (seenBusinessIds.length > 0) {
    query = query.not('id', 'in', `(${seenBusinessIds.join(',')})`);
  }

  if (buyerProfile.region_main) {
    query = query.eq('canton', buyerProfile.region_main);
  }

  const { data: nextCard } = await query.limit(1).single();

  if (!nextCard) {
    return NextResponse.json({ business: null, message: 'No more businesses available' });
  }

  return NextResponse.json({
    success: true,
    business: {
      id: nextCard.id,
      name: nextCard.name,
      sector: nextCard.sector,
      canton: nextCard.canton,
      priceMin: nextCard.price_min,
      priceMax: nextCard.price_max,
      photos: nextCard.photos,
      establishedYear: nextCard.established_year,
    },
  });
}

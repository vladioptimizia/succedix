import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const SWIPES_PER_DAY = 5;

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { businessId, action } = await req.json();
  const userId = req.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!['like', 'pass', 'save'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  if (action === 'save') {
    const { error } = await supabase
      .from('interactions')
      .insert([{ buyer_id: userId, business_id: businessId, action: 'save' }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, countedAsSwipe: false });
  }

  const today = new Date().toISOString().split('T')[0];

  const { data: counterData } = await supabase
    .from('swipe_counters')
    .select('count')
    .eq('buyer_id', userId)
    .eq('date_counter', today)
    .single();

  const currentCount = counterData?.count || 0;

  if (currentCount >= SWIPES_PER_DAY) {
    return NextResponse.json(
      { error: 'Daily swipe limit reached', limit: SWIPES_PER_DAY },
      { status: 429 }
    );
  }

  const { error: interactionError } = await supabase
    .from('interactions')
    .insert([{ buyer_id: userId, business_id: businessId, action }]);

  if (interactionError) {
    return NextResponse.json({ error: interactionError.message }, { status: 400 });
  }

  if (counterData) {
    await supabase
      .from('swipe_counters')
      .update({ count: currentCount + 1 })
      .eq('buyer_id', userId)
      .eq('date_counter', today);
  } else {
    await supabase
      .from('swipe_counters')
      .insert([{ buyer_id: userId, date_counter: today, count: 1 }]);
  }

  const swipesRemaining = SWIPES_PER_DAY - (currentCount + 1);

  return NextResponse.json({
    success: true,
    action,
    swipesRemaining,
    limitReached: swipesRemaining === 0,
  });
}

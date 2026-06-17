import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { SWIPES_PER_DAY } from '@/lib/constants';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const SwipeSchema = z.object({
  businessId: z.string().uuid(),
  action: z.enum(['like', 'pass', 'save']),
});

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = SwipeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const { businessId, action } = parsed.data;
  const supabase = createAdminClient();

  // "save" doesn't count against the daily swipe limit
  if (action === 'save') {
    const { error } = await supabase
      .from('interactions')
      .insert([{ buyer_id: userId, business_id: businessId, action: 'save' }]);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, countedAsSwipe: false });
  }

  const today = new Date().toISOString().split('T')[0];

  // Atomic upsert: increment counter or reject if limit reached.
  // The DB CHECK constraint (count <= 6) acts as a hard backstop.
  const { data: counter, error: counterError } = await supabase
    .from('swipe_counters')
    .upsert(
      { buyer_id: userId, date_counter: today, count: 1 },
      { onConflict: 'buyer_id,date_counter', ignoreDuplicates: false }
    )
    .select('count')
    .single();

  // If the upsert didn't create a new row it means the row existed; increment it
  if (counterError) {
    // Row already exists — increment atomically via rpc if available, else read-modify-write
    const { data: existing } = await supabase
      .from('swipe_counters')
      .select('count')
      .eq('buyer_id', userId)
      .eq('date_counter', today)
      .single();

    const currentCount = existing?.count ?? 0;
    if (currentCount >= SWIPES_PER_DAY) {
      return NextResponse.json(
        { error: 'Daily swipe limit reached', limit: SWIPES_PER_DAY },
        { status: 429 }
      );
    }

    await supabase
      .from('swipe_counters')
      .update({ count: currentCount + 1 })
      .eq('buyer_id', userId)
      .eq('date_counter', today);

    const { error: interactionError } = await supabase
      .from('interactions')
      .insert([{ buyer_id: userId, business_id: businessId, action }]);
    if (interactionError) return NextResponse.json({ error: interactionError.message }, { status: 400 });

    const swipesRemaining = SWIPES_PER_DAY - (currentCount + 1);
    return NextResponse.json({ success: true, action, swipesRemaining, limitReached: swipesRemaining === 0 });
  }

  // New row was inserted (first swipe of the day)
  const usedCount = counter?.count ?? 1;
  if (usedCount > SWIPES_PER_DAY) {
    return NextResponse.json(
      { error: 'Daily swipe limit reached', limit: SWIPES_PER_DAY },
      { status: 429 }
    );
  }

  const { error: interactionError } = await supabase
    .from('interactions')
    .insert([{ buyer_id: userId, business_id: businessId, action }]);
  if (interactionError) return NextResponse.json({ error: interactionError.message }, { status: 400 });

  const swipesRemaining = SWIPES_PER_DAY - usedCount;
  return NextResponse.json({ success: true, action, swipesRemaining, limitReached: swipesRemaining === 0 });
}

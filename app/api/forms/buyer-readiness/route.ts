import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { calculateBuyerReadinessScore } from '@/lib/scoring';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const BuyerReadinessSchema = z.object({
  capitalMin: z.number().min(0),
  capitalMax: z.number().min(0),
  capitalSource: z.enum(['proprio', 'credito', 'combinado', 'investor']),
  sectorsInterested: z.array(z.enum(['cafe', 'restaurante', 'varejo', 'servicos', 'saude', 'outro'])),
  openToOtherSectors: z.boolean(),
  regionMain: z.enum(['ZH', 'BE', 'AG', 'ZG', 'VD', 'GE', 'TI', 'outro']),
  radiusKm: z.number().min(0),
  exploreOtherRegions: z.boolean(),
  involvementType: z.enum(['operator', 'investor', 'unknown']),
  hoursAvailablePerWeek: z.number().min(0).max(168),
  experienceBackground: z.string(),
  timelineMonths: z.number().int().min(1),
  languages: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = BuyerReadinessSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const score = calculateBuyerReadinessScore(data);
  const supabase = createAdminClient();

  const { error: profileError } = await supabase
    .from('buyer_profiles')
    .upsert({
      user_id: userId,
      capital_min: data.capitalMin,
      capital_max: data.capitalMax,
      sectors_interested: data.sectorsInterested,
      region_main: data.regionMain,
      radius_km: data.radiusKm,
      explore_other_regions: data.exploreOtherRegions,
      experience_background: data.experienceBackground,
      involvement_type: data.involvementType,
      hours_available_per_week: data.hoursAvailablePerWeek,
      timeline_months: data.timelineMonths,
      languages: data.languages,
    }, { onConflict: 'user_id' });

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

  const { error: scoreError } = await supabase
    .from('users')
    .update({ buyer_readiness_score: score, buyer_readiness_updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (scoreError) return NextResponse.json({ error: scoreError.message }, { status: 400 });

  return NextResponse.json({ success: true, score });
}

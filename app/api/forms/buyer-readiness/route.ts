import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { calculateBuyerReadinessScore } from '@/lib/scoring'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.json()
  const score = calculateBuyerReadinessScore(formData)

  const { error: profileError } = await supabase
    .from('buyer_profiles')
    .upsert({
      user_id: userId,
      capital_min: formData.capitalMin,
      capital_max: formData.capitalMax,
      sectors_interested: formData.sectorsInterested,
      region_main: formData.regionMain,
      radius_km: formData.radiusKm,
      explore_other_regions: formData.exploreOtherRegions,
      experience_background: formData.experienceBackground,
      involvement_type: formData.involvementType,
      hours_available_per_week: formData.hoursAvailablePerWeek,
      timeline_months: formData.timelineMonths,
      languages: formData.languages,
    }, { onConflict: 'user_id' })

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 })

  const { error: scoreError } = await supabase
    .from('users')
    .update({ buyer_readiness_score: score, buyer_readiness_updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (scoreError) return NextResponse.json({ error: scoreError.message }, { status: 400 })

  return NextResponse.json({ success: true, score })
}

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateMatchesForBuyer } from '@/lib/match-engine'
import type { BuyerReadinessInput } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const { buyer_id } = await req.json().catch(() => ({}))

  const buyerQuery = supabase
    .from('buyer_profiles')
    .select('user_id, capital_min, capital_max, sectors_interested, region_main, radius_km, explore_other_regions, involvement_type, hours_available_per_week, experience_background, timeline_months, languages')

  if (buyer_id) buyerQuery.eq('user_id', buyer_id)

  const { data: buyers, error: buyersErr } = await buyerQuery
  if (buyersErr) return NextResponse.json({ error: buyersErr.message }, { status: 500 })
  if (!buyers?.length) return NextResponse.json({ message: 'Nenhum comprador encontrado', processed: 0 })

  const { data: businesses, error: bizErr } = await supabase
    .from('businesses')
    .select('id, name, sector, canton, city, price_min, price_max, annual_revenue, description, employees, established_year, seller_readiness_score')
    .in('status', ['approved', 'published'])

  if (bizErr) return NextResponse.json({ error: bizErr.message }, { status: 500 })
  if (!businesses?.length) return NextResponse.json({ message: 'Nenhum negócio disponível', processed: 0 })

  let totalMatches = 0

  for (const buyer of buyers) {
    const buyerInput: BuyerReadinessInput & { id: string } = {
      id: buyer.user_id,
      capitalMin: buyer.capital_min ?? 0,
      capitalMax: buyer.capital_max ?? 999999,
      capitalSource: 'proprio',
      sectorsInterested: buyer.sectors_interested ?? [],
      openToOtherSectors: buyer.explore_other_regions ?? true,
      regionMain: buyer.region_main ?? 'ZH',
      radiusKm: buyer.radius_km ?? 50,
      exploreOtherRegions: buyer.explore_other_regions ?? true,
      involvementType: buyer.involvement_type ?? 'unknown',
      hoursAvailablePerWeek: buyer.hours_available_per_week ?? 0,
      experienceBackground: buyer.experience_background ?? '',
      timelineMonths: buyer.timeline_months ?? 12,
      languages: buyer.languages ?? [],
    }

    const matches = await generateMatchesForBuyer(buyerInput, businesses as any, 10)

    const rows = matches.map(m => ({
      buyer_id: buyer.user_id,
      business_id: m.businessId,
      fit_score: m.fitScore,
      ai_explanation: m.aiExplanation,
      ai_highlights: m.aiHighlights,
      sector_match: m.sectorMatch,
      price_match: m.priceMatch,
      region_match: m.regionMatch,
      generated_at: new Date().toISOString(),
    }))

    await supabase.from('matches').upsert(rows, { onConflict: 'buyer_id,business_id' })
    totalMatches += rows.length
  }

  return NextResponse.json({ success: true, buyers: buyers.length, matches: totalMatches })
}

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { guessSector, guessCanton } from '@/lib/taxonomy'

export const dynamic = 'force-dynamic'

// Tenta classificar primeiro a partir do campo estruturado (sector/canton vindo do
// site de origem); só recorre a nome+descrição (ou cidade) como segunda tentativa
// se a primeira não encontrar nenhuma correspondência conhecida.
function resolveSector(b: { sector?: string; name: string; description?: string }): string {
  if (b.sector) {
    const fromSector = guessSector(b.sector)
    if (fromSector !== 'outro') return fromSector
  }
  return guessSector(`${b.sector ?? ''} ${b.name} ${b.description ?? ''}`)
}

function resolveCanton(b: { canton?: string; city?: string }): string {
  if (b.canton) {
    const fromCanton = guessCanton(b.canton)
    if (fromCanton !== 'outro') return fromCanton
  }
  return guessCanton(`${b.canton ?? ''} ${b.city ?? ''}`)
}

const BusinessSchema = z.object({
  source: z.string(),          // "companymarket.ch", "firmenkauf.de", etc.
  source_id: z.string(),       // original listing ID from source site
  source_url: z.string().url().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  sector: z.string().optional(),
  canton: z.string().optional(),
  city: z.string().optional(),
  price_min: z.number().optional(),
  price_max: z.number().optional(),
  annual_revenue: z.number().optional(),
  established_year: z.number().optional(),
  employees: z.number().optional(),
})

const PayloadSchema = z.object({
  businesses: z.array(BusinessSchema).min(1).max(100),
})

export async function POST(req: NextRequest) {
  // Verify secret token
  const token = req.headers.get('x-n8n-secret')
  if (!token || token !== process.env.N8N_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = PayloadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = createAdminClient()
  const results = { inserted: 0, skipped: 0, errors: 0 }

  for (const b of parsed.data.businesses) {
    // Skip duplicates — same source + source_id
    const { data: existing } = await supabase
      .from('businesses')
      .select('id')
      .eq('source', b.source)
      .eq('source_id', b.source_id)
      .maybeSingle()

    if (existing) {
      results.skipped++
      continue
    }

    const sectorResolved = resolveSector(b)
    const cantonResolved = resolveCanton(b)

    const { error } = await supabase.from('businesses').insert({
      name: b.name,
      description: b.description ?? null,
      sector: sectorResolved,
      canton: cantonResolved,
      city: b.city ?? null,
      price_min: b.price_min ?? 0,
      price_max: b.price_max ?? 0,
      annual_revenue: b.annual_revenue ?? null,
      established_year: b.established_year ?? null,
      employees: b.employees ?? null,
      source: b.source,
      source_id: b.source_id,
      source_url: b.source_url ?? null,
      status: 'imported',
      photos: [],
    })

    if (error) {
      results.errors++
    } else {
      results.inserted++
    }
  }

  return NextResponse.json({
    success: true,
    inserted: results.inserted,
    skipped: results.skipped,
    errors: results.errors,
  })
}

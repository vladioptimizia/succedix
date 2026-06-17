import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Map source site names to internal sector values
function guessSector(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('café') || t.includes('cafe') || t.includes('kaffee') || t.includes('bakery') || t.includes('bäckerei')) return 'cafe'
  if (t.includes('restaurant') || t.includes('gastro') || t.includes('pizz') || t.includes('bistro')) return 'restaurante'
  if (t.includes('shop') || t.includes('handel') || t.includes('retail') || t.includes('boutique')) return 'varejo'
  if (t.includes('arzt') || t.includes('medizin') || t.includes('health') || t.includes('pflege') || t.includes('dental')) return 'saude'
  if (t.includes('service') || t.includes('beratung') || t.includes('consulting') || t.includes('agentur')) return 'servicos'
  return 'outro'
}

function guessCanton(text: string): string {
  const cantons: Record<string, string> = {
    'zürich': 'ZH', 'zurich': 'ZH', 'zh': 'ZH',
    'bern': 'BE', 'berne': 'BE', 'be': 'BE',
    'aargau': 'AG', 'aarau': 'AG', 'ag': 'AG',
    'zug': 'ZG', 'zg': 'ZG',
    'vaud': 'VD', 'lausanne': 'VD', 'vd': 'VD',
    'genève': 'GE', 'geneva': 'GE', 'genf': 'GE', 'ge': 'GE',
    'ticino': 'TI', 'lugano': 'TI', 'ti': 'TI',
  }
  const t = text.toLowerCase()
  for (const [key, val] of Object.entries(cantons)) {
    if (t.includes(key)) return val
  }
  return 'outro'
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

    const sectorResolved = b.sector
      ? guessSector(b.sector)
      : guessSector(b.name + ' ' + (b.description ?? ''))

    const cantonResolved = b.canton
      ? guessCanton(b.canton)
      : guessCanton(b.city ?? '')

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

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { SECTOR_VALUES, CANTON_VALUES } from '@/lib/taxonomy';

export const dynamic = 'force-dynamic';

const PublishSchema = z.object({
  name: z.string().min(1),
  sector: z.enum(SECTOR_VALUES),
  canton: z.enum(CANTON_VALUES),
  city: z.string().optional(),
  description: z.string().optional(),
  priceMin: z.number().min(0),
  priceMax: z.number().min(0),
  annualRevenue: z.number().min(0).optional(),
  establishedYear: z.number().int().min(1900).optional(),
  photos: z.array(z.string().url()).optional(),
});

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = PublishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('businesses')
    .insert([{
      vendor_id: userId,
      name: d.name,
      sector: d.sector,
      canton: d.canton,
      city: d.city ?? null,
      description: d.description ?? null,
      price_min: d.priceMin,
      price_max: d.priceMax,
      annual_revenue: d.annualRevenue ?? null,
      established_year: d.establishedYear ?? null,
      photos: d.photos ?? [],
      status: 'pending_approval',
    }])
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, businessId: data[0].id, status: 'pending_approval' });
}

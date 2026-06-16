import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const businessData = await req.json();
  const userId = req.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!businessData.name || !businessData.sector || !businessData.priceMin) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('businesses')
    .insert([{
      vendor_id: userId,
      name: businessData.name,
      sector: businessData.sector,
      canton: businessData.canton,
      city: businessData.city,
      description: businessData.description,
      price_min: businessData.priceMin,
      price_max: businessData.priceMax,
      annual_revenue: businessData.annualRevenue,
      established_year: businessData.establishedYear,
      photos: businessData.photos || [],
      status: 'pending_approval',
    }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    businessId: data[0].id,
    status: 'pending_approval',
  });
}

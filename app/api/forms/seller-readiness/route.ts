import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function calculateSellerReadinessScore(formData: {
  establishedYear?: number;
  documentationComplete?: boolean;
  annualRevenue?: number;
  recurringCustomers?: boolean;
  ownerDependency?: number;
}): number {
  let score = 0;

  if (formData.establishedYear && new Date().getFullYear() - formData.establishedYear > 3) {
    score += 20;
  }

  if (formData.documentationComplete) {
    score += 20;
  }

  if (formData.annualRevenue && formData.annualRevenue > 100000) {
    score += 20;
  }

  if (formData.recurringCustomers) {
    score += 20;
  }

  if (formData.ownerDependency !== undefined && formData.ownerDependency < 50) {
    score += 20;
  }

  return Math.min(score, 100);
}

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const formData = await req.json();
  const userId = req.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const readinessScore = calculateSellerReadinessScore(formData);

  const { error } = await supabase
    .from('users')
    .update({
      seller_readiness_score: readinessScore,
      seller_readiness_updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    score: readinessScore,
    status: readinessScore >= 70 ? 'good' : 'needs_improvement',
  });
}

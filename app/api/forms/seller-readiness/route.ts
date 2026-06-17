import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { calculateSellerReadinessScore } from '@/lib/scoring';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const SellerReadinessSchema = z.object({
  businessName: z.string().min(1),
  sector: z.enum(['cafe', 'restaurante', 'varejo', 'servicos', 'saude', 'outro']),
  canton: z.enum(['ZH', 'BE', 'AG', 'ZG', 'VD', 'GE', 'TI', 'outro']),
  foundedYear: z.number().int().min(1900).max(new Date().getFullYear()),
  annualRevenue: z.number().min(0),
  operatingMargin: z.number().min(0).max(100),
  recurringClients: z.boolean(),
  saleReason: z.enum(['aposentadoria', 'burnout', 'mudanca', 'outro']),
  timeline: z.enum(['1_mes', '3_6_meses', '1_ano', 'aberto']),
  confidentiality: z.enum(['muito_sigilo', 'normal', 'posso_contar']),
  ownerDependency: z.union([z.literal(0), z.literal(25), z.literal(50), z.literal(75), z.literal(100)]),
  hasDocumentedProcesses: z.boolean(),
  teamSize: z.number().int().min(0),
  documentsOrganized: z.boolean(),
  accountingUpToDate: z.boolean(),
  licensesValid: z.boolean(),
  description: z.string(),
});

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = SellerReadinessSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const readinessScore = calculateSellerReadinessScore(parsed.data);
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('users')
    .update({
      seller_readiness_score: readinessScore,
      seller_readiness_updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, score: readinessScore });
}

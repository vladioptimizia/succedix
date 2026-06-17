import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  userType: z.enum(['buyer', 'vendor']),
  fullName: z.string().min(1).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password, userType, fullName } = parsed.data;
  const supabase = createAdminClient();

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const { error: insertError } = await supabase
    .from('users')
    .insert([{ id: authData.user!.id, email, user_type: userType, full_name: fullName ?? null }]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, userId: authData.user!.id });
}

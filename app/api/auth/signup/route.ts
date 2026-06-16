import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { email, password, userType, fullName } = await req.json();

  if (!email || !password || !userType || !['buyer', 'vendor', 'admin'].includes(userType)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

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
    .insert([{
      id: authData.user!.id,
      email,
      user_type: userType,
      full_name: fullName,
    }]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, userId: authData.user!.id });
}

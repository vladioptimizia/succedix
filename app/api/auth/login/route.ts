import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// Login feito no servidor — o servidor fala com o Supabase (caminho fiável),
// define os cookies de sessão e devolve para onde redirecionar.
export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Pedido inválido' }, { status: 400 })
  }

  const { email, password } = body
  if (!email || !password) {
    return NextResponse.json({ error: 'Email e password são obrigatórios' }, { status: 400 })
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const isAdmin = data.user?.email === 'vladimir.m.f95@gmail.com'
  const userType = data.user?.user_metadata?.user_type
  const redirect = isAdmin
    ? '/admin'
    : userType === 'vendor'
      ? '/onboarding/seller'
      : userType === 'buyer'
        ? '/onboarding/buyer'
        : '/discover'

  return NextResponse.json({ ok: true, redirect, email: data.user?.email })
}

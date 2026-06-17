import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export const dynamic = 'force-dynamic'

const SUPABASE_URL = 'https://zdkohzpcwmvgfbripovw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpka29oenBjd212Z2Zicmlwb3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2Mjc5NjUsImV4cCI6MjA5NzIwMzk2NX0.hksU7-Qi7_XJ6S7Mh0vrPsSscT40Cla8hh4uDNRJ904'

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

  // Collect cookies to set on the response
  const cookiesToSet: { name: string; value: string; options: CookieOptions }[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => { cookiesToSet.push(...cookies) },
      },
    }
  )

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

  const response = NextResponse.json({ ok: true, redirect, email: data.user?.email })

  // Set session cookies on the response
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as any)
  })

  return response
}

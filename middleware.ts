import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/discover', '/admin', '/sell']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always strip client-supplied x-user-id to prevent spoofing
  const cleanHeaders = new Headers(request.headers)
  cleanHeaders.delete('x-user-id')

  let supabaseResponse = NextResponse.next({ request: { headers: cleanHeaders } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => cleanHeaders.set(`cookie`, `${name}=${value}`))
          supabaseResponse = NextResponse.next({ request: { headers: cleanHeaders } })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const authedHeaders = new Headers(cleanHeaders)
    authedHeaders.set('x-user-id', user.id)
    const response = NextResponse.next({ request: { headers: authedHeaders } })
    supabaseResponse.cookies.getAll().forEach(c => response.cookies.set(c.name, c.value))
    return response
  }

  if (PROTECTED.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}

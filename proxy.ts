// proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // পাবলিক রাউট (লগইন ছাড়া যেসব পেজ দেখা যাবে)
  const publicRoutes = ['/login', '/auth/callback', '/', '/grammer-haat', '/mall', '/marketplace', '/social']
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route + '/'))

  // লগইন করা ইউজার লগইন পেজে গেলে হোমপেজে পাঠান
  if (req.nextUrl.pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // পাবলিক রাউট না হলে এবং ইউজার লগইন না থাকলে লগইন পেজে পাঠান
  if (!isPublicRoute && !user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
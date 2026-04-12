// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log("🚀 CALLBACK ROUTE HIT!");
  
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  console.log("📝 Code from Google:", code ? "YES - " + code.substring(0, 30) + "..." : "NO CODE");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("❌ Exchange failed:", error.message);
      return NextResponse.redirect(new URL('/login?error=exchange_failed', requestUrl.origin));
    }
    console.log("✅ Session exchanged successfully!");
  }

  console.log("➡️ Redirecting to home page");
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
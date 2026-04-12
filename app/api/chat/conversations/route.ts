// app/api/chat/conversations/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }); },
        remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }); },
      },
    }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participant1:users!conversations_participant1_fkey(id, name, avatar, email),
      participant2:users!conversations_participant2_fkey(id, name, avatar, email)
    `)
    .or(`participant1.eq.${user.id},participant2.eq.${user.id}`)
    .order('last_message_time', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formatted = data?.map((conv: any) => ({
    ...conv,
    otherParticipant: conv.participant1.id === user.id ? conv.participant2 : conv.participant1,
  }));

  return NextResponse.json(formatted || []);
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }); },
        remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }); },
      },
    }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { participantId, type, productId } = await req.json();
  if (!participantId) {
    return NextResponse.json({ error: 'Missing participantId' }, { status: 400 });
  }

  // Check existing conversation
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .or(`and(participant1.eq.${user.id},participant2.eq.${participantId}),and(participant1.eq.${participantId},participant2.eq.${user.id})`)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ id: existing.id });
  }

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      participant1: user.id,
      participant2: participantId,
      type: type || 'marketplace',
      product_id: productId || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
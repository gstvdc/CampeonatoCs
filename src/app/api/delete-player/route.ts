import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, password } = body;

    if (!id || !password) {
      return NextResponse.json({ success: false, error: 'Faltam dados.' }, { status: 400 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json({ success: false, error: 'Senha incorreta.' }, { status: 403 });
    }

    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase não configurado.' }, { status: 500 });
    }

    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.success) {
      return NextResponse.json({ success: false, error: rateLimit.error }, { status: 429 });
    }

    const { data, error } = await supabase
      .from('interested_players')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error deleting player:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ success: false, error: 'Não foi possível remover. Verifique as permissões de exclusão (RLS) no Supabase ou se o ID existe.' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API /delete-player error:', err);
    return NextResponse.json({ success: false, error: 'Erro interno.' }, { status: 500 });
  }
}

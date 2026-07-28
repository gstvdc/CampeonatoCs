import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import type { InterestedPlayer } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { captain_name, player_name, premier_points, steam_id, role, player_password } = body;

    if (!captain_name || !player_name || premier_points === undefined || !player_password) {
      return NextResponse.json({ success: false, error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    if (Number(premier_points) < 1000) {
      return NextResponse.json({ success: false, error: 'O mínimo de pontos no Premier é de 1000.' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Banco de dados não configurado no servidor.' }, { status: 500 });
    }

    // Rate Limiting
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.success) {
      return NextResponse.json({ success: false, error: rateLimit.error }, { status: 429 });
    }

    // Input Sanitization (Tamanho máximo)
    if (
      captain_name.length > 50 ||
      player_name.length > 50 ||
      (steam_id && steam_id.length > 100) ||
      player_password.length > 50 ||
      (role && role.length > 20)
    ) {
      return NextResponse.json({ success: false, error: 'Campos excederam o tamanho máximo permitido.' }, { status: 400 });
    }

    // If it's not a local / unknown IP, check for existing registration
    if (ip !== 'unknown' && ip !== '::1' && ip !== '127.0.0.1' && ip !== 'localhost') {
      const { data: existingPlayers, error: fetchError } = await supabase
        .from('interested_players')
        .select('id')
        .eq('ip_address', ip);

      if (fetchError) {
        console.error('Error fetching by IP:', fetchError);
        return NextResponse.json({ success: false, error: 'Erro ao validar registro.' }, { status: 500 });
      }

      if (existingPlayers && existingPlayers.length > 0) {
        return NextResponse.json({ success: false, error: 'Já existe um cadastro registrado por esta rede/IP.' }, { status: 403 });
      }
    }

    // Prepare data
    const newPlayer: Omit<InterestedPlayer, 'id' | 'created_at'> = {
      captain_name,
      player_name,
      premier_points: Number(premier_points),
      steam_id,
      role,
      ip_address: ip,
      player_password
    };

    // Insert into DB
    const { data, error } = await supabase
      .from('interested_players')
      .insert([newPlayer])
      .select();

    if (error) {
      console.error('Error inserting player:', error);
      return NextResponse.json({ success: false, error: error.message || 'Erro ao registrar no banco de dados.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data[0] });

  } catch (err: unknown) {
    console.error('API /register error:', err);
    return NextResponse.json({ success: false, error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

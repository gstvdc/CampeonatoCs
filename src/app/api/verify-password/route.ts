import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { withApiAuth } from '@/lib/apiUtils';

export const POST = withApiAuth(async (request: Request) => {
  const body = await request.json();
  const { id, player_password } = body;

  if (!id || !player_password) {
    return NextResponse.json({ success: false, error: 'ID e Senha são obrigatórios.' }, { status: 400 });
  }

  const { data: player, error: fetchError } = await supabase!
    .from('interested_players')
    .select('player_password')
    .eq('id', id)
    .single();

  if (fetchError || !player) {
    return NextResponse.json({ success: false, error: 'Jogador não encontrado.' }, { status: 404 });
  }

  if (!player.player_password) {
    return NextResponse.json({ success: false, error: 'Este jogador é um cadastro antigo e não possui senha pessoal.' }, { status: 403 });
  }

  if (player.player_password !== player_password) {
    return NextResponse.json({ success: false, error: 'Senha pessoal incorreta.' }, { status: 403 });
  }

  return NextResponse.json({ success: true });
});


import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, player_password, captain_name, player_name, premier_points, steam_id, role } = body;

    if (!id || !player_password) {
      return NextResponse.json({ success: false, error: 'ID e Senha são obrigatórios para edição.' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase não configurado.' }, { status: 500 });
    }

    // Buscar a senha atual do jogador no banco
    const { data: player, error: fetchError } = await supabase
      .from('interested_players')
      .select('player_password')
      .eq('id', id)
      .single();

    if (fetchError || !player) {
      return NextResponse.json({ success: false, error: 'Jogador não encontrado.' }, { status: 404 });
    }

    if (!player.player_password) {
      return NextResponse.json({ success: false, error: 'Este jogador é um cadastro antigo e não possui senha pessoal. Peça ao administrador para removê-lo e cadastre-se novamente.' }, { status: 403 });
    }

    if (player.player_password !== player_password) {
      return NextResponse.json({ success: false, error: 'Senha pessoal incorreta.' }, { status: 403 });
    }

    // Se a senha bateu, atualizar os dados
    const updates = {
      captain_name,
      player_name,
      premier_points: Number(premier_points),
      steam_id,
      role
    };

    const { error: updateError } = await supabase
      .from('interested_players')
      .update(updates)
      .eq('id', id);

    if (updateError) {
      console.error('Error updating player:', updateError);
      return NextResponse.json({ success: false, error: 'Erro ao atualizar dados.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    console.error('API /edit-player error:', err);
    return NextResponse.json({ success: false, error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

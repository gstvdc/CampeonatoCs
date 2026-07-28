import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { withApiAuth } from '@/lib/apiUtils';

export const POST = withApiAuth(async (request: Request) => {
  const body = await request.json();
  const { id, player_password, player_name, premier_points, steam_id, role } = body;

  if (!id || !player_password) {
    return NextResponse.json({ success: false, error: 'ID e Senha são obrigatórios para edição.' }, { status: 400 });
  }

  if (Number(premier_points) < 1000) {
    return NextResponse.json({ success: false, error: 'O mínimo de pontos no Premier é de 1000.' }, { status: 400 });
  }

  if (
    player_name.length > 50 ||
    (steam_id && steam_id.length > 100) ||
    player_password.length > 50 ||
    (role && role.length > 20)
  ) {
    return NextResponse.json({ success: false, error: 'Campos excederam o tamanho máximo permitido.' }, { status: 400 });
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
    return NextResponse.json({ success: false, error: 'Este jogador é um cadastro antigo e não possui senha pessoal. Peça ao administrador para removê-lo e cadastre-se novamente.' }, { status: 403 });
  }

  if (player.player_password !== player_password) {
    return NextResponse.json({ success: false, error: 'Senha pessoal incorreta.' }, { status: 403 });
  }

  const updates = {
    captain_name: 'Draft',
    player_name,
    premier_points: Number(premier_points),
    steam_id,
    role
  };

  const { data, error: updateError } = await supabase!
    .from('interested_players')
    .update(updates)
    .eq('id', id)
    .select();

  if (updateError) {
    console.error('Error updating player:', updateError);
    return NextResponse.json({ success: false, error: 'Erro ao atualizar dados.' }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ success: false, error: 'Não foi possível atualizar. Banco de dados bloqueou a edição (falta de permissão UPDATE no RLS).' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
});


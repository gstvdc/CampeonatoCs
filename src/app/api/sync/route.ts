import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const LEETIFY_API_KEY = process.env.LEETIFY_API_KEY || 'b320d6da-50f4-431e-94d8-a601afb56a90';

const PLAYERS = [
  { name: 'HPS', steam_id: '76561198307975279' },
  { name: 'GUSTA', steam_id: '76561198041561362' },
  { name: 'SOUZ', steam_id: '76561198172431970' },
  { name: 'ZANE', steam_id: '76561198981339882' },
  { name: 'GONZA', steam_id: '76561198074932950' },
  { name: 'SUCO', steam_id: '76561198354809416' },
  { name: 'LUCAS MOURA', steam_id: '76561198105201024' },
  { name: 'BLAZER', steam_id: '76561198090108428' },
  { name: 'PYONG', steam_id: '76561198313120130' },
  { name: 'JOAOZAO', steam_id: '76561199017898105' },
  { name: 'OYZ', steam_id: '76561198090139576' },
  { name: 'WITT', steam_id: '76561198308591706' },
  { name: 'RICHA', steam_id: '76561198203860751' },
  { name: 'HAXI', steam_id: '76561198452343727' },
  { name: 'SCALCO', steam_id: '76561198142881775' },
  { name: 'RAFINHA', steam_id: '76561198331708293' },
  { name: 'BENHUR', steam_id: '76561198145387248' },
  { name: 'CUNHA', steam_id: '76561198267183907' },
  { name: 'CENOURA', steam_id: '76561198865546206' },
  { name: 'GUI COELHO', steam_id: '76561198309460901' },
  { name: 'ANDREZINHO', steam_id: '76561198337786442' }
];

export async function POST() {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });
  }

  const { data: existingPlayers } = await supabase.from('interested_players').select('*');
  const existingMap = new Map(existingPlayers?.map((p: any) => [p.steam_id, p]) || []);

  const updatedPlayers = [];
  
  for (const player of PLAYERS) {
    try {
      const res = await fetch(`https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${player.steam_id}`, {
        headers: {
          'Authorization': `Bearer ${LEETIFY_API_KEY}`
        }
      });
      
      if (!res.ok) continue;
      
      const json = await res.json();
      
      let winRate = 50;
      if (json.winrate != null) {
        winRate = Math.round(json.winrate * 100);
      }
      
      const fullSteamUrl = `https://steamcommunity.com/profiles/${player.steam_id}`;
      const existingPlayer = existingMap.get(fullSteamUrl);
      
      let premierPoints = existingPlayer && existingPlayer.premier_points && existingPlayer.premier_points !== 10000 
                          ? existingPlayer.premier_points 
                          : 10000;
      
      // Puxa o max rank: só atualiza com o do Leetify se for MAIOR que o histórico que já temos
      if (json.ranks && json.ranks.premier) {
        if (json.ranks.premier > premierPoints) {
           premierPoints = json.ranks.premier;
        }
      }
      
      let kd = 1.0;
      if (json.recent_matches && json.recent_matches.length > 0) {
        let kills = 0, deaths = 0;
        json.recent_matches.forEach((m: any) => {
          if (m.score && m.score.length >= 2) {
             kills += m.score[0];
             deaths += m.score[1];
          }
        });
        if (deaths > 0) kd = Number((kills / deaths).toFixed(2));
      }
      
      let calculatedRole = 'Rifler';
      
      // Determinismo para espalhar bem as funções usando o final do steam_id
      let seed = parseInt(player.steam_id.slice(-3)) || 123;
      
      if (premierPoints > 20000 && kd >= 1.15) {
        calculatedRole = seed % 2 === 0 ? 'Entry Fragger' : 'Lurker';
      } 
      else if (kd > 1.05 && winRate >= 54) {
        calculatedRole = 'IGL'; // Muito impacto e vitórias
      }
      else if (kd >= 1.05 && seed % 4 === 0) {
        calculatedRole = 'AWPer'; // Cerca de 1/4 dos jogadores com bom KD
      }
      else if (premierPoints < 12000 && premierPoints > 0 && premierPoints !== 10000) {
        calculatedRole = 'Support';
      } 
      else if (kd < 0.95) {
        calculatedRole = seed % 3 === 0 ? 'Support' : 'Anchor';
      }
      else if (premierPoints > 15000 && kd > 1.0) {
        calculatedRole = seed % 3 === 0 ? 'Flex' : 'Rifler';
      }
      else {
        calculatedRole = seed % 2 === 0 ? 'Rifler' : 'Anchor';
      }
      
      // Forçar funções específicas se o usuário mencionou (Ex: Blazer)
      if (player.name === 'BLAZER') calculatedRole = 'AWPer';
      if (player.name === 'BENHUR' || player.name === 'CUNHA') calculatedRole = 'Support';

      // Status Detalhados (Radar Chart)
      let stat_mira = 50;
      let stat_nocao = 50;
      let stat_utilitaria = 50;
      let stat_movimentacao = 50;
      let stat_impacto = 50;

      if (json.rating) {
        stat_mira = Math.round(json.rating.aim) || 50;
        stat_nocao = Math.round(json.rating.positioning) || 50;
        stat_utilitaria = Math.round(json.rating.utility) || 50;
        
        // Impacto é calculado baseado no Leetify Rating geral (normalizado 0-100)
        // Um rating de 2.0+ é excelente, -2.0 é ruim. 
        // Ex: 0 -> 50, 3.0 -> 80, -3.0 -> 20.
        if (json.ranks && json.ranks.leetify !== null) {
           let impactScore = (json.ranks.leetify + 5) * 10;
           stat_impacto = Math.min(Math.max(Math.round(impactScore), 1), 99);
        }
      }

      if (json.stats) {
        // Movimentação usamos a estatística de Counter-Strafing do Leetify
        if (json.stats.counter_strafing_good_shots_ratio) {
           stat_movimentacao = Math.min(Math.max(Math.round(json.stats.counter_strafing_good_shots_ratio), 1), 99);
        }
      }

      updatedPlayers.push({
        ...(existingPlayer ? { id: existingPlayer.id } : {}), // Preserva o ID se já existir
        player_name: player.name,
        steam_id: fullSteamUrl,
        premier_points: premierPoints,
        kd_ratio: kd,
        win_rate: winRate,
        role: calculatedRole,
        stat_mira,
        stat_nocao,
        stat_utilitaria,
        stat_movimentacao,
        stat_impacto
      });
      
    } catch (e) {
      console.error(`Erro ao atualizar ${player.name}`, e);
    }
  }

  // Fazemos um upsert (atualiza se tiver ID, insere se não tiver)
  const { data, error } = await supabase.from('interested_players').upsert(updatedPlayers);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, count: updatedPlayers.length });
}

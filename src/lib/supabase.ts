import { createClient } from '@supabase/supabase-js';
import type { CaptainProfile, InterestedPlayer } from '@/types';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return (
    supabaseUrl.length > 0 &&
    !supabaseUrl.includes('seu-projeto') &&
    supabaseAnonKey.length > 0 &&
    !supabaseAnonKey.includes('sua-chave')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const FIXED_CAPTAINS: CaptainProfile[] = [
  {
    id: 'cap-gusta',
    name: 'Gusta',
    team_name: 'TIME GUSTA',
    steam_id: 'https://steamcommunity.com/id/gusta',
    avatar_url: '/captains/gusta.png',
    color: '#f59e0b',
    premier_points: 30000,
  },
  {
    id: 'cap-hps',
    name: 'HPS',
    team_name: 'TIME HPS',
    steam_id: 'https://steamcommunity.com/id/hps',
    avatar_url: '/captains/hps.png',
    color: '#3b82f6',
    premier_points: 25000,
  },
  {
    id: 'cap-leo',
    name: 'Léo',
    team_name: 'TIME LÉO',
    steam_id: 'https://steamcommunity.com/id/leo',
    avatar_url: '/captains/leo.png',
    color: '#ef4444',
    premier_points: 25000,
  },
  {
    id: 'cap-zane',
    name: 'Zane',
    team_name: 'TIME ZANE',
    steam_id: 'https://steamcommunity.com/id/zane',
    avatar_url: '/captains/zane.png',
    color: '#a855f7',
    premier_points: 25000,
  },
];

export async function getCaptains(): Promise<CaptainProfile[]> {
  return FIXED_CAPTAINS;
}

export async function getInterestedPlayers(): Promise<InterestedPlayer[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('interested_players').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as InterestedPlayer[];
    } catch (e) {
      console.error("Error fetching interested players:", e);
    }
  }
  return [];
}

export async function registerInterestedPlayer(
  player: Omit<InterestedPlayer, 'id' | 'created_at'>
): Promise<{ success: boolean; data?: InterestedPlayer; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('interested_players').insert([player]).select();
      if (error) throw error;
      if (data) return { success: true, data: data[0] };
    } catch (e: unknown) {
      console.error("Error registering interested player:", e);
      return { success: false, error: (e as Error).message || "Erro desconhecido ao registrar interesse." };
    }
  }
  return { success: false, error: "Banco de dados não configurado." };
}

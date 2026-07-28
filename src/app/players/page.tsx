import React from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { PlayersMasterDetail } from '@/components/player/PlayersMasterDetail';

export const revalidate = 0; // Disable cache so we always see new players/roles

export default async function PlayersListPage() {
  let players = [];
  
  if (isSupabaseConfigured() && supabase) {
    const { data } = await supabase.from('interested_players').select('*').order('premier_points', { ascending: false });
    if (data) players = data;
  }

  return (
    <div className="h-screen w-full bg-[#161616] overflow-hidden">
      <PlayersMasterDetail players={players} />
    </div>
  );
}

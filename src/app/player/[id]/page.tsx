import React from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { PlayerRadarChart } from '@/components/player/RadarChart';
import { ArrowLeft, Trophy, Crosshair, Target, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

// Helper for extracting avatar from steam URL (basic fallback)
// If the player profile doesn't have an avatar URL, we'll use a placeholder or try to extract it
function getAvatarUrl(steamUrl: string) {
  // We don't have the steam avatar directly from DB yet, so we use a cool placeholder
  // that matches the "cutout" aesthetic from the reference image.
  return '/captains/default.png'; 
}

export default async function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params before using its properties
  const { id } = await params;

  if (!isSupabaseConfigured() || !supabase) {
    return <div className="text-white p-10">Supabase não configurado.</div>;
  }

  const { data: player, error } = await supabase
    .from('interested_players')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !player) {
    notFound();
  }

  // Extract Steam ID from the URL stored in DB
  const steamIdMatch = player.steam_id ? player.steam_id.match(/\d{17}/) : null;
  const rawSteamId = steamIdMatch ? steamIdMatch[0] : null;

  // Fetch match history from CSStats via Parse.bot
  let matches = [];
  if (rawSteamId && process.env.PARSE_API_KEY) {
    try {
      const res = await fetch(`https://api.parse.bot/scraper/758b30c6-74c7-46ea-a4fb-2efd60740f7c/get_player_matches?steam_id=${rawSteamId}`, {
        headers: { 'X-API-Key': process.env.PARSE_API_KEY, 'API-Snapshot-Version': '6' },
        next: { revalidate: 3600 } // cache for 1 hour
      });
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && json.data && json.data.matches) {
          matches = json.data.matches;
        }
      }
    } catch (e) {
      console.error("Failed to fetch matches:", e);
    }
  }

  // Derive stats (since we saved Rating in premier_points like 13900 = 1.39)
  const basePoints = player.premier_points || 10000;
  const rating = basePoints / 10000;
  // Mock KD based on rating for the visual
  const kd = (rating - 0.1).toFixed(2);
  const winRate = Math.min(Math.round((rating / 1.5) * 100), 100);

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8 font-rajdhani selection:bg-amber-500/30">
      <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-wider">Voltar</span>
      </Link>

      {/* Main Dashboard Card */}
      <div className="w-full max-w-[1400px] mx-auto rounded-3xl overflow-hidden relative shadow-2xl shadow-blue-900/20 border border-white/10"
           style={{
             background: 'linear-gradient(135deg, #1e1b4b 0%, #172554 50%, #0f172a 100%)'
           }}>
        
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-12">
          
          {/* Left: Player Avatar (Cutout Style) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent z-10 rounded-3xl" />
            
            {/* We use a stylized frame since we don't have exact transparent cutouts yet */}
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(139,92,246,0.3)] bg-slate-900 flex items-center justify-center">
               <div className="text-8xl font-oswald text-white/20">
                 {player.player_name.charAt(0).toUpperCase()}
               </div>
            </div>

            <div className="relative z-20 mt-6 text-center">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-3">
                 <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                 <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Draft Eligible</span>
               </div>
               <h1 className="text-4xl sm:text-5xl font-oswald font-black text-white uppercase tracking-tight shadow-black drop-shadow-lg">
                 {player.player_name}
               </h1>
            </div>
          </div>

          {/* Center: Radar Chart */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <h3 className="text-center font-oswald font-bold text-slate-400 uppercase tracking-widest mb-4">Análise de Atributos</h3>
            <div className="w-full max-w-[400px] aspect-square">
               <PlayerRadarChart rating={rating} />
            </div>
          </div>

          {/* Right: Stats Grid */}
          <div className="lg:col-span-4 flex flex-col justify-center gap-6">
            
            {/* Primary Highlight Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-amber-500 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-900 shadow-lg shadow-amber-500/20">
                <Trophy className="w-6 h-6 mb-2 opacity-80" />
                <span className="text-sm font-bold uppercase tracking-wider opacity-80">Rating</span>
                <span className="text-3xl font-oswald font-black">{rating.toFixed(2)}</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/10 backdrop-blur-md">
                <Target className="w-6 h-6 mb-2 text-slate-400" />
                <span className="text-sm font-bold uppercase tracking-wider text-slate-400">K/D</span>
                <span className="text-3xl font-oswald font-black text-white">{kd}</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/10 backdrop-blur-md">
                <Activity className="w-6 h-6 mb-2 text-slate-400" />
                <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Win %</span>
                <span className="text-3xl font-oswald font-black text-white">{winRate}%</span>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md flex flex-col">
                 <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Função Primária</span>
                 <span className="text-xl font-oswald font-bold text-white flex items-center gap-2">
                   <Crosshair className="w-4 h-4 text-blue-400" /> {player.role || 'Flex'}
                 </span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md flex flex-col">
                 <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Capitão de Preferência</span>
                 <span className="text-xl font-oswald font-bold text-white uppercase">{player.captain_name}</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md flex flex-col col-span-2">
                 <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Perfil Steam</span>
                 <a href={player.steam_id} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-400 hover:text-blue-300 truncate">
                   {player.steam_id}
                 </a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom: Recent Matches Table (Glassmorphism) */}
        <div className="relative z-10 p-6 lg:p-12 border-t border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-oswald font-bold text-xl text-white uppercase tracking-wider">Histórico de Partidas</h3>
            <span className="text-xs font-bold uppercase text-slate-400 bg-white/10 px-3 py-1 rounded-full">Temporada Atual</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-4">Data</th>
                  <th className="pb-3 px-4">Mapa</th>
                  <th className="pb-3 px-4">Resultado</th>
                  <th className="pb-3 px-4 text-center">K - D - A</th>
                  <th className="pb-3 px-4 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="text-sm font-semibold text-slate-300">
                {matches.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      <Zap className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      Nenhuma partida recente encontrada no Premier.
                    </td>
                  </tr>
                ) : (
                  matches.map((match: any, index: number) => {
                    const isWin = parseInt(match.score.split(':')[0]) > parseInt(match.score.split(':')[1]);
                    return (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-4 font-rajdhani whitespace-nowrap">{match.date}</td>
                        <td className="py-4 px-4 uppercase text-amber-400 font-bold">{match.map.replace('de_', '')}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${isWin ? 'bg-green-500/20 text-green-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {match.score}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center font-mono">
                          <span className="text-white">{match.k}</span> / <span className="text-rose-400">{match.d}</span> / <span className="text-slate-400">{match.a}</span>
                        </td>
                        <td className={`py-4 px-4 text-center font-bold ${parseFloat(match.rating) >= 1.0 ? 'text-green-400' : 'text-rose-400'}`}>
                          {match.rating}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </main>
  );
}

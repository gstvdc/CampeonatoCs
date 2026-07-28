'use client';

import React, { useState, useEffect } from 'react';
import { CS2Badge } from '@/components/CS2Badge';
import { Swords, Crosshair, Brain, Zap, ShieldPlus, EyeOff, Anchor, RefreshCw, Trophy, Target, Activity, X, Search, Home, Users, LayoutList, ChevronLeft } from 'lucide-react';
import { PlayerRadarChart } from './RadarChart';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Link from 'next/link';

export const PlayersMasterDetail = ({ players }: { players: any[] }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [liveStats, setLiveStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'jogadores' | 'capitaes'>('jogadores');
  const [resultsPerPage, setResultsPerPage] = useState('20');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Erro ao sincronizar dados');
        setIsSyncing(false);
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao sincronizar dados');
      setIsSyncing(false);
    }
  };

  const filteredAndSearchedPlayers = players.filter(p => {
    const matchesSearch = p.player_name.toLowerCase().includes(searchQuery.toLowerCase());
    const isCaptain = ['GUSTA', 'HPS', 'SOUZ', 'ZANE'].includes(p.player_name.toUpperCase());
    
    if (activeTab === 'capitaes') {
      return matchesSearch && isCaptain;
    }
    return matchesSearch && !isCaptain;
  });

  const handlePrevPlayer = () => {
    if (!selectedPlayer) return;
    const currentIndex = filteredAndSearchedPlayers.findIndex(p => p.id === selectedPlayer.id);
    if (currentIndex > 0) {
      setSelectedPlayer(filteredAndSearchedPlayers[currentIndex - 1]);
    }
  };

  const handleNextPlayer = () => {
    if (!selectedPlayer) return;
    const currentIndex = filteredAndSearchedPlayers.findIndex(p => p.id === selectedPlayer.id);
    if (currentIndex !== -1 && currentIndex < filteredAndSearchedPlayers.length - 1) {
      setSelectedPlayer(filteredAndSearchedPlayers[currentIndex + 1]);
    }
  };

  const renderRole = (role: string) => {
    if (!role) return null;
    const r = role.toLowerCase();
    let Icon = Swords;
    if (r === 'awper') Icon = Crosshair;
    else if (r === 'igl') Icon = Brain;
    else if (r === 'entry fragger') Icon = Zap;
    else if (r === 'support') Icon = ShieldPlus;
    else if (r === 'lurker') Icon = EyeOff;
    else if (r === 'anchor') Icon = Anchor;
    else if (r === 'flex') Icon = RefreshCw;

    return (
      <div className="flex items-center gap-2" title={`Função: ${role}`}>
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-slate-300 font-rajdhani font-bold text-sm uppercase tracking-widest">
          {role}
        </span>
      </div>
    );
  };

  useEffect(() => {
    if (selectedPlayer) {
      // Reset state for new player
      setLoadingMatches(true);
      setLoadingStats(true);
      const steamIdMatch = selectedPlayer.steam_id ? selectedPlayer.steam_id.match(/\d{17}/) : null;
      const rawSteamId = steamIdMatch ? steamIdMatch[0] : null;
      
      if (rawSteamId) {
        // Fetch live stats (radar + hs% + recent matches)
        fetch(`/api/player-stats?steam_id=${rawSteamId}`)
          .then(r => r.json())
          .then(data => {
            if (data.success && data.stats) {
              setLiveStats(data.stats);
              setMatches(data.stats.recentMatches || []);
            }
          })
          .catch(e => console.error(e))
          .finally(() => {
            setLoadingStats(false);
            setLoadingMatches(false);
          });
      }
    }
  }, [selectedPlayer]);

  let rating = 1.00;
  let kd = "1.00";
  if (selectedPlayer) {
    const basePoints = selectedPlayer.premier_points || 0;
    rating = basePoints > 0 ? basePoints / 10000 : 0;
    kd = selectedPlayer.kd_ratio ? Number(selectedPlayer.kd_ratio).toFixed(2) : "0.00";
  }

  return (
    <div className="flex h-full w-full bg-[#18181b] text-slate-300 font-rajdhani overflow-hidden selection:bg-amber-500/30">
      
      {/* Sidebar */}
      <aside className="w-16 sm:w-[72px] border-r border-white/5 flex flex-col items-center py-6 bg-[#121214] flex-none z-20 shadow-xl">
        <Link href="/" className="mb-8 hover:scale-105 transition-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Copa LM" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
        </Link>
        
        <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-4">Menu</div>
        
        <nav className="flex flex-col gap-4 w-full items-center">
          <Link href="/" className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Voltar para Início">
            <Home className="w-5 h-5" />
          </Link>
          <div className="p-2.5 text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg transition-colors" title="Inscritos">
            <Users className="w-5 h-5" />
          </div>
          <Link href="/#draft" className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Draft">
            <LayoutList className="w-5 h-5" />
          </Link>
        </nav>
      </aside>

      {/* Middle: Master List */}
      <div className={`flex-1 flex flex-col h-full bg-[#18181b] transition-all duration-300 ${selectedPlayer ? 'hidden lg:flex' : 'flex'}`}>
        
        {/* Search & Header */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-4 text-slate-400 mb-6">
            <Link href="/" className="p-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 hover:text-white transition">
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div className="flex-1 max-w-sm relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121214] border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-600 font-bold"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] font-mono font-bold text-slate-600">
                <span className="px-1.5 py-0.5 bg-white/5 rounded">CTRL</span>
                <span>+</span>
                <span className="px-1.5 py-0.5 bg-white/5 rounded">K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            <span>Jogadores</span> 
            <span className="text-slate-700">/</span> 
            <span className="text-amber-500/80">Busca Avançada</span>
          </div>
          
          <h1 className="text-3xl font-oswald font-black text-white uppercase tracking-wide mb-6">
            {searchQuery ? `Resultados para "${searchQuery}"` : 'Todos os Inscritos'}
          </h1>
          
          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-white/5 text-xs font-bold uppercase tracking-wider">
            <button 
              onClick={() => setActiveTab('jogadores')}
              className={`pb-4 transition-colors ${activeTab === 'jogadores' ? 'text-white border-b-2 border-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Jogadores
            </button>
            <button 
              onClick={() => setActiveTab('capitaes')}
              className={`pb-4 transition-colors ${activeTab === 'capitaes' ? 'text-white border-b-2 border-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Capitães
            </button>
          </div>
        </div>

        {/* List Actions */}
        <div className="px-6 py-4 flex items-center gap-4 text-xs font-bold text-slate-400">
          <span>{filteredAndSearchedPlayers.length} Resultados</span>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded bg-[#121214] hover:bg-white/5 hover:text-white transition-colors uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            Adicionar à lista
          </button>
          
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3 py-1.5 border border-amber-500/30 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition-colors uppercase tracking-wider ml-auto disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Dados Reais'}
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-4">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="pb-3 px-4 w-8"></th>
                <th className="pb-3 px-4 w-[250px]">Jogador</th>
                <th className="pb-3 px-4">K/D Ratio</th>
                <th className="pb-3 px-4">Win Rate</th>
                <th className="pb-3 px-4">Função</th>
                <th className="pb-3 px-4 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="text-sm font-semibold text-slate-300">
              {filteredAndSearchedPlayers.map(player => (
                <tr 
                  key={player.id} 
                  onClick={() => setSelectedPlayer(player)}
                  className={`border-b border-white/5 transition-colors cursor-pointer group ${selectedPlayer?.id === player.id ? 'bg-white/5 border-l-2 border-l-amber-500' : 'hover:bg-white/5 border-l-2 border-l-transparent'}`}
                >
                  <td className="py-3 px-4 text-slate-700 font-mono text-xs">
                    {/* Fake checkbox/icon placeholder */}
                    <div className="w-4 h-4 rounded border border-white/10 group-hover:border-white/30 transition-colors"></div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded bg-[#121214] border border-white/10 flex items-center justify-center font-oswald text-base text-slate-400 shadow-inner group-hover:border-amber-500/30 transition-colors">
                        {player.player_name.charAt(0).toUpperCase()}
                      </div>
                      <span className={`font-oswald font-bold text-base tracking-wide transition-colors ${selectedPlayer?.id === player.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                        {player.player_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-oswald font-black text-white">{player.kd_ratio ? Number(player.kd_ratio).toFixed(2) : "0.00"}</span>
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-rajdhani font-bold">
                    {player.win_rate ? player.win_rate : "0"}%
                  </td>
                  <td className="py-3 px-4">
                    {player.role ? (
                      <div className="inline-flex px-2 py-1 rounded bg-[#121214] border border-white/5">
                        {renderRole(player.role)}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right flex justify-end">
                    <div className="scale-75 origin-right">
                      <CS2Badge points={player.premier_points || 0} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 px-6 border-t border-white/5 flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-[#18181b] z-10">
          <span>Resultados por página</span>
          <select 
            value={resultsPerPage}
            onChange={(e) => setResultsPerPage(e.target.value)}
            className="bg-[#121214] border border-white/10 rounded px-3 py-1.5 outline-none hover:border-white/20 transition-colors cursor-pointer"
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      {/* Right Side: Detail Panel */}
      {selectedPlayer && (
        <div className="w-full lg:w-[450px] lg:min-w-[450px] bg-[#1c1c1e] border-l border-white/5 flex flex-col h-full absolute inset-0 z-50 lg:relative lg:z-auto transition-transform duration-300 shadow-2xl lg:shadow-none">
          
          {/* Panel Header Actions */}
          <div className="px-6 py-4 flex justify-between items-center bg-[#1c1c1e]">
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedPlayer(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors lg:hidden"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handlePrevPlayer}
                    disabled={filteredAndSearchedPlayers.findIndex(p => p.id === selectedPlayer.id) === 0}
                    className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleNextPlayer}
                    disabled={filteredAndSearchedPlayers.findIndex(p => p.id === selectedPlayer.id) === filteredAndSearchedPlayers.length - 1}
                    className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
             </div>
            <button 
              onClick={() => setSelectedPlayer(null)}
              className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
            
            {/* Player Info Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#18181b] to-[#121214] border border-white/10 flex items-center justify-center font-oswald text-3xl text-amber-500 shadow-inner">
                {selectedPlayer.player_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-oswald font-black text-white uppercase tracking-wide">
                  {selectedPlayer.player_name}
                </h2>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {selectedPlayer.role || 'Player'} <span className="text-slate-600 mx-1">•</span> Copa Lucas Moura
                </div>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex items-center gap-6 border-b border-white/5 text-xs font-bold uppercase tracking-wider mb-6">
              <button className="pb-3 text-white border-b-2 border-white">Overview</button>
              <button className="pb-3 text-slate-500 hover:text-slate-300 transition-colors">Stats Performance</button>
              <button className="pb-3 text-slate-500 hover:text-slate-300 transition-colors">Matches</button>
            </div>

            <div className="space-y-6">
              
              {/* Leetify Stats Dashboard */}
              <div className="mb-8 bg-[#121214] border border-white/5 rounded-xl p-6 relative">
                 {loadingStats && (
                   <div className="absolute inset-0 bg-[#121214]/80 flex items-center justify-center z-10 rounded-xl">
                      <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
                   </div>
                 )}
                 <div className="flex flex-col gap-6">
                    {/* Top Row: Win Rate & Leetify Ratings */}
                    <div className="flex flex-row items-center justify-between px-2 sm:px-10 border-b border-white/5 pb-6">
                       <CircularProgress 
                         title="Win Rate" 
                         value={selectedPlayer?.win_rate ? `${selectedPlayer.win_rate}%` : "-"} 
                         percentage={selectedPlayer?.win_rate || 0} 
                         color={selectedPlayer?.win_rate >= 50 ? '#10b981' : '#f59e0b'} 
                         subtitle={selectedPlayer?.win_rate >= 55 ? 'Great' : selectedPlayer?.win_rate >= 50 ? 'Good' : 'Subpar'}
                         size="large"
                       />
                       
                       <CircularProgress 
                         title="Leetify Rating" 
                         value={liveStats ? (liveStats.leetifyRating > 0 ? `+${liveStats.leetifyRating.toFixed(2)}` : liveStats.leetifyRating.toFixed(2)) : "-"} 
                         percentage={liveStats ? Math.min(Math.max((liveStats.leetifyRating + 5) * 10, 0), 100) : 0} 
                         color={liveStats?.leetifyRating >= 1.0 ? '#10b981' : liveStats?.leetifyRating >= -1.0 ? '#f59e0b' : '#ef4444'} 
                         subtitle={liveStats?.leetifyRating >= 1.0 ? 'Great' : liveStats?.leetifyRating >= -1.0 ? 'Average' : 'Subpar'}
                         size="large"
                       />

                       <div className="flex flex-col gap-4">
                         <CircularProgress 
                           title="T Rating" 
                           value={liveStats ? (liveStats.tRating > 0 ? `+${liveStats.tRating.toFixed(2)}` : liveStats.tRating.toFixed(2)) : "-"} 
                           percentage={liveStats ? Math.min(Math.max((liveStats.tRating + 5) * 10, 0), 100) : 0} 
                           color={liveStats?.tRating >= 0 ? '#f59e0b' : '#64748b'} 
                         />
                         <CircularProgress 
                           title="CT Rating" 
                           value={liveStats ? (liveStats.ctRating > 0 ? `+${liveStats.ctRating.toFixed(2)}` : liveStats.ctRating.toFixed(2)) : "-"} 
                           percentage={liveStats ? Math.min(Math.max((liveStats.ctRating + 5) * 10, 0), 100) : 0} 
                           color={liveStats?.ctRating >= 0 ? '#3b82f6' : '#64748b'} 
                         />
                       </div>
                    </div>

                    {/* Bottom Row: Additional Stats */}
                    <div className="flex flex-row items-center justify-between px-2 sm:px-6">
                       <CircularProgress 
                         title="Headshot Accuracy" 
                         value={liveStats ? `${liveStats.hsPercentage}%` : "-"} 
                         percentage={liveStats?.hsPercentage || 0} 
                         color={liveStats?.hsPercentage >= 25 ? '#10b981' : '#f59e0b'} 
                       />
                       <CircularProgress 
                         title="Time to Damage" 
                         value={liveStats ? `${liveStats.timeToDamage}ms` : "-"} 
                         percentage={liveStats ? Math.max(100 - ((liveStats.timeToDamage - 450) / 250) * 100, 0) : 0} 
                         color={liveStats?.timeToDamage <= 500 ? '#10b981' : '#f59e0b'} 
                       />
                       <CircularProgress 
                         title="Crosshair Placement" 
                         value={liveStats ? `${liveStats.crosshairPlacement}°` : "-"} 
                         percentage={liveStats ? Math.max(100 - ((liveStats.crosshairPlacement - 5) / 10) * 100, 0) : 0} 
                         color={liveStats?.crosshairPlacement <= 8 ? '#10b981' : '#f59e0b'} 
                       />
                    </div>
                 </div>
              </div>

              {/* Position / Radar Chart */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Position & Attributes</h3>
                     <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/5">Highlight v.</span>
                  </div>
                  <div className="bg-[#121214] border border-white/5 rounded-xl p-4 flex flex-col items-center h-[260px] relative">
                     {loadingStats && (
                       <div className="absolute inset-0 bg-[#121214]/80 flex items-center justify-center z-10 rounded-xl">
                          <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
                       </div>
                     )}
                     <PlayerRadarChart 
                       rating={rating} 
                       mira={liveStats?.mira || selectedPlayer?.stat_mira}
                       nocao={liveStats?.nocao || selectedPlayer?.stat_nocao}
                       utilitaria={liveStats?.utilitaria || selectedPlayer?.stat_utilitaria}
                       movimentacao={liveStats?.movimentacao || selectedPlayer?.stat_movimentacao}
                       impacto={liveStats?.impacto || selectedPlayer?.stat_impacto}
                     />
                  </div>
                </div>

              {/* Match History Chart */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Últimas 10 Partidas (Rating)</h3>
                <div className="bg-[#121214] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center h-[200px]">
                  {loadingMatches ? (
                     <RefreshCw className="w-6 h-6 animate-spin text-slate-500" />
                  ) : matches && matches.length > 0 ? (
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={matches.map((m: any, i: number) => {
                          const rating = m.leetify_rating || 0;
                          return { name: `M${matches.length - i}`, Rating: Number(rating.toFixed(2)), Outcome: m.outcome };
                        }).reverse()}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis domain={['auto', 'auto']} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#121214', borderColor: '#ffffff10', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#f59e0b' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Rating" 
                            stroke="#f59e0b" 
                            strokeWidth={2} 
                            dot={(props: any) => {
                               const { cx, cy, payload } = props;
                               const color = payload.Outcome === 'win' ? '#10b981' : payload.Outcome === 'loss' ? '#ef4444' : '#64748b';
                               return <circle cx={cx} cy={cy} r={4} fill={color} stroke="#121214" strokeWidth={2} key={payload.name} />;
                            }}
                            activeDot={{ r: 6 }} 
                          />
                        </LineChart>
                     </ResponsiveContainer>
                  ) : (
                    <>
                      <Activity className="w-6 h-6 text-slate-500 mb-2 opacity-20" />
                      <span className="text-[10px] font-black tracking-widest text-slate-600 uppercase">Nenhuma Partida Registrada</span>
                    </>
                  )}
                </div>
              </div>

              {/* Match History List */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Recent Matches</h3>
                <div className="bg-[#121214] border border-white/5 rounded-xl overflow-hidden">
                  {loadingMatches ? (
                     <div className="p-8 text-center text-slate-500 text-xs font-bold animate-pulse uppercase tracking-wider">
                       Buscando histórico...
                     </div>
                  ) : matches.length === 0 ? (
                     <div className="p-8 text-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                       <Activity className="w-5 h-5 mx-auto mb-2 opacity-30" />
                       Nenhuma partida
                     </div>
                  ) : (
                    <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                      {matches.map((match: any, index: number) => {
                        const isWin = match.outcome === 'win';
                        const isTie = match.outcome === 'tie';
                        const scoreStr = match.score && match.score.length >= 2 ? `${match.score[0]}:${match.score[1]}` : 'N/A';
                        
                        return (
                          <div key={index} className="flex items-center justify-between p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <div>
                              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded mr-2 ${isWin ? 'bg-green-500/20 text-green-400' : isTie ? 'bg-slate-500/20 text-slate-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                {scoreStr}
                              </span>
                              <span className="font-rajdhani text-xs font-bold text-slate-300 uppercase">
                                {match.map_name ? match.map_name.replace('de_', '') : 'Unknown'}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="block font-mono text-[10px] text-white">
                                Rating: <span className={match.leetify_rating > 0 ? "text-green-400" : "text-rose-400"}>{match.leetify_rating > 0 ? '+' : ''}{(match.leetify_rating || 0).toFixed(2)}</span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

  // Circular Progress component for dashboard
  const CircularProgress = ({ title, value, percentage, color, subtitle, size = 'normal' }: any) => {
    const radius = size === 'large' ? 44 : 26;
    const stroke = size === 'large' ? 6 : 4;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center justify-center">
        <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3 h-6 text-center max-w-[80px] leading-tight">{title}</span>
        <div className="relative flex items-center justify-center mb-1">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90 drop-shadow-lg">
            <circle
              stroke="#ffffff08"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke={color}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`font-oswald font-black text-white ${size === 'large' ? 'text-3xl' : 'text-sm'}`}>
              {value}
            </span>
          </div>
        </div>
        {subtitle && <span className={`font-bold mt-2 ${size === 'large' ? 'text-sm' : 'text-[10px]'}`} style={{ color }}>{subtitle}</span>}
      </div>
    );
  };

// A simple missing icon
const ExternalLinkIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

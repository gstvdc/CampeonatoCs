'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

const MAPS = [
  { name: 'Mirage', bg: 'from-orange-500/20 to-yellow-600/20', img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop' },
  { name: 'Dust 2', bg: 'from-amber-500/20 to-orange-700/20', img: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop' },
  { name: 'Anubis', bg: 'from-yellow-600/20 to-stone-700/20', img: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=800&auto=format&fit=crop' },
  { name: 'Inferno', bg: 'from-red-500/20 to-orange-600/20', img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800&auto=format&fit=crop' },
  { name: 'Vertigo', bg: 'from-sky-500/20 to-blue-700/20', img: 'https://images.unsplash.com/photo-1541888075865-985bb0479708?q=80&w=800&auto=format&fit=crop' },
  { name: 'Ancient', bg: 'from-emerald-500/20 to-green-800/20', img: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop' },
  { name: 'Nuke', bg: 'from-blue-400/20 to-cyan-700/20', img: 'https://images.unsplash.com/photo-1559828738-f99a9a08419f?q=80&w=800&auto=format&fit=crop' }
];

export function VetoRoom({ initialRoom }: { initialRoom: any }) {
  const [room, setRoom] = useState(initialRoom);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));

    const channel = supabase.channel(`veto-${room.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'match_vetoes', filter: `id=eq.${room.id}` }, (payload) => {
        setRoom(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [room.id]);

  const handleMapClick = async (mapName: string) => {
    if (room.status === 'completed') return;
    if (room.current_turn !== userId) return alert('Não é o seu turno!');
    if (room.actions.some((a: any) => a.map === mapName)) return;

    const isMD3 = room.format === 'MD3';
    const actionCount = room.actions.length;

    let actionType = 'ban';
    if (isMD3) {
      if (actionCount === 2 || actionCount === 3) {
        actionType = 'pick';
      }
    }

    const newActions = [...room.actions, { action: actionType, map: mapName, by: userId }];
    
    let nextTurn = room.current_turn === room.captain1_id ? room.captain2_id : room.captain1_id;
    
    const remainingMaps = MAPS.filter(m => !newActions.some(a => a.map === m.name));
    
    let finalStatus = 'in_progress';
    
    if (remainingMaps.length === 1) {
      newActions.push({ action: 'pick', map: remainingMaps[0].name, by: 'system' });
      finalStatus = 'completed';
      nextTurn = null;
    }

    await supabase.from('match_vetoes').update({
      actions: newActions,
      current_turn: nextTurn,
      status: finalStatus
    }).eq('id', room.id);
  };

  const getCaptainName = (id: string | null) => {
    if (!id) return 'Sistema';
    return id === room.captain1_id ? 'Capitão 1' : 'Capitão 2';
  };

  const isMyTurn = room.current_turn === userId && room.status !== 'completed';
  const turnLabel = room.status === 'completed' ? 'Veto Finalizado' : `Turno de: ${getCaptainName(room.current_turn)}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-white font-rajdhani p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mt-8 md:mt-12 mb-12">
          <h1 className="text-5xl md:text-6xl font-black font-oswald uppercase tracking-wider bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            Veto de Mapas ({room.format})
          </h1>
          
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border backdrop-blur-md transition-colors ${
            room.status === 'completed' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : isMyTurn 
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                : 'bg-white/5 border-white/10 text-gray-300'
          }`}>
            {room.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            <span className="text-xl font-bold uppercase tracking-wide">{turnLabel}</span>
            {isMyTurn && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>}
          </div>
        </div>

        {/* Maps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MAPS.map(map => {
            const action = room.actions.find((a: any) => a.map === map.name);
            const isBanned = action?.action === 'ban';
            const isPicked = action?.action === 'pick';
            const isSelectable = !action && room.status !== 'completed' && isMyTurn;

            return (
              <div 
                key={map.name} 
                onClick={() => handleMapClick(map.name)}
                className={`group relative h-48 md:h-64 rounded-2xl overflow-hidden transition-all duration-500 ${
                  isSelectable ? 'cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'cursor-default'
                } ${action ? 'ring-2 ring-offset-2 ring-offset-[#0a0a0a]' : 'ring-1 ring-white/10'} ${
                  isBanned ? 'ring-rose-500/50' : isPicked ? 'ring-emerald-500/50' : ''
                }`}
              >
                {/* Background Image & Gradient */}
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${!action ? 'group-hover:scale-110' : ''} ${action ? 'opacity-30 grayscale' : 'opacity-60'}`}
                  style={{ backgroundImage: `url(${map.img})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent`} />
                <div className={`absolute inset-0 bg-gradient-to-br ${map.bg} mix-blend-overlay`} />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className={`text-3xl font-black uppercase tracking-wider drop-shadow-lg ${action ? 'text-gray-400' : 'text-white'}`}>
                    {map.name}
                  </h3>
                </div>

                {/* Action Overlay */}
                {action && (
                  <div className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm ${
                    isBanned ? 'bg-rose-950/40' : 'bg-emerald-950/40'
                  }`}>
                    {isBanned ? (
                      <ShieldAlert className="w-16 h-16 text-rose-500 mb-2 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                    ) : (
                      <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    )}
                    <span className={`text-4xl font-black uppercase tracking-widest rotate-[-10deg] ${
                      isBanned ? 'text-rose-500' : 'text-emerald-500'
                    }`}>
                      {action.action}
                    </span>
                    <span className="mt-4 px-3 py-1 bg-black/50 rounded-full text-sm text-gray-300 backdrop-blur-md">
                      por {getCaptainName(action.by)}
                    </span>
                  </div>
                )}
                
                {/* Hover state for available maps */}
                {isSelectable && (
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 font-bold tracking-widest uppercase">
                      Selecionar
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

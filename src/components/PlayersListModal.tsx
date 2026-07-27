import React from 'react';
import { X, Users, Trophy, Trash2 } from 'lucide-react';
import type { InterestedPlayer } from '@/lib/supabase';

interface PlayersListModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: InterestedPlayer[];
}

export const PlayersListModal: React.FC<PlayersListModalProps> = ({
  isOpen,
  onClose,
  players,
}) => {
  if (!isOpen) return null;

  // Filtrar capitães da lista de inscritos, caso tenham se registrado
  const captainNames = ['gusta', 'hps', 'léo', 'leo', 'zane'];
  const filteredPlayers = players.filter(
    (p) => !captainNames.some((c) => p.player_name.toLowerCase().includes(c))
  ).sort((a, b) => b.premier_points - a.premier_points);

  const handleDelete = async (id: string, name: string) => {
    const password = window.prompt(`Digite a senha de administrador para remover ${name}:`);
    if (!password) return;

    try {
      const res = await fetch('/api/delete-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password })
      });
      const data = await res.json();

      if (data.success) {
        alert('Jogador removido com sucesso!');
        window.location.reload(); // Recarrega a página para atualizar a lista
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (err) {
      alert('Erro ao tentar remover o jogador.');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#111622] border border-amber-500/40 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b0e14]">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-oswald font-bold text-lg text-white uppercase">
                LISTA DE JOGADORES INSCRITOS
              </h3>
              <p className="text-xs font-rajdhani font-bold text-amber-400 uppercase">
                {filteredPlayers.length} JOGADORES DISPONÍVEIS PARA O DRAFT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-10">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-rajdhani text-lg">
                Nenhum jogador inscrito no momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPlayers.map((player) => (
                <div 
                  key={player.id} 
                  className="bg-[#0b0e14] border border-slate-700/50 p-4 rounded-lg flex flex-col gap-2 hover:border-amber-500/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-oswald font-bold text-white text-lg truncate pr-2">
                      {player.player_name}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-[#161b26] px-2 py-0.5 rounded border border-amber-500/20 text-amber-400 font-rajdhani font-bold text-xs whitespace-nowrap">
                        <Trophy className="w-3 h-3" />
                        {player.premier_points.toLocaleString('pt-BR')} PTS
                      </div>
                      <button
                        onClick={() => handleDelete(player.id, player.player_name)}
                        className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                        title="Remover inscrito"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs font-rajdhani font-bold text-slate-400">
                    <span className="uppercase">
                      Pref: <span className="text-slate-200">{player.captain_name}</span>
                    </span>
                    {player.role && (
                      <span className="uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                        {player.role}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

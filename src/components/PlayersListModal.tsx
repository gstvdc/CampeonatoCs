import React from 'react';
import { X, Users, Trash2, Crosshair, Swords, Brain, Zap, ShieldPlus, EyeOff, Anchor, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { InterestedPlayer } from '@/types';
import { CS2Badge } from './CS2Badge';

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
  const router = useRouter();
  const [playerToDelete, setPlayerToDelete] = React.useState<{ id: string, name: string } | null>(null);
  const [deletePassword, setDeletePassword] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState('');
  
  const [shouldRender, setShouldRender] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  const renderRole = (role: string) => {
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
      <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity" title={`Função: ${role}`}>
        <Icon className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-slate-200 font-oswald text-xs uppercase tracking-widest">
          {role}
        </span>
      </div>
    );
  };

  if (!shouldRender) return null;

  const captainNames = ['gusta', 'hps', 'léo', 'leo', 'zane'];
  const filteredPlayers = players.filter(
    (p) => !captainNames.some((c) => p.player_name.toLowerCase().includes(c))
  ).sort((a, b) => b.premier_points - a.premier_points);

  const confirmDelete = async (id: string, name: string) => {
    setPlayerToDelete({ id, name });
    setDeletePassword('');
    setDeleteError('');
  };

  const executeDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerToDelete || !deletePassword) return;

    setIsDeleting(true);
    setDeleteError('');

    try {
      const res = await fetch('/api/delete-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: playerToDelete.id, password: deletePassword })
      });
      const data = await res.json();

      if (data.success) {
        setPlayerToDelete(null);
        router.refresh(); 
      } else {
        setDeleteError(data.error || 'Erro ao remover.');
      }
    } catch {
      setDeleteError('Erro inesperado ao remover jogador.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto transition-opacity duration-200 ease-out ${isVisible ? 'bg-black/90 opacity-100' : 'bg-black/0 opacity-0 pointer-events-none'}`}>
      <div className={`relative w-full max-w-3xl bg-[#111622] border border-amber-500/40 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)] my-8 transition-all duration-300 ease-out transform ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
        
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
                  className="group relative bg-gradient-to-br from-[#12161f] to-[#0a0c11] border border-slate-700/40 p-4 rounded-xl flex flex-col gap-1 hover:border-slate-500/60 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-500/30 group-hover:via-amber-500/40 to-transparent transition-colors"></div>

                  <div className="flex justify-between items-start relative z-10">
                    {player.steam_id ? (
                      <a
                        href={player.steam_id.startsWith('http') ? player.steam_id : `https://steamcommunity.com/id/${player.steam_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-oswald font-bold text-white hover:text-amber-400 text-xl tracking-wide truncate pr-2 hover:underline transition-colors flex items-center gap-2"
                        title="Ver perfil na Steam"
                      >
                        {player.player_name}
                      </a>
                    ) : (
                      <span className="font-oswald font-bold text-white text-xl tracking-wide truncate pr-2 group-hover:text-amber-400 transition-colors">
                        {player.player_name}
                      </span>
                    )}
                    <button
                      onClick={() => confirmDelete(player.id, player.player_name)}
                      className="p-1.5 rounded-md bg-rose-500/5 hover:bg-rose-500/20 text-rose-500/70 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Remover inscrito"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end mt-3 relative z-10">
                    <div>
                      {player.role && renderRole(player.role)}
                    </div>
                    <div>
                      <CS2Badge points={player.premier_points} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {playerToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 transition-opacity duration-200 ease-out">
          <div className="w-full max-w-sm bg-[#111622] border border-slate-700/60 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-[#0b0e14]">
              <h4 className="font-oswald font-bold text-white uppercase flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-500" />
                Remover Jogador
              </h4>
              <button
                onClick={() => setPlayerToDelete(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={executeDelete} className="p-5 space-y-4">
              <div>
                <p className="text-slate-300 font-rajdhani text-sm mb-3">
                  Digite a senha de administrador para remover <strong className="text-white">{playerToDelete.name}</strong>:
                </p>
                <input
                  type="password"
                  required
                  placeholder="Senha do administrador"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all"
                  autoFocus
                />
                {deleteError && (
                  <p className="text-rose-400 text-xs mt-2 font-bold">{deleteError}</p>
                )}
              </div>
              
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setPlayerToDelete(null)}
                  className="px-4 py-2 text-xs font-rajdhani font-bold uppercase text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isDeleting || !deletePassword}
                  className="px-4 py-2 text-xs font-rajdhani font-bold uppercase text-white bg-rose-600 hover:bg-rose-500 rounded transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Removendo...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

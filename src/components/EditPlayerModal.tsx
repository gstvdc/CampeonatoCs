import React, { useState, useEffect } from 'react';
import { Pencil, X, CheckCircle2, AlertCircle } from 'lucide-react';
import type { InterestedPlayer } from '@/lib/supabase';

interface EditPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: InterestedPlayer | null;
  onSuccess: () => void;
}

export const EditPlayerModal: React.FC<EditPlayerModalProps> = ({
  isOpen,
  onClose,
  player,
  onSuccess
}) => {
  const [playerForm, setPlayerForm] = useState({
    captain_name: 'Gusta',
    player_name: '',
    premier_points: '',
    steam_id: '',
    role: 'Rifler',
    player_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Load player data when modal opens
  useEffect(() => {
    if (player && isOpen) {
      setPlayerForm({
        captain_name: player.captain_name || 'Gusta',
        player_name: player.player_name || '',
        premier_points: player.premier_points?.toString() || '',
        steam_id: player.steam_id || '',
        role: player.role || 'Rifler',
        player_password: '', // Always require the password again
      });
      setSubmittedSuccess(false);
      setErrorMsg('');
    }
  }, [player, isOpen]);

  if (!isOpen || !player) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/edit-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: player.id,
          ...playerForm
        }),
      });

      const res = await response.json();

      if (response.ok && res.success) {
        setSubmittedSuccess(true);
        setTimeout(() => {
          onSuccess(); // Refresh and close
        }, 1500);
      } else {
        setErrorMsg(res.error || 'Erro ao atualizar dados.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Erro inesperado de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111622] border border-amber-500/40 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b0e14]">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-oswald font-bold text-lg text-white uppercase">
                EDITAR MEU CADASTRO
              </h3>
              <p className="text-xs font-rajdhani font-bold text-amber-400 uppercase">
                ATUALIZE SUAS INFORMAÇÕES DO DRAFT
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
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {submittedSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8 text-amber-500" />
              </div>
              <h4 className="font-oswald font-bold text-2xl text-white uppercase tracking-wide">
                DADOS ATUALIZADOS!
              </h4>
              <p className="text-slate-400 font-rajdhani text-lg">
                Suas informações foram salvas com sucesso no banco de dados.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-rajdhani font-semibold text-sm">{errorMsg}</p>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-oswald font-bold text-sm text-amber-400 uppercase tracking-widest border-b border-slate-800 pb-2">
                  <Pencil className="w-4 h-4" />
                  Altere seus dados
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Captain */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-rajdhani font-bold text-amber-400 uppercase mb-1">
                      Selecione o Capitão de Sua Preferência *
                    </label>
                    <select
                      value={playerForm.captain_name}
                      onChange={(e) => setPlayerForm({ ...playerForm, captain_name: e.target.value })}
                      className="w-full pl-4 pr-10 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all shadow-inner cursor-pointer"
                    >
                      <option value="Gusta">Capitão Gusta (Time Gusta)</option>
                      <option value="HPS">Capitão HPS (Time HPS)</option>
                      <option value="Léo">Capitão Léo (Time Léo)</option>
                      <option value="Zane">Capitão Zane (Time Zane)</option>
                      <option value="Qualquer">Qualquer Capitão (Sem preferência)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1">
                      Seu Nick / Nome *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: FalleN"
                      value={playerForm.player_name}
                      onChange={(e) => setPlayerForm({ ...playerForm, player_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all shadow-inner cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1">
                      Pontos no Premier (CS2) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Ex: 15000"
                      value={playerForm.premier_points}
                      onChange={(e) => setPlayerForm({ ...playerForm, premier_points: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all shadow-inner cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1">
                      ID ou Link da Steam *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="https://steamcommunity.com/id/seu-nick"
                      value={playerForm.steam_id}
                      onChange={(e) => setPlayerForm({ ...playerForm, steam_id: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all shadow-inner cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1">
                      Função Principal (Opcional)
                    </label>
                    <select
                      value={playerForm.role}
                      onChange={(e) => setPlayerForm({ ...playerForm, role: e.target.value })}
                      className="w-full pl-4 pr-10 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all shadow-inner cursor-pointer"
                    >
                      <option value="Rifler">Rifler</option>
                      <option value="AWPer">AWPer</option>
                      <option value="Entry Fragger">Entry Fragger</option>
                      <option value="Support">Support</option>
                      <option value="IGL">IGL (Líder em jogo)</option>
                    </select>
                  </div>

                  {/* Password Required to Save */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-rajdhani font-bold text-red-400 uppercase mb-1">
                      Sua Senha Pessoal (Obrigatória para confirmar) *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Digite a senha que você criou no cadastro"
                      value={playerForm.player_password}
                      onChange={(e) => setPlayerForm({ ...playerForm, player_password: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#0b0e14] border border-red-500/50 text-white font-rajdhani text-sm focus:border-red-400 focus:ring-1 focus:ring-red-400/50 focus:outline-none transition-all shadow-inner cursor-pointer"
                    />
                  </div>

                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded bg-slate-800 text-slate-300 font-rajdhani font-bold text-sm uppercase hover:bg-slate-700 cursor-pointer"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-oswald font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer active:scale-[0.98]"
                >
                  {loading ? 'PROCESSANDO...' : 'SALVAR ALTERAÇÕES'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { UserPlus, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { registerInterestedPlayer } from '@/lib/supabase';
import confetti from 'canvas-confetti';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Player "Tenho Interesse" Form State
  const [playerForm, setPlayerForm] = useState({
    captain_name: 'Gusta',
    player_name: '',
    premier_points: '',
    steam_id: '',
    role: 'Rifler',
  });

  if (!isOpen) return null;

  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!playerForm.player_name || !playerForm.premier_points || !playerForm.steam_id) {
      setErrorMsg('Por favor, preencha seu Nome/Nick, Pontos no Premier e ID/Link da Steam.');
      setLoading(false);
      return;
    }

    try {
      const res = await registerInterestedPlayer({
        captain_name: playerForm.captain_name,
        player_name: playerForm.player_name,
        premier_points: Number(playerForm.premier_points) || 0,
        steam_id: playerForm.steam_id,
        role: playerForm.role,
      });

      if (res.success) {
        setSubmittedSuccess(true);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#eab308', '#f97316'],
          });
        } catch (e) {}

        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setErrorMsg(res.error || 'Falha ao registrar interesse. Tente novamente.');
      }
    } catch (err: any) {
      setErrorMsg('Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111622] border border-amber-500/40 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b0e14]">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-oswald font-bold text-lg text-white uppercase">
                INSCRIÇÃO DA COPA LUCAS MOURA 2ª EDIÇÃO
              </h3>
              <p className="text-xs font-rajdhani font-bold text-amber-400 uppercase">
                DRAFT AO VIVO E TORNEIO • SÁBADO, DIA 08 DE AGOSTO
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
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-oswald font-bold text-2xl text-white uppercase">
                CADASTRO REALIZADO COM SUCESSO!
              </h4>
              <p className="text-slate-300 font-rajdhani font-semibold text-base max-w-md mx-auto">
                Seu interesse foi registrado no Draft! O capitão selecionado verá seu perfil para o sorteio no sábado, dia 08/08.
              </p>
              <button
                onClick={() => {
                  setSubmittedSuccess(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded bg-amber-500 text-black font-oswald font-bold text-xs uppercase hover:bg-amber-400 cursor-pointer"
              >
                VER NO SITE
              </button>
            </div>
          ) : (
            /* PLAYER "TENHO INTERESSE" FORM */
            <form onSubmit={handlePlayerSubmit} className="space-y-5">
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-rajdhani font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="font-oswald font-bold text-xs text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>CADASTRO DE INTERESSE PARA O DRAFT (SÁBADO 08/08)</span>
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
                      className="w-full px-4 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all shadow-inner"
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
                      className="w-full px-4 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all shadow-inner"
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
                      className="w-full px-4 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all shadow-inner"
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
                      className="w-full px-4 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1">
                      Função Principal (Opcional)
                    </label>
                    <select
                      value={playerForm.role}
                      onChange={(e) => setPlayerForm({ ...playerForm, role: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all shadow-inner"
                    >
                      <option value="Rifler">Rifler</option>
                      <option value="AWPer">AWPer</option>
                      <option value="Entry Fragger">Entry Fragger</option>
                      <option value="Support">Support</option>
                      <option value="IGL">IGL (Líder em jogo)</option>
                    </select>
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
                  {loading ? 'PROCESSANDO...' : 'CADASTRAR INTERESSE NO DRAFT'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

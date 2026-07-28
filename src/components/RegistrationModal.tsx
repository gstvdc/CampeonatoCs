import React, { useState, useEffect } from 'react';
import { UserPlus, X, CheckCircle2, AlertCircle, LogIn, Pencil } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getInterestedPlayers, InterestedPlayer } from '@/lib/supabase';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ModalMode = 'register' | 'login' | 'edit';

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<ModalMode>('register');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [players, setPlayers] = useState<InterestedPlayer[]>([]);

  // Player Form State (used for both register and edit)
  const [playerForm, setPlayerForm] = useState({
    id: '', // Used for edit
    captain_name: 'Qualquer',
    player_name: '',
    premier_points: '',
    steam_id: '',
    role: 'Rifler',
    player_password: '',
  });

  // Login State
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Fetch players when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode('register');
      setSubmittedSuccess(false);
      setErrorMsg('');
      setPlayerForm({
        id: '',
        captain_name: 'Qualquer',
        player_name: '',
        premier_points: '',
        steam_id: '',
        role: 'Rifler',
        player_password: '',
      });
      setLoginPassword('');
      setSelectedPlayerId('');
      
      const fetchPlayers = async () => {
        const data = await getInterestedPlayers();
        setPlayers(data);
      };
      fetchPlayers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!playerForm.player_name || !playerForm.premier_points || !playerForm.player_password) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerForm),
      });

      const res = await response.json();

      if (response.ok && res.success) {
        setSubmittedSuccess(true);
        triggerConfetti();
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setErrorMsg(res.error || 'Falha ao registrar interesse. Tente novamente.');
      }
    } catch {
      setErrorMsg('Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId || !loginPassword) {
      setErrorMsg('Selecione seu nome e digite a senha.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPlayerId, player_password: loginPassword }),
      });

      const res = await response.json();

      if (response.ok && res.success) {
        // Find player and populate form
        const p = players.find(p => p.id === selectedPlayerId);
        if (p) {
          setPlayerForm({
            id: p.id,
            captain_name: p.captain_name || 'Qualquer',
            player_name: p.player_name || '',
            premier_points: p.premier_points?.toString() || '',
            steam_id: p.steam_id || '',
            role: p.role || 'Rifler',
            player_password: loginPassword,
          });
          setMode('edit');
        }
      } else {
        setErrorMsg(res.error || 'Senha incorreta.');
      }
    } catch {
      setErrorMsg('Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/edit-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerForm),
      });

      const res = await response.json();

      if (response.ok && res.success) {
        setSubmittedSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setErrorMsg(res.error || 'Erro ao atualizar dados.');
      }
    } catch {
      setErrorMsg('Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#eab308', '#f97316'],
      });
    } catch { /* ignore */ }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
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

        {/* Mode Tabs */}
        {!submittedSuccess && mode !== 'edit' && (
          <div className="flex border-b border-slate-800/80">
            <button
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`flex-1 py-3 text-sm font-oswald font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                mode === 'register' ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              NOVO CADASTRO
            </button>
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-3 text-sm font-oswald font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                mode === 'login' ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              JÁ SOU CADASTRADO
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {submittedSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-oswald font-bold text-2xl text-white uppercase">
                {mode === 'edit' ? 'DADOS ATUALIZADOS COM SUCESSO!' : 'CADASTRO REALIZADO COM SUCESSO!'}
              </h4>
              <p className="text-slate-300 font-rajdhani font-semibold text-base max-w-md mx-auto">
                {mode === 'edit' 
                  ? 'Suas informações foram salvas no banco de dados.'
                  : 'Seu interesse foi registrado no Draft! O capitão selecionado verá seu perfil para o sorteio.'}
              </p>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-rajdhani font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <h4 className="font-oswald font-bold text-xs text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      <span>AUTENTICAR PARA EDITAR</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1">
                        Selecione seu Nome/Nick *
                      </label>
                      <select
                        required
                        value={selectedPlayerId}
                        onChange={(e) => setSelectedPlayerId(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="">-- Selecione na lista --</option>
                        {players.map(p => (
                          <option key={p.id} value={p.id}>{p.player_name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1">
                        Sua Senha Pessoal *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Digite a senha que você criou"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all cursor-pointer"
                      />
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
                      disabled={loading || !selectedPlayerId}
                      className="w-full py-3.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-oswald font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? 'VERIFICANDO...' : 'CONFIRMAR IDENTIDADE'}
                    </button>
                  </div>
                </form>
              )}

              {(mode === 'register' || mode === 'edit') && (
                <form onSubmit={mode === 'register' ? handleRegisterSubmit : handleEditSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <h4 className="font-oswald font-bold text-xs text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-2">
                      {mode === 'edit' ? <Pencil className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      <span>{mode === 'edit' ? 'ALTERAR DADOS DO CADASTRO' : 'CADASTRO DE INTERESSE PARA O DRAFT (SÁBADO 08/08)'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Select Captain */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-rajdhani font-bold text-amber-400 uppercase mb-1">
                          Selecione o Capitão de Sua Preferência <span className="text-slate-400 normal-case tracking-normal font-medium">(A escolha é anônima)</span> *
                        </label>
                        <select
                          value={playerForm.captain_name}
                          onChange={(e) => setPlayerForm({ ...playerForm, captain_name: e.target.value })}
                          className="w-full pl-4 pr-10 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all shadow-inner cursor-pointer"
                        >
                          <option value="Qualquer">Qualquer Capitão (Sem preferência)</option>
                          <option value="Gusta">Capitão Gusta (Time Gusta)</option>
                          <option value="HPS">Capitão HPS (Time HPS)</option>
                          <option value="Léo">Capitão Léo (Time Léo)</option>
                          <option value="Zane">Capitão Zane (Time Zane)</option>
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
                          ID ou Link da Steam (Opcional)
                        </label>
                        <input
                          type="text"
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

                      {mode === 'register' && (
                        <div>
                          <label className="block text-xs font-rajdhani font-bold text-amber-400 uppercase mb-1">
                            Senha Pessoal (Para Edição) *
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Crie uma senha"
                            value={playerForm.player_password}
                            onChange={(e) => setPlayerForm({ ...playerForm, player_password: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-[#0b0e14] border border-amber-500/50 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all shadow-inner cursor-pointer"
                          />
                        </div>
                      )}
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
                      className="w-full py-3.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-oswald font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? 'PROCESSANDO...' : (mode === 'edit' ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR INTERESSE')}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { UserPlus, X, CheckCircle2, LogIn, Pencil, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import type { InterestedPlayer } from '@/types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  interestedPlayers: InterestedPlayer[];
}

type ModalMode = 'register' | 'login' | 'edit';

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  interestedPlayers,
}) => {
  const [mode, setMode] = useState<ModalMode>('register');
  const [loading, setLoading] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [playerForm, setPlayerForm] = useState({
    id: '', 
    player_name: '',
    premier_points: '',
    steam_id: '',
    role: '',
    player_password: '',
  });

  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPointsDropdownOpen, setIsPointsDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const pointsOptions = [
    { value: "", label: "Selecione seu Rating" },
    { value: "1000", label: "1.000 a 4.999 (Cinza)" },
    { value: "5000", label: "5.000 a 9.999 (Azul Claro)" },
    { value: "10000", label: "10.000 a 14.999 (Azul)" },
    { value: "15000", label: "15.000 a 19.999 (Roxo)" },
    { value: "20000", label: "20.000 a 24.999 (Rosa/Fúcsia)" },
    { value: "25000", label: "25.000 a 29.999 (Vermelho)" },
    { value: "30000", label: "30.000+ (Amarelo/Ouro)" },
  ];

  const roleOptions = [
    { value: "", label: "Selecione sua função" },
    { value: "Rifler", label: "Rifler" },
    { value: "AWPer", label: "AWPer" },
    { value: "Entry Fragger", label: "Entry Fragger" },
    { value: "Support", label: "Support" },
    { value: "Lurker", label: "Lurker" },
    { value: "Flex", label: "Flex (Versátil)" },
    { value: "IGL", label: "IGL (Líder em jogo)" },
    { value: "Anchor", label: "Anchor (Âncora CT)" },
  ];

  const filteredSearchPlayers = interestedPlayers.filter(p => 
    p.player_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
      
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode('register');
      setSubmittedSuccess(false);
      setPlayerForm({
        id: '',
        player_name: '',
        premier_points: '',
        steam_id: '',
        role: '',
        player_password: '',
      });
      setLoginPassword('');
      setSelectedPlayerId('');
      setSearchQuery('');
      setIsDropdownOpen(false);
      setIsPointsDropdownOpen(false);
      setIsRoleDropdownOpen(false);
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!playerForm.player_name || !playerForm.premier_points || !playerForm.player_password) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    if (Number(playerForm.premier_points) < 1000) {
      toast.error('O mínimo de pontos no Premier é de 1000.');
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
        toast.success('Interesse cadastrado com sucesso!');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        toast.error(res.error || 'Falha ao registrar interesse. Tente novamente.');
      }
    } catch {
      toast.error('Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId || !loginPassword) {
      toast.error('Selecione seu nome e digite a senha.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPlayerId, player_password: loginPassword }),
      });

      const res = await response.json();

      if (response.ok && res.success) {
        const p = interestedPlayers.find(p => p.id === selectedPlayerId);
        if (p) {
          setPlayerForm({
            id: p.id,
            player_name: p.player_name || '',
            premier_points: p.premier_points?.toString() || '',
            steam_id: p.steam_id || '',
            role: p.role || '',
            player_password: loginPassword,
          });
          setMode('edit');
        }
      } else {
        toast.error(res.error || 'Senha incorreta.');
      }
    } catch {
      toast.error('Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (Number(playerForm.premier_points) < 1000) {
      toast.error('O mínimo de pontos no Premier é de 1000.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/edit-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerForm),
      });

      const res = await response.json();

      if (response.ok && res.success) {
        setSubmittedSuccess(true);
        toast.success('Dados atualizados com sucesso!');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        toast.error(res.error || 'Erro ao atualizar dados.');
      }
    } catch {
      toast.error('Erro inesperado.');
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
    } catch {  }
  };

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto transition-opacity duration-200 ease-out ${isVisible ? 'bg-black/90 opacity-100' : 'bg-black/0 opacity-0 pointer-events-none'}`}>
      <div className={`relative w-full max-w-2xl bg-[#111622] border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl my-8 transition-all duration-300 ease-out transform ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b0e14]">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-oswald font-bold text-lg text-white uppercase">
                INSCRIÇÃO DA COPA LUCAS MOURA 2ª EDIÇÃO
              </h3>
              <p className="text-xs font-rajdhani font-bold text-amber-400 uppercase">
                DRAFT AO VIVO DIA 07/08 • TORNEIO DIA 08/08
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

        {!submittedSuccess && mode !== 'edit' && (
          <div className="flex border-b border-slate-800/80">
            <button
              onClick={() => { setMode('register'); }}
              className={`flex-1 py-3 text-sm font-oswald font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                mode === 'register' ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              NOVO CADASTRO
            </button>
            <button
              onClick={() => { setMode('login'); }}
              className={`flex-1 py-3 text-sm font-oswald font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                mode === 'login' ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              JÁ SOU CADASTRADO
            </button>
          </div>
        )}

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
                  : 'Seu interesse foi registrado no Draft! Os capitães verão seu perfil para o sorteio.'}
              </p>
            </div>
          ) : (
            <>
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <h4 className="font-oswald font-bold text-xs text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      <span>AUTENTICAR PARA EDITAR</span>
                    </h4>

                    <div className="relative">
                      <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1">
                        Selecione seu Nome/Nick *
                      </label>
                      <div className="w-full relative">
                        <input
                          type="text"
                          placeholder="Digite para buscar..."
                          value={isDropdownOpen ? searchQuery : (interestedPlayers.find(p => p.id === selectedPlayerId)?.player_name || '')}
                          onFocus={() => {
                            setIsDropdownOpen(true);
                            setSearchQuery('');
                          }}
                          onBlur={() => {
                            setTimeout(() => setIsDropdownOpen(false), 200);
                          }}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsDropdownOpen(true);
                          }}
                          className="w-full pl-4 pr-10 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all cursor-text"
                        />
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {isDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-[#0b0e14] border border-slate-700/60 rounded-lg shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                          {filteredSearchPlayers.length > 0 ? (
                            filteredSearchPlayers.map(p => (
                              <div
                                key={p.id}
                                className="px-4 py-2.5 hover:bg-amber-500/10 cursor-pointer text-white font-rajdhani text-sm border-b border-slate-800 last:border-0"
                                onClick={() => {
                                  setSelectedPlayerId(p.id);
                                  setSearchQuery(p.player_name);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                {p.player_name}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-slate-400 font-rajdhani text-sm text-center italic">
                              Nenhum jogador encontrado.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1">
                        Sua Senha Pessoal *
                      </label>
                      <input
                        type="password"
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
                      <span>{mode === 'edit' ? 'ALTERAR DADOS DO CADASTRO' : 'CADASTRO DE INTERESSE PARA O DRAFT (SEXTA 07/08)'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1">
                          Seu Nick / Nome *
                        </label>
                        <input
                          type="text"
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
                        <div className="relative">
                          <div
                            tabIndex={0}
                            onBlur={() => setTimeout(() => setIsPointsDropdownOpen(false), 200)}
                            onClick={() => { setIsPointsDropdownOpen(!isPointsDropdownOpen); setIsRoleDropdownOpen(false); }}
                            className="w-full pl-4 pr-10 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all shadow-inner cursor-pointer flex items-center h-[46px]"
                          >
                            <span className={playerForm.premier_points ? "text-white" : "text-slate-400"}>
                              {playerForm.premier_points ? pointsOptions.find(o => o.value === playerForm.premier_points)?.label : "Selecione seu Rating"}
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                          </div>

                          {isPointsDropdownOpen && (
                            <div className="absolute z-50 w-full mt-1 bg-[#0b0e14] border border-slate-700/60 rounded-lg shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                              {pointsOptions.filter(o => o.value !== "").map(o => (
                                <div
                                  key={o.value}
                                  className="px-4 py-2.5 hover:bg-amber-500/10 cursor-pointer text-white font-rajdhani text-sm border-b border-slate-800 last:border-0"
                                  onClick={() => {
                                    setPlayerForm({ ...playerForm, premier_points: o.value });
                                    setIsPointsDropdownOpen(false);
                                  }}
                                >
                                  {o.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
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
                        <div className="relative">
                          <div
                            tabIndex={0}
                            onBlur={() => setTimeout(() => setIsRoleDropdownOpen(false), 200)}
                            onClick={() => { setIsRoleDropdownOpen(!isRoleDropdownOpen); setIsPointsDropdownOpen(false); }}
                            className="w-full pl-4 pr-10 py-3 rounded-lg bg-[#0b0e14] border border-slate-700/60 text-white font-rajdhani text-sm focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 focus:outline-none transition-all shadow-inner cursor-pointer flex items-center h-[46px]"
                          >
                            <span className={playerForm.role ? "text-white" : "text-slate-400"}>
                              {roleOptions.find(o => o.value === playerForm.role)?.label || "Selecione sua função"}
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                          </div>

                          {isRoleDropdownOpen && (
                            <div className="absolute z-[60] w-full mt-1 bg-[#0b0e14] border border-slate-700/60 rounded-lg shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                              {roleOptions.map(o => (
                                <div
                                  key={o.value}
                                  className="px-4 py-2.5 hover:bg-amber-500/10 cursor-pointer text-white font-rajdhani text-sm border-b border-slate-800 last:border-0"
                                  onClick={() => {
                                    setPlayerForm({ ...playerForm, role: o.value });
                                    setIsRoleDropdownOpen(false);
                                  }}
                                >
                                  {o.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {mode === 'register' && (
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-rajdhani font-bold text-amber-400 uppercase mb-1">
                            Senha Pessoal (Para Edição) *
                          </label>
                          <input
                            type="password"
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

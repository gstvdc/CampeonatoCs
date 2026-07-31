"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, LogOut, Lock } from 'lucide-react';

export default function EditProfilePage() {
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    const { data } = await supabase.from('interested_players').select('*').eq('user_id', user.id).single();
    if (data) setPlayer(data);
    setLoading(false);
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setMessage(null);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${player.id}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
    if (uploadError) {
      setMessage({ text: 'Erro ao fazer upload da imagem.', type: 'error' });
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
    
    await supabase.from('interested_players').update({ avatar_url: publicUrlData.publicUrl }).eq('id', player.id);
    setPlayer({ ...player, avatar_url: publicUrlData.publicUrl });
    setMessage({ text: 'Foto de perfil atualizada com sucesso!', type: 'success' });
    setUploading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage({ text: 'Erro ao alterar senha.', type: 'error' });
    } else {
      setMessage({ text: 'Senha alterada com sucesso!', type: 'success' });
      setNewPassword('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen bg-slate-950 p-10 text-white font-rajdhani flex items-center justify-center"><div className="animate-pulse text-2xl font-oswald uppercase tracking-widest text-slate-500">Carregando Perfil...</div></div>;

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-8 font-rajdhani selection:bg-amber-500/30">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold uppercase tracking-wider">Voltar ao Início</span>
          </Link>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 rounded-lg font-bold uppercase tracking-wider transition-colors border border-rose-500/20">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>

        {/* Main Container */}
        <div className="w-full rounded-3xl overflow-hidden relative shadow-2xl shadow-blue-900/20 border border-white/10"
             style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #172554 50%, #0f172a 100%)' }}>
          
          {/* Glow Effects */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 p-8 sm:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 border-b border-white/10 pb-12">
               {/* Avatar Box */}
               <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(139,92,246,0.3)] bg-slate-900 flex items-center justify-center shrink-0 group">
                  {player?.avatar_url ? (
                    <img src={player.avatar_url} alt="Avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="text-7xl font-oswald text-white/20 uppercase">{player?.player_name?.charAt(0)}</span>
                  )}
                  
                  {/* Overlay Upload Button */}
                  <label htmlFor="avatarUpload" className={`absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm ${uploading ? 'opacity-100' : ''}`}>
                    {uploading ? (
                      <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
                    ) : (
                      <Upload className="w-8 h-8 text-amber-400 mb-2" />
                    )}
                    <span className="text-white font-bold uppercase tracking-wider text-xs">{uploading ? 'Enviando...' : 'Alterar Foto'}</span>
                  </label>
                  <input type="file" id="avatarUpload" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
               </div>

               {/* User Info */}
               <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
                   <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                   <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Painel do Jogador</span>
                 </div>
                 <h1 className="text-4xl sm:text-5xl font-oswald font-black text-white uppercase tracking-tight drop-shadow-lg mb-2">
                   {player?.player_name}
                 </h1>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-6">
                   ID: {player?.id?.split('-')[0]} • Função: {player?.role || 'N/A'}
                 </p>

                 {message && (
                    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg font-bold text-sm border backdrop-blur-md ${
                      message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}>
                      {message.text}
                    </div>
                  )}
               </div>
            </div>

            {/* Edit Password Section */}
            <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Lock className="w-32 h-32" />
              </div>
              
              <h2 className="text-xl font-oswald font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                Segurança da Conta
              </h2>
              <p className="text-slate-400 text-sm mb-6 font-semibold">
                Atualize sua senha de acesso abaixo. Escolha uma senha segura.
              </p>
              
              <form onSubmit={handlePasswordChange} className="flex flex-col sm:flex-row items-end gap-4 max-w-2xl relative z-10">
                <div className="flex-1 w-full">
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-2 block">Nova Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                      className="w-full bg-[#0a0a0f]/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all font-semibold placeholder:text-slate-600" 
                      placeholder="••••••••" />
                  </div>
                </div>
                <button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-black py-3 px-8 rounded-xl uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap">
                  Atualizar Senha
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

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
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold uppercase tracking-wider">Voltar ao Início</span>
          </Link>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider transition-colors">
            Sair da Conta <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-900 border border-white/10 p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-oswald font-black text-white uppercase tracking-tight mb-8 drop-shadow-md">
              Editar Perfil - <span className="text-blue-400">{player?.player_name}</span>
            </h1>

            {message && (
              <div className={`p-4 rounded-xl mb-8 font-bold border flex items-center gap-3 ${
                message.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-rose-500/20 border-rose-500/50 text-rose-400'
              }`}>
                {message.text}
              </div>
            )}

            <div className="grid gap-8">
              {/* Avatar Section */}
              <div className="p-6 sm:p-8 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
                <h2 className="text-xl font-oswald font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-400" /> Foto de Perfil
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-950 border-4 border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                    {player?.avatar_url ? (
                      <img src={player.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl font-oswald text-white/20 uppercase">{player?.player_name?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-slate-400 text-sm mb-4">
                      Faça upload de uma imagem (recomendado: quadrado, formato PNG ou JPG).
                    </p>
                    <input type="file" id="avatarUpload" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
                    <label htmlFor="avatarUpload" className={`inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold cursor-pointer uppercase tracking-wider text-sm transition-colors shadow-lg shadow-purple-600/20 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Upload className="w-4 h-4" />
                      {uploading ? 'Enviando Imagem...' : 'Escolher Nova Foto'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="p-6 sm:p-8 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
                <h2 className="text-xl font-oswald font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-400" /> Alterar Senha
                </h2>
                <form onSubmit={handlePasswordChange} className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="flex-1 w-full">
                    <label className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2 block">Nova Senha</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors font-semibold" 
                      placeholder="Digite uma nova senha segura" />
                  </div>
                  <button type="submit" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-8 rounded-xl uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20">
                    Salvar Senha
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

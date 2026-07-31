"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Email ou senha inválidos.');
    } else {
      router.push('/perfil/editar');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-rajdhani">
      <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-50%] left-[-50%] w-[100%] h-[100%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-oswald font-bold text-white uppercase text-center mb-6">Login do Jogador</h1>
          {error && <div className="bg-rose-500/20 border border-rose-500/50 text-rose-400 p-3 rounded mb-4 text-sm font-bold text-center">{error}</div>}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-slate-400 text-sm font-bold uppercase mb-1 block">E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-semibold" />
            </div>
            <div>
              <label className="text-slate-400 text-sm font-bold uppercase mb-1 block">Senha</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors font-semibold" />
            </div>
            <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

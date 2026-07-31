'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const Navbar = () => {
  // Forced turbopack rebuild
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0b0e14]/95 backdrop-blur-md border-b border-amber-500/20 py-3 shadow-lg'
          : 'bg-[#0b0e14]/50 border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 flex items-center justify-between">
        
        <a href="/#inicio" className="flex items-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Logo Copa Lucas Moura"
            className="h-12 sm:h-16 w-auto object-contain mix-blend-screen group-hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          />
        </a>

        <nav className="hidden lg:flex items-center gap-8 font-oswald font-bold text-sm tracking-wider uppercase text-slate-300">
          <a href="/#inicio" className="hover:text-amber-400 transition-colors py-1 border-b-2 border-amber-400 text-white">
            INÍCIO
          </a>
          <a href="/#capitaes" className="hover:text-amber-400 transition-colors py-1 border-b-2 border-transparent hover:border-amber-400">
            CAPITÃES
          </a>
          <a href="/#cronograma" className="hover:text-amber-400 transition-colors py-1 border-b-2 border-transparent hover:border-amber-400">
            CRONOGRAMA
          </a>
          <a href="/#regras" className="hover:text-amber-400 transition-colors py-1 border-b-2 border-transparent hover:border-amber-400">
            REGRAS & FAQ
          </a>
        </nav>

        <div className="flex flex-wrap items-center justify-end gap-3 w-full lg:w-auto">
          {user ? (
            <Link
              href="/perfil/editar"
              className="lg:mt-0 bg-slate-800 text-white border border-white/10 px-4 sm:px-6 py-2 sm:py-3 rounded text-xs sm:text-sm font-oswald font-bold uppercase tracking-wider hover:bg-slate-700 transition-all flex items-center justify-center cursor-pointer"
            >
              PERFIL
            </Link>
          ) : (
            <Link
              href="/login"
              className="lg:mt-0 bg-slate-800 text-white border border-white/10 px-4 sm:px-6 py-2 sm:py-3 rounded text-xs sm:text-sm font-oswald font-bold uppercase tracking-wider hover:bg-slate-700 transition-all flex items-center justify-center cursor-pointer"
            >
              LOGIN
            </Link>
          )}
          <Link 
            href="/players"
            className="lg:mt-0 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 sm:px-6 py-2 sm:py-3 rounded text-xs sm:text-sm font-oswald font-bold uppercase tracking-wider hover:from-amber-400 hover:to-orange-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4 hidden sm:block" />
            VER INSCRITOS
          </Link>
        </div>

      </div>
    </header>
  );
};

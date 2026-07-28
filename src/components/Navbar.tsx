'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';

export const Navbar = () => {
  // Forced turbopack rebuild
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        
        <a href="#inicio" className="flex items-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Logo Copa Lucas Moura"
            className="h-12 sm:h-16 w-auto object-contain mix-blend-screen group-hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          />
        </a>

        <nav className="hidden lg:flex items-center gap-8 font-oswald font-bold text-sm tracking-wider uppercase text-slate-300">
          <a href="#inicio" className="hover:text-amber-400 transition-colors py-1 border-b-2 border-amber-400 text-white">
            INÍCIO
          </a>
          <a href="#capitaes" className="hover:text-amber-400 transition-colors py-1 border-b-2 border-transparent hover:border-amber-400">
            CAPITÃES
          </a>
          <a href="#cronograma" className="hover:text-amber-400 transition-colors py-1 border-b-2 border-transparent hover:border-amber-400">
            CRONOGRAMA
          </a>
          <a href="#regras" className="hover:text-amber-400 transition-colors py-1 border-b-2 border-transparent hover:border-amber-400">
            REGRAS & FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
              <Link 
                href="/players"
                className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-6 py-3 rounded text-sm font-oswald font-bold uppercase tracking-wider hover:from-amber-400 hover:to-orange-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                VER INSCRITOS
              </Link>
        </div>

      </div>
    </header>
  );
};

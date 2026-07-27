'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister }) => {
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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0b0e14]/90 backdrop-blur-md border-b border-amber-500/20 py-3 shadow-lg'
          : 'bg-gradient-to-b from-[#0b0e14]/90 via-[#0b0e14]/50 to-transparent py-4'
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 flex items-center justify-between">
        
        {/* Clean Logo Image Only (Background blended smoothly, side text removed) */}
        <a href="#inicio" className="flex items-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Logo Copa Lucas Moura"
            className="h-12 sm:h-16 w-auto object-contain mix-blend-screen group-hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          />
        </a>

        {/* Navigation Links */}
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

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Confirm Interest / CTA Button */}
          <button
            onClick={onOpenRegister}
            className="px-5 py-2.5 rounded font-oswald font-bold text-xs sm:text-sm tracking-wider uppercase text-black bg-amber-500 hover:bg-amber-400 transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 fill-black" />
            <span>CONFIRMAR PRESENÇA</span>
          </button>
        </div>

      </div>
    </header>
  );
};

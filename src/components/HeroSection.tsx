'use client';

import React from 'react';
import { ShieldCheck, ChevronRight, Users } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

interface HeroSectionProps {
  onOpenRegister: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenRegister }) => {
  return (
    <section id="inicio" className="relative min-h-screen pt-36 sm:pt-40 pb-20 flex flex-col justify-between overflow-hidden bg-[#0b0e14]">
      {/* Official CS2 Wallpaper Background */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/backgrounds/hero.png"
          alt="CS2 Official Wallpaper"
          className="w-full h-full object-cover opacity-35 mix-blend-screen scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/60 to-transparent" />
      </div>

      {/* Hero Ultra-Wide Content Grid */}
      <div className="relative z-10 max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        
        {/* Left Column: Aggressive, Clean & Determined Typography */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="font-oswald font-black text-5xl sm:text-7xl xl:text-8xl tracking-tight text-amber-400 leading-none uppercase drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
              SEM MARGEM PARA ERROS.
            </h1>
            <h2 className="font-oswald font-black text-4xl sm:text-6xl xl:text-7xl tracking-widest text-white uppercase drop-shadow-lg">
              APENAS UM SERÁ <span className="text-amber-400">CAMPEÃO!</span>
            </h2>
          </div>

          {/* Subtext Description: Flexible for any number of captains */}
          <p className="text-slate-200 font-rajdhani font-bold text-lg sm:text-2xl max-w-2xl leading-relaxed drop-shadow-md">
            Os melhores capitães. 1 dia único. Inscreva-se no Draft e dispute o troféu exclusivo, 08 de Agosto.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenRegister}
              className="group relative px-9 py-5 rounded font-oswald font-black text-base sm:text-lg tracking-wider uppercase text-black bg-amber-500 hover:bg-amber-400 transition-all cursor-pointer flex items-center gap-3"
            >
              <ShieldCheck className="w-6 h-6 fill-black" />
              <span>GARANTIR VAGA NO DRAFT</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#capitaes"
              className="px-7 py-5 rounded font-oswald font-bold text-base tracking-wider uppercase text-slate-200 bg-[#161c2b]/90 hover:bg-[#1f283d] border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer flex items-center gap-2"
            >
              <Users className="w-5 h-5 text-amber-400" />
              <span>VER CAPITÃES</span>
            </a>
          </div>
        </div>

        {/* Right Column: 3D Pop-out Frame & Aligned Countdown Timer DIRECTLY Below Image */}
        <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end space-y-6 mt-6 sm:mt-10 lg:mt-12">
          
          {/* 3D Pop-out Card Container */}
          <div className="relative group max-w-lg xl:max-w-xl w-full">
            {/* Main Frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-all">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-[#0b0e14]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/banner-frame.png"
                  alt="Copa Lucas Moura Banner"
                  className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14]/60 via-transparent to-black/20" />
              </div>
            </div>

            {/* 3D Pop-out Trophy Image */}
            <div className="absolute -top-10 -right-6 sm:-top-14 sm:-right-8 xl:-top-16 xl:-right-10 w-56 sm:w-72 xl:w-80 pointer-events-none z-20 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/trophy-popout.png"
                alt="Troféu CS2 3D Popout"
                className="w-full h-auto object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_0_40px_rgba(245,158,11,0.4)]"
              />
            </div>
          </div>

          {/* Countdown Timer: Positioned Directly Under the Image Frame */}
          <div className="max-w-lg xl:max-w-xl w-full">
            <CountdownTimer targetDate="2026-08-08T13:00:00" />
          </div>

        </div>

      </div>
    </section>
  );
};

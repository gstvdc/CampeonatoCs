'use client';

import React from 'react';
import { Heart, Tv, Video } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#040508] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 font-rajdhani">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 space-y-12">
        
        {/* Top Footer Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col: Logo Image Only with Seamless Background Blend */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Logo Copa Lucas Moura"
                className="h-14 sm:h-16 w-auto object-contain mix-blend-screen filter drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              />
            </div>
            <p className="text-sm text-slate-400 max-w-md font-semibold leading-relaxed">
              O campeonato de Counter-Strike 2 reunindo os melhores capitães. Troféu exclusivo, transmissão ao vivo profissional e disputas intensas.
            </p>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
              <span className="px-2.5 py-1 rounded bg-[#0e121e] border border-slate-700 text-amber-400 uppercase">
                COUNTER-STRIKE 2
              </span>
              <span className="px-2.5 py-1 rounded bg-[#0e121e] border border-slate-700 text-amber-400 uppercase">
                2ª EDIÇÃO 2026
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-oswald font-bold text-sm text-white uppercase tracking-wider">
              NAVEGAÇÃO RÁPIDA
            </h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <a href="#inicio" className="hover:text-amber-400 transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#capitaes" className="hover:text-amber-400 transition-colors">
                  Capitães da Arena
                </a>
              </li>
              <li>
                <a href="#cronograma" className="hover:text-amber-400 transition-colors">
                  Cronograma & Datas
                </a>
              </li>
              <li>
                <a href="#regras" className="hover:text-amber-400 transition-colors">
                  Regulamento Oficial
                </a>
              </li>
            </ul>
          </div>

          {/* Live Channels */}
          <div className="space-y-3">
            <h4 className="font-oswald font-bold text-sm text-white uppercase tracking-wider">
              TRANSMISSÃO AO VIVO
            </h4>
            <div className="space-y-2 text-sm font-semibold">
              <a
                href="https://twitch.tv"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded bg-[#0e121e] border border-slate-800 hover:border-purple-500 text-slate-200 hover:text-purple-400 transition-all"
              >
                <Tv className="w-4 h-4 text-purple-400" />
                <span>Twitch Official Stream</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits Line */}
        <div className="pt-8 border-t border-slate-800/60 flex items-center justify-center text-xs font-semibold text-slate-400">
          <p>© 2026 Copa Lucas Moura - Todos os direitos reservados. CS2 é marca registrada da Valve Corporation.</p>
        </div>

      </div>
    </footer>
  );
};

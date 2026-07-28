'use client';

import React from 'react';

const TwitchIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/>
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#040508] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 font-rajdhani">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
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

          </div>

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

          <div className="space-y-3">
            <h4 className="font-oswald font-bold text-sm text-white uppercase tracking-wider">
              TRANSMISSÃO AO VIVO
            </h4>
            <div className="space-y-2 text-sm font-semibold">
              <a
                href="https://twitch.tv"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2.5 px-5 py-2.5 rounded-lg bg-[#9146FF] hover:bg-[#772CE8] text-white transition-all font-semibold shadow-md"
              >
                <TwitchIcon className="w-5 h-5" />
                <span>Twitch Official Stream</span>
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/60 flex items-center justify-center text-xs font-semibold text-slate-400">
          <p>© 2026 Copa Lucas Moura - Todos os direitos reservados. CS2 é marca registrada da Valve Corporation.</p>
        </div>

      </div>
    </footer>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { getCaptains, getInterestedPlayers, CaptainProfile, InterestedPlayer } from '@/lib/supabase';

interface CaptainsShowcaseProps {
  onOpenInterestModal: (captainName?: string) => void;
  refreshTrigger: number;
}

export const CaptainsShowcase: React.FC<CaptainsShowcaseProps> = ({
  onOpenInterestModal,
  refreshTrigger,
}) => {
  const [captains, setCaptains] = useState<CaptainProfile[]>([]);
  const [interestedPlayers, setInterestedPlayers] = useState<InterestedPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const caps = await getCaptains();
      const players = await getInterestedPlayers();
      setCaptains(caps);
      setInterestedPlayers(players);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [refreshTrigger]);

  return (
    <section id="capitaes" className="py-20 bg-[#0b0e14] relative border-t border-slate-800">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-slate-800/80">
          <div>
            <h2 className="font-oswald font-extrabold text-4xl sm:text-6xl text-white tracking-tight uppercase">
              CAPITÃES & <span className="text-amber-400">JOGADORES DO DRAFT</span>
            </h2>
            <p className="text-slate-400 font-rajdhani font-semibold text-base sm:text-lg mt-1">
              Escolha seu Capitão de preferência e cadastre seu interesse para entrar no Draft do torneio no Sábado (08/08).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">

            <button
              onClick={() => onOpenInterestModal()}
              className="px-6 py-3 rounded font-oswald font-bold text-xs uppercase tracking-wider text-black bg-amber-500 hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 fill-black" />
              <span>TENHO INTERESSE NO DRAFT</span>
            </button>
          </div>
        </div>

        {/* Captain Cards Carousel (Overlapping 3D effect) */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 font-rajdhani font-bold text-lg animate-pulse">
            Carregando Capitães e inscritos do Draft...
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-8 py-10">
            {captains.map((c, idx) => {
              const teamInterested = interestedPlayers.filter(
                (p) => p.captain_name.toLowerCase() === c.name.toLowerCase()
              );

              return (
                <div
                  key={c.id || idx}
                  className="relative hover:z-10 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(245,158,11,0.2)] transition-all duration-500 w-[280px] sm:w-[320px] rounded-2xl bg-[#050401] border border-amber-500/20 shadow-[0_15px_40px_rgba(0,0,0,0.9)] overflow-hidden group flex flex-col"
                >
                  {/* Top Image Area */}
                  <div className="h-[340px] relative flex flex-col justify-end overflow-hidden">
                    {/* Static Background Layer */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center z-0 opacity-60"
                      style={{ backgroundImage: `url('/backgrounds/captain-card.png')` }}
                    />
                    
                    {/* Captain Avatar (Transparent PNG) */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center z-10 pointer-events-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.avatar_url || '/logo.png'}
                        alt={`Capitão ${c.name}`}
                        className="h-[340px] w-auto object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700"
                      />
                    </div>

                    {/* Gradient Fade Overlay at bottom of image area */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0702] via-[#0a0702]/80 to-transparent z-20 pointer-events-none" />

                    {/* Name Overlays */}
                    <div className="relative z-30 text-center pb-4">
                      <h3 className="font-oswald font-black text-3xl sm:text-4xl text-white tracking-wide uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] group-hover:text-amber-400 transition-colors">
                        {c.name}
                      </h3>
                      <span className="text-amber-500 text-xs sm:text-sm font-rajdhani font-bold uppercase tracking-widest mt-1 block">
                        {c.team_name}
                      </span>
                    </div>
                  </div>

                  {/* Body Content (Stats + Button) */}
                  <div className="px-6 pb-6 pt-3 flex flex-col bg-gradient-to-b from-[#0a0702] to-[#050401] relative z-40 flex-1">
                    {/* Stats Row */}
                    <div className="flex items-center justify-between w-full px-2 mb-6 border-t border-b border-amber-900/40 py-3">
                      <div className="flex flex-col items-center">
                        <span className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-widest mb-1">Interessados</span>
                        <span className="text-white font-oswald text-xl sm:text-2xl font-bold">{teamInterested.length}</span>
                      </div>
                      <div className="w-px h-8 bg-amber-900/40"></div>
                      <div className="flex flex-col items-center">
                        <span className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-widest mb-1">Vagas</span>
                        <span className="text-white font-oswald text-xl sm:text-2xl font-bold">{Math.max(0, 4 - teamInterested.length)}</span>
                      </div>
                      <div className="w-px h-8 bg-amber-900/40"></div>
                      <div className="flex flex-col items-center">
                        <span className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-widest mb-1">Premier</span>
                        <span className="text-white font-oswald text-xl sm:text-2xl font-bold">
                          {c.premier_points >= 1000 ? (c.premier_points / 1000).toFixed(1).replace('.0', '') + 'K' : c.premier_points}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => onOpenInterestModal(c.name)}
                      className="w-full py-3 rounded-xl font-oswald font-bold text-sm uppercase tracking-wider text-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 group-hover:-translate-y-1 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] cursor-pointer"
                    >
                      <span>TENHO INTERESSE</span>
                      <span className="text-lg leading-none mb-0.5">➦</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

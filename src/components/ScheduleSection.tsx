'use client';

import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export const ScheduleSection: React.FC = () => {
  const timeline = [
    {
      date: 'ATÉ 07/08 SEXTA',
      time: '23:59 BRT',
      title: 'INSCRIÇÕES DO DRAFT ("TENHO INTERESSE")',
      desc: 'Prazo final para jogadores e capitães registrarem interesse e perfil na plataforma.',
      status: 'EM ANDAMENTO',
      active: true,
    },
    {
      date: '08/08 SÁBADO',
      time: '13:00 BRT',
      title: 'DRAFT AO VIVO DOS CAPITÃES',
      desc: 'Sorteio presencial e ao vivo dos times entre os capitães com transmissão.',
      status: 'GAME DAY',
      active: false,
    },
    {
      date: '08/08 SÁBADO',
      time: '15:00 BRT',
      title: 'FASE DE GRUPOS & ELIMINATÓRIAS MD3',
      desc: 'Confrontos eliminatórios diretos em servidores dedicados 128-tick / CS2 Sub-tick com vetos de mapas.',
      status: 'GAME DAY',
      active: false,
    },
    {
      date: '08/08 SÁBADO',
      time: '19:00 BRT',
      title: 'GRANDE FINAL & CERIMÔNIA DO TROFÉU',
      desc: 'Transmissão da Grande Final com estúdio ao vivo, premiação do MVP e entrega do Troféu!',
      status: 'FINAL',
      active: false,
    },
  ];

  return (
    <section id="cronograma" className="py-20 bg-[#0e121e] border-t border-slate-800 relative">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">

          <h2 className="font-oswald font-bold text-3xl sm:text-5xl text-white tracking-tight uppercase">
            PROGRAMAÇÃO DO <span className="text-amber-400">SÁBADO (08/08)</span>
          </h2>
          <p className="text-slate-400 font-rajdhani font-semibold text-lg">
            Todo o torneio ocorrerá em um único dia épico: Draft ao vivo à tarde e Grande Final à noite!
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {timeline.map((item, idx) => (
            <div
              key={idx}
              className={`glass-panel p-7 rounded-2xl border transition-all relative tactical-corners ${
                item.active
                  ? 'border-amber-500 shadow-lg bg-[#161c2b]'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-oswald font-bold text-amber-400">
                  ETAPA 0{idx + 1}
                </span>
                <span
                  className={`px-2.5 py-1 rounded text-[10px] font-rajdhani font-bold uppercase ${
                    item.active
                      ? 'bg-amber-500 text-black animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Date & Time */}
              <div className="flex items-center gap-2 text-xs font-rajdhani font-bold text-amber-400 mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{item.date} • {item.time}</span>
              </div>

              {/* Title */}
              <h3 className="font-oswald font-bold text-lg text-white mb-2 uppercase">
                {item.title}
              </h3>

              {/* Desc */}
              <p className="text-slate-400 text-xs font-rajdhani font-semibold leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

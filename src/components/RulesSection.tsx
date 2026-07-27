'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const RulesSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Como funciona o processo de confirmação de presença?',
      a: 'O capitão de cada time deve preencher o formulário oficial clicando no botão "CONFIRMAR PRESENÇA", registrando a line-up de 5 jogadores principais e opcionalmente 1 reserva. A confirmação é gravada em tempo real no banco de dados Supabase.',
    },
    {
      q: 'Qual é o formato das partidas e Map Pool oficial?',
      a: 'Todas as partidas da fase eliminatória e Grande Final serão em formato MD3 (Melhor de 3). O Map Pool ativo utiliza a rotação oficial competitiva do CS2: Mirage, Inferno, Nuke, Anubis, Ancient, Dust II e Vertigo com sistema de veto de capitães.',
    },
    {
      q: 'Regras de Anti-Cheat e Servidores',
      a: 'É obrigatório o uso de conta Steam sem banimentos VAC ou Game Ban ativos nos últimos 365 dias. Todas as partidas ocorrem em servidores brasileiros dedicados com Anti-Cheat habilitado e gravação de GOTV/DEMO obrigatória.',
    },
    {
      q: 'Qual é a tolerância de atraso e suporte?',
      a: 'O tempo limite de tolerância para check-in de cada partida na sala da lobby é de 15 minutos após o horário agendado. Os capitães têm canal direto no Discord oficial do torneio para tirar dúvidas.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="regras" className="py-20 bg-[#0b0e14] relative border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#111726] border border-slate-800 text-xs font-rajdhani font-bold text-blue-400 uppercase tracking-widest">
            <HelpCircle className="w-4 h-4" />
            <span>REGULAMENTO & PERGUNTAS FREQUENTES</span>
          </div>
          <h2 className="font-oswald font-bold text-3xl sm:text-5xl text-white tracking-tight uppercase">
            REGRAS <span className="text-blue-400">OFICIAIS</span>
          </h2>
          <p className="text-slate-400 font-rajdhani font-semibold text-lg">
            Tudo o que você e sua equipe precisam saber antes de entrar em servidor.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-xl border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-oswald font-bold text-base text-white hover:text-blue-400 transition-colors uppercase cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs text-amber-400 font-mono">0{idx + 1}.</span>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-300 font-rajdhani font-semibold text-sm leading-relaxed border-t border-slate-800/60 bg-[#0b0e14]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

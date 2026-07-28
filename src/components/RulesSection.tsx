'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const RulesSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Como funciona a inscrição para o Draft?',
      a: 'Cada jogador individual deve se inscrever clicando em "TENHO INTERESSE NO DRAFT" e preenchendo seus dados (Nick, Link da Steam e Função). A escolha das equipes será feita ao vivo pelos capitães no formato Snake Draft (1-2-2-1).',
    },
    {
      q: 'Qual é o formato das partidas e Map Pool oficial?',
      a: 'As partidas do chaveamento (Double Elimination com 4 times) serão em formato MD1 (Melhor de 1), e a Grande Final será uma série MD3 (Melhor de 3). O Map Pool ativo utiliza a rotação oficial do CS2, com sistema de veto em tempo real.',
    },
    {
      q: 'Regras de Anti-Cheat e Servidores',
      a: 'É obrigatório o uso de conta Steam sem banimentos VAC ou Game Ban ativos nos últimos 365 dias. Todas as partidas ocorrem nos servidores da FireGames com Anti-Cheat habilitado e gravação de GOTV/DEMO obrigatória.',
    },
    {
      q: 'Qual é a tolerância de atraso e suporte?',
      a: 'O tempo limite de tolerância para o comparecimento do time no servidor é de 15 minutos após o horário agendado. Os capitães têm canal direto no Discord oficial do torneio para tirar dúvidas.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="regras" className="py-20 bg-[#0b0e14] relative border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-oswald font-bold text-3xl sm:text-5xl text-white tracking-tight uppercase">
            REGRAS <span className="text-blue-400">OFICIAIS</span>
          </h2>
          <p className="text-slate-400 font-rajdhani font-semibold text-lg">
            Tudo o que você e sua equipe precisam saber antes de entrar em servidor.
          </p>
        </div>

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

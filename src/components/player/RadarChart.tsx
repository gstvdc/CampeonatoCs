'use client';

import React from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
}

export const PlayerRadarChart: React.FC<{ 
  rating: number, 
  mira?: number,
  nocao?: number,
  utilitaria?: number,
  movimentacao?: number,
  impacto?: number
}> = ({ rating, mira = 50, nocao = 50, utilitaria = 50, movimentacao = 50, impacto = 50 }) => {
  
  const data: RadarData[] = [
    { subject: 'MIRA', A: mira, fullMark: 100 },
    { subject: 'NOÇÃO', A: nocao, fullMark: 100 },
    { subject: 'UTILITÁRIA', A: utilitaria, fullMark: 100 },
    { subject: 'MOVIMENTAÇÃO', A: movimentacao, fullMark: 100 },
    { subject: 'IMPACTO', A: impacto, fullMark: 100 },
  ];

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl font-oswald font-black text-white/5 opacity-40 z-0">
          {Math.round(rating * 100)}
        </span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar cx="50%" cy="50%" outerRadius="60%" data={data}>
          <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Rajdhani', fontWeight: 600 }} />
          <Radar
            name="Player"
            dataKey="A"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="#f59e0b"
            fillOpacity={0.2}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
};

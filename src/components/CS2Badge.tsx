import React from 'react';
import { getCS2ColorHex } from '@/lib/colors';

interface CS2BadgeProps {
  points: number;
}

export const CS2Badge: React.FC<CS2BadgeProps> = ({ points }) => {
  const colorHex = getCS2ColorHex(points);
  
  // Format with comma e.g. 15,000
  const formattedPoints = points.toLocaleString('en-US');

  return (
    <div 
      className="relative inline-flex items-center justify-center skew-x-[-12deg] bg-[#1a1e28] h-[36px] sm:h-[44px] px-5 sm:px-8 shadow-lg overflow-hidden"
    >
      {/* Soft gradient background matching CS2 style */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{ background: `linear-gradient(90deg, ${colorHex} 0%, transparent 80%)` }}
      ></div>

      {/* Left accent lines */}
      <div className="absolute left-0 top-0 bottom-0 flex">
        <div className="w-[4px] sm:w-[5px] h-full" style={{ backgroundColor: colorHex }}></div>
        <div className="w-[2px] h-full bg-[#1a1e28]"></div>
        <div className="w-[3px] h-full" style={{ backgroundColor: colorHex, opacity: 0.9 }}></div>
      </div>
      
      {/* Right/Top/Bottom Borders to give the box feel */}
      <div className="absolute inset-0 border-r border-t border-b border-white/5 pointer-events-none"></div>

      <span 
        className="relative z-10 ml-3 font-oswald italic font-bold tracking-wider text-lg sm:text-2xl skew-x-[12deg] drop-shadow-md"
        style={{ color: colorHex }}
      >
        {formattedPoints}
      </span>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          days: String(days).padStart(2, '0'),
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0'),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="w-full text-center space-y-3 pt-2">
      <h4 className="text-amber-400 font-rajdhani font-semibold text-base sm:text-lg tracking-wide">
        O torneio começa em
      </h4>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 text-center">
        <div className="bg-white/[0.06] backdrop-blur-md p-3.5 sm:p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center transition-all hover:bg-white/[0.09]">
          <div className="font-oswald font-bold text-3xl sm:text-4xl xl:text-5xl text-amber-400 tracking-tight leading-none">
            {timeLeft.days}
          </div>
          <div className="text-[11px] sm:text-xs font-rajdhani font-semibold text-amber-400/90 uppercase tracking-widest mt-2">
            DIAS
          </div>
        </div>

        <div className="bg-white/[0.06] backdrop-blur-md p-3.5 sm:p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center transition-all hover:bg-white/[0.09]">
          <div className="font-oswald font-bold text-3xl sm:text-4xl xl:text-5xl text-amber-400 tracking-tight leading-none">
            {timeLeft.hours}
          </div>
          <div className="text-[11px] sm:text-xs font-rajdhani font-semibold text-amber-400/90 uppercase tracking-widest mt-2">
            HRS
          </div>
        </div>

        <div className="bg-white/[0.06] backdrop-blur-md p-3.5 sm:p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center transition-all hover:bg-white/[0.09]">
          <div className="font-oswald font-bold text-3xl sm:text-4xl xl:text-5xl text-amber-400 tracking-tight leading-none">
            {timeLeft.minutes}
          </div>
          <div className="text-[11px] sm:text-xs font-rajdhani font-semibold text-amber-400/90 uppercase tracking-widest mt-2">
            MIN
          </div>
        </div>

        <div className="bg-white/[0.06] backdrop-blur-md p-3.5 sm:p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center transition-all hover:bg-white/[0.09]">
          <div className="font-oswald font-bold text-3xl sm:text-4xl xl:text-5xl text-amber-400 tracking-tight leading-none">
            {timeLeft.seconds}
          </div>
          <div className="text-[11px] sm:text-xs font-rajdhani font-semibold text-amber-400/90 uppercase tracking-widest mt-2">
            SECS
          </div>
        </div>
      </div>
    </div>
  );
};

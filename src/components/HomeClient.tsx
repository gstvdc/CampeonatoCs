'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { LiveBanner } from '@/components/LiveBanner';
import { CaptainsShowcase } from '@/components/CaptainsShowcase';
import { ScheduleSection } from '@/components/ScheduleSection';
import { RulesSection } from '@/components/RulesSection';
import { Footer } from '@/components/Footer';
import type { CaptainProfile, InterestedPlayer } from '@/types';

interface HomeClientProps {
  captains: CaptainProfile[];
  interestedPlayers: InterestedPlayer[];
}

export const HomeClient: React.FC<HomeClientProps> = ({ captains, interestedPlayers }) => {
  return (
    <main className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar />

      <HeroSection />

      <LiveBanner />

      <CaptainsShowcase
        captains={captains}
      />

      <ScheduleSection />

      <RulesSection />

      <Footer />
    </main>
  );
};

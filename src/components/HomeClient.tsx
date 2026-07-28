'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { LiveBanner } from '@/components/LiveBanner';
import { CaptainsShowcase } from '@/components/CaptainsShowcase';
import { ScheduleSection } from '@/components/ScheduleSection';
import { RulesSection } from '@/components/RulesSection';
import { RegistrationModal } from '@/components/RegistrationModal';
import { Footer } from '@/components/Footer';
import type { CaptainProfile, InterestedPlayer } from '@/types';

interface HomeClientProps {
  captains: CaptainProfile[];
  interestedPlayers: InterestedPlayer[];
}

export const HomeClient: React.FC<HomeClientProps> = ({ captains, interestedPlayers }) => {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const router = useRouter();

  const handleRegisterSuccess = () => {
    router.refresh();
  };

  const openPlayerInterestModal = () => {
    setRegisterModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar onOpenRegister={openPlayerInterestModal} />

      <HeroSection onOpenRegister={openPlayerInterestModal} />

      <LiveBanner />

      <CaptainsShowcase
        onOpenInterestModal={openPlayerInterestModal}
        captains={captains}
        interestedPlayers={interestedPlayers}
      />

      <ScheduleSection />

      <RulesSection />

      <Footer />

      <RegistrationModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSuccess={handleRegisterSuccess}
        interestedPlayers={interestedPlayers}
      />
    </main>
  );
};

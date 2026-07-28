'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { LiveBanner } from '@/components/LiveBanner';
import { CaptainsShowcase } from '@/components/CaptainsShowcase';
import { ScheduleSection } from '@/components/ScheduleSection';
import { RulesSection } from '@/components/RulesSection';
import { RegistrationModal } from '@/components/RegistrationModal';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRegisterSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const openPlayerInterestModal = () => {
    setRegisterModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      <Navbar
        onOpenRegister={openPlayerInterestModal}
      />

      <HeroSection onOpenRegister={() => openPlayerInterestModal()} />

      <LiveBanner />

      <CaptainsShowcase
        onOpenInterestModal={openPlayerInterestModal}
        refreshTrigger={refreshTrigger}
      />

      <ScheduleSection />

      <RulesSection />

      <Footer />

      <RegistrationModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSuccess={handleRegisterSuccess}
      />
    </main>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
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
      {/* Navbar Header */}
      <Navbar
        onOpenRegister={openPlayerInterestModal}
      />

      {/* Hero Section */}
      <HeroSection onOpenRegister={() => openPlayerInterestModal()} />

      {/* Twitch Live Banner */}
      <LiveBanner />

      {/* Captains Showcase with Draft Registration */}
      <CaptainsShowcase
        onOpenInterestModal={openPlayerInterestModal}
        refreshTrigger={refreshTrigger}
      />

      {/* Schedule Timeline (Single Day Saturday 08/08) */}
      <ScheduleSection />

      {/* Rules FAQ Accordion */}
      <RulesSection />

      {/* Footer */}
      <Footer />

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSuccess={handleRegisterSuccess}
      />
    </main>
  );
}

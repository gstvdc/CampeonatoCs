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
import { getCaptains, CaptainProfile } from '@/lib/supabase';

export default function Home() {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<'player' | 'captain'>('player');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [captains, setCaptains] = useState<CaptainProfile[]>([]);

  useEffect(() => {
    getCaptains().then(setCaptains);
  }, [refreshTrigger]);

  const handleRegisterSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const openPlayerInterestModal = (captainName?: string) => {
    setModalInitialTab('player');
    setRegisterModalOpen(true);
  };

  const openCaptainRegisterModal = () => {
    setModalInitialTab('captain');
    setRegisterModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Navbar Header */}
      <Navbar
        onOpenRegister={() => openPlayerInterestModal()}
      />

      {/* Hero Section */}
      <HeroSection onOpenRegister={() => openPlayerInterestModal()} />

      {/* Twitch Live Banner */}
      <LiveBanner />

      {/* Captains Showcase with Draft Registration */}
      <CaptainsShowcase
        onOpenInterestModal={openPlayerInterestModal}
        onOpenCaptainRegisterModal={openCaptainRegisterModal}
        refreshTrigger={refreshTrigger}
      />

      {/* Schedule Timeline (Single Day Saturday 08/08) */}
      <ScheduleSection />

      {/* Rules FAQ Accordion */}
      <RulesSection />

      {/* Footer */}
      <Footer />

      {/* Registration Modal with Player Interest and Captain Registration Tabs */}
      <RegistrationModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSuccess={handleRegisterSuccess}
        captains={captains}
        initialTab={modalInitialTab}
      />
    </main>
  );
}

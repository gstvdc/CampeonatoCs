import React from 'react';
import { HomeClient } from '@/components/HomeClient';
import { getCaptains, getInterestedPlayers } from '@/lib/supabase';

export const revalidate = 0; // Ensures fresh data is fetched on every request (useful for drafts)

export default async function Home() {
  const [captains, interestedPlayers] = await Promise.all([
    getCaptains(),
    getInterestedPlayers(),
  ]);

  return <HomeClient captains={captains} interestedPlayers={interestedPlayers} />;
}

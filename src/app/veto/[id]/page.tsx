import { VetoRoom } from '@/components/veto/VetoRoom';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function VetoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: room, error } = await supabase.from('match_vetoes').select('*').eq('id', id).single();
  
  if (error || !room) return notFound();

  return <VetoRoom initialRoom={room} />;
}

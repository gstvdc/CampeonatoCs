import { VetoRoom } from '@/components/veto/VetoRoom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function VetoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (!isSupabaseConfigured() || !supabase) {
    return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">Erro: Supabase não está configurado. Verifique as variáveis de ambiente.</div>;
  }
  
  const { data: room, error } = await supabase.from('match_vetoes').select('*').eq('id', id).single();
  
  if (error || !room) return notFound();

  return <VetoRoom initialRoom={room} />;
}

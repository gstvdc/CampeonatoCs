import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { captain1_id, captain2_id, format } = await request.json();

    if (!captain1_id || !captain2_id || !format) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('match_vetoes')
      .insert([{
        captain1_id,
        captain2_id,
        format,
        status: 'in_progress',
        current_turn: captain1_id,
        actions: []
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

# Map Veto System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real-time map pick/ban system for two captains using Supabase Realtime and Next.js App Router.

**Architecture:** A new Supabase table `match_vetoes` tracks the room state. The frontend uses `supabase-js` realtime subscriptions to listen to state changes and broadcast updates. The UI features interactive map cards that captains click to ban/pick based on a strict turn-based logic.

**Tech Stack:** Next.js (App Router), React, Tailwind CSS, Supabase (Database + Realtime).

## Global Constraints

- TypeScript strict mode must pass.
- Ensure Tailwind CSS styling uses glassmorphism and the established UI palette.
- Use `isSupabaseConfigured` check before initializing Supabase clients.

---

### Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/20260729_add_match_vetoes.sql`

**Interfaces:**
- Consumes: Supabase Postgres environment
- Produces: `public.match_vetoes` table with RLS and realtime enabled.

- [ ] **Step 1: Write the migration script**

```sql
-- Create the match_vetoes table
CREATE TABLE IF NOT EXISTS public.match_vetoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  captain1_id UUID REFERENCES auth.users(id),
  captain2_id UUID,
  format TEXT CHECK (format IN ('MD1', 'MD3')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  current_turn UUID,
  actions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.match_vetoes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read vetoes (for spectators)
CREATE POLICY "Vetoes are viewable by everyone" 
ON public.match_vetoes FOR SELECT 
USING (true);

-- Allow authenticated users to insert (to create rooms)
CREATE POLICY "Users can create vetoes" 
ON public.match_vetoes FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow update only if the user is one of the captains
CREATE POLICY "Captains can update vetoes" 
ON public.match_vetoes FOR UPDATE 
USING (auth.uid() = captain1_id OR auth.uid() = captain2_id);

-- Enable Realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_vetoes;
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/20260729_add_match_vetoes.sql
git commit -m "chore: add match_vetoes migration"
```

### Task 2: Create Veto Room Logic (API)

**Files:**
- Create: `src/app/api/veto/create/route.ts`

**Interfaces:**
- Consumes: Supabase Server Client
- Produces: API endpoint `POST /api/veto/create` returning `{ id: string }`

- [ ] **Step 1: Write the API route implementation**

```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { captain1_id, captain2_id, format } = await request.json();

    if (!captain1_id || !captain2_id || !format) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/veto/create/route.ts
git commit -m "feat: add api route to create veto room"
```

### Task 3: Admin Button & Modal

**Files:**
- Modify: `src/components/player/PlayersMasterDetail.tsx`

**Interfaces:**
- Consumes: Players list state in the component, `POST /api/veto/create`
- Produces: A button and logic to route to `/veto/[id]`

- [ ] **Step 1: Add the Create Veto logic and button**

Modify the file to include a button that selects the top 2 players (for testing/simplicity) or opens a prompt, then calls the API and redirects.

```typescript
// Inside PlayersMasterDetail.tsx, add to imports:
import { useRouter } from 'next/navigation';

// Inside the component:
const router = useRouter();
const handleCreateVeto = async () => {
  if (players.length < 2) return alert('Need at least 2 players');
  // For simplicity, we use the first two players from the list, or prompt for IDs
  // We will assume the user manually inputs or selects two players. Let's use prompts for this MVP:
  const c1 = prompt('ID do Capitão 1:', players[0].user_id);
  const c2 = prompt('ID do Capitão 2:', players[1].user_id);
  const format = prompt('Formato (MD1 ou MD3):', 'MD1');
  
  if (!c1 || !c2 || !format) return;

  const res = await fetch('/api/veto/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ captain1_id: c1, captain2_id: c2, format: format.toUpperCase() })
  });
  const data = await res.json();
  if (data.id) {
    router.push(`/veto/${data.id}`);
  } else {
    alert('Erro ao criar sala de veto');
  }
};

// Add the button next to the "Adicionar à lista" button:
<button onClick={handleCreateVeto} className="flex items-center gap-2 px-3 py-1.5 border border-purple-500/30 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors uppercase tracking-wider ml-2">
  Criar Votação
</button>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/player/PlayersMasterDetail.tsx
git commit -m "feat: add create veto button to players list"
```

### Task 4: Veto Room UI Component

**Files:**
- Create: `src/app/veto/[id]/page.tsx`
- Create: `src/components/veto/VetoRoom.tsx`

**Interfaces:**
- Consumes: `match_vetoes` DB row, Supabase Realtime
- Produces: The real-time interactive map veto page.

- [ ] **Step 1: Create the Server Page**

```typescript
// src/app/veto/[id]/page.tsx
import { VetoRoom } from '@/components/veto/VetoRoom';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function VetoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: room, error } = await supabase.from('match_vetoes').select('*').eq('id', id).single();
  
  if (error || !room) return notFound();

  return <VetoRoom initialRoom={room} />;
}
```

- [ ] **Step 2: Create the Client Component**

```typescript
// src/components/veto/VetoRoom.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const MAPS = ['Mirage', 'Dust 2', 'Anubis', 'Inferno', 'Cache', 'Ancient', 'Nuke'];

export function VetoRoom({ initialRoom }: { initialRoom: any }) {
  const [room, setRoom] = useState(initialRoom);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));

    const channel = supabase.channel(`veto-${room.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'match_vetoes', filter: `id=eq.${room.id}` }, (payload) => {
        setRoom(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [room.id]);

  const handleMapClick = async (mapName: string) => {
    if (room.status === 'completed') return;
    if (room.current_turn !== userId) return alert('Não é o seu turno!');
    if (room.actions.some((a: any) => a.map === mapName)) return;

    // Simplified Logic for MD1 strictly
    const actionType = room.actions.length === 6 ? 'pick' : 'ban';
    const newActions = [...room.actions, { action: actionType, map: mapName, by: userId }];
    
    // Determine next turn
    let nextTurn = room.current_turn;
    if (room.format === 'MD1') {
       if (newActions.length === 2) nextTurn = room.captain2_id;
       else if (newActions.length === 5) nextTurn = room.captain1_id;
    }
    
    const newStatus = newActions.length === 7 ? 'completed' : 'in_progress';

    await supabase.from('match_vetoes').update({ 
      actions: newActions, 
      current_turn: nextTurn,
      status: newStatus
    }).eq('id', room.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white font-rajdhani">
      <h1 className="text-4xl text-center font-oswald uppercase mb-8">Veto de Mapas ({room.format})</h1>
      <div className="text-center mb-8">
        <p className="text-2xl">Turno Atual: {room.current_turn === room.captain1_id ? 'Capitão 1' : 'Capitão 2'}</p>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {MAPS.map(map => {
          const action = room.actions.find((a: any) => a.map === map);
          return (
            <div key={map} onClick={() => handleMapClick(map)}
                 className="w-48 h-64 bg-slate-800 border border-white/20 rounded-xl flex items-center justify-center cursor-pointer relative overflow-hidden">
               <span className="text-2xl font-bold uppercase z-10">{map}</span>
               {action && (
                 <div className={`absolute inset-0 flex items-center justify-center opacity-80 ${action.action === 'ban' ? 'bg-rose-600' : 'bg-green-600'}`}>
                    <span className="text-4xl font-black rotate-[-15deg]">{action.action}</span>
                 </div>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/veto/ src/components/veto/
git commit -m "feat: add realtime map veto UI"
```

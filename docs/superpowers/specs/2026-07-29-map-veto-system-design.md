# Map Veto System Design

## Overview
A real-time map pick/ban (veto) system for two captains to decide the maps to be played in a match. The system supports MD1 (Best of 1) and MD3 (Best of 3) formats and provides a visually rich UI using map images and real-time syncing via Supabase.

## Architecture

### Database (Supabase)
A new table `match_vetoes` will be created to manage the state of the voting room.
- `id`: UUID (Primary Key)
- `captain1_id`: UUID (References `auth.users` or `interested_players`)
- `captain2_id`: UUID
- `format`: String (`MD1` or `MD3`)
- `status`: String (`pending`, `in_progress`, `completed`)
- `current_turn`: UUID (Who is currently allowed to vote)
- `actions`: JSONB (Array of actions: `{ action: 'ban'|'pick', map: 'Mirage', by: UUID }`)
- `created_at`: Timestamp

Row Level Security (RLS) will be enabled so that only authenticated users can update the row if it's their turn.

### Realtime Sync
The frontend will use `@supabase/supabase-js` to subscribe to changes on the `match_vetoes` row. When a captain clicks a map, it updates the row, triggering a real-time broadcast to the other captain's screen.

## User Flow & UI

### Room Creation (Admin)
- A "Criar Votação" button on the `/players` sidebar.
- A simple modal/page where the admin selects the two captains and the format (MD1/MD3).
- It generates a unique URL (e.g., `/veto/[id]`) to be shared with the captains.

### Voting Interface (`/veto/[id]`)
- Displays a grid of 7 map cards (Mirage, Dust 2, Anubis, Inferno, Cache, Ancient, Nuke) using rich background images and glassmorphism.
- Shows the current turn prominently with a glowing indicator.
- Maps can be clicked by the captain whose turn it is.
- Banned maps get a red overlay with a cross/"BANNED" text.
- Picked maps get a green overlay with "PICKED".

## Turn Sequences

### MD1 (Best of 1)
Strictly follows the user's requested consecutive format:
1. **Captain 1** bans 2 maps (Turn stays on Captain 1 until 2 bans are made).
2. **Captain 2** bans 3 maps (Turn stays on Captain 2 until 3 bans are made).
3. **Captain 1** picks 1 map from the remaining 2.
4. Draft ends.

### MD3 (Best of 3)
1. **Captain 1** bans 1 map.
2. **Captain 2** bans 1 map.
3. **Captain 1** picks Map 1.
4. **Captain 2** picks Map 2.
5. The system immediately and **randomly picks** the 3rd decider map from the remaining 3 maps.
6. Draft ends.

## Edge Cases & Error Handling
- Non-captains or unauthenticated users visiting the URL will be in "Spectator Mode" (read-only view of the live voting).
- Captains trying to vote out of turn or vote for already selected maps will have the action blocked by the UI and DB.

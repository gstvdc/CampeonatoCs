# Player Profile & Login Design Spec

## Overview
Implement an authentication and profile management system for players. Currently, players exist in the `interested_players` table but do not have user accounts or customizable profiles (like an avatar). We need to bulk-create user accounts for them so they can log in, change their password, and upload a profile picture.

## Architecture & Components

### 1. Database Schema Changes
- **Table `interested_players`:**
  - Add `user_id` (UUID, references `auth.users(id)`). This links the statistical player profile to a Supabase authentication user.
  - Add `avatar_url` (TEXT). This stores the path to the uploaded image in Supabase Storage.

### 2. Supabase Storage
- Create a new public storage bucket named `avatars` to store profile pictures.
- Add RLS policies to `avatars` bucket:
  - `SELECT`: public (everyone can view avatars).
  - `INSERT` / `UPDATE` / `DELETE`: authenticated users only, and ideally restricted so a user can only upload/modify their own avatar path.

### 3. Account Migration Strategy
- Write a one-off script or use a Supabase edge function/API route to bulk-create accounts for all players currently in `interested_players` without a `user_id`.
- **Email generation:** `[lowercase_player_name_without_spaces]@campeonato.com`.
- **Default password:** `abd123`.
- After creating the `auth.users` record, the script updates the `interested_players.user_id` with the newly created ID.

### 4. Authentication (Frontend)
- **Page:** `/login`
- Uses Supabase Auth to sign in users with Email and Password.
- On successful login, redirect to `/perfil/editar` (or the dashboard).

### 5. Profile Edit Page (Frontend)
- **Page:** `/perfil/editar`
- **Route Protection:** Must redirect to `/login` if not authenticated.
- **Functionality:**
  - Avatar Upload: A UI component to select an image, upload it to the `avatars` bucket, and update the `avatar_url` in the `interested_players` table.
  - Change Password: A form to call `supabase.auth.updateUser({ password: newPassword })` so players can change from `abd123`.

### 6. Public Profile Page Updates
- **Page:** `/player/[id]/page.tsx`
- Modify the logic to use the `avatar_url` from the database if it exists. If it is null, fallback to the existing `/captains/default.png`.

## Error Handling
- Supabase Storage upload failures should gracefully show a toast/alert to the user.
- Login errors (wrong password) should be displayed clearly on the `/login` page.
- If a user tries to access `/perfil/editar` without being logged in, they are redirected.

## Testing Strategy
- Test the migration script on a few dummy records first or ensure we can rollback.
- Verify login works with the generated email and default password.
- Verify avatar upload successfully writes to the bucket and updates the `interested_players` row.
- Verify the public profile displays the newly uploaded avatar.

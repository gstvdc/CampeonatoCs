-- supabase/migrations/20260728_add_player_profiles.sql
ALTER TABLE public.interested_players 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Storage Bucket for Avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Avatar public access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Avatar auth insert" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY "Avatar auth update" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

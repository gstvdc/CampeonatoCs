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

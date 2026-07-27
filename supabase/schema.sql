-- Schema Atualizado para Banco de Dados Supabase (Copa Lucas Moura 2ª Edição - CS2)

-- 1. Tabela de Capitães
CREATE TABLE IF NOT EXISTS public.captains (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    team_name TEXT NOT NULL,
    steam_id TEXT NOT NULL,
    avatar_url TEXT,
    color TEXT DEFAULT '#f59e0b',
    contact_phone TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Jogadores Interessados (Inscrições individuais para o Draft do Dia 08/08)
CREATE TABLE IF NOT EXISTS public.interested_players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    captain_name TEXT NOT NULL, -- Gusta, HPS, Léo, Zane ou Qualquer
    player_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    steam_id TEXT NOT NULL,
    role TEXT DEFAULT 'Rifler',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar RLS
ALTER TABLE public.captains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interested_players ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Leitura e Inserção Pública
CREATE POLICY "Leitura pública de capitães" ON public.captains FOR SELECT USING (true);
CREATE POLICY "Cadastro público de capitães" ON public.captains FOR INSERT WITH CHECK (true);

CREATE POLICY "Leitura pública de interessados" ON public.interested_players FOR SELECT USING (true);
CREATE POLICY "Cadastro público de interessados" ON public.interested_players FOR INSERT WITH CHECK (true);

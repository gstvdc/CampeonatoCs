-- Script gerado automaticamente pelo robô do CSStats + Leetify
DROP TABLE IF EXISTS public.interested_players;

CREATE TABLE public.interested_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_name TEXT NOT NULL,
    steam_id TEXT,
    faceit_id TEXT,
    premier_points INTEGER,
    kd_ratio NUMERIC,
    win_rate INTEGER,
    role TEXT,
    stat_mira INTEGER DEFAULT 50,
    stat_nocao INTEGER DEFAULT 50,
    stat_utilitaria INTEGER DEFAULT 50,
    stat_movimentacao INTEGER DEFAULT 50,
    stat_impacto INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Desabilita temporariamente o RLS para garantir que a inserção funcione se for via API, ou cria as políticas
ALTER TABLE public.interested_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
ON public.interested_players
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert"
ON public.interested_players
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update"
ON public.interested_players
FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete"
ON public.interested_players
FOR DELETE
USING (true);

INSERT INTO public.interested_players (player_name, steam_id, premier_points, kd_ratio, win_rate, role) VALUES
('HPS', 'https://steamcommunity.com/profiles/76561198307975279', 28088, 1.3, 57, 'Entry Fragger'),
('GUSTA', 'https://steamcommunity.com/profiles/76561198041561362', 30000, 1.25, 56, 'Entry Fragger'),
('SOUZ', 'https://steamcommunity.com/profiles/76561198172431970', 25654, 1.27, 57, 'Entry Fragger'),
('ZANE', 'https://steamcommunity.com/profiles/76561198981339882', 24189, 1.3, 58, 'Entry Fragger'),
('GONZA', 'https://steamcommunity.com/profiles/76561198074932950', 21246, 1.13, 52, 'Rifler'),
('SUCO', 'https://steamcommunity.com/profiles/76561198354809416', 22457, 1.14, 51, 'Rifler'),
('LUCAS MOURA', 'https://steamcommunity.com/profiles/76561198105201024', 22236, 1.16, 52, 'Rifler'),
('BLAZER', 'https://steamcommunity.com/profiles/76561198090108428', 21841, 1.07, 49, 'AWPer'),
('PYONG', 'https://steamcommunity.com/profiles/76561198313120130', 24788, 1.17, 53, 'Rifler'),
('JOAOZAO', 'https://steamcommunity.com/profiles/76561199017898105', 18722, 1.01, 47, 'Rifler'),
('OYZ', 'https://steamcommunity.com/profiles/76561198090139576', 10000, 1.09, 52, 'Rifler'),
('WITT', 'https://steamcommunity.com/profiles/76561198308591706', 18479, 1.01, 47, 'Rifler'),
('RICHA', 'https://steamcommunity.com/profiles/76561198203860751', 19999, 1.13, 52, 'Rifler'),
('HAXI', 'https://steamcommunity.com/profiles/76561198452343727', 24348, 1.17, 52, 'Rifler'),
('SCALCO', 'https://steamcommunity.com/profiles/76561198142881775', 13435, 1.04, 51, 'Rifler'),
('RAFINHA', 'https://steamcommunity.com/profiles/76561198331708293', 9881, 0.93, 49, 'Support'),
('BENHUR', 'https://steamcommunity.com/profiles/76561198145387248', 7457, 0.82, 44, 'Support'),
('CUNHA', 'https://steamcommunity.com/profiles/76561198267183907', 6416, 0.72, 40, 'Support'),
('CENOURA', 'https://steamcommunity.com/profiles/76561198865546206', 7049, 0.72, 40, 'Support'),
('GUI COELHO', 'https://steamcommunity.com/profiles/76561198309460901', 10000, 0.9, 45, 'Rifler'),
('ANDREZINHO', 'https://steamcommunity.com/profiles/76561198337786442', 3164, 1, 49, 'Support');
export interface CaptainProfile {
  id?: string;
  name: string;
  team_name: string;
  steam_id: string;
  avatar_url?: string;
  color?: string;
  premier_points: number;
  created_at?: string;
}

export type InterestedPlayer = {
  id: string;
  captain_name: string;
  player_name: string;
  premier_points: number;
  steam_id: string;
  role?: string;
  ip_address?: string;
  player_password?: string;
  created_at: string;
};

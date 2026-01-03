
export enum LeagueCategory {
  EUROPE = 'Europe',
  SAUDI = 'Saudi',
}

export interface Player {
  id: string;
  name: string;
  nationalTeam: string;
  club: string;
  league: LeagueCategory;
  position: string;
  age: number;
  marketValue: string;
  starPower: number; // 1-5
  description: string;
  imageUrl?: string;
  nationColor?: string; // HEX color for UI branding
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface PlayerListResponse {
  players: Player[];
  sources: GroundingSource[];
}

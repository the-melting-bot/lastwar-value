export interface Server {
  id: number;
  createdAt?: string;
  merged: boolean;
  regions?: string[];
}

export interface ServerInfo {
  id: number;
  createdAt: string;
  day: number;
  season: number;
  regions: string[];
  merged: boolean;
}

export interface WeaponData {
  unlocked: boolean;
  level: number;
}

export interface EvaluationInput {
  // Step 1
  serverId: number;
  serverDay: number;
  serverSeason: number;

  // Step 2
  decorationPower: number;
  totalHeroPower: number;
  heroPowerRank: number;

  // Step 3
  mainSquadPower: number;
  exclusiveWeapons: WeaponData[];
  droneLevel: number;
  droneComponents: string;

  // Step 4
  skinsCount: number;
  overlordLevel: number;
  hqLevel: number;
  oilTechTree: string;

  // Step 5
  vipLevel: number;
  rssReserves: string;
  diamonds: number;
  totalMoneySpent: string;
}

export interface CategoryResult {
  key: string;
  name: string;
  emoji: string;
  playerValue: number | string;
  baseline: number | string;
  score: number;
  weight: number;
  weightedScore: number;
  dollarValue: number;
  label: string;
}

export interface ValuationResult {
  totalValue: number;
  lowRange: number;
  highRange: number;
  categories: CategoryResult[];
  weightedTotal: number;
}

export interface Evaluation {
  id: string;
  date: string;
  input: EvaluationInput;
  result: ValuationResult;
  serverInfo: {
    id: number;
    day: number;
    season: number;
  };
}

export const REGION_FLAGS: Record<string, string> = {
  AF: '🌍',
  EU: '🇪🇺',
  JP: '🇯🇵',
  KR: '🇰🇷',
  ME: '🌍',
  NA: '🇺🇸',
  OC: '🇦🇺',
  SA: '🌎',
  TR: '🇹🇷',
};

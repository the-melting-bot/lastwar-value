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

export type SquadType = 'Air' | 'Tank' | 'Missile';

export interface SquadHeroData {
  name: string;
  power: number;
}

export const SQUAD_HEROES: Record<SquadType, string[]> = {
  Air: ['DVA', 'Morrison', 'Carlie', 'Lucius', 'Schuyler'],
  Tank: ['Kimberly', 'Stetman', 'Williams', 'Murphy', 'Marshall'],
  Missile: ['Adam', 'Fiona', 'Tesla', 'Swift', 'McGregor'],
};

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
  squadType: SquadType | '';
  squadHeroes: Record<string, number>; // heroName -> power
  mainSquadPower: number; // total squad power (sum of hero powers or manual entry)
  exclusiveWeapons: WeaponData[]; // level now 1-30
  droneLevel: number;
  droneComponentLevel: number; // 1-10
  droneComponentPower: number; // overall component power

  // Step 4
  skinsCount: string; // dropdown: "0 Skins" | "1 Skin" | ... | "5+ Skins"
  overlordLevel: string; // dropdown: "Not Yet Unlocked" | "Level 1" | ... | "Level 10"
  hqLevel: number;
  oilTechTree: string; // new options: "Not Unlocked" | "Less than 20%" | "20% - 50%" | "50% - 80%" | "Above 80%" | "Maxed (100%)"

  // Step 5
  vipLevel: number;
  rssReserves: string;
  diamonds: number;
  totalMoneySpent: string;

  // Legacy field kept for backward compatibility when reading old evals
  droneComponents?: string;
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
  detail?: string; // extra display info for the results breakdown
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

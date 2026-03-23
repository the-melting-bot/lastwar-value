import { EvaluationInput, CategoryResult, ValuationResult } from './types';

// --- Baseline Curves (linear interpolation between anchors) ---

interface Anchor {
  day: number;
  value: number;
}

const DECORATION_POWER_ANCHORS: Anchor[] = [
  { day: 100, value: 20000 },
  { day: 300, value: 100000 },
  { day: 500, value: 300000 },
  { day: 700, value: 600000 },
  { day: 900, value: 1000000 },
];

const TOTAL_HERO_POWER_ANCHORS: Anchor[] = [
  { day: 100, value: 1000000 },
  { day: 300, value: 4000000 },
  { day: 500, value: 8000000 },
  { day: 700, value: 15000000 },
  { day: 900, value: 25000000 },
];

const MAIN_SQUAD_POWER_ANCHORS: Anchor[] = [
  { day: 100, value: 2000000 },
  { day: 300, value: 15000000 },
  { day: 500, value: 35000000 },
  { day: 700, value: 55000000 },
  { day: 900, value: 80000000 },
];

const DRONE_LEVEL_ANCHORS: Anchor[] = [
  { day: 100, value: 5 },
  { day: 300, value: 15 },
  { day: 500, value: 25 },
  { day: 700, value: 35 },
  { day: 900, value: 40 },
];

const DRONE_COMPONENT_POWER_ANCHORS: Anchor[] = [
  { day: 100, value: 50000 },
  { day: 300, value: 150000 },
  { day: 500, value: 350000 },
  { day: 700, value: 600000 },
  { day: 900, value: 900000 },
];

// Legacy skins anchors kept for backward compat
const SKINS_COUNT_ANCHORS: Anchor[] = [
  { day: 100, value: 1 },
  { day: 300, value: 4 },
  { day: 500, value: 8 },
  { day: 700, value: 12 },
  { day: 900, value: 18 },
];

function interpolate(anchors: Anchor[], day: number): number {
  const clampedDay = Math.max(100, Math.min(900, day));

  if (clampedDay <= anchors[0].day) return anchors[0].value;
  if (clampedDay >= anchors[anchors.length - 1].day)
    return anchors[anchors.length - 1].value;

  for (let i = 0; i < anchors.length - 1; i++) {
    if (clampedDay >= anchors[i].day && clampedDay <= anchors[i + 1].day) {
      const t =
        (clampedDay - anchors[i].day) /
        (anchors[i + 1].day - anchors[i].day);
      return anchors[i].value + t * (anchors[i + 1].value - anchors[i].value);
    }
  }
  return anchors[anchors.length - 1].value;
}

// --- Diminishing returns helper ---
// For ratio-based scores: being 2x baseline isn't worth 2x the score
function diminishingScore(ratio: number): number {
  if (ratio <= 1) return ratio;
  return 1 + Math.log2(ratio) * 0.5;
}

// --- Skins scoring (dropdown-based) ---

function scoreSkinsDropdown(skins: string | number): number {
  if (typeof skins === 'number') {
    if (skins >= 5) return 2.0;
    if (skins >= 4) return 1.6;
    if (skins >= 3) return 1.2;
    if (skins >= 2) return 0.9;
    if (skins >= 1) return 0.5;
    return 0.2;
  }
  switch (skins) {
    case '5+ Skins': return 2.0;
    case '4 Skins': return 1.6;
    case '3 Skins': return 1.2;
    case '2 Skins': return 0.9;
    case '1 Skin': return 0.5;
    case '0 Skins': return 0.2;
    default: return 0.2;
  }
}

// --- Overlord scoring (dropdown-based) ---

function scoreOverlordDropdown(level: string | number, season: number): number {
  if (season < 2) return 0;
  if (typeof level === 'number') {
    if (level >= 10) return 2.0;
    if (level >= 9) return 1.85;
    if (level >= 8) return 1.7;
    if (level >= 7) return 1.55;
    if (level >= 6) return 1.4;
    if (level >= 5) return 1.25;
    if (level >= 4) return 1.1;
    if (level >= 3) return 0.9;
    if (level >= 2) return 0.7;
    if (level >= 1) return 0.5;
    return 0.2;
  }
  switch (level) {
    case 'Level 10': return 2.0;
    case 'Level 9': return 1.85;
    case 'Level 8': return 1.7;
    case 'Level 7': return 1.55;
    case 'Level 6': return 1.4;
    case 'Level 5': return 1.25;
    case 'Level 4': return 1.1;
    case 'Level 3': return 0.9;
    case 'Level 2': return 0.7;
    case 'Level 1': return 0.5;
    case 'Not Yet Unlocked': return 0.2;
    default: return 0.2;
  }
}

// --- Direct Scoring Functions ---

function scoreHeroPowerRank(rank: number): number {
  if (rank <= 5) return 2.5;
  if (rank <= 10) return 2.0;
  if (rank <= 25) return 1.6;
  if (rank <= 50) return 1.3;
  if (rank <= 100) return 1.0;
  if (rank <= 500) return 0.7;
  return 0.4;
}

function scoreDroneComponentLevel(level: number): number {
  if (level >= 10) return 2.0;
  if (level >= 8) return 1.6;
  if (level >= 6) return 1.2;
  if (level >= 4) return 0.9;
  if (level >= 2) return 0.6;
  return 0.3;
}

function scoreDroneComponents(input: EvaluationInput, day: number): number {
  const levelScore = scoreDroneComponentLevel(input.droneComponentLevel || 1);
  const baseline = interpolate(DRONE_COMPONENT_POWER_ANCHORS, day);
  const powerRatio = (input.droneComponentPower || 0) / baseline;
  const powerScore = diminishingScore(powerRatio);
  return (levelScore + powerScore) / 2;
}

// CHANGE 4: Fixed exclusive weapons scoring — much more granular
function scoreExclusiveWeapons(
  weapons: { unlocked: boolean; level: number }[]
): number {
  const unlocked = weapons.filter((w) => w.unlocked);
  if (unlocked.length === 0) return 0.05;
  const avgLevel =
    unlocked.reduce((sum, w) => sum + w.level, 0) / unlocked.length;

  // Base score from unlock count (0.2 to 1.0)
  const countScore = unlocked.length / 5;

  // Level multiplier with diminishing returns after 20
  let levelMultiplier: number;
  if (avgLevel <= 10) {
    levelMultiplier = (avgLevel / 10) * 0.8;
  } else if (avgLevel <= 20) {
    levelMultiplier = 0.8 + ((avgLevel - 10) / 10) * 1.0;
  } else {
    levelMultiplier = 1.8 + ((avgLevel - 20) / 10) * 1.2;
  }

  return countScore * levelMultiplier;
}

// Main squad scoring with balance bonus
function scoreMainSquad(
  input: EvaluationInput,
  day: number
): { score: number; playerValue: number | string; baseline: number | string } {
  const squadBaseline = interpolate(MAIN_SQUAD_POWER_ANCHORS, day);

  const heroPowers = Object.values(input.squadHeroes || {}).filter((p) => p > 0);
  const totalFromHeroes = heroPowers.reduce((sum, p) => sum + p, 0);
  const totalPower = totalFromHeroes > 0 ? totalFromHeroes : (input.mainSquadPower || 0);

  const ratio = totalPower / squadBaseline;
  // CHANGE 5: Diminishing returns on squad power
  let score = diminishingScore(ratio);

  // Squad balance bonus
  if (heroPowers.length >= 2) {
    const maxPower = Math.max(...heroPowers);
    const minPower = Math.min(...heroPowers);
    if (maxPower > 0 && minPower >= maxPower * 0.7) {
      score *= 1.1;
    }
  }

  const squadTypeLabel = input.squadType ? ` (${input.squadType})` : '';

  return {
    score,
    playerValue: `${totalPower.toLocaleString('en-US')}${squadTypeLabel}`,
    baseline: Math.round(squadBaseline),
  };
}

function scoreHqLevel(level: number, season: number): number {
  if (season < 2) return 0;
  if (level >= 35) return 2.5;
  if (level >= 34) return 2.0;
  if (level >= 32) return 1.7;
  if (level >= 30) return 1.5;
  if (level >= 25) return 1.2;
  if (level >= 20) return 1.0;
  if (level >= 15) return 0.7;
  return 0.4;
}

function scoreOilTechTree(tree: string, season: number): number {
  if (season < 2) return 0;
  switch (tree) {
    case 'Maxed (100%)': return 2.0;
    case 'Above 80%': return 1.7;
    case '50% - 80%': return 1.3;
    case '20% - 50%': return 0.9;
    case 'Less than 20%': return 0.5;
    case 'Not Unlocked': return 0.2;
    case 'Maxed': return 2.0;
    case 'Advanced': return 1.5;
    case 'Mid': return 1.0;
    case 'Early': return 0.6;
    default: return 0.2;
  }
}

// CHANGE 3: Fixed VIP scoring — VIP 16+ is exponentially more valuable
function scoreVipLevel(level: number): number {
  if (level >= 18) return 4.0;
  if (level >= 17) return 3.5;
  if (level >= 16) return 3.0;
  if (level >= 15) return 2.2;
  if (level >= 14) return 1.8;
  if (level >= 13) return 1.4;
  if (level >= 12) return 1.1;
  if (level >= 11) return 0.9;
  if (level >= 10) return 0.7;
  if (level >= 8) return 0.5;
  if (level >= 5) return 0.3;
  return 0.15;
}

function scoreRssReserves(reserves: string): number {
  switch (reserves) {
    case '5B+': return 2.0;
    case '1B-5B': return 1.5;
    case '500M-1B': return 1.1;
    case '100M-500M': return 0.8;
    case 'Under 100M': return 0.4;
    default: return 0.4;
  }
}

function scoreDiamonds(diamonds: number): number {
  if (diamonds >= 500000) return 2.5;
  if (diamonds >= 200000) return 1.8;
  if (diamonds >= 50000) return 1.2;
  if (diamonds >= 10000) return 0.7;
  return 0.3;
}

// --- CHANGE 1: Master Dollar Curve ---
// Converts a single weighted total score to a realistic market-based dollar value.
// weightedTotal typically ranges from 0.2 (barely played) to 2.5+ (mega whale).

function weightedScoreToDollar(weightedTotal: number): number {
  if (weightedTotal <= 0.3) return 15;
  if (weightedTotal <= 0.5) return 15 + ((weightedTotal - 0.3) / 0.2) * 35;
  if (weightedTotal <= 0.7) return 50 + ((weightedTotal - 0.5) / 0.2) * 75;
  if (weightedTotal <= 0.9) return 125 + ((weightedTotal - 0.7) / 0.2) * 125;
  if (weightedTotal <= 1.1) return 250 + ((weightedTotal - 0.9) / 0.2) * 200;
  if (weightedTotal <= 1.4) return 450 + ((weightedTotal - 1.1) / 0.3) * 350;
  if (weightedTotal <= 1.8) return 800 + ((weightedTotal - 1.4) / 0.4) * 700;
  if (weightedTotal <= 2.2) return 1500 + ((weightedTotal - 1.8) / 0.4) * 1500;
  if (weightedTotal <= 2.5) return 3000 + ((weightedTotal - 2.2) / 0.3) * 2000;
  return 5000 + (weightedTotal - 2.5) * 1500;
}

function getLabel(score: number): string {
  if (score < 0.5) return 'LOW';
  if (score < 0.85) return 'AVERAGE';
  if (score < 1.2) return 'ABOVE AVG';
  if (score < 1.7) return 'HIGH';
  return 'EXCEPTIONAL';
}

// --- CHANGE 2: Rebalanced Category Weights ---

const POST_SEASON2_WEIGHTS: Record<string, number> = {
  decorationPower: 0.18,
  totalHeroPower: 0.14,
  heroPowerRank: 0.07,
  mainSquadPower: 0.10,
  exclusiveWeapons: 0.12,
  droneLevel: 0.05,
  droneComponents: 0.04,
  skinsCount: 0.04,
  overlordLevel: 0.04,
  hqLevel: 0.05,
  oilTechTree: 0.04,
  vipLevel: 0.08,
  rssReserves: 0.03,
  diamonds: 0.02,
};

const PRE_SEASON2_WEIGHTS: Record<string, number> = {
  decorationPower: 0.22,
  totalHeroPower: 0.18,
  heroPowerRank: 0.08,
  mainSquadPower: 0.13,
  exclusiveWeapons: 0.12,
  droneLevel: 0.06,
  droneComponents: 0.05,
  skinsCount: 0.04,
  vipLevel: 0.08,
  overlordLevel: 0,
  hqLevel: 0,
  oilTechTree: 0,
  rssReserves: 0.02,
  diamonds: 0.02,
};

interface CategoryDef {
  key: string;
  name: string;
  emoji: string;
}

const CATEGORIES: CategoryDef[] = [
  { key: 'decorationPower', name: 'Decoration Power', emoji: '🏅' },
  { key: 'totalHeroPower', name: 'Total Hero Power', emoji: '⚔️' },
  { key: 'heroPowerRank', name: 'Hero Power Rank', emoji: '🏆' },
  { key: 'mainSquadPower', name: 'Main Squad Power', emoji: '💪' },
  { key: 'exclusiveWeapons', name: 'Exclusive Weapons', emoji: '🔫' },
  { key: 'droneLevel', name: 'Drone Level', emoji: '🤖' },
  { key: 'droneComponents', name: 'Drone Components', emoji: '🔧' },
  { key: 'skinsCount', name: 'Skins Count', emoji: '🎨' },
  { key: 'overlordLevel', name: 'Overlord Level', emoji: '👑' },
  { key: 'hqLevel', name: 'HQ Level', emoji: '🏠' },
  { key: 'oilTechTree', name: 'Oil Tech Tree', emoji: '🛢️' },
  { key: 'vipLevel', name: 'VIP Level', emoji: '⭐' },
  { key: 'rssReserves', name: 'RSS Reserves', emoji: '📦' },
  { key: 'diamonds', name: 'Diamonds', emoji: '💎' },
];

// --- Main Valuation ---

export function calculateValuation(input: EvaluationInput): ValuationResult {
  const day = input.serverDay;
  const season = input.serverSeason;
  const weights = season >= 2 ? POST_SEASON2_WEIGHTS : PRE_SEASON2_WEIGHTS;

  const scores: Record<string, { score: number; playerValue: number | string; baseline: number | string; detail?: string }> = {};

  // CHANGE 5: Decoration power with diminishing returns
  const decBaseline = interpolate(DECORATION_POWER_ANCHORS, day);
  const decRatio = input.decorationPower / decBaseline;
  scores.decorationPower = {
    score: diminishingScore(decRatio),
    playerValue: input.decorationPower,
    baseline: Math.round(decBaseline),
  };

  // CHANGE 5: Hero power with diminishing returns
  const heroBaseline = interpolate(TOTAL_HERO_POWER_ANCHORS, day);
  const heroRatio = input.totalHeroPower / heroBaseline;
  scores.totalHeroPower = {
    score: diminishingScore(heroRatio),
    playerValue: input.totalHeroPower,
    baseline: Math.round(heroBaseline),
  };

  // Main squad (already uses diminishing returns)
  const squadResult = scoreMainSquad(input, day);
  scores.mainSquadPower = squadResult;

  const droneBaseline = interpolate(DRONE_LEVEL_ANCHORS, day);
  scores.droneLevel = {
    score: input.droneLevel / droneBaseline,
    playerValue: input.droneLevel,
    baseline: Math.round(droneBaseline),
  };

  scores.skinsCount = {
    score: scoreSkinsDropdown(input.skinsCount),
    playerValue: input.skinsCount,
    baseline: '3 Skins',
  };

  scores.heroPowerRank = {
    score: scoreHeroPowerRank(input.heroPowerRank),
    playerValue: input.heroPowerRank,
    baseline: 'Top 100',
  };

  const droneCompScore = scoreDroneComponents(input, day);
  const compBaseline = interpolate(DRONE_COMPONENT_POWER_ANCHORS, day);
  scores.droneComponents = {
    score: droneCompScore,
    playerValue: `Level ${input.droneComponentLevel || 1} — ${(input.droneComponentPower || 0).toLocaleString('en-US')} power`,
    baseline: `Level 6 — ${Math.round(compBaseline).toLocaleString('en-US')} power`,
  };

  // CHANGE 4: Updated weapon scoring
  const weaponScore = scoreExclusiveWeapons(input.exclusiveWeapons);
  const unlockedWeapons = input.exclusiveWeapons.filter((w) => w.unlocked);
  const avgWeaponLevel = unlockedWeapons.length > 0
    ? Math.round(unlockedWeapons.reduce((sum, w) => sum + w.level, 0) / unlockedWeapons.length)
    : 0;
  scores.exclusiveWeapons = {
    score: weaponScore,
    playerValue: `${unlockedWeapons.length}/5 Unlocked — Avg Level: ${avgWeaponLevel}`,
    baseline: '3/5 Unlocked — Avg Level: 15',
  };

  scores.overlordLevel = {
    score: scoreOverlordDropdown(input.overlordLevel, season),
    playerValue: season >= 2 ? input.overlordLevel : 'N/A',
    baseline: season >= 2 ? 'Level 5' : 'N/A',
  };

  scores.hqLevel = {
    score: scoreHqLevel(input.hqLevel, season),
    playerValue: season >= 2 ? input.hqLevel : 'N/A',
    baseline: season >= 2 ? '20' : 'N/A',
  };

  scores.oilTechTree = {
    score: scoreOilTechTree(input.oilTechTree, season),
    playerValue: season >= 2 ? input.oilTechTree : 'N/A',
    baseline: season >= 2 ? '50% - 80%' : 'N/A',
  };

  scores.vipLevel = {
    score: scoreVipLevel(input.vipLevel),
    playerValue: input.vipLevel,
    baseline: '10',
  };

  scores.rssReserves = {
    score: scoreRssReserves(input.rssReserves),
    playerValue: input.rssReserves,
    baseline: '500M-1B',
  };

  scores.diamonds = {
    score: scoreDiamonds(input.diamonds),
    playerValue: input.diamonds,
    baseline: '50,000',
  };

  // Build category results — calculate weighted total first
  let weightedTotal = 0;
  const categoriesRaw: CategoryResult[] = CATEGORIES.map((cat) => {
    const s = scores[cat.key];
    const weight = weights[cat.key] || 0;
    const weightedScore = s.score * weight;
    weightedTotal += weightedScore;

    return {
      key: cat.key,
      name: cat.name,
      emoji: cat.emoji,
      playerValue: s.playerValue,
      baseline: s.baseline,
      score: s.score,
      weight,
      weightedScore,
      dollarValue: 0, // Will be set after total is calculated
      label: weight > 0 ? getLabel(s.score) : 'N/A',
      detail: s.detail,
    };
  });

  // CHANGE 1: Convert the single weighted total to dollars using master curve
  const totalValue = Math.round(weightedScoreToDollar(weightedTotal));

  // Distribute dollar value proportionally across categories
  const categories = categoriesRaw.map((cat) => ({
    ...cat,
    dollarValue: weightedTotal > 0 && cat.weight > 0
      ? Math.round((cat.weightedScore / weightedTotal) * totalValue)
      : 0,
  }));

  // CHANGE 7: ±20% range
  const lowRange = Math.round(totalValue * 0.80);
  const highRange = Math.round(totalValue * 1.20);

  // Sort by dollar contribution descending
  categories.sort((a, b) => b.dollarValue - a.dollarValue);

  return {
    totalValue,
    lowRange,
    highRange,
    categories,
    weightedTotal,
  };
}

// --- Recommendations ---

export function getRecommendations(
  categories: CategoryResult[]
): { category: string; action: string; estimatedBoost: number }[] {
  const eligible = categories
    .filter((c) => c.weight > 0)
    .sort((a, b) => a.score - b.score);

  const actions: Record<string, string> = {
    decorationPower: 'Focus on decoration events and daily decoration quests',
    totalHeroPower: 'Invest in hero shards and hero experience items',
    heroPowerRank: 'Push hero power to climb server rankings',
    mainSquadPower: 'Balance your squad heroes and upgrade combat tech',
    exclusiveWeapons: 'Unlock and upgrade exclusive weapons (push toward level 30)',
    droneLevel: 'Farm drone EXP and upgrade drone consistently',
    droneComponents: 'Upgrade drone component levels and power',
    skinsCount: 'Collect skins from events and seasonal content',
    overlordLevel: 'Complete Overlord quests and challenges',
    hqLevel: 'Upgrade HQ by meeting building requirements',
    oilTechTree: 'Invest in oil tech research to increase completion %',
    vipLevel: 'Increase VIP through daily play and spending',
    rssReserves: 'Stockpile RSS from gathering and events',
    diamonds: 'Save diamonds and farm from events',
  };

  // Estimate boost: if this category improved by 0.3 score, how much would total change?
  // Use the master curve to estimate: current total value vs total value with boosted category
  const currentTotal = categories.reduce((sum, c) => sum + c.weightedScore, 0);
  const currentDollar = weightedScoreToDollar(currentTotal);

  return eligible.slice(0, 3).map((c) => {
    const boostedTotal = currentTotal + 0.3 * c.weight;
    const boostedDollar = weightedScoreToDollar(boostedTotal);
    return {
      category: `${c.emoji} ${c.name}`,
      action: actions[c.key] || 'Focus on improving this area',
      estimatedBoost: Math.round(boostedDollar - currentDollar),
    };
  });
}

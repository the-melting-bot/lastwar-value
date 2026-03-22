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

// --- Direct Scoring ---

function scoreHeroPowerRank(rank: number): number {
  if (rank <= 5) return 2.5;
  if (rank <= 10) return 2.0;
  if (rank <= 25) return 1.6;
  if (rank <= 50) return 1.3;
  if (rank <= 100) return 1.0;
  if (rank <= 500) return 0.7;
  return 0.4;
}

function scoreDroneComponents(component: string): number {
  switch (component) {
    case 'Max Legendary':
      return 2.0;
    case 'Mix of Legendary & Epic':
      return 1.4;
    case 'Mostly Epic':
      return 1.0;
    case 'Mostly Rare':
      return 0.5;
    default:
      return 0.5;
  }
}

function scoreExclusiveWeapons(
  weapons: { unlocked: boolean; level: number }[]
): number {
  const unlocked = weapons.filter((w) => w.unlocked);
  if (unlocked.length === 0) return 0.1;
  const avgLevel =
    unlocked.reduce((sum, w) => sum + w.level, 0) / unlocked.length;
  return (unlocked.length / 5) * (avgLevel / 10) * 2.5;
}

function scoreOverlordLevel(level: number, season: number): number {
  if (season < 2) return 0;
  if (level >= 40) return 2.0;
  if (level >= 30) return 1.5;
  if (level >= 20) return 1.1;
  if (level >= 10) return 0.8;
  return 0.5;
}

function scoreHqLevel(level: number, season: number): number {
  if (season < 2) return 0;
  if (level >= 30) return 1.5;
  if (level >= 25) return 1.2;
  if (level >= 20) return 1.0;
  if (level >= 15) return 0.7;
  return 0.4;
}

function scoreOilTechTree(tree: string, season: number): number {
  if (season < 2) return 0;
  switch (tree) {
    case 'Maxed':
      return 2.0;
    case 'Advanced':
      return 1.5;
    case 'Mid':
      return 1.0;
    case 'Early':
      return 0.6;
    case 'Not Unlocked':
      return 0.2;
    default:
      return 0.2;
  }
}

function scoreVipLevel(level: number): number {
  if (level >= 15) return 2.0;
  if (level >= 12) return 1.5;
  if (level >= 10) return 1.1;
  if (level >= 7) return 0.7;
  return 0.4;
}

function scoreRssReserves(reserves: string): number {
  switch (reserves) {
    case '5B+':
      return 2.0;
    case '1B-5B':
      return 1.5;
    case '500M-1B':
      return 1.1;
    case '100M-500M':
      return 0.8;
    case 'Under 100M':
      return 0.4;
    default:
      return 0.4;
  }
}

function scoreDiamonds(diamonds: number): number {
  if (diamonds >= 500000) return 2.5;
  if (diamonds >= 200000) return 1.8;
  if (diamonds >= 50000) return 1.2;
  if (diamonds >= 10000) return 0.7;
  return 0.3;
}

// --- Dollar Conversion ---

function scoreToDollar(score: number): number {
  if (score <= 0) return 5;
  if (score <= 0.4) return 5 + (score / 0.4) * 20;
  if (score <= 0.7) return 25 + ((score - 0.4) / 0.3) * 50;
  if (score <= 1.0) return 75 + ((score - 0.7) / 0.3) * 100;
  if (score <= 1.4) return 175 + ((score - 1.0) / 0.4) * 175;
  if (score <= 1.8) return 350 + ((score - 1.4) / 0.4) * 250;
  if (score <= 2.5) return 600 + ((score - 1.8) / 0.7) * 600;
  return 1200 + (score - 2.5) * 400;
}

function getLabel(score: number): string {
  if (score < 0.5) return 'LOW';
  if (score < 0.85) return 'AVERAGE';
  if (score < 1.2) return 'ABOVE AVG';
  if (score < 1.7) return 'HIGH';
  return 'EXCEPTIONAL';
}

// --- Category Weights ---

const POST_SEASON2_WEIGHTS: Record<string, number> = {
  decorationPower: 0.23,
  totalHeroPower: 0.16,
  heroPowerRank: 0.09,
  mainSquadPower: 0.1,
  exclusiveWeapons: 0.08,
  droneLevel: 0.06,
  droneComponents: 0.05,
  skinsCount: 0.04,
  overlordLevel: 0.05,
  hqLevel: 0.04,
  oilTechTree: 0.04,
  vipLevel: 0.03,
  rssReserves: 0.015,
  diamonds: 0.015,
};

const PRE_SEASON2_WEIGHTS: Record<string, number> = {
  decorationPower: 0.28,
  totalHeroPower: 0.2,
  heroPowerRank: 0.09,
  mainSquadPower: 0.13,
  exclusiveWeapons: 0.1,
  droneLevel: 0.07,
  droneComponents: 0.06,
  skinsCount: 0.04,
  vipLevel: 0.03,
  overlordLevel: 0,
  hqLevel: 0,
  oilTechTree: 0,
  rssReserves: 0,
  diamonds: 0,
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

  const scores: Record<string, { score: number; playerValue: number | string; baseline: number | string }> = {};

  // Interpolated categories
  const decBaseline = interpolate(DECORATION_POWER_ANCHORS, day);
  scores.decorationPower = {
    score: input.decorationPower / decBaseline,
    playerValue: input.decorationPower,
    baseline: Math.round(decBaseline),
  };

  const heroBaseline = interpolate(TOTAL_HERO_POWER_ANCHORS, day);
  scores.totalHeroPower = {
    score: input.totalHeroPower / heroBaseline,
    playerValue: input.totalHeroPower,
    baseline: Math.round(heroBaseline),
  };

  const squadBaseline = interpolate(MAIN_SQUAD_POWER_ANCHORS, day);
  scores.mainSquadPower = {
    score: input.mainSquadPower / squadBaseline,
    playerValue: input.mainSquadPower,
    baseline: Math.round(squadBaseline),
  };

  const droneBaseline = interpolate(DRONE_LEVEL_ANCHORS, day);
  scores.droneLevel = {
    score: input.droneLevel / droneBaseline,
    playerValue: input.droneLevel,
    baseline: Math.round(droneBaseline),
  };

  const skinsBaseline = interpolate(SKINS_COUNT_ANCHORS, day);
  scores.skinsCount = {
    score: input.skinsCount / skinsBaseline,
    playerValue: input.skinsCount,
    baseline: Math.round(skinsBaseline),
  };

  // Direct scoring
  scores.heroPowerRank = {
    score: scoreHeroPowerRank(input.heroPowerRank),
    playerValue: input.heroPowerRank,
    baseline: 'Top 100',
  };

  scores.droneComponents = {
    score: scoreDroneComponents(input.droneComponents),
    playerValue: input.droneComponents,
    baseline: 'Mostly Epic',
  };

  scores.exclusiveWeapons = {
    score: scoreExclusiveWeapons(input.exclusiveWeapons),
    playerValue: `${input.exclusiveWeapons.filter((w) => w.unlocked).length}/5 unlocked`,
    baseline: '3/5 unlocked',
  };

  scores.overlordLevel = {
    score: scoreOverlordLevel(input.overlordLevel, season),
    playerValue: season >= 2 ? input.overlordLevel : 'N/A',
    baseline: season >= 2 ? '20' : 'N/A',
  };

  scores.hqLevel = {
    score: scoreHqLevel(input.hqLevel, season),
    playerValue: season >= 2 ? input.hqLevel : 'N/A',
    baseline: season >= 2 ? '20' : 'N/A',
  };

  scores.oilTechTree = {
    score: scoreOilTechTree(input.oilTechTree, season),
    playerValue: season >= 2 ? input.oilTechTree : 'N/A',
    baseline: season >= 2 ? 'Mid' : 'N/A',
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

  // Build category results
  let weightedTotal = 0;
  const categories: CategoryResult[] = CATEGORIES.map((cat) => {
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
      dollarValue: weight > 0 ? scoreToDollar(s.score) * weight : 0,
      label: weight > 0 ? getLabel(s.score) : 'N/A',
    };
  });

  // Total dollar value: sum of (scoreToDollar(categoryScore) * weight) for each category
  const totalValue = categories.reduce((sum, c) => sum + c.dollarValue, 0);
  const lowRange = Math.round(totalValue * 0.88);
  const highRange = Math.round(totalValue * 1.12);

  // Sort by dollar contribution descending
  categories.sort((a, b) => b.dollarValue - a.dollarValue);

  return {
    totalValue: Math.round(totalValue),
    lowRange,
    highRange,
    categories,
    weightedTotal,
  };
}

export function getRecommendations(
  categories: CategoryResult[]
): { category: string; action: string; estimatedBoost: number }[] {
  // Find 3 categories with lowest scores that have weight > 0
  const eligible = categories
    .filter((c) => c.weight > 0)
    .sort((a, b) => a.score - b.score);

  const actions: Record<string, string> = {
    decorationPower: 'Focus on decoration events and daily decoration quests',
    totalHeroPower: 'Invest in hero shards and hero experience items',
    heroPowerRank: 'Push hero power to climb server rankings',
    mainSquadPower: 'Level up main squad troops and research combat tech',
    exclusiveWeapons: 'Unlock and upgrade exclusive weapons in events',
    droneLevel: 'Farm drone EXP and upgrade drone consistently',
    droneComponents: 'Focus on getting Epic and Legendary drone parts',
    skinsCount: 'Collect skins from events and seasonal content',
    overlordLevel: 'Complete Overlord quests and challenges',
    hqLevel: 'Upgrade HQ by meeting building requirements',
    oilTechTree: 'Invest in oil tech research',
    vipLevel: 'Increase VIP through daily play and spending',
    rssReserves: 'Stockpile RSS from gathering and events',
    diamonds: 'Save diamonds and farm from events',
  };

  return eligible.slice(0, 3).map((c) => ({
    category: `${c.emoji} ${c.name}`,
    action: actions[c.key] || 'Focus on improving this area',
    estimatedBoost: Math.round(
      (scoreToDollar(Math.min(c.score + 0.3, 2.5)) - scoreToDollar(c.score)) *
        c.weight
    ),
  }));
}

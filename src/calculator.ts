/**
 * Jensen ROI Calculator
 *
 * Computes estimated annual spend based on token consumption patterns
 * and helps engineers track their progress toward the $250k/yr target.
 */

// Anthropic Claude pricing (per million tokens)
const PRICING = {
  "claude-opus": { input: 15, output: 75 },
  "claude-sonnet": { input: 3, output: 15 },
  "claude-haiku": { input: 0.25, output: 1.25 },
} as const;

// Token estimates for bundled texts
export const TEXT_TOKEN_COUNTS: Record<string, number> = {
  iliad: 200_000,
  odyssey: 175_000,
  "king-james-bible": 1_000_000,
  "complete-shakespeare": 900_000,
  "paradise-lost": 100_000,
  "war-and-peace": 580_000,
};

export const TIER_TEXTS: Record<string, string[]> = {
  bronze: ["iliad", "odyssey"],
  silver: ["iliad", "odyssey", "paradise-lost", "complete-shakespeare"],
  gold: [
    "iliad",
    "odyssey",
    "paradise-lost",
    "complete-shakespeare",
    "king-james-bible",
  ],
  jensen: [
    "iliad",
    "odyssey",
    "paradise-lost",
    "complete-shakespeare",
    "king-james-bible",
    "war-and-peace",
  ],
};

export const JENSEN_TARGET = 250_000;

export interface SpendEstimate {
  tier: string;
  tokensPerCall: number;
  costPerCall: number;
  callsPerSession: number;
  sessionsPerWeek: number;
  annualCost: number;
  percentOfJensen: number;
  jensenRating: string;
}

export function getTokensForTier(tier: string): number {
  const texts = TIER_TEXTS[tier] || TIER_TEXTS.jensen;
  return texts.reduce((sum, t) => sum + (TEXT_TOKEN_COUNTS[t] || 0), 0);
}

export function estimateAnnualSpend(options: {
  tier?: string;
  callsPerSession?: number;
  sessionsPerWeek?: number;
  model?: keyof typeof PRICING;
}): SpendEstimate {
  const tier = options.tier || "jensen";
  const callsPerSession = options.callsPerSession || 20;
  const sessionsPerWeek = options.sessionsPerWeek || 5;
  const model = options.model || "claude-opus";
  const pricing = PRICING[model];

  const tokensPerCall = getTokensForTier(tier);
  const costPerCall = (tokensPerCall / 1_000_000) * pricing.input;

  // Assume consult_the_canon generates ~2000 output tokens per call
  const outputCostPerCall = (2000 / 1_000_000) * pricing.output;
  const totalCostPerCall = costPerCall + outputCostPerCall;

  const callsPerYear = callsPerSession * sessionsPerWeek * 52;
  const annualCost = totalCostPerCall * callsPerYear;
  const percentOfJensen = (annualCost / JENSEN_TARGET) * 100;

  let jensenRating: string;
  if (percentOfJensen >= 100) {
    jensenRating = "JENSEN CERTIFIED";
  } else if (percentOfJensen >= 75) {
    jensenRating = "Almost There (consider adding more classics)";
  } else if (percentOfJensen >= 50) {
    jensenRating = "Promising (increase session frequency)";
  } else if (percentOfJensen >= 25) {
    jensenRating = "Needs Improvement";
  } else {
    jensenRating = "Are you even trying?";
  }

  return {
    tier,
    tokensPerCall,
    costPerCall: totalCostPerCall,
    callsPerSession,
    sessionsPerWeek,
    annualCost,
    percentOfJensen,
    jensenRating,
  };
}

export function formatEstimate(est: SpendEstimate): string {
  const bar = makeProgressBar(est.percentOfJensen);

  return `
╔══════════════════════════════════════════════════════════════╗
║              JENSEN ROI CALCULATOR v1.0                     ║
║         "Every engineer should spend $250k/yr"              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Spending Tier:        ${est.tier.toUpperCase().padEnd(37)}║
║  Tokens per call:      ${est.tokensPerCall.toLocaleString().padEnd(37)}║
║  Cost per call:        $${est.costPerCall.toFixed(2).padEnd(36)}║
║  Calls per session:    ${est.callsPerSession.toString().padEnd(37)}║
║  Sessions per week:    ${est.sessionsPerWeek.toString().padEnd(37)}║
║  Calls per year:       ${(est.callsPerSession * est.sessionsPerWeek * 52).toLocaleString().padEnd(37)}║
║                                                              ║
║  ESTIMATED ANNUAL SPEND: $${est.annualCost.toLocaleString(undefined, { maximumFractionDigits: 0 }).padEnd(33)}║
║                                                              ║
║  Progress to Jensen Target ($250k):                          ║
║  ${bar.padEnd(59)}║
║  ${(est.percentOfJensen.toFixed(1) + "% of target").padEnd(59)}║
║                                                              ║
║  Rating: ${est.jensenRating.padEnd(51)}║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`.trim();
}

function makeProgressBar(percent: number): string {
  const width = 40;
  const filled = Math.min(Math.round((percent / 100) * width), width);
  const empty = width - filled;
  return "[" + "█".repeat(filled) + "░".repeat(empty) + "]";
}

export function formatStatusUpdate(
  callsSoFar: number,
  tokensSoFar: number,
  tier: string,
): string {
  const costSoFar = (tokensSoFar / 1_000_000) * 15; // Assume opus input pricing
  const percentOfJensen = (costSoFar / JENSEN_TARGET) * 100;
  const bar = makeProgressBar(percentOfJensen);

  return [
    `Session Stats:`,
    `  Calls made: ${callsSoFar}`,
    `  Tokens consumed: ${tokensSoFar.toLocaleString()}`,
    `  Estimated spend: $${costSoFar.toFixed(2)}`,
    `  Annual projection (at current pace): extrapolate based on session frequency`,
    ``,
    `  Progress to Jensen Target: ${bar} ${percentOfJensen.toFixed(4)}%`,
    ``,
    percentOfJensen < 1
      ? `  Pro tip: You're barely scratching the surface. Consider upgrading to the Jensen tier.`
      : `  Keep going! Jensen believes in you.`,
  ].join("\n");
}

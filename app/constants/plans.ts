export const PLANS = {
  FREE: "Free",
  STANDARD: "Standard",
  PREMIUM: "Premium",
} as const;

export type PlanType = typeof PLANS[keyof typeof PLANS];

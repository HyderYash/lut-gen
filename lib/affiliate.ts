import { prisma } from "./prisma"

export const COMMISSION_TIERS = {
  TIER_1: { min: 0, max: 10, rate: 0.2 }, // 20%
  TIER_2: { min: 11, max: 20, rate: 0.25 }, // 25%
  TIER_3: { min: 21, max: 50, rate: 0.3 }, // 30%
  TIER_4: { min: 51, max: Infinity, rate: 0.35 }, // 35%
}

export const MILESTONE_BONUS = 100 // $100 bonus at 100 referrals

export function calculateCommissionTier(totalReferrals: number): number {
  if (totalReferrals >= 51) return 35;
  if (totalReferrals >= 21) return 30;
  if (totalReferrals >= 11) return 25;
  return 20; // Base commission rate
}

export function calculateMilestoneBonus(totalReferrals: number): number {
  if (totalReferrals >= 100) return 100; // $100 bonus for 100 referrals
  return 0;
}

export async function processCommission(referrerId: string, amount: number, description: string) {
  const referrer = await prisma.user.findUnique({
    where: { id: referrerId }
  });

  if (!referrer) {
    throw new Error("Referrer not found");
  }

  const totalReferrals = referrer.totalReferrals || 0;
  const monthlyReferrals = referrer.monthlyReferrals || 0;
  const currentTier = calculateCommissionTier(totalReferrals);
  
  // Calculate commission amount based on tier
  const commissionAmount = (amount * currentTier) / 100;
  
  // Check for milestone bonus
  const milestoneBonus = calculateMilestoneBonus(totalReferrals + 1);
  const totalAmount = commissionAmount + milestoneBonus;

  // Update user stats
  const updatedUser = await prisma.user.update({
    where: { id: referrerId },
    data: {
      totalReferrals: { increment: 1 },
      monthlyReferrals: { increment: 1 },
      totalEarnings: { increment: totalAmount },
      monthlyEarnings: { increment: totalAmount },
      currentTier,
      reachedMilestone: milestoneBonus > 0
    }
  });

  // Reset monthly stats if it's a new month
  const lastReset = referrer.lastMonthReset;
  const currentMonth = new Date().getMonth();
  if (!lastReset || lastReset.getMonth() !== currentMonth) {
    await prisma.user.update({
      where: { id: referrerId },
      data: {
        monthlyReferrals: 0,
        monthlyEarnings: 0,
        lastMonthReset: new Date()
      }
    });
  }

  return {
    commissionAmount: totalAmount,
    newTier: currentTier,
    totalReferrals: updatedUser.totalReferrals,
    monthlyReferrals: updatedUser.monthlyReferrals,
    milestoneBonus,
    totalEarnings: updatedUser.totalEarnings
  };
}

export async function updateReferralStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Update user's referral stats
  await prisma.user.update({
    where: { id: userId },
    data: {
      totalReferrals: { increment: 1 },
      monthlyReferrals: { increment: 1 },
    },
  });

  return true;
}

export async function getAffiliateStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      totalReferrals: true,
      activeReferrals: true,
      totalEarnings: true,
      currentTier: true,
      monthlyReferrals: true,
      monthlyEarnings: true,
      reachedMilestone: true,
      referralCode: true
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const nextTierThreshold = user.totalReferrals >= 51 ? null :
    user.totalReferrals >= 21 ? 51 :
    user.totalReferrals >= 11 ? 21 :
    11;

  return {
    ...user,
    nextTierThreshold,
    referralsToNextTier: nextTierThreshold ? nextTierThreshold - user.totalReferrals : 0
  };
}

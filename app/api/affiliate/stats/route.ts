import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getAffiliateStats } from "@/lib/affiliate"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const stats = await getAffiliateStats(user.id)

    return NextResponse.json({
      referralCode: stats.referralCode || null,
      stats: {
        totalReferrals: stats.totalReferrals || 0,
        activeReferrals: stats.activeReferrals || 0,
        totalEarnings: stats.totalEarnings || 0,
        currentTier: stats.currentTier || 20,
        monthlyReferrals: stats.monthlyReferrals || 0,
        monthlyEarnings: stats.monthlyEarnings || 0,
        nextTierThreshold: stats.nextTierThreshold,
        referralsToNextTier: stats.referralsToNextTier,
        reachedMilestone: stats.reachedMilestone || false
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
  } catch (error) {
    console.error("Error fetching affiliate stats:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getAffiliateStats } from "@/lib/affiliate"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const stats = await getAffiliateStats(user.id)

    return NextResponse.json({
      referralCode: stats.referralCode || null,
      stats: {
        totalReferrals: stats.totalReferrals || 0,
        activeReferrals: stats.activeReferrals || 0,
        totalEarnings: stats.totalEarnings || 0,
        currentTier: stats.currentTier || 20, // Base commission rate
        monthlyReferrals: stats.monthlyReferrals || 0,
        monthlyEarnings: stats.monthlyEarnings || 0,
        nextTierThreshold: stats.nextTierThreshold,
        referralsToNextTier: stats.referralsToNextTier,
        reachedMilestone: stats.reachedMilestone || false
      }
    })
  } catch (error) {
    console.error("Error fetching affiliate stats:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

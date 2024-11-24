import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateReferralStats } from "@/lib/affiliate"

export async function POST(req: Request) {
  try {
    const { referralCode } = await req.json()

    if (!referralCode) {
      return new NextResponse("Referral code is required", { status: 400 })
    }

    const referrer = await prisma.user.findUnique({
      where: { referralCode },
    })

    if (!referrer) {
      return new NextResponse(
        "Invalid referral code. Please check and try again.",
        { status: 404 }
      )
    }

    // Update referrer's stats
    await updateReferralStats(referrer.id)

    return NextResponse.json({ success: true, referrerId: referrer.id })
  } catch (error) {
    console.error("Error validating referral code:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

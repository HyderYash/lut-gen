import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      )
    }

    const { referralCode } = await req.json()

    // If referral code is provided, try to use it
    if (referralCode) {
      const referrer = await prisma.user.findFirst({
        where: { referralCode: referralCode },
      })

      if (!referrer) {
        return NextResponse.json(
          { message: "Invalid referral code" },
          { status: 400 }
        )
      }

      // Update user with the referral code
      await prisma.user.update({
        where: { email: session.user.email },
        data: { usedReferralCode: referralCode },
      })
    }

    // Always let them proceed, even if referral code was invalid
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating referral code:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

// Generate a new referral code for existing users
export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      )
    }

    // Generate a unique referral code
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    // Update user with new referral code
    await prisma.user.update({
      where: { email: session.user.email },
      data: { referralCode },
    })

    return NextResponse.json({ referralCode })
  } catch (error) {
    console.error("Error generating referral code:", error)
    return NextResponse.json(
      { message: "Failed to generate referral code" },
      { status: 500 }
    )
  }
}

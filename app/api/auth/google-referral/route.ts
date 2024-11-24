import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { PLANS } from "@/constants/plans"

export async function POST(req: NextRequest) {
  try {
    const { email, name, image, referralCode } = await req.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Verify if referral code exists if provided
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
      })
      if (!referrer) {
        return NextResponse.json(
          { error: "Invalid referral code" },
          { status: 400 }
        )
      }
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        image,
        plan: PLANS.FREE,
        usedReferralCode: referralCode || null,
        customerId: `cus_${Math.random().toString(36).substring(2, 15)}`,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}

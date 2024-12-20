import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { PLANS } from "@/constants/plans"

export async function POST(req: Request) {
  try {
    const { email, password, referralCode } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate unique customer ID and referral code
    const customerId = `cus_${Math.random().toString(36).substring(2, 15)}`
    const userReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase() + Date.now().toString(36).substring(-4)

    // Create user with referral information
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        plan: PLANS.FREE,
        customerId,
        referralCode: userReferralCode,
        credits: 10,
        usedReferralCode: referralCode || undefined,
      },
    })

    return NextResponse.json(
      { message: "User created successfully", user: { email: user.email } },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    )
  }
}

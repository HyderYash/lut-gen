import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { processCommission } from "@/lib/affiliate"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { referrerId, amount, description } = await req.json()

    if (!referrerId || !amount || !description) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Process the commission
    const result = await processCommission(referrerId, amount, description)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing commission:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

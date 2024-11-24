import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    return NextResponse.json({ exists: !!user })
  } catch (error) {
    console.error("Error checking user:", error)
    return NextResponse.json(
      { error: "Failed to check user" },
      { status: 500 }
    )
  }
}

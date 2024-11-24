import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ credits: 0 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { credits: true, plan: true },
    });

    if (!user) {
      return NextResponse.json({ credits: 0 });
    }

    // If credits is -1 or plan is premium, user has unlimited credits
    const hasUnlimitedCredits = user.credits === -1 || user.plan.toLowerCase() === "premium";

    return NextResponse.json({
      credits: hasUnlimitedCredits ? -1 : user.credits,
    });
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return NextResponse.json({ credits: 0 });
  }
}

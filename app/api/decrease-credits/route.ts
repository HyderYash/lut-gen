import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { credits: true, plan: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't decrease credits if user has unlimited credits or is on premium plan
    if (user.credits === -1 || user.plan.toLowerCase() === "premium") {
      return NextResponse.json({ credits: -1 });
    }

    // Decrease credits by 1
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { credits: user.credits - 1 },
      select: { credits: true },
    });

    return NextResponse.json({ credits: updatedUser.credits });
  } catch (error) {
    console.error("Error decreasing credits:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

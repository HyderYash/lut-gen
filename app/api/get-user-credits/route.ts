import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    console.log("Session:", session); // Log session data
    
    if (!session?.user?.email) {
      console.log("No session or email found"); // Log when no session
      return NextResponse.json({ credits: 0 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { credits: true, plan: true },
    });
    console.log("User data:", user); // Log user data

    if (!user) {
      console.log("No user found for email:", session.user.email); // Log when no user found
      return NextResponse.json({ credits: 0 });
    }

    // If credits is -1 or plan is premium, user has unlimited credits
    const hasUnlimitedCredits = user.credits === -1 || user.plan.toLowerCase() === "premium";
    console.log("Has unlimited credits:", hasUnlimitedCredits); // Log credits calculation

    return NextResponse.json({
      credits: hasUnlimitedCredits ? -1 : user.credits,
    });
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return NextResponse.json({ credits: 0 });
  }
}

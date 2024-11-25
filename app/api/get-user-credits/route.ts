import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Mark route as dynamic since we use headers in auth
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log("GET /api/get-user-credits - Request received");
  
  try {
    const session = await auth();
    console.log("Session data:", {
      exists: !!session,
      email: session?.user?.email,
      hasUser: !!session?.user
    });
    
    if (!session?.user?.email) {
      console.log("No session or email found, returning 0 credits");
      return NextResponse.json({ credits: 0 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { credits: true, plan: true },
    });
    console.log("Database user data:", {
      found: !!user,
      plan: user?.plan,
      credits: user?.credits
    });

    if (!user) {
      console.log("No user found in database");
      return NextResponse.json({ credits: 0 });
    }

    // If credits is -1 or plan is premium, user has unlimited credits
    const hasUnlimitedCredits = user.credits === -1 || user.plan.toLowerCase() === "premium";
    console.log("Credits calculation:", {
      hasUnlimitedCredits,
      finalCredits: hasUnlimitedCredits ? -1 : user.credits
    });

    const response = { credits: hasUnlimitedCredits ? -1 : user.credits };
    console.log("Sending response:", response);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in get-user-credits:", error);
    return NextResponse.json({ credits: 0 });
  }
}

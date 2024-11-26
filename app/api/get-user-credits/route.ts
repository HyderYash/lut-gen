import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Segment config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ credits: 0 }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { credits: true, plan: true }
    });

    if (!user) {
      return NextResponse.json({ credits: 0 }, { status: 200 });
    }

    const hasUnlimitedCredits = user.credits === -1 || user.plan?.toLowerCase() === "premium";
    const finalCredits = hasUnlimitedCredits ? -1 : user.credits;

    return NextResponse.json({ 
      credits: finalCredits,
      plan: user.plan 
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

  } catch (error) {
    console.error("[Vercel] Error in get-user-credits:", error);
    return NextResponse.json({ credits: 0 }, { status: 200 });
  }
}

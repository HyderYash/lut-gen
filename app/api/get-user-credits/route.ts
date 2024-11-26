import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { headers } from 'next/headers';

// Segment config
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const headersList = headers();
    console.log("[Vercel] Headers received:", headersList.get("user-agent"));

    const session = await auth();
    console.log("[Vercel] Session state:", {
      hasSession: !!session,
      email: session?.user?.email || 'none'
    });

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ credits: 0, error: "No valid session" }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        credits: true, 
        plan: true,
        email: true
      },
    });

    console.log("[Vercel] User data:", {
      found: !!user,
      plan: user?.plan || 'none',
      credits: user?.credits
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ credits: 0, error: "User not found" }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    }

    const hasUnlimitedCredits = user.credits === -1 || user.plan?.toLowerCase() === "premium";
    const finalCredits = hasUnlimitedCredits ? -1 : user.credits;

    return new NextResponse(
      JSON.stringify({
        credits: finalCredits,
        plan: user.plan,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );

  } catch (error) {
    console.error("[Vercel] Error in get-user-credits:", error);
    return new NextResponse(
      JSON.stringify({ credits: 0, error: "Server error" }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
  }
}

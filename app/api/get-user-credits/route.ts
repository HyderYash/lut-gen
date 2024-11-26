import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from 'next/headers';

// Segment config
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('next-auth.session-token');

    const session = await auth();
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ credits: 0, error: "No valid session" }), {
        status: 401,
        headers: { 'content-type': 'application/json' }
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        credits: true, 
        plan: true,
        email: true
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ credits: 0, error: "User not found" }), {
        status: 404,
        headers: { 'content-type': 'application/json' }
      });
    }

    const hasUnlimitedCredits = user.credits === -1 || user.plan?.toLowerCase() === "premium";
    const finalCredits = hasUnlimitedCredits ? -1 : user.credits;

    return new Response(JSON.stringify({
      credits: finalCredits,
      plan: user.plan,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });

  } catch (error) {
    console.error("[Vercel] Error in get-user-credits:", error);
    return new Response(JSON.stringify({ credits: 0, error: "Server error" }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}

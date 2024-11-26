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
        JSON.stringify({ plan: "free", error: "No valid session" }),
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
        plan: true,
        email: true
      },
    });

    console.log("[Vercel] User data:", {
      found: !!user,
      plan: user?.plan || 'free'
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ plan: "free", error: "User not found" }),
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

    return new NextResponse(
      JSON.stringify({
        plan: user.plan || "free",
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
    console.error("[Vercel] Error in get-user-account-type:", error);
    return new NextResponse(
      JSON.stringify({ plan: "free", error: "Server error" }),
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

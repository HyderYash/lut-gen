import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Mark route as dynamic since we use headers in auth
export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // Optional: Use edge runtime for better performance
export const revalidate = 0; // Disable cache

export async function GET(request: Request) {
  console.log("[Vercel] GET /api/get-user-credits - Request received");
  
  try {
    // 1. Get session with error handling
    let session;
    try {
      session = await auth();
      console.log("[Vercel] Auth completed:", {
        hasSession: !!session,
        hasUser: !!session?.user,
        email: session?.user?.email || 'none'
      });
    } catch (authError) {
      console.error("[Vercel] Auth error:", authError);
      return NextResponse.json(
        { credits: 0, error: "Authentication failed" },
        { status: 401 }
      );
    }

    // 2. Validate session
    if (!session?.user?.email) {
      console.log("[Vercel] No valid session found");
      return NextResponse.json(
        { credits: 0, error: "No valid session" },
        { status: 401 }
      );
    }

    // 3. Get user from database with error handling
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { 
          credits: true, 
          plan: true,
          email: true // Add email for logging
        },
      });
      console.log("[Vercel] Database query completed:", {
        userFound: !!user,
        email: session.user.email,
        plan: user?.plan || 'none',
        credits: user?.credits || 0
      });
    } catch (dbError) {
      console.error("[Vercel] Database error:", dbError);
      return NextResponse.json(
        { credits: 0, error: "Database error" },
        { status: 500 }
      );
    }

    // 4. Validate user
    if (!user) {
      console.log("[Vercel] User not found in database:", session.user.email);
      return NextResponse.json(
        { credits: 0, error: "User not found" },
        { status: 404 }
      );
    }

    // 5. Calculate credits
    const hasUnlimitedCredits = user.credits === -1 || user.plan?.toLowerCase() === "premium";
    const finalCredits = hasUnlimitedCredits ? -1 : user.credits;

    console.log("[Vercel] Credits calculation:", {
      email: user.email,
      plan: user.plan,
      hasUnlimitedCredits,
      originalCredits: user.credits,
      finalCredits
    });

    // 6. Send response
    const response = { 
      credits: finalCredits,
      plan: user.plan,
      timestamp: new Date().toISOString()
    };
    
    console.log("[Vercel] Sending response:", response);
    return NextResponse.json(response);

  } catch (error) {
    // Log any unexpected errors
    console.error("[Vercel] Unexpected error in get-user-credits:", error);
    return NextResponse.json(
      { credits: 0, error: "Unexpected error" },
      { status: 500 }
    );
  }
}

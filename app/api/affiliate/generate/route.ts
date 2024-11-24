import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get user from session
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Check if user already has a referral code
        if (user.referralCode) {
            return NextResponse.json({
                referralCode: user.referralCode,
                totalReferrals: user.totalReferrals,
                currentTier: user.currentTier,
                totalEarnings: user.totalEarnings
            });
        }

        // Generate unique referral code
        const referralCode = nanoid(10);

        // Update user with referral code
        await prisma.user.update({
            where: { email: session.user.email },
            data: { referralCode }
        });

        return NextResponse.json({
            referralCode: referralCode,
            totalReferrals: user.totalReferrals,
            currentTier: user.currentTier,
            totalEarnings: user.totalEarnings
        });
    } catch (error) {
        console.error('Affiliate code generation error:', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
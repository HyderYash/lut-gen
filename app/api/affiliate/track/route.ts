// app/api/affiliate/track/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { referrerCode, referredUserId } = await request.json();

        // Find the referrer
        const referrer = await prisma.user.findUnique({
            where: { referralCode: referrerCode }
        });

        if (!referrer) {
            return NextResponse.json({
                message: 'Invalid referral code'
            }, { status: 400 });
        }

        // Update referral count and determine commission tier
        const updatedUser = await prisma.user.update({
            where: { id: referrer.id },
            data: {
                totalReferrals: { increment: 1 },
                currentTier: determineCommissionTier(referrer.totalReferrals + 1),
                monthlyReferrals: { increment: 1 }
            }
        });

        return NextResponse.json({
            success: true,
            currentTier: updatedUser.currentTier,
            totalReferrals: updatedUser.totalReferrals,
            monthlyReferrals: updatedUser.monthlyReferrals
        }, { status: 200 });
    } catch (error) {
        console.error('Referral tracking error:', error);
        return NextResponse.json({
            message: 'Failed to track referral'
        }, { status: 500 });
    }
}

function determineCommissionTier(totalReferrals: number): number {
    if (totalReferrals < 11) return 1; // 20%
    if (totalReferrals < 21) return 2; // 25%
    if (totalReferrals < 51) return 3; // 30%
    return 4; // 35%
}
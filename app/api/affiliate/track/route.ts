// app/api/affiliate/track/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { referrerCode, referredUserId } = await request.json();

        // Find the referrer's affiliate account
        const referrerAffiliate = await prisma.affiliate.findUnique({
            where: { referralCode: referrerCode }
        });

        if (!referrerAffiliate) {
            return NextResponse.json({
                message: 'Invalid referral code'
            }, { status: 400 });
        }

        // Update referral count and determine commission tier
        const updatedAffiliate = await prisma.affiliate.update({
            where: { id: referrerAffiliate.id },
            data: {
                totalReferrals: { increment: 1 },
                commissionTier: determineCommissionTier(referrerAffiliate.totalReferrals + 1),
                referralLinks: { push: referredUserId }
            }
        });

        return NextResponse.json({
            success: true,
            commissionTier: updatedAffiliate.commissionTier,
            totalReferrals: updatedAffiliate.totalReferrals
        }, { status: 200 });
    } catch (error) {
        console.error('Referral tracking error:', error);
        return NextResponse.json({
            message: 'Failed to track referral'
        }, { status: 500 });
    }
}

function determineCommissionTier(totalReferrals: number): number {
    if (totalReferrals < 11) return 20;
    if (totalReferrals < 21) return 25;
    if (totalReferrals < 51) return 30;
    return 35;
}
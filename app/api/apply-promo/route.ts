import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, promoCode } = body;

        if (!userId || !promoCode) {
            return NextResponse.json(
                { message: 'User ID and Promo Code are required' },
                { status: 400 }
            );
        }

        // Find the promo code
        const promo = await prisma.promoCode.findUnique({
            where: { code: promoCode },
        });

        if (!promo) {
            return NextResponse.json({ message: 'Promo code not found' }, { status: 404 });
        }

        if (promo.used) {
            return NextResponse.json({ message: 'Promo code already used' }, { status: 400 });
        }

        if (new Date() > new Date(promo.expiresAt)) {
            return NextResponse.json({ message: 'Promo code expired' }, { status: 400 });
        }

        // Add credits to the user's account
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                credits: { increment: 10 }, // Add 10 credits
            },
        });

        // Mark the promo code as used
        await prisma.promoCode.update({
            where: { id: promo.id },
            data: { used: true },
        });

        return NextResponse.json({
            message: 'Promo code applied successfully',
            updatedCredits: updatedUser.credits,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error applying promo code', error: error.message },
            { status: 500 }
        );
    }
}

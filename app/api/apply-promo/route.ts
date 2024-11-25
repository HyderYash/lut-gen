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

        if (promo.currentUses >= promo.maxUses) {
            return NextResponse.json({ message: 'Promo code has reached maximum uses' }, { status: 400 });
        }

        if (promo.expiresAt && new Date() > promo.expiresAt) {
            return NextResponse.json({ message: 'Promo code expired' }, { status: 400 });
        }

        // Add credits to the user's account based on discount
        // For example, if discount is 10, add 10 credits
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                credits: { increment: promo.discount },
            },
        });

        // Increment the usage count
        await prisma.promoCode.update({
            where: { id: promo.id },
            data: { 
                currentUses: { increment: 1 }
            },
        });

        return NextResponse.json({
            message: 'Promo code applied successfully',
            updatedCredits: updatedUser.credits,
        });
    } catch (error) {
        console.error('Error applying promo code:', error);
        return NextResponse.json(
            { message: 'Failed to apply promo code' },
            { status: 500 }
        );
    }
}

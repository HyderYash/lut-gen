import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        // Generate a random promo code
        const code = `${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        // Set expiration date to 5 days from now
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 5);

        // Save promo code in the database
        const promoCode = await prisma.promoCode.create({
            data: {
                code,
                userId,
                expiresAt,
            },
        });

        return NextResponse.json({ promoCode }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error generating promo code', error: error.message },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from "@/db/prisma";

export async function GET(req: Request) {
    try {
        const session = await auth();
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized: No user found' }, { status: 401 });
        }

        const email = session.user.email;

        // Fetch the user from the database using Prisma
        const dbUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
        }

        return NextResponse.json({ plan: dbUser.plan || 'Free' });
    } catch (error) {
        console.error('Error fetching user account type:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

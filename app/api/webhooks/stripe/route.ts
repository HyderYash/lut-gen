import prisma from "@/db/prisma";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { customAlphabet } from 'nanoid';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// Generate a random referral code
const generateReferralCode = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 8);

async function generateUniqueReferralCode(): Promise<string> {
    let referralCode: string;
    let isUnique = false;
    
    while (!isUnique) {
        referralCode = generateReferralCode();
        const existingUser = await prisma.user.findUnique({
            where: { referralCode }
        });
        if (!existingUser) {
            isUnique = true;
            return referralCode;
        }
    }
    
    throw new Error("Could not generate unique referral code");
}

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature")!;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
    } catch (err: any) {
        console.error("Webhook signature verification failed.", err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                console.log("Handling checkout.session.completed");
                const session = event.data.object as Stripe.Checkout.Session;
                const customerEmail = session.customer_details?.email;
                
                if (!customerEmail) {
                    throw new Error("No customer email found in session");
                }

                // Get the price ID from the session
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
                const priceId = lineItems.data[0]?.price?.id;

                if (!priceId) {
                    throw new Error("No price ID found in session");
                }

                let plan: string;
                let credits: number;

                // Determine plan details based on price ID
                switch (priceId) {
                    case process.env.STRIPE_STANDARD_MONTHLY_PRICE_ID:
                    case process.env.STRIPE_STANDARD_YEARLY_PRICE_ID:
                        plan = "Standard";
                        credits = 100;
                        break;
                    case process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID:
                    case process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID:
                        plan = "Premium";
                        credits = -1; // Unlimited
                        break;
                    default:
                        throw new Error(`Unknown price ID: ${priceId}`);
                }

                // Find or create user
                let user = await prisma.user.findUnique({
                    where: { email: customerEmail }
                });

                if (!user) {
                    // Generate a unique referral code
                    const referralCode = await generateUniqueReferralCode();
                    
                    // Create user if they don't exist
                    user = await prisma.user.create({
                        data: {
                            email: customerEmail,
                            name: session.customer_details?.name || customerEmail,
                            customerId: session.customer as string,
                            plan: "Free", // Default plan
                            credits: 10, // Default credits
                            referralCode // Add the unique referral code
                        }
                    });
                    console.log(`Created new user: ${user.id} with referral code: ${referralCode}`);
                }

                // Update user
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        plan,
                        credits,
                        customerId: session.customer as string
                    }
                });

                console.log(`Successfully updated subscription for user ${user.id}`);
                break;
            }

            case "customer.subscription.created":
            case "customer.subscription.updated": {
                console.log(`Handling ${event.type}`);
                const subscription = event.data.object as Stripe.Subscription;
                const customer = await stripe.customers.retrieve(subscription.customer as string);
                
                if (!('email' in customer) || !customer.email) {
                    throw new Error("No customer email found");
                }

                const user = await prisma.user.findUnique({
                    where: { email: customer.email as string }
                });

                if (user && user.plan === "Standard") {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { credits: 100 } // Reset Standard plan credits
                    });
                    console.log(`Reset credits for Standard plan user ${user.id}`);
                }
                break;
            }

            case "customer.subscription.deleted": {
                console.log("Handling customer.subscription.deleted");
                const subscription = event.data.object as Stripe.Subscription;
                const customer = await stripe.customers.retrieve(subscription.customer as string);
                
                if (!('email' in customer) || !customer.email) {
                    throw new Error("No customer email found");
                }

                const user = await prisma.user.findUnique({
                    where: { email: customer.email as string }
                });

                if (!user) {
                    throw new Error("User not found");
                }

                // Reset to free plan
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        plan: "Free",
                        credits: 10
                    }
                });

                console.log(`Successfully cancelled subscription for user ${user.id}`);
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return new Response("Webhook processed successfully", { status: 200 });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return new Response(`Webhook Error: ${error instanceof Error ? error.message : "Unknown error"}`, { status: 400 });
    }
}

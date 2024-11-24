import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Get the price details
    const price = await stripe.prices.retrieve(subscription.items.data[0].price.id);

    // Determine credits based on the plan
    let credits = 0;
    if (price.nickname?.includes('Standard')) {
      credits = price.recurring?.interval === 'month' ? 100 : 1200;
    } else if (price.nickname?.includes('Premium')) {
      credits = price.recurring?.interval === 'month' ? 300 : 3600;
    }

    const paymentDetails = {
      plan: price.nickname || 'Unknown Plan',
      amount: price.unit_amount || 0,
      interval: price.recurring?.interval || 'unknown',
      credits: credits,
    };

    return NextResponse.json(paymentDetails);
  } catch (error) {
    console.error('Error retrieving payment details:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payment details' },
      { status: 500 }
    );
  }
}

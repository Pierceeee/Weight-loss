import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

// Request body validation schema
const checkoutRequestSchema = z.object({
  planId: z.string(), // Flexible plan ID
  sessionId: z.string().optional(), // Funnel session ID for tracking
  email: z.string().email().optional(),
});

// Plan configuration with prices
const plans: Record<string, { name: string; amount: number; currency: string; interval: "day" | "month" | "year" | null; interval_count?: number }> = {
  // --- Standard Plans ---
  "7day": {
    name: "7-Day Plan",
    amount: 693, // $6.93
    currency: "usd",
    interval: "day",
    interval_count: 7,
  },
  "1month": {
    name: "1-Month Plan",
    amount: 1519, // $15.19
    currency: "usd",
    interval: "month",
    interval_count: 1,
  },
  "3month": {
    name: "3-Month Plan",
    amount: 2599, // $25.99
    currency: "usd",
    interval: "month",
    interval_count: 3,
  },

  // --- 74% Discount Plans ---
  "7day_74": {
    name: "7-Day Plan (74% Off)",
    amount: 577, // $5.77
    currency: "usd",
    interval: "day",
    interval_count: 7,
  },
  "1month_74": {
    name: "1-Month Plan (74% Off)",
    amount: 1154, // $11.54
    currency: "usd",
    interval: "month",
    interval_count: 1,
  },
  "3month_74": {
    name: "3-Month Plan (74% Off)",
    amount: 1963, // $19.63
    currency: "usd",
    interval: "month",
    interval_count: 3,
  },

  // --- 81% Discount Plans ---
  "7day_81": {
    name: "7-Day Plan (81% Off)",
    amount: 422, // $4.22
    currency: "usd",
    interval: "day",
    interval_count: 7,
  },
  "1month_81": {
    name: "1-Month Plan (81% Off)",
    amount: 844, // $8.44
    currency: "usd",
    interval: "month",
    interval_count: 1,
  },
  "3month_81": {
    name: "3-Month Plan (81% Off)",
    amount: 1434, // $14.34
    currency: "usd",
    interval: "month",
    interval_count: 3,
  },
};

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please set STRIPE_SECRET_KEY." },
        { status: 503 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = checkoutRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { planId, sessionId, email } = validationResult.data;
    const plan = plans[planId];

    // Get the origin for redirect URLs
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: plan.interval ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: plan.currency,
            product_data: {
              name: plan.name,
              description: "PCOS Reset Method - Personalized weight loss and wellness program",
              images: [`${origin}/images/product-image.png`],
            },
            unit_amount: plan.amount,
            ...(plan.interval && {
              recurring: {
                interval: plan.interval,
                interval_count: plan.interval_count || 1,
              },
            }),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/result-offer?canceled=true`,
      customer_email: email,
      metadata: {
        planId,
        funnelSessionId: sessionId || "",
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      ...(plan.interval && {
        subscription_data: {
          metadata: {
            planId,
            funnelSessionId: sessionId || "",
          },
        },
      }),
    });

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    const message = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: "Failed to create checkout session", message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "PCOS Reset Method API - Create Checkout Session",
    method: "POST",
    description: "Create a Stripe checkout session for a plan",
    configured: !!process.env.STRIPE_SECRET_KEY,
    plans: Object.keys(plans),
  });
}

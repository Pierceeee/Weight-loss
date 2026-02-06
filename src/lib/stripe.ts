import Stripe from "stripe";

// Initialize Stripe client
export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is required");
  }

  return new Stripe(secretKey, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
  });
}

// Check if Stripe is configured
export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
}

// Pricing configuration
export const PRICING = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID || "price_monthly",
    amount: 1999, // $19.99 in cents
    name: "Monthly",
    interval: "month" as const,
  },
  yearly: {
    priceId: process.env.STRIPE_YEARLY_PRICE_ID || "price_yearly",
    amount: 11988, // $119.88 in cents (billed yearly)
    name: "Yearly",
    interval: "year" as const,
  },
  lifetime: {
    priceId: process.env.STRIPE_LIFETIME_PRICE_ID || "price_lifetime",
    amount: 19900, // $199.00 in cents
    name: "Lifetime",
    interval: null,
  },
};

export type PlanType = keyof typeof PRICING;

/**
 * Create a Stripe Checkout session
 */
export async function createCheckoutSession(
  stripe: Stripe,
  params: {
    planType: PlanType;
    customerId?: string;
    customerEmail?: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }
) {
  const plan = PRICING[params.planType];

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ["card"],
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
    mode: plan.interval ? "subscription" : "payment",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  };

  if (params.customerId) {
    sessionParams.customer = params.customerId;
  } else if (params.customerEmail) {
    sessionParams.customer_email = params.customerEmail;
  }

  return stripe.checkout.sessions.create(sessionParams);
}

/**
 * Get customer portal session URL
 */
export async function createPortalSession(
  stripe: Stripe,
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}

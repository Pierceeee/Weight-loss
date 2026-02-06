"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Heart,
  Check,
  Shield,
  Clock,
  Sparkles,
  ChefHat,
  ListChecks,
  Users,
  Zap,
} from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  billing: string;
  popular?: boolean;
  savings?: string;
}

const plans: PricingPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: 19.99,
    period: "/month",
    billing: "Billed monthly",
  },
  {
    id: "yearly",
    name: "Yearly",
    price: 9.99,
    originalPrice: 19.99,
    period: "/month",
    billing: "Billed $119.88/year",
    popular: true,
    savings: "Save 50%",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: 199,
    period: "",
    billing: "One-time payment",
    savings: "Best value",
  },
];

const features = [
  { icon: ChefHat, text: "Personalized PCOS-friendly meal plans" },
  { icon: ListChecks, text: "Weekly grocery shopping lists" },
  { icon: Sparkles, text: "AI-powered recipe recommendations" },
  { icon: Clock, text: "Progress tracking & plan adjustments" },
  { icon: Users, text: "Access to community support" },
  { icon: Zap, text: "Expert tips & educational content" },
];

export default function OfferPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("yearly");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Implement Stripe checkout
      // const response = await fetch("/api/checkout", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ planId: selectedPlan }),
      // });
      // const { url } = await response.json();
      // window.location.href = url;
      
      // For now, simulate checkout
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Stripe checkout will be integrated here. Redirecting to dashboard...");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PCOS Plan</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground">
            Start your personalized PCOS journey today
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? "border-primary ring-2 ring-primary"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              {plan.savings && !plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                  {plan.savings}
                </div>
              )}
              <CardHeader className="pb-2 pt-6">
                <h3 className="text-lg font-semibold text-center">{plan.name}</h3>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-2">
                  {plan.originalPrice && (
                    <span className="text-muted-foreground line-through text-lg mr-2">
                      ${plan.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.billing}</p>
                
                <div className="mt-4 flex justify-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === plan.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {selectedPlan === plan.id && (
                      <Check className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-center">
              What&apos;s included in your plan:
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="space-y-4">
          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full h-14 text-lg"
            size="lg"
          >
            {isLoading ? (
              "Processing..."
            ) : (
              <>
                Get Started for ${selectedPlanData?.price}
                {selectedPlanData?.period}
              </>
            )}
          </Button>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Have questions?{" "}
            <Link href="#" className="text-primary hover:underline">
              Check our FAQ
            </Link>{" "}
            or{" "}
            <Link href="#" className="text-primary hover:underline">
              contact support
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-8">
        <div className="container max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            By continuing, you agree to our{" "}
            <Link href="#" className="hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuizStore } from "@/hooks/useQuizState";
import { Heart, Lock, ArrowLeft } from "lucide-react";

export default function EmailCapturePage() {
  const router = useRouter();
  const { responses } = useQuizStore();
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const targetWeight = responses["target-weight"] as number || 70;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!agreed) {
      setError("Please agree to the privacy policy");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement Supabase auth here
      // For now, we'll just store the email in localStorage and proceed
      localStorage.setItem("pcos-user-email", email);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      router.push("/offer");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/timeline")}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">PCOS Plan</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            Enter your email to see how you can reach{" "}
            <span className="text-primary">{targetWeight} kg</span> and alleviate
            PCOS symptoms
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Your email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacy"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              disabled={isLoading}
            />
            <label
              htmlFor="privacy"
              className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
            >
              I agree to the{" "}
              <Link href="#" className="text-primary hover:underline">
                Privacy policy
              </Link>{" "}
              and receiving future information from PCOS Plan
            </label>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full h-14 text-lg"
            disabled={!email || !agreed || isLoading}
          >
            {isLoading ? "Please wait..." : "Continue"}
          </Button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground">
          <Lock className="w-4 h-4" />
          <p>
            We respect your privacy and use your email only to send you the PCOS
            Plan program and other important emails. You won&apos;t receive spam.
          </p>
        </div>
      </main>
    </div>
  );
}

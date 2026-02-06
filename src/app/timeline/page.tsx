"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuizStore } from "@/hooks/useQuizState";
import { estimateWeeksToGoal } from "@/lib/bmi";
import { Heart } from "lucide-react";

export default function TimelinePage() {
  const router = useRouter();
  const { getUserProfile } = useQuizStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const profile = getUserProfile();

  if (!profile) {
    router.push("/quiz/1");
    return null;
  }

  const weeksToGoal = estimateWeeksToGoal(
    profile.currentWeight,
    profile.targetWeight
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PCOS Plan</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            It only takes a{" "}
            <span className="text-primary">{weeksToGoal} week</span> plan to make
            a lifelong impact
          </h1>
          <p className="text-muted-foreground">
            PCOS Plan will be with you every step of the way
          </p>
        </div>

        {/* Projection Chart */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
              <span>WEIGHT</span>
              <span>TIME</span>
            </div>

            <div className="relative h-48 mb-4">
              <svg viewBox="0 0 400 150" className="w-full h-full">
                <path
                  d="M 20 30 Q 100 60, 200 100 T 380 120"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                />
                <path
                  d="M 20 30 Q 150 80, 200 50 T 380 60"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <circle cx="20" cy="30" r="8" fill="hsl(var(--primary))" />
                <circle cx="380" cy="120" r="8" fill="hsl(var(--primary))" />
              </svg>

              <div className="absolute top-0 left-0 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                Your weight
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                After {weeksToGoal} weeks
              </div>
              <div className="absolute bottom-0 right-0 text-xs text-muted-foreground">
                Maintain lost weight
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-primary rounded" />
                <span>With PCOS Plan</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-1 bg-red-500 rounded"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, transparent, transparent 2px, #EF4444 2px, #EF4444 4px)",
                  }}
                />
                <span>Usual weight loss journey</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              This is a tentative timeline based on your answers.
            </p>
          </CardContent>
        </Card>

        <Button asChild className="w-full h-14 text-lg" size="lg">
          <Link href="/summary">Continue</Link>
        </Button>
      </main>
    </div>
  );
}

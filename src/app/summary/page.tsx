"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuizStore } from "@/hooks/useQuizState";
import { calculateBMI, getBMIResult, getHealthRisks } from "@/lib/bmi";
import { Heart, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";

export default function SummaryPage() {
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

  const bmi = calculateBMI(profile.currentWeight, profile.height);
  const bmiResult = getBMIResult(bmi);
  const healthRisks = getHealthRisks(bmiResult.category);

  // Calculate gauge position (0-100)
  const gaugePosition = Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100);

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
            Your Personal Summary
          </h1>
          <p className="text-muted-foreground">
            Based on your answers, here is your current health profile.
          </p>
        </div>

        {/* BMI Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">BMI & Health Risks</h2>
            
            {/* BMI Gauge */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
              <div className="relative h-4 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500 rounded-full">
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-6 bg-foreground rounded-sm"
                  style={{ left: `calc(${gaugePosition}% - 8px)` }}
                />
              </div>
              <div className="text-center mt-4">
                <span className="text-3xl font-bold" style={{ color: bmiResult.color }}>
                  {bmi.toFixed(1)}
                </span>
                <span className="text-lg text-muted-foreground ml-2">BMI</span>
                <p className="font-medium" style={{ color: bmiResult.color }}>
                  {bmiResult.category}
                </p>
              </div>
            </div>

            {/* Health Risks */}
            {healthRisks.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Risks of unhealthy BMI
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {healthRisks.map((risk, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Profile Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <CheckCircle className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-sm text-muted-foreground">PCOS SYMPTOMS: </span>
                  <span className="font-medium">Present</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <TrendingDown className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-sm text-muted-foreground">EXERCISE: </span>
                  <span className="font-medium">
                    {profile.exercisePreference === "regularly" ? "Regular" : 
                     profile.exercisePreference === "occasionally" ? "Occasional" : "Light"} exercise
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Heart className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-sm text-muted-foreground">ACTIVITY LEVEL: </span>
                  <span className="font-medium">
                    {profile.activityLevel === "desk-job" ? "Low" :
                     profile.activityLevel === "always-working-out" ? "High" : "Moderate"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Button asChild className="w-full h-14 text-lg" size="lg">
          <Link href="/email">Continue</Link>
        </Button>
      </main>
    </div>
  );
}

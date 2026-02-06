"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/hooks/useQuizState";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export function AnalyzingAnimation() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Analyzing your profile...");

  useEffect(() => {
    // 5-second animation
    const duration = 5000;
    const interval = 50; // update every 50ms
    const steps = duration / interval;
    const increment = 100 / steps;

    let currentProgress = 0;

    const timer = setInterval(() => {
      currentProgress += increment;
      setProgress(Math.min(currentProgress, 100));

      // Update status text based on progress
      if (currentProgress > 30 && currentProgress < 60) {
        setStatusText("Calculating metabolic rate...");
      } else if (currentProgress >= 60 && currentProgress < 90) {
        setStatusText("Building your personalized plan...");
      } else if (currentProgress >= 90) {
        setStatusText("Finalizing results...");
      }

      if (currentProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          router.push("/timeline");
        }, 500); // Small delay after 100%
      }
    }, interval);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 p-6 text-center animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
        <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
      </div>
      
      <div className="space-y-2 w-full max-w-xs">
        <h2 className="text-2xl font-bold">{statusText}</h2>
        <Progress value={progress} className="h-3" />
        <p className="text-sm text-muted-foreground text-right font-mono">
          {Math.round(progress)}%
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mt-8 max-w-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${progress > 20 ? "bg-green-500" : "bg-muted"}`} />
          BMI Analysis
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${progress > 40 ? "bg-green-500" : "bg-muted"}`} />
          Metabolic Check
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${progress > 60 ? "bg-green-500" : "bg-muted"}`} />
          Hormone Profile
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${progress > 80 ? "bg-green-500" : "bg-muted"}`} />
          Meal Planning
        </div>
      </div>
    </div>
  );
}

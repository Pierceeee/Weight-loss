"use client";

import { Progress } from "@/components/ui/progress";
import { TOTAL_STEPS } from "@/lib/quiz-data";

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <Progress value={progress} className="h-2 flex-1" />
        <span className="ml-4 text-sm text-muted-foreground font-medium">
          {currentStep}/{TOTAL_STEPS}
        </span>
      </div>
    </div>
  );
}

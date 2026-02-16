"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useQuizStore } from "@/hooks/useQuizState";
import { generateAnalysis } from "@/lib/actions/generate-analysis";

const femaleAnalysisSteps = [
  { id: "bmi", label: "Calculating BMI" },
  { id: "metabolic", label: "Analyzing metabolic rate" },
  { id: "hormones", label: "Evaluating hormone profile" },
  { id: "plan", label: "Building your PCOS plan" },
];

const maleAnalysisSteps = [
  { id: "bmi", label: "Calculating BMI" },
  { id: "metabolic", label: "Analyzing metabolic rate" },
  { id: "fitness", label: "Evaluating fitness profile" },
  { id: "plan", label: "Building your fitness plan" },
];

export function AnalyzingAnimation() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const { sessionId, getUserProfile, gender } = useQuizStore();
  
  const analysisSteps = gender === "male" ? maleAnalysisSteps : femaleAnalysisSteps;

  useEffect(() => {
    // Trigger AI analysis generation in the background
    const triggerAnalysis = async () => {
      const profile = getUserProfile();
      
      if (profile && sessionId) {
        try {
          console.log("Triggering AI analysis generation...");
          await generateAnalysis(sessionId, profile);
          console.log("AI analysis generation completed");
        } catch (error) {
          console.error("Failed to generate AI analysis:", error);
          // Fallback is handled in the generateAnalysis function
        }
      }
    };

    triggerAnalysis();

    // 5-second animation
    const duration = 5000;
    const interval = 50;
    const steps = duration / interval;
    const increment = 100 / steps;

    let currentProgress = 0;

    const timer = setInterval(() => {
      currentProgress += increment;
      setProgress(Math.min(currentProgress, 100));

      // Update current step based on progress
      if (currentProgress > 25 && currentProgress <= 50) {
        setCurrentStep(1);
      } else if (currentProgress > 50 && currentProgress <= 75) {
        setCurrentStep(2);
      } else if (currentProgress > 75) {
        setCurrentStep(3);
      }

      if (currentProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          router.push("/timeline");
        }, 600);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [router, sessionId, getUserProfile]);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center max-w-md mx-auto">
      {/* Animated rings */}
      <div className="relative mb-12">
        <div className="w-32 h-32 rounded-full border-4 border-purple-100 flex items-center justify-center bg-white shadow-xl">
          <div 
            className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"
            style={{ animationDuration: "1.5s" }}
          />
          <div 
            className="absolute inset-2 rounded-full border-4 border-purple-300 border-b-transparent animate-spin"
            style={{ animationDuration: "2s", animationDirection: "reverse" }}
          />
          <span className="text-3xl font-black tabular-nums text-purple-900">
            {Math.round(progress)}%
          </span>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-2xl -z-10 animate-pulse" />
      </div>

      {/* Status text */}
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
        Analyzing your answers
      </h2>
      <p className="text-purple-600/70 mb-10 font-medium">
        Creating your personalized plan...
      </p>

      {/* Step indicators */}
      <div className="w-full space-y-3">
        {analysisSteps.map((step, index) => {
          const isComplete = index < currentStep || (index === currentStep && progress > (index + 1) * 25);
          const isActive = index === currentStep;
          
          return (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${
                isComplete
                  ? "bg-purple-50 border border-purple-200"
                  : isActive
                  ? "bg-white border border-purple-200 shadow-md"
                  : "bg-purple-50/30 border border-transparent"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isComplete
                    ? "bg-purple-600 text-white"
                    : isActive
                    ? "bg-purple-700 text-white"
                    : "bg-purple-100 text-purple-400"
                }`}
              >
                {isComplete ? (
                  <Check className="w-5 h-5" strokeWidth={3} />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>
              <span
                className={`font-bold transition-colors duration-300 ${
                  isComplete ? "text-purple-700" : isActive ? "text-slate-900" : "text-purple-300"
                }`}
              >
                {step.label}
              </span>
              {isActive && !isComplete && (
                <div className="ml-auto flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

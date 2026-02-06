"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ProgressBar,
  SingleSelect,
  MultiSelect,
  NumericInput,
  VisualSelect,
  Interstitial,
  AnalyzingAnimation,
} from "@/components/quiz";
import { getQuestionByStep, TOTAL_STEPS } from "@/lib/quiz-data";
import { useQuizStore } from "@/hooks/useQuizState";
import { ArrowLeft } from "lucide-react";

export default function QuizStepPage() {
  const router = useRouter();
  const params = useParams();
  const step = parseInt(params.step as string, 10);

  const {
    responses,
    setResponse,
    setCurrentStep,
    getResponse,
  } = useQuizStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentStep(step);
  }, [step, setCurrentStep]);

  const question = getQuestionByStep(step);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!question || step < 1 || step > TOTAL_STEPS) {
    router.push("/quiz/1");
    return null;
  }

  // Handle Analyzing Step (Step 20) with Animation
  if (question.type === "interstitial" && question.id === "processing") {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center">
        <div className="container max-w-2xl mx-auto px-4">
          <AnalyzingAnimation />
        </div>
      </div>
    );
  }

  const currentValue = getResponse(question.id);

  const handleNext = () => {
    if (step === TOTAL_STEPS) {
      // Step 20 is the final step in quiz data (processing)
      // The AnalyzingAnimation component handles the redirect
      // But if we clicked 'Continue' manually (fallback):
      router.push("/timeline");
    } else {
      router.push(`/quiz/${step + 1}`);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      router.push(`/quiz/${step - 1}`);
    } else {
      router.push("/");
    }
  };

  const handleValueChange = (value: string | string[] | number) => {
    setResponse(question.id, value);
  };

  const canContinue = () => {
    if (question.type === "interstitial") return true;
    if (!question.required) return true;
    if (currentValue === undefined || currentValue === null) return false;
    if (Array.isArray(currentValue) && currentValue.length === 0) return false;
    if (typeof currentValue === "string" && currentValue === "") return false;
    return true;
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case "single-select":
        return (
          <SingleSelect
            options={question.options || []}
            value={currentValue as string | undefined}
            onChange={(v) => handleValueChange(v)}
          />
        );

      case "multi-select":
        return (
          <MultiSelect
            options={question.options || []}
            value={(currentValue as string[]) || []}
            onChange={(v) => handleValueChange(v)}
          />
        );

      case "numeric-input":
        return (
          <NumericInput
            value={currentValue as number | undefined}
            onChange={(v) => handleValueChange(v)}
            unit={question.unit}
            unitOptions={question.unitOptions}
            min={question.validation?.min}
            max={question.validation?.max}
          />
        );

      case "visual-select":
        return (
          <VisualSelect
            options={question.options || []}
            value={currentValue as string | undefined}
            onChange={(v) => handleValueChange(v)}
          />
        );

      case "interstitial":
        return question.content ? (
          <Interstitial
            title={question.content.title}
            description={question.content.description}
            highlight={question.content.highlight}
            image={question.content.image}
          />
        ) : null;

      default:
        return null;
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
              onClick={handleBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <ProgressBar currentStep={step} />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-2xl mx-auto px-4 py-8 pb-28">
        <div className="space-y-8">
          {/* Question Title */}
          {question.type !== "interstitial" && question.question && (
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold">
                {question.question}
              </h1>
              {question.subtitle && (
                <p className="text-muted-foreground">{question.subtitle}</p>
              )}
            </div>
          )}

          {/* Question Content */}
          <div className="py-4">{renderQuestionContent()}</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <Button
            onClick={handleNext}
            disabled={!canContinue()}
            className="w-full h-14 text-lg font-semibold"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </footer>
    </div>
  );
}

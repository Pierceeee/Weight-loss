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
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function QuizStepPage() {
  const router = useRouter();
  const params = useParams();
  const step = parseInt(params.step as string, 10);

  const {
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
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
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
      <div className="h-screen w-screen bg-background flex items-center justify-center noise-texture">
        <AnalyzingAnimation />
      </div>
    );
  }

  const currentValue = getResponse(question.id);

  const handleNext = () => {
    if (step === TOTAL_STEPS) {
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
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden noise-texture">
      {/* Header - minimal and integrated */}
      <header className="flex-shrink-0 px-4 sm:px-8 pt-4 sm:pt-6 pb-2">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="p-2.5 rounded-xl hover:bg-muted transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="flex-1 flex items-center gap-4">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full progress-glow transition-all duration-500 ease-out"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-muted-foreground tabular-nums min-w-[60px] text-right">
              {step} / {TOTAL_STEPS}
            </span>
          </div>
        </div>
      </header>

      {/* Main content - maximized */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          <div className="max-w-2xl mx-auto h-full flex flex-col">
            {/* Question Title */}
            {question.type !== "interstitial" && question.question && (
              <div className="text-center mb-8 animate-fade-up">
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight mb-3">
                  {question.question}
                </h1>
                {question.subtitle && (
                  <p className="text-muted-foreground text-base sm:text-lg">
                    {question.subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Question Content */}
            <div className="flex-1 flex items-start justify-center animate-fade-up animate-delay-100">
              <div className="w-full">
                {renderQuestionContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - integrated CTA */}
        <footer className="flex-shrink-0 px-4 sm:px-8 pb-6 pt-4 glass border-t border-border/50">
          <div className="max-w-2xl mx-auto">
            <Button
              onClick={handleNext}
              disabled={!canContinue()}
              size="lg"
              className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold rounded-2xl shadow-lg shadow-primary/20 disabled:shadow-none transition-all duration-300 group"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </footer>
      </main>
    </div>
  );
}

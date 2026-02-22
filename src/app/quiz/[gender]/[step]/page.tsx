"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  SingleSelect,
  MultiSelect,
  NumericInput,
  HeightInput,
  WeightInput,
  VisualSelect,
  Interstitial,
  IngredientSelect,
  ScienceList,
  GoalProjection,
  PersonalSummary,
} from "@/components/quiz";
import { getQuestionByStep, getTotalSteps } from "@/lib/quiz-data";
import { useQuizStore } from "@/hooks/useQuizState";
import { startFunnelSubmission } from "@/lib/actions/submit-quiz";
import { lbsToKg, kgToLbs } from "@/lib/bmi";
import { ArrowLeft, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuizStepPage() {
  const router = useRouter();
  const params = useParams();
  const urlStep = parseInt(params.step as string, 10);
  const gender = params.gender as "male" | "female";
  // URL step excludes the first internal quiz question (age-range).
  const step = urlStep + 1;

  const {
    setResponse,
    setCurrentStep,
    getResponse,
    sessionId,
    responses,
    setGender,
  } = useQuizStore();

  const [submissionCreated, setSubmissionCreated] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState<"forward" | "back">("forward");
  const [enterDirection, setEnterDirection] = useState<"forward" | "back">("forward");
  const prevStepRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevStepRef.current !== null) {
      setEnterDirection(urlStep > prevStepRef.current ? "forward" : "back");
    }
    prevStepRef.current = urlStep;
    setIsExiting(false);
  }, [urlStep]);

  useEffect(() => {
    setCurrentStep(step);
    // Set gender in store
    if (gender) {
      setGender(gender);
    }
  }, [step, setCurrentStep, gender, setGender]);

  // Create initial funnel submission when user starts the quiz (step 1)
  useEffect(() => {
    if (urlStep === 0 && sessionId && !submissionCreated) {
      startFunnelSubmission(sessionId, { ...responses, gender })
        .then((result) => {
          if (result.success) {
            console.log("Funnel submission created:", result.id);
            setSubmissionCreated(true);
          } else {
            console.warn("Failed to create funnel submission:", result.error);
          }
        })
        .catch((error) => {
          console.error("Error creating funnel submission:", error);
        });
    }
  }, [step, sessionId, responses, submissionCreated, gender]);

  const question = getQuestionByStep(step, gender);
  const totalSteps = getTotalSteps(gender);

  const totalUrlSteps = totalSteps - 1;

  if (!question || urlStep < 0 || urlStep > totalUrlSteps) {
    router.push(`/quiz/${gender}/0`);
    return null;
  }

  const currentValue = getResponse(question.id);

  const handleNext = () => {
    if (isExiting) return;
    setExitDirection("forward");
    setIsExiting(true);
    setTimeout(() => {
      if (step === totalSteps) {
        router.push("/generating");
      } else {
        router.push(`/quiz/${gender}/${urlStep + 1}`);
      }
    }, 220);
  };

  const handleBack = () => {
    if (isExiting) return;
    if (urlStep > 0) {
      setExitDirection("back");
      setIsExiting(true);
      setTimeout(() => {
        router.push(`/quiz/${gender}/${urlStep - 1}`);
      }, 220);
    }
  };

  const handleValueChange = (value: string | string[] | number) => {
    if (question.type === "weight-input") {
      const kgValue = Number(value);
      if (!Number.isNaN(kgValue)) {
        setResponse(question.id, kgValue);
        // Also store the lbs version for legacy support in some components
        setResponse(`${question.id}-lbs`, Math.round(kgToLbs(kgValue)));
      }
    } else {
      setResponse(question.id, value);
    }

    if (question.type === "single-select" || question.type === "visual-select") {
      setTimeout(() => {
        if (isExiting) return;
        setExitDirection("forward");
        setIsExiting(true);
        setTimeout(() => {
          router.push(`/quiz/${gender}/${urlStep + 1}`);
        }, 220);
      }, 150);
    }

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
            min={question.validation?.min}
            max={question.validation?.max}
          />
        );

      case "height-input":
        return (
          <HeightInput
            valueCm={currentValue as number | undefined}
            onChange={(v) => handleValueChange(v)}
          />
        );

      case "weight-input":
        return (
          <WeightInput
            valueKg={currentValue as number | undefined}
            onChange={(v) => handleValueChange(v)}
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

      case "interstitial": {
        let interstitialImage = question.content?.image;
        let interstitialDescription = question.content?.description || "";
        // Dynamically swap avatar and personalize copy for motivation-2
        if (question.id === "motivation-2") {
          const age = getResponse("age") as number | undefined;
          const currentWeight = getResponse("current-weight") as number | undefined;
          const targetWeight = getResponse("target-weight") as number | undefined;

          if (!age || age < 35) {
            interstitialImage = "/images/age-25-35.png";
          } else if (age < 50) {
            interstitialImage = "/images/age-35-50.png";
          } else {
            interstitialImage = "/images/age-50-65.png";
          }

          // Use actual entered values
          const displayAge = age || 30;
          const displayCurrentWeight = currentWeight ? Math.round(currentWeight) : 68;
          const displayTargetWeight = targetWeight ? Math.round(targetWeight) : 60;

          interstitialDescription = `Women at age ${displayAge}, a gentle reminder: building consistent daily habits that help you reach and maintain a weight range of ${displayTargetWeight}kg to ${displayCurrentWeight}kg can accelerate your progress toward a stronger, healthier body.`;
        }
        return question.content ? (
          <Interstitial
            title={question.content.title}
            description={interstitialDescription}
            highlight={question.content.highlight}
            image={interstitialImage}
            benefits={question.benefits}
          />
        ) : null;
      }

      case "ingredient-select":
        return (
          <IngredientSelect
            question={question}
            value={(currentValue as string[]) || []}
            onChange={(v) => handleValueChange(v)}
          />
        );

      case "science-list":
        return <ScienceList />;

      case "goal-projection":
        return <GoalProjection />;

      case "personal-summary":
        return <PersonalSummary />;

      default:
        return null;
    }
  };

  const showFooterButton = question.type !== "single-select" && question.type !== "visual-select";
  // For compact input types (height, weight, numeric, visual-select), show the button inline below the content
  const inlineButton = 
    question.type === "height-input" || 
    question.type === "weight-input" ||
    question.type === "numeric-input" || 
    question.type === "visual-select";

  return (
    <div className={`min-h-[100dvh] flex flex-col transition-colors duration-300 ${question.id === "age-range" ? "bg-[#FAF5FF]" : "bg-[#FDFBFF]"}`}>
      {/* Header - only show for non-age-range questions */}
      {question.id !== "age-range" && (
        <header className="flex-shrink-0 sticky top-0 z-10 bg-white">
          <div className="h-1 bg-[#E9D5FF]">
            <div
              className="h-full bg-[#A855F7] transition-all duration-500"
              style={{ width: `${(urlStep / totalUrlSteps) * 100}%` }}
            />
          </div>
          <div className="relative px-4 py-3 border-b border-purple-100">
            <button
              onClick={handleBack}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg border border-purple-200 bg-white hover:bg-purple-50"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-purple-700" />
            </button>
            <div className="text-center flex items-center justify-center gap-2">
              <span className="text-xl">💖</span>
              <p className="font-bold text-xl text-gray-800">PCOS Reset Method</p>
            </div>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-purple-600">
              {urlStep}/{totalUrlSteps}
            </span>
          </div>
        </header>
      )}

      {/* Special header for age-range question */}
      {question.id === "age-range" && (
        <header className="flex-shrink-0 sticky top-0 z-10 w-full py-3 flex justify-center items-center bg-white border-b border-purple-100">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-sm sm:text-base font-semibold text-gray-800">
              💜 Trusted by 28,000+ women
            </span>
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              4.8 ★ average rating
            </span>
          </div>
        </header>
      )}

      {/* Main content - scrollable area */}
      <main className="flex-1 overflow-y-auto">
        <div className={cn(
          "px-4 pt-4 sm:pt-8",
          showFooterButton && !inlineButton ? "pb-28" : "pb-8"
        )}>
          <div className={cn(
            "mx-auto flex flex-col w-full",
            question.type === "visual-select" ? "max-w-2xl" : "max-w-[400px] sm:max-w-md",
            isExiting 
              ? (exitDirection === "forward" ? "quiz-slide-exit" : "quiz-slide-exit-back")
              : (enterDirection === "forward" ? "quiz-slide-enter" : "quiz-slide-enter-back")
          )}>
            {question.question && question.id === "age-range" ? (
              <div className="text-center mb-8 sm:mb-10 px-2">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                  Feel like nothing works for your PCOS?
                </h1>
                <p className="text-[15px] sm:text-lg text-purple-700 font-semibold mb-2">
                  Let&apos;s find out what YOUR body actually needs.
                </p>
                <p className="text-[13px] sm:text-base text-gray-500 font-medium">
                  Get your personalized PCOS reset in 3 minutes.
                </p>
              </div>
            ) : question.question ? (
              <div className="text-center mb-6 sm:mb-8 px-2">
                <h1 className="text-lg sm:text-2xl leading-snug font-bold text-gray-900 mb-2">
                  {question.question}
                </h1>
                {question.subtitle && (
                  <p className="text-gray-600 text-[13px] sm:text-sm font-normal">
                    {question.subtitle}
                  </p>
                )}
              </div>
            ) : null}

            <div>
              {renderQuestionContent()}
            </div>

            {/* Inline continue button — directly under the input box */}
            {showFooterButton && inlineButton && (
              <div className="mt-8 mb-4">
                <button
                  onClick={handleNext}
                  disabled={!canContinue()}
                  className="w-full py-3 font-semibold text-base rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-200 disabled:text-purple-400 disabled:cursor-not-allowed transition-colors shadow-lg shadow-purple-200"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Fixed bottom continue button for scrollable question types */}
      {showFooterButton && !inlineButton && (
        <footer className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-6 pt-4 bg-gradient-to-t from-white via-white/95 to-white/0">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleNext}
              disabled={!canContinue()}
              className="w-full py-3 font-semibold text-base rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-200 disabled:text-purple-400 disabled:cursor-not-allowed transition-colors shadow-lg shadow-purple-200"
            >
              Continue
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

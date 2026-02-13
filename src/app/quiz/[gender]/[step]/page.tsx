"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  SingleSelect,
  MultiSelect,
  NumericInput,
  HeightInput,
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
    if (step === totalSteps) {
      router.push("/generating");
    } else {
      router.push(`/quiz/${gender}/${urlStep + 1}`);
    }
  };

  const handleBack = () => {
    if (urlStep > 0) {
      router.push(`/quiz/${gender}/${urlStep - 1}`);
    }
  };

  const handleValueChange = (value: string | string[] | number) => {
    if (question.id === "current-weight" || question.id === "target-weight") {
      const lbsValue = Number(value);
      if (!Number.isNaN(lbsValue)) {
        setResponse(question.id, lbsToKg(lbsValue));
        setResponse(`${question.id}-lbs`, lbsValue);
      }
    } else {
      setResponse(question.id, value);
    }

    if (question.type === "single-select" || question.type === "visual-select") {
      setTimeout(() => {
        router.push(`/quiz/${gender}/${urlStep + 1}`);
      }, 280);
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
            benefits={question.benefits}
          />
        ) : null;

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
  // For compact input types (height, numeric, visual-select), show the button inline below the content
  const inlineButton = question.type === "height-input" || question.type === "numeric-input" || question.type === "visual-select";

  return (
    <div className={`min-h-screen flex flex-col ${question.id === "age-range" ? "bg-[#FFF0E0]" : "bg-[#F5F5F5]"}`}>
      {/* Header - only show for non-age-range questions */}
      {question.id !== "age-range" && (
        <header className="flex-shrink-0">
          <div className="h-1 bg-[#ffd4b3]">
            <div
              className="h-full bg-[#ff9933] transition-all duration-500"
              style={{ width: `${(urlStep / totalUrlSteps) * 100}%` }}
            />
          </div>
          <div className="relative px-4 py-3 bg-white border-b border-gray-100">
            <button
              onClick={handleBack}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
            <div className="text-center flex items-center justify-center gap-2">
              <div className="bg-[#F4A460] p-1 rounded-md">
                <Heart className="w-[18px] h-[18px] text-white fill-current" />
              </div>
              <p className="font-bold text-xl text-gray-800">PCOS Plan</p>
            </div>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600">
              {urlStep}/{totalUrlSteps}
            </span>
          </div>
        </header>
      )}

      {/* Special header for age-range question */}
      {question.id === "age-range" && (
        <header className="w-full py-4 flex justify-center items-center bg-white border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-[#F4A460] p-1 rounded-md">
              <Heart className="w-[18px] h-[18px] text-white fill-current" />
            </div>
            <span className="font-bold text-xl text-gray-800">PCOS Plan</span>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4">
          <div className={cn(
            "mx-auto flex flex-col min-h-full justify-center w-full",
            question.type === "visual-select" ? "max-w-2xl" : "max-w-md"
          )}>
            {question.question && question.id === "age-range" ? (
              <div className="text-center mb-10">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                  {question.question}
                </h1>
                {question.subtitle && (
                  <p className="text-lg text-gray-600 font-medium">
                    {question.subtitle}
                  </p>
                )}
              </div>
            ) : question.question ? (
              <div className="text-center mb-8">
                <h1 className="text-2xl leading-snug font-bold text-gray-900 mb-2">
                  {question.question}
                </h1>
                {question.subtitle && (
                  <p className="text-gray-600 text-sm font-normal">
                    {question.subtitle}
                  </p>
                )}
              </div>
            ) : null}

            <div className={inlineButton ? "" : "flex-1"}>
              {renderQuestionContent()}
            </div>

            {/* Inline continue button — directly under the input box */}
            {showFooterButton && inlineButton && (
              <div className="mt-8 mb-4">
                <button
                  onClick={handleNext}
                  disabled={!canContinue()}
                  className="w-full py-3 font-semibold text-base rounded-xl bg-black text-white hover:bg-gray-900 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom-pinned continue button for other question types (multi-select, ingredient-select, etc.) */}
        {showFooterButton && !inlineButton && (
          <footer className="px-4 pb-6 pt-8">
            <div className="max-w-md mx-auto">
              <button
                onClick={handleNext}
                disabled={!canContinue()}
                className="w-full py-3 font-semibold text-base rounded-xl bg-black text-white hover:bg-gray-900 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
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
import Image from "next/image";
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

      case "interstitial":
        return question.content ? (
          <Interstitial
            title={question.content.title}
            description={
              question.id === "motivation-2"
                ? (() => {
                    const ageRange = responses["age-range"] as string | undefined;
                    const currentKg = responses["current-weight"] as number | undefined;
                    const targetKg = responses["target-weight"] as number | undefined;
                    const ageLabel = ageRange === "18-27" ? "20s" : ageRange === "27-40" ? "30s" : ageRange === "41-50" ? "40s" : ageRange === "50+" ? "50s" : "30s";
                    const low = targetKg ? Math.round(targetKg) : 64;
                    const high = currentKg ? Math.round(currentKg) : 72;
                    return `Women in their ${ageLabel}, a gentle reminder: building consistent daily habits that help you reach and maintain a weight range of ${low}kg to ${high}kg can accelerate your progress toward a stronger, healthier body.`;
                  })()
                : question.content.description
            }
            highlight={question.content.highlight}
            image={
              question.id === "motivation-2"
                ? (() => {
                    const ageRange = responses["age-range"] as string | undefined;
                    const imageMap: Record<string, string> = {
                      "18-27": "/images/age-18-27.png",
                      "27-40": "/images/age-27-40.png",
                      "41-50": "/images/age-27-40.png",
                      "50+": "/images/age-50-plus.png",
                    };
                    return ageRange ? imageMap[ageRange] || "/images/age-18-27.png" : "/images/age-18-27.png";
                  })()
                : question.content.image
            }
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
  // For compact input types (height, weight, numeric, visual-select), show the button inline below the content
  const inlineButton = 
    question.type === "height-input" || 
    question.type === "weight-input" ||
    question.type === "numeric-input" || 
    question.type === "visual-select";

  return (
    <div className={`min-h-screen flex flex-col ${question.id === "age-range" ? "bg-[#FAF5FF]" : "bg-[#FDFBFF]"}`}>
      {/* Header - only show for non-age-range questions */}
      {question.id !== "age-range" && (
        <header className="flex-shrink-0">
          <div className="h-1 bg-[#E9D5FF]">
            <div
              className="h-full bg-[#A855F7] transition-all duration-500"
              style={{ width: `${(urlStep / totalUrlSteps) * 100}%` }}
            />
          </div>
          <div className="relative px-4 py-3 bg-white border-b border-purple-100">
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
        <header className="w-full py-3 flex justify-center items-center bg-white border-b border-purple-100">
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

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 pt-4 sm:pt-8 pb-4">
          <div className={cn(
            "mx-auto flex flex-col min-h-full justify-center w-full",
            question.type === "visual-select" ? "max-w-2xl" : "max-w-[400px] sm:max-w-md"
          )}>
            {question.question && question.id === "age-range" ? (
              <div className="text-center mb-8 sm:mb-10 px-2">
                {/* Avatar that updates based on selected age */}
                <div className="flex justify-center mb-5">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg bg-white">
                    <Image
                      src={
                        currentValue
                          ? (question.options?.find(o => o.id === currentValue)?.image || "/images/age-18-27.png")
                          : "/images/age-18-27.png"
                      }
                      alt="Your avatar"
                      width={144}
                      height={144}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
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

            <div className={inlineButton ? "" : "flex-1"}>
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

        {/* Bottom-pinned continue button for other question types (multi-select, ingredient-select, etc.) */}
        {showFooterButton && !inlineButton && (
          <footer className="px-4 pb-6 pt-4 sm:pt-8">
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
      </main>
    </div>
  );
}

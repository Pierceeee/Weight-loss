"use client";

import { useMemo } from "react";
import { useQuizStore } from "@/hooks/useQuizState";
import { calculateBMI, getBMIResult } from "@/lib/bmi";
import Image from "next/image";
import { cn } from "@/lib/utils";

function getExerciseLabel(exercisePreference: string) {
  if (exercisePreference === "regularly") return "Moderate activity";
  if (exercisePreference === "occasionally") return "Light activity";
  if (exercisePreference === "try-to-stay-active") return "Light activity";
  return "Low activity";
}

function getActivityLabel(activityLevel: string) {
  if (activityLevel === "always-working-out") return "High";
  if (activityLevel === "moving-a-lot") return "Above average";
  if (activityLevel === "desk-job") return "Average";
  return "Average";
}

function BMIGauge({ bmi }: { bmi: number }) {
  // Map BMI to needle rotation
  // Arc spans from -90° (left/underweight) to +90° (right/obese)
  // Categories: <18.5 underweight | 18.5-25 normal | 25-30 overweight | 30+ obese
  // Each category gets equal arc space (45°)
  const rotation = useMemo(() => {
    const clampedBMI = Math.max(15, Math.min(40, bmi));
    if (clampedBMI < 18.5) {
      // Underweight zone: -90° to -45° (far left, green)
      const pct = (clampedBMI - 15) / (18.5 - 15);
      return -90 + pct * 45;
    } else if (clampedBMI < 25) {
      // Normal zone: -45° to 0° (left-center, lime)
      const pct = (clampedBMI - 18.5) / (25 - 18.5);
      return -45 + pct * 45;
    } else if (clampedBMI < 30) {
      // Overweight zone: 0° to 45° (right-center, orange)
      const pct = (clampedBMI - 25) / (30 - 25);
      return pct * 45;
    } else {
      // Obese zone: 45° to 90° (far right, red)
      const pct = Math.min(1, (clampedBMI - 30) / (40 - 30));
      return 45 + pct * 45;
    }
  }, [bmi]);

  const animId = `gauge-bmi-${Math.round(bmi * 10)}`;

  return (
    <>
      <style>{`
        @keyframes ${animId} {
          from { transform: rotate(-90deg); }
          to { transform: rotate(${rotation}deg); }
        }
        .${animId} {
          transform-origin: 80px 80px;
          animation: ${animId} 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
      <svg viewBox="0 0 160 100" className="w-36 h-auto mx-auto mt-3 overflow-visible">
        {/* Background arc segments mapped to BMI categories */}
        {/* Underweight: green - far left */}
        <path d="M 15 80 A 65 65 0 0 1 34 35" fill="none" stroke="#22c55e" strokeWidth="14" strokeLinecap="round" />
        {/* Normal: lime - left center */}
        <path d="M 38 30 A 65 65 0 0 1 80 15" fill="none" stroke="#84cc16" strokeWidth="14" strokeLinecap="round" />
        {/* Overweight: orange - right center */}
        <path d="M 84 15 A 65 65 0 0 1 126 35" fill="none" stroke="#f97316" strokeWidth="14" strokeLinecap="round" />
        {/* Obese: red - far right */}
        <path d="M 130 40 A 65 65 0 0 1 145 80" fill="none" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" />

        {/* Needle - animates to correct BMI position */}
        <g className={animId}>
          <line x1="80" y1="80" x2="80" y2="25" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
          <circle cx="80" cy="80" r="6" fill="#1f2937" />
          <circle cx="80" cy="80" r="2.5" fill="#9ca3af" />
        </g>
      </svg>
    </>
  );
}

export function PersonalSummary() {
  const { getUserProfile, getResponse } = useQuizStore();
  const profile = getUserProfile();

  // Get values directly from responses for more reliability
  const age = (getResponse("age") as number | undefined) || profile?.age || 30;
  const currentWeight = (getResponse("current-weight") as number | undefined) || profile?.currentWeight || 70;
  const height = (getResponse("height") as number | undefined) || profile?.height || 165;
  const exercisePreference = (getResponse("exercise-preference") as string | undefined) || profile?.exercisePreference || "";
  const activityLevel = (getResponse("activity-level") as string | undefined) || profile?.activityLevel || "";

  const bmiValue = useMemo(() => {
    return calculateBMI(currentWeight, height);
  }, [currentWeight, height]);

  const bmiResult = useMemo(() => {
    return getBMIResult(bmiValue);
  }, [bmiValue]);

  // Select image based on BMI category
  const summaryImage = useMemo(() => {
    switch (bmiResult.category) {
      case "Underweight":
        return "/images/body-type-regular.png";
      case "Normal":
        return "/images/body-type-regular.png";
      case "Overweight":
        return "/images/body-type-plump.png";
      case "Obese":
        return "/images/body-type-extra.png";
      default:
        return "/images/body-type-regular.png";
    }
  }, [bmiResult.category]);

  const exerciseLabel = getExerciseLabel(exercisePreference);
  const activityLabel = getActivityLabel(activityLevel);

  return (
    <div className="max-w-sm mx-auto">
      <div className="rounded-2xl overflow-hidden bg-white border border-purple-100 shadow-sm relative">
        {/* BMI Section - Warm background */}
        <div className="bg-[#FFF8DC] px-5 pt-5 pb-6 text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Body Mass Index (BMI)
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {bmiResult.category}
          </p>

          <BMIGauge bmi={bmiValue} />

          <p className="text-[10px] text-gray-600 mt-3 leading-relaxed px-2">
            A healthy BMI provides a strong foundation for improving body composition and reaching your desired shape.
          </p>
        </div>

        {/* Info items + Person image */}
        <div className="flex items-end">
          {/* Left side - info items */}
          <div className="flex-1 p-3 sm:p-5 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                <span className="text-base sm:text-lg">🌸</span>
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  PCOS symptom indicators
                </p>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-xs sm:text-sm text-gray-900">Detected</p>
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                <span className="text-base sm:text-lg">💪</span>
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  Exercise habits
                </p>
                <p className="font-bold text-xs sm:text-sm text-gray-900">{exerciseLabel}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <span className="text-base sm:text-lg">⚡</span>
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  Daily activity level
                </p>
                <p className="font-bold text-xs sm:text-sm text-gray-900">{activityLabel}</p>
              </div>
            </div>
          </div>

          {/* Right side - person image */}
          <div className="relative w-32 sm:w-44 flex-shrink-0">
            <Image
              src={summaryImage}
              alt="Personal summary"
              width={200}
              height={280}
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

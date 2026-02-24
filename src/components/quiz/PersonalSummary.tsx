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
  // Four equal arc zones (each 45°), needle inset 10° into each zone
  // so the needle is always clearly inside the correct color band
  const rotation = useMemo(() => {
    const clampedBMI = Math.max(15, Math.min(40, bmi));
    if (clampedBMI < 18.5) {
      const pct = (clampedBMI - 15) / 3.5;
      return -80 + pct * 35;            // -80° to -45°
    } else if (clampedBMI < 25) {
      const pct = (clampedBMI - 18.5) / 6.5;
      return -35 + pct * 25;            // -35° to -10°
    } else if (clampedBMI < 30) {
      const pct = (clampedBMI - 25) / 5;
      return 10 + pct * 25;             // +10° to +35°
    } else {
      const pct = Math.min(1, (clampedBMI - 30) / 10);
      return 55 + pct * 35;             // +55° to +90°
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
        {/* Underweight: green  (-90° to -45°) */}
        <path d="M 15 80 A 65 65 0 0 1 34 35" fill="none" stroke="#22c55e" strokeWidth="14" strokeLinecap="round" />
        {/* Normal: lime  (-45° to 0°) */}
        <path d="M 38 30 A 65 65 0 0 1 80 15" fill="none" stroke="#84cc16" strokeWidth="14" strokeLinecap="round" />
        {/* Overweight: orange  (0° to +45°) */}
        <path d="M 84 15 A 65 65 0 0 1 126 35" fill="none" stroke="#f97316" strokeWidth="14" strokeLinecap="round" />
        {/* Obese: red  (+45° to +90°) */}
        <path d="M 130 40 A 65 65 0 0 1 145 80" fill="none" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" />

        {/* Needle */}
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

  const ageRange = (getResponse("age-range") as string | undefined) || "";

  const summaryImage = useMemo(() => {
    switch (ageRange) {
      case "18-27":
        return "/images/age-25-35.png";
      case "27-40":
        return "/images/age-35-50.png";
      case "41-50":
        return "/images/age-50-65.png";
      case "50+":
        return "/images/age-65-plus.png";
      default:
        return "/images/age-25-35.png";
    }
  }, [ageRange]);

  const exerciseLabel = getExerciseLabel(exercisePreference);
  const activityLabel = getActivityLabel(activityLevel);

  return (
    <div className="max-w-sm mx-auto">
      <div className="rounded-2xl bg-white border border-purple-100 shadow-sm">
        {/* BMI Section - Warm background */}
        <div className="bg-[#FFF8DC] rounded-t-2xl px-5 pt-5 pb-6 text-center">
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
        <div className="grid grid-cols-[1fr_120px] sm:grid-cols-[1fr_150px] items-center">
          {/* Left side - info items */}
          <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
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
          <div className="self-end">
            <img
              src={summaryImage}
              alt="Personal summary"
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

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
  // Calculate rotation based on BMI (15 to 40 range)
  const rotation = useMemo(() => {
    const minBMI = 15;
    const maxBMI = 40;
    const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi));
    const percentage = (clampedBMI - minBMI) / (maxBMI - minBMI);
    return (percentage * 140) - 70; // Map to -70 to +70 degrees
  }, [bmi]);

  return (
    <svg viewBox="0 0 200 120" className="w-32 h-auto mx-auto mt-3 overflow-visible">
      {/* Background arc segments */}
      <path
        d="M 35 95 A 65 65 0 0 1 75 38"
        fill="none"
        stroke="#22c55e"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M 78 36 A 65 65 0 0 1 100 32"
        fill="none"
        stroke="#84cc16"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M 103 32 A 65 65 0 0 1 135 42"
        fill="none"
        stroke="#f97316"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M 138 45 A 65 65 0 0 1 165 95"
        fill="none"
        stroke="#ef4444"
        strokeWidth="12"
        strokeLinecap="round"
      />
      
      {/* Needle - animated */}
      <g 
        className="animate-gauge-sweep"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="35"
          stroke="#1f2937"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="6" fill="#1f2937" />
        <circle cx="100" cy="100" r="2" fill="#9ca3af" />
      </g>
    </svg>
  );
}

export function PersonalSummary() {
  const { getUserProfile } = useQuizStore();
  const profile = getUserProfile();

  const bmiValue = useMemo(() => {
    if (!profile) return 22;
    return calculateBMI(profile.currentWeight, profile.height);
  }, [profile]);

  const bmiResult = useMemo(() => {
    return getBMIResult(bmiValue);
  }, [bmiValue]);

  const exerciseLabel = profile ? getExerciseLabel(profile.exercisePreference) : "Moderate activity";
  const activityLabel = profile ? getActivityLabel(profile.activityLevel) : "Average";

  return (
    <div className="max-w-sm mx-auto">
      <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm relative animate-fade-up">
        {/* BMI Section - Yellow background */}
        <div className="bg-[#FFF8DC] px-5 pt-5 pb-6 text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Body Mass Index (BMI)
          </p>
          <p className="text-2xl font-bold text-gray-900 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {bmiResult.category}
          </p>

          <BMIGauge bmi={bmiValue} />

          <p className="text-[10px] text-gray-600 mt-3 leading-relaxed px-2 animate-fade-up" style={{ animationDelay: '0.8s' }}>
            A healthy BMI provides a strong foundation for improving body composition and reaching your desired shape.
          </p>
        </div>

        {/* Info items + Person image */}
        <div className="flex items-end">
          {/* Left side - info items */}
          <div className="flex-1 p-3 sm:p-5 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                <span className="text-base sm:text-lg">💗</span>
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  PCOS symptom indicators
                </p>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-xs sm:text-sm text-gray-900">Detected</p>
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 animate-fade-up" style={{ animationDelay: '0.5s' }}>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                <span className="text-base sm:text-lg">🏋️</span>
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  Exercise habits
                </p>
                <p className="font-bold text-xs sm:text-sm text-gray-900">{exerciseLabel}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 animate-fade-up" style={{ animationDelay: '0.6s' }}>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <span className="text-base sm:text-lg">📊</span>
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
          <div className="relative w-24 sm:w-36 flex-shrink-0 animate-fade-up" style={{ animationDelay: '0.7s' }}>
            <Image
              src="/images/personal-summary.png"
              alt="Personal summary"
              width={160}
              height={220}
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

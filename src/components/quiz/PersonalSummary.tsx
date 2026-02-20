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
  // Map BMI to needle rotation using category-aware positioning
  // Arc spans from -70° (left/underweight) to +70° (right/obese)
  // Categories: <18.5 underweight | 18.5-25 normal | 25-30 overweight | 30+ obese
  // We give each zone a proportional arc segment:
  //   Underweight (BMI 15-18.5):  -70° to -35°
  //   Normal      (BMI 18.5-25):  -35° to  10°
  //   Overweight  (BMI 25-30):     10° to  40°
  //   Obese       (BMI 30-40):     40° to  70°
  const rotation = useMemo(() => {
    const clampedBMI = Math.max(15, Math.min(40, bmi));
    if (clampedBMI < 18.5) {
      // Underweight zone: -70 to -35
      const pct = (clampedBMI - 15) / (18.5 - 15);
      return -70 + pct * 35;
    } else if (clampedBMI < 25) {
      // Normal zone: -35 to 10
      const pct = (clampedBMI - 18.5) / (25 - 18.5);
      return -35 + pct * 45;
    } else if (clampedBMI < 30) {
      // Overweight zone: 10 to 40
      const pct = (clampedBMI - 25) / (30 - 25);
      return 10 + pct * 30;
    } else {
      // Obese zone: 40 to 70
      const pct = (clampedBMI - 30) / (40 - 30);
      return 40 + pct * 30;
    }
  }, [bmi]);

  const animId = `gauge-${Math.round(rotation)}`;

  return (
    <>
      <style>{`
        @keyframes ${animId} {
          from { transform: rotate(-90deg); }
          to { transform: rotate(${rotation}deg); }
        }
        .${animId} {
          transform-origin: 100px 100px;
          animation: ${animId} 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
      <svg viewBox="0 0 200 120" className="w-32 h-auto mx-auto mt-3 overflow-visible">
        {/* Background arc segments mapped to BMI categories */}
        {/* Underweight: green */}
        <path d="M 35 95 A 65 65 0 0 1 75 38" fill="none" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" />
        {/* Normal: lime */}
        <path d="M 78 36 A 65 65 0 0 1 115 33" fill="none" stroke="#84cc16" strokeWidth="12" strokeLinecap="round" />
        {/* Overweight: orange */}
        <path d="M 118 34 A 65 65 0 0 1 148 52" fill="none" stroke="#f97316" strokeWidth="12" strokeLinecap="round" />
        {/* Obese: red */}
        <path d="M 151 55 A 65 65 0 0 1 165 95" fill="none" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" />

        {/* Needle - animates to correct BMI position */}
        <g className={animId}>
          <line x1="100" y1="100" x2="100" y2="35" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="6" fill="#1f2937" />
          <circle cx="100" cy="100" r="2" fill="#9ca3af" />
        </g>
      </svg>
    </>
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
          <div className="relative w-24 sm:w-36 flex-shrink-0">
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

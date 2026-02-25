"use client";

import { useMemo } from "react";
import { useQuizStore } from "@/hooks/useQuizState";
import { calculateBMI, getBMIResult } from "@/lib/bmi";
import Image from "next/image";
import { cn } from "@/lib/utils";

function getExerciseLabel(exercisePreference: string) {
  if (exercisePreference === "regularly") return "Moderate exercise";
  if (exercisePreference === "occasionally") return "Light exercise";
  if (exercisePreference === "try-to-stay-active") return "Light exercise";
  return "Low exercise";
}

function getActivityLabel(activityLevel: string) {
  if (activityLevel === "always-working-out") return "High";
  if (activityLevel === "moving-a-lot") return "Above average";
  if (activityLevel === "desk-job") return "Average";
  return "Average";
}

function BMIGauge({ bmi }: { bmi: number }) {
  const rotation = useMemo(() => {
    const clampedBMI = Math.max(15, Math.min(40, bmi));
    if (clampedBMI < 18.5) {
      const pct = (clampedBMI - 15) / 3.5;
      return -80 + pct * 35;
    } else if (clampedBMI < 25) {
      const pct = (clampedBMI - 18.5) / 6.5;
      return -35 + pct * 25;
    } else if (clampedBMI < 30) {
      const pct = (clampedBMI - 25) / 5;
      return 10 + pct * 25;
    } else {
      const pct = Math.min(1, (clampedBMI - 30) / 10);
      return 55 + pct * 35;
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
      <svg viewBox="0 0 160 100" className="w-48 h-auto mx-auto mt-5 overflow-visible">
        {/* Blue segment (Underweight) */}
        <path 
          d="M 15 80 A 65 65 0 0 1 34 35" 
          fill="none" 
          stroke="#3B82F6" 
          strokeWidth="10" 
          strokeLinecap="round" 
        />
        {/* Green segment (Normal) */}
        <path 
          d="M 38 30 A 65 65 0 0 1 80 15" 
          fill="none" 
          stroke="#22C55E" 
          strokeWidth="10" 
          strokeLinecap="round" 
        />
        {/* Yellow/Orange segment (Overweight) */}
        <path 
          d="M 84 15 A 65 65 0 0 1 126 35" 
          fill="none" 
          stroke="#F59E0B" 
          strokeWidth="10" 
          strokeLinecap="round" 
        />
        {/* Red segment (Obese) */}
        <path 
          d="M 130 40 A 65 65 0 0 1 145 80" 
          fill="none" 
          stroke="#EF4444" 
          strokeWidth="10" 
          strokeLinecap="round" 
        />

        {/* Needle - raindrop/triangular shape */}
        <g className={animId}>
          <path 
            d="M 80 80 L 76 75 L 80 25 L 84 75 Z" 
            fill="#1F2937"
          />
          <circle cx="80" cy="80" r="5" fill="#1F2937" />
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
        return "/images/after-25-35.png";
      case "27-40":
        return "/images/after-35-50.png";
      case "41-50":
        return "/images/after-50-65.png";
      case "50+":
        return "/images/after-50-65.png";
      default:
        return "/images/after-25-35.png";
    }
  }, [ageRange]);

  const exerciseLabel = getExerciseLabel(exercisePreference);
  const activityLabel = getActivityLabel(activityLevel);

  return (
    <div className="max-w-md mx-auto font-sans">
      {/* Main card with shadow */}
      <div className="relative rounded-2xl bg-white shadow-lg overflow-hidden">
        {/* BMI Section - Pink background */}
        <div className="bg-[#FDE8E4] px-8 pt-8 pb-6 text-center">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">
            Body Mass Index (BMI)
          </p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {bmiResult.category}
          </p>

          <BMIGauge bmi={bmiValue} />

          <p className="text-sm text-gray-500 mt-5 leading-relaxed max-w-[320px] mx-auto">
            <span className="font-semibold text-gray-700">Risks of unhealthy BMI:</span>{" "}
            High blood pressure, increased risk of heart attack, stroke, type 2 diabetes, chronic back and joint pain
          </p>
        </div>

        {/* Stats + Image section - White background */}
        <div className="relative bg-white min-h-[240px]">
          {/* Left side - stats list */}
          <div className="py-6 pl-6 pr-[160px] space-y-6">
            {/* PCOS Symptoms */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fillOpacity="0.3"/>
                  <circle cx="12" cy="12" r="5"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  PCOS Symptoms
                </p>
                <p className="font-bold text-base text-gray-900">Present</p>
              </div>
            </div>

            {/* Exercise */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Exercise
                </p>
                <p className="font-bold text-base text-gray-900">{exerciseLabel}</p>
              </div>
            </div>

            {/* Activity Level */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                  <text x="12" y="17" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">17</text>
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Activity Level
                </p>
                <p className="font-bold text-base text-gray-900">{activityLabel}</p>
              </div>
            </div>
          </div>

          {/* Right side - person image positioned at bottom right */}
          <div className="absolute right-0 bottom-0 w-[240px]">
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

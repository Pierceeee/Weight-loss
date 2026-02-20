"use client";

import { useMemo } from "react";
import { useQuizStore } from "@/hooks/useQuizState";
import { calculateBMI, getBMIResult } from "@/lib/bmi";

function getGoalDate() {
  const date = new Date();
  date.setDate(date.getDate() + 88);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function GoalProjection() {
  const { responses } = useQuizStore();
  const targetKg = (responses["target-weight"] as number | undefined) || 55;
  const currentKg = (responses["current-weight"] as number | undefined) || 68;
  const heightCm = (responses["height"] as number | undefined) || 165;
  const goalDate = useMemo(() => getGoalDate(), []);

  const bmi = calculateBMI(currentKg, heightCm);
  const bmiResult = getBMIResult(bmi);

  // BMI arrow position: map BMI 15–40 to 0%–100%
  const bmiPercent = Math.min(100, Math.max(0, ((bmi - 15) / (40 - 15)) * 100));

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-center text-xl sm:text-2xl font-bold text-[#A855F7] mb-2">{Math.round(targetKg)} kg by {goalDate}</h2>
      <p className="text-center text-sm text-gray-600 mb-4">Weight Now: {Math.round(currentKg)} kg • Goal: {Math.round(targetKg)} kg</p>

      {/* BMI Indicator */}
      <div className="bg-white border border-purple-100 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-800">Your BMI</span>
          <span className="text-sm font-bold" style={{ color: bmiResult.color }}>
            {bmi.toFixed(1)} — {bmiResult.category}
          </span>
        </div>

        {/* BMI bar */}
        <div className="relative mt-3 mb-6">
          <div className="flex h-3 rounded-full overflow-hidden">
            <div className="flex-1 bg-blue-400" />
            <div className="flex-1 bg-green-400" />
            <div className="flex-1 bg-yellow-400" />
            <div className="flex-1 bg-orange-400" />
            <div className="flex-1 bg-red-500" />
          </div>

          {/* Arrow indicator */}
          <div
            className="absolute -top-1 transition-all duration-500"
            style={{ left: `${bmiPercent}%`, transform: "translateX(-50%)" }}
          >
            <div className="flex flex-col items-center">
              <div className="text-lg leading-none">▼</div>
              <span className="text-[10px] font-bold mt-0.5" style={{ color: bmiResult.color }}>
                {bmi.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-gray-400">15</span>
            <span className="text-[10px] text-gray-400">Underweight</span>
            <span className="text-[10px] text-gray-400">Normal</span>
            <span className="text-[10px] text-gray-400">Overweight</span>
            <span className="text-[10px] text-gray-400">Obese</span>
            <span className="text-[10px] text-gray-400">40</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-purple-100 rounded-xl p-4">
        <svg viewBox="0 0 520 300" className="w-full h-auto">
          {/* WEIGHT label */}
          <text x="20" y="30" fill="#9ca3af" fontSize="11" fontWeight="600" letterSpacing="1">WEIGHT</text>

          {/* Grid lines */}
          <line x1="20" y1="60" x2="500" y2="60" stroke="#e5e7eb" strokeDasharray="4 4" />
          <line x1="20" y1="140" x2="500" y2="140" stroke="#e5e7eb" strokeDasharray="4 4" />
          <line x1="20" y1="220" x2="500" y2="220" stroke="#e5e7eb" strokeDasharray="4 4" />

          {/* Typical weight-loss journey (red dashed) */}
          <path
            d="M 30 95 C 140 100, 220 70, 500 65"
            fill="none"
            stroke="#ef4444"
            strokeWidth="4"
            strokeDasharray="10 8"
            className="opacity-40"
          />

          {/* PCOS Reset Method line (purple solid) */}
          <path
            d="M 30 105 C 120 100, 160 170, 250 155 C 320 140, 360 210, 500 200"
            fill="none"
            stroke="#A855F7"
            strokeWidth="5"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            className="animate-draw"
          />

          {/* Arrowhead at the end of the purple line */}
          <path
            d="M 490 190 L 505 200 L 490 210 Z"
            fill="#A855F7"
            className="animate-fade-up"
            style={{ animationDelay: '2s', opacity: 0 }}
          />

          {/* Dots on the line */}
          <circle cx="95" cy="108" r="8" fill="#A855F7" className="animate-fade-up" style={{ animationDelay: '0.4s', opacity: 0 }} />
          <circle cx="250" cy="155" r="8" fill="#A855F7" className="animate-fade-up" style={{ animationDelay: '1s', opacity: 0 }} />
          <circle cx="410" cy="190" r="8" fill="#A855F7" className="animate-fade-up" style={{ animationDelay: '1.6s', opacity: 0 }} />

          {/* Now label */}
          <g className="animate-fade-up">
            <rect x="45" y="68" width="98" height="32" rx="8" fill="#A855F7" />
            <text x="94" y="89" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">Now: {Math.round(currentKg)} kg</text>
          </g>

          {/* Goal label */}
          <g className="animate-fade-up" style={{ animationDelay: '2s', opacity: 0 }}>
            <rect x="360" y="148" width="98" height="32" rx="8" fill="#A855F7" />
            <text x="409" y="169" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">Goal: {Math.round(targetKg)} kg</text>
            {/* Animated pointing arrow */}
            <path
              d="M 409 140 L 409 125 M 404 130 L 409 125 L 414 130"
              fill="none"
              stroke="#A855F7"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce-subtle"
            />
          </g>

          {/* TIME label */}
          <text x="480" y="250" fill="#9ca3af" fontSize="11" fontWeight="600" letterSpacing="1" textAnchor="end">TIME</text>
        </svg>

        <div className="space-y-2 mt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-10 h-[3px] bg-[#A855F7] inline-block rounded-full" />
            <span className="font-medium text-gray-700">Estimated Timeline With PCOS Reset Method</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-10 h-[3px] inline-block bg-[repeating-linear-gradient(90deg,#ef4444,#ef4444_5px,transparent_5px,transparent_10px)]" />
            <span className="font-medium text-gray-700">Typical weight-loss journey</span>
          </div>
        </div>
      </div>
    </div>
  );
}

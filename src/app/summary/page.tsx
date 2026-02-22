"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuizStore } from "@/hooks/useQuizState";
import { calculateBMI, getBMIResult, getHealthRisks } from "@/lib/bmi";
import { ArrowRight, AlertTriangle, Activity, Flame, Droplets, Moon } from "lucide-react";

export default function SummaryPage() {
  const router = useRouter();
  const { getUserProfile, gender, getResponse } = useQuizStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5FF]">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  const profile = getUserProfile();
  
  if (!profile) {
    router.push("/");
    return null;
  }

  const bmi = calculateBMI(profile.currentWeight, profile.height);
  const bmiResult = getBMIResult(bmi);
  const healthRisks = getHealthRisks(bmiResult.category);

  // Get transformation images based on age
  const age = (getResponse("age") as number | undefined) || profile.age || 30;
  const getTransformationImages = () => {
    if (age < 35) {
      return {
        before: "/images/before-25-35.png",
        after: "/images/after-25-35.png",
        label: "Age 25-35"
      };
    } else if (age < 50) {
      return {
        before: "/images/before-35-50.png",
        after: "/images/after-35-50.png",
        label: "Age 35-50"
      };
    } else if (age < 65) {
      return {
        before: "/images/before-50-65.png",
        after: "/images/after-50-65.png",
        label: "Age 50-65"
      };
    } else {
      return {
        before: "/images/before-65-plus.png",
        after: "/images/summary-age-65-plus.png",
        label: "Age 65+"
      };
    }
  };
  const transformation = getTransformationImages();

  // Calculate gauge position (0-100)
  const gaugePosition = Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100);
  
  // Get BMI color
  const getBMIColor = (category: string) => {
    switch (category) {
      case "Underweight": return "#3b82f6";
      case "Normal": return "#10b981";
      case "Overweight": return "#f59e0b";
      case "Obese": return "#ef4444";
      default: return "#64748b";
    }
  };

  const bmiColor = getBMIColor(bmiResult.category);

  // Profile insights based on gender
  const getActivityLabel = (level: string) => {
    switch (level) {
      case "desk-job": return { label: "Sedentary", desc: "Desk job lifestyle" };
      case "moving-a-lot": return { label: "Active", desc: "On your feet often" };
      case "always-working-out": return { label: "Very Active", desc: "Regular workouts" };
      case "home": return { label: "Light", desc: "Home-based activity" };
      default: return { label: "Moderate", desc: "Average activity" };
    }
  };

  const getExerciseLabel = (pref: string) => {
    switch (pref) {
      case "regularly": return { label: "Regular", icon: "⚡" };
      case "occasionally": return { label: "Occasional", icon: "👟" };
      case "try-to-stay-active": return { label: "Light", icon: "👣" };
      default: return { label: "Getting Started", icon: "🌿" };
    }
  };

  const activity = getActivityLabel(profile.activityLevel);
  const exercise = getExerciseLabel(profile.exercisePreference);

  return (
    <div className="min-h-screen bg-[#FDFBFF]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-black tracking-tight text-slate-900">PCOS RESET</span>
            <span className="text-xl font-black tracking-tight text-purple-600">METHOD</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-6 sm:py-10">
        {/* Transformation Preview - Matching competitor design */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          {/* Header labels */}
          <div className="flex border-b border-gray-100">
            <div className="flex-1 py-3 text-center">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">NOW</span>
            </div>
            <div className="flex-1 py-3 text-center">
              <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">YOUR GOAL</span>
            </div>
          </div>
          
          {/* Before/After Images with arrow */}
          <div className="relative flex items-end justify-center px-4 pt-4 pb-2 bg-gradient-to-b from-gray-50 to-white">
            {/* Before */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-32 sm:w-40 aspect-[3/4]">
                <Image
                  src={transformation.before}
                  alt="Before transformation"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </div>
            
            {/* Arrow indicator */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-purple-100 rounded-full p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-purple-500">
                  <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 6L21 12L15 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                </svg>
              </div>
            </div>
            
            {/* After */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-32 sm:w-40 aspect-[3/4]">
                <Image
                  src={transformation.after}
                  alt="After transformation"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </div>

          {/* Comparison Stats - Side by side */}
          <div className="flex divide-x divide-gray-100">
            {/* Before Stats */}
            <div className="flex-1 p-4 space-y-4">
              {/* Body Fat */}
              <div className="flex items-center gap-2">
                <span className="text-base">🔥</span>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">BODY FAT</p>
                  <p className="font-bold text-sm text-gray-900">Medium</p>
                </div>
              </div>
              
              {/* PCOS Symptoms */}
              <div className="flex items-center gap-2">
                <span className="text-base">🌸</span>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">PCOS SYMPTOMS</p>
                  <div className="flex gap-0.5">
                    <div className="h-1.5 flex-1 bg-orange-400 rounded-full" />
                    <div className="h-1.5 flex-1 bg-orange-400 rounded-full" />
                    <div className="h-1.5 flex-1 bg-orange-400 rounded-full" />
                    <div className="h-1.5 flex-1 bg-orange-200 rounded-full" />
                  </div>
                </div>
              </div>
              
              {/* Daily Energy */}
              <div className="flex items-center gap-2">
                <span className="text-base">⚡</span>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">DAILY ENERGY</p>
                  <div className="flex gap-0.5">
                    <div className="h-1.5 flex-1 bg-orange-300 rounded-full" />
                    <div className="h-1.5 flex-1 bg-orange-200 rounded-full" />
                    <div className="h-1.5 flex-1 bg-orange-100 rounded-full" />
                    <div className="h-1.5 flex-1 bg-orange-100 rounded-full" />
                  </div>
                </div>
              </div>
              
              {/* Stress Level */}
              <div className="flex items-center gap-2">
                <span className="text-base">😰</span>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">STRESS LEVEL</p>
                  <div className="flex gap-0.5">
                    <div className="h-1.5 flex-1 bg-orange-400 rounded-full" />
                    <div className="h-1.5 flex-1 bg-orange-400 rounded-full" />
                    <div className="h-1.5 flex-1 bg-orange-300 rounded-full" />
                    <div className="h-1.5 flex-1 bg-orange-200 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* After Stats */}
            <div className="flex-1 p-4 space-y-4">
              {/* Body Fat */}
              <div className="flex items-center gap-2">
                <span className="text-base">🔥</span>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">BODY FAT</p>
                  <p className="font-bold text-sm text-gray-900">Low</p>
                </div>
              </div>
              
              {/* PCOS Symptoms */}
              <div className="flex items-center gap-2">
                <span className="text-base">🌸</span>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">PCOS SYMPTOMS</p>
                  <div className="flex gap-0.5">
                    <div className="h-1.5 flex-1 bg-green-400 rounded-full" />
                    <div className="h-1.5 flex-1 bg-green-200 rounded-full" />
                    <div className="h-1.5 flex-1 bg-green-100 rounded-full" />
                    <div className="h-1.5 flex-1 bg-green-100 rounded-full" />
                  </div>
                </div>
              </div>
              
              {/* Daily Energy */}
              <div className="flex items-center gap-2">
                <span className="text-base">⚡</span>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">DAILY ENERGY</p>
                  <div className="flex gap-0.5">
                    <div className="h-1.5 flex-1 bg-green-400 rounded-full" />
                    <div className="h-1.5 flex-1 bg-green-400 rounded-full" />
                    <div className="h-1.5 flex-1 bg-green-400 rounded-full" />
                    <div className="h-1.5 flex-1 bg-green-300 rounded-full" />
                  </div>
                </div>
              </div>
              
              {/* Stress Level */}
              <div className="flex items-center gap-2">
                <span className="text-base">😊</span>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">STRESS LEVEL</p>
                  <div className="flex gap-0.5">
                    <div className="h-1.5 flex-1 bg-green-300 rounded-full" />
                    <div className="h-1.5 flex-1 bg-green-100 rounded-full" />
                    <div className="h-1.5 flex-1 bg-green-100 rounded-full" />
                    <div className="h-1.5 flex-1 bg-green-100 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            Your Health Profile
          </h1>
          <p className="text-base text-slate-500">
            Based on your answers, here's your current status
          </p>
        </div>

        {/* BMI Card - Compact */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Body Mass Index</h2>
          
          {/* BMI Gauge */}
          <div className="mb-4">
            {/* Labels */}
            <div className="flex justify-between text-[10px] font-medium text-slate-400 mb-1.5 px-0.5">
              <span>Under</span>
              <span>Normal</span>
              <span>Over</span>
              <span>Obese</span>
            </div>
            
            {/* Gauge bar */}
            <div className="relative h-2.5 rounded-full overflow-hidden mb-4">
              <div className="absolute inset-0 flex">
                <div className="flex-1 bg-green-300" />
                <div className="flex-1 bg-green-400" />
                <div className="flex-1 bg-orange-400" />
                <div className="flex-1 bg-red-400" />
              </div>
              {/* Indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-800 rounded-full border-2 border-white shadow-md transition-all duration-500"
                style={{ left: `calc(${gaugePosition}% - 8px)` }}
              />
            </div>
            
            {/* BMI Value */}
            <div className="text-center">
              <div className="inline-flex items-baseline gap-1.5">
                <span className="text-3xl font-black" style={{ color: bmiColor }}>
                  {bmi.toFixed(1)}
                </span>
                <span className="text-sm font-bold text-slate-400">BMI</span>
              </div>
              <div 
                className="mt-1.5 inline-block px-3 py-1 rounded-full text-xs font-bold"
                style={{ 
                  backgroundColor: `${bmiColor}15`,
                  color: bmiColor 
                }}
              >
                {bmiResult.category}
              </div>
            </div>
          </div>

          {/* Health Risks */}
          {healthRisks.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-sm text-orange-700">Potential Health Risks</span>
              </div>
              <ul className="space-y-1">
                {healthRisks.slice(0, 3).map((risk, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs text-orange-600">
                    <span className="w-1 h-1 bg-orange-400 rounded-full flex-shrink-0" />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Lifestyle Insights - Compact */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
          <h2 className="text-base font-bold text-slate-900 mb-3">Your Lifestyle</h2>
          
          <div className="grid grid-cols-2 gap-2">
            {/* Activity Level */}
            <div className="bg-purple-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-purple-600">Activity</span>
              </div>
              <div className="text-sm font-bold text-slate-900">{activity.label}</div>
            </div>
            
            {/* Exercise */}
            <div className="bg-purple-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{exercise.icon}</span>
                <span className="text-xs font-semibold text-purple-600">Exercise</span>
              </div>
              <div className="text-sm font-bold text-slate-900">{exercise.label}</div>
            </div>
            
            {/* Hydration */}
            <div className="bg-purple-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-purple-600">Hydration</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {profile.hydration === "7-10-glasses" ? "Good" :
                 profile.hydration === "2-6-glasses" ? "Moderate" : "Low"}
              </div>
            </div>
            
            {/* Energy */}
            <div className="bg-purple-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-purple-600">Energy</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {profile.energyLevels === "fine" ? "Good" :
                 profile.energyLevels === "inconsistent" ? "Variable" : "Low"}
              </div>
            </div>
          </div>
        </div>

        {/* Goals Summary - Compact */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
          <h2 className="text-base font-bold text-slate-900 mb-3">Your Goals</h2>
          <div className="flex flex-wrap gap-1.5">
            {profile.goals.slice(0, 4).map((goal, index) => (
              <span 
                key={index}
                className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium"
              >
                {goal.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/email"
          className="flex items-center justify-center gap-2 w-full h-14 text-base font-bold rounded-xl
                   bg-purple-600 text-white
                   hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-900/20
                   transition-all duration-200 group"
        >
          Continue
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </main>
    </div>
  );
}

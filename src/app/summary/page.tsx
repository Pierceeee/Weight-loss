"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuizStore } from "@/hooks/useQuizState";
import { calculateBMI, getBMIResult, getHealthRisks } from "@/lib/bmi";
import { ArrowRight, AlertTriangle, Activity, Flame, Droplets, Moon } from "lucide-react";

export default function SummaryPage() {
  const router = useRouter();
  const { getUserProfile, gender } = useQuizStore();
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
      case "regularly": return { label: "Regular", icon: "💪" };
      case "occasionally": return { label: "Occasional", icon: "🏃" };
      case "try-to-stay-active": return { label: "Light", icon: "🚶" };
      default: return { label: "Getting Started", icon: "🌱" };
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
      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
            Your Health Profile
          </h1>
          <p className="text-lg text-slate-500">
            Based on your answers, here's your current status
          </p>
        </div>

        {/* BMI Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Body Mass Index</h2>
          
          {/* BMI Gauge */}
          <div className="mb-8">
            {/* Labels */}
            <div className="flex justify-between text-xs font-medium text-slate-400 mb-2 px-1">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
            
            {/* Gauge bar */}
            <div className="relative h-3 rounded-full overflow-hidden mb-6">
              <div className="absolute inset-0 flex">
                <div className="flex-1 bg-purple-200" />
                <div className="flex-1 bg-purple-400" />
                <div className="flex-1 bg-purple-600" />
                <div className="flex-1 bg-purple-800" />
              </div>
              {/* Indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-purple-900 rounded-full border-3 border-white shadow-lg transition-all duration-500"
                style={{ left: `calc(${gaugePosition}% - 10px)` }}
              />
            </div>
            
            {/* BMI Value */}
            <div className="text-center">
              <div className="inline-flex items-baseline gap-2">
                <span className="text-5xl font-black" style={{ color: bmiColor }}>
                  {bmi.toFixed(1)}
                </span>
                <span className="text-xl font-bold text-slate-400">BMI</span>
              </div>
              <div 
                className="mt-2 inline-block px-4 py-1.5 rounded-full text-sm font-bold"
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
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-purple-800">Potential Health Risks</span>
              </div>
              <ul className="space-y-2">
                {healthRisks.slice(0, 4).map((risk, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-purple-700">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0" />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Lifestyle Insights */}
        <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Your Lifestyle</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Activity Level */}
            <div className="bg-purple-50 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-bold text-purple-700">Activity</span>
              </div>
              <div className="text-xl font-black text-slate-900">{activity.label}</div>
              <div className="text-xs text-slate-500">{activity.desc}</div>
            </div>
            
            {/* Exercise */}
            <div className="bg-purple-50 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg">
                  {exercise.icon}
                </div>
                <span className="text-sm font-bold text-purple-700">Exercise</span>
              </div>
              <div className="text-xl font-black text-slate-900">{exercise.label}</div>
              <div className="text-xs text-slate-500">Workout frequency</div>
            </div>
            
            {/* Hydration */}
            <div className="bg-purple-50 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-bold text-purple-700">Hydration</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {profile.hydration === "7-10-glasses" ? "Good" :
                 profile.hydration === "2-6-glasses" ? "Moderate" : "Low"}
              </div>
              <div className="text-xs text-slate-500">Water intake</div>
            </div>
            
            {/* Energy */}
            <div className="bg-purple-50 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Flame className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-bold text-purple-700">Energy</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {profile.energyLevels === "fine" ? "Good" :
                 profile.energyLevels === "inconsistent" ? "Variable" : "Low"}
              </div>
              <div className="text-xs text-slate-500">Energy levels</div>
            </div>
          </div>
        </div>

        {/* Goals Summary */}
        <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Your Goals</h2>
          <div className="flex flex-wrap gap-2">
            {profile.goals.map((goal, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
              >
                {goal.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/email"
          className="flex items-center justify-center gap-2 w-full h-14 sm:h-16 text-base sm:text-lg font-bold rounded-full
                   bg-purple-600 text-white
                   hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-900/20 hover:-translate-y-0.5
                   transition-all duration-200 group"
        >
          Continue
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </main>
    </div>
  );
}

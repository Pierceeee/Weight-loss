"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuizStore } from "@/hooks/useQuizState";
import { estimateWeeksToGoal } from "@/lib/bmi";
import { ArrowRight, TrendingDown, Target, Calendar } from "lucide-react";

export default function TimelinePage() {
  const router = useRouter();
  const { getUserProfile, gender } = useQuizStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5FF]">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  const profile = getUserProfile();

  if (!profile) {
    router.push("/");
    return null;
  }

  const weeksToGoal = estimateWeeksToGoal(
    profile.currentWeight,
    profile.targetWeight
  );
  
  const weightToLose = profile.currentWeight - profile.targetWeight;
  const planName = gender === "male" ? "Perfect Body" : "Perfect Body";

  return (
    <div className="min-h-screen bg-[#FDFBFF]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-black tracking-tight text-slate-900">PCOS</span>
            <span className="text-xl font-black tracking-tight text-purple-600">PLAN</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-6">
            <Target className="w-4 h-4" />
            Your Plan is Ready
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4">
            It only takes{" "}
            <span className="text-purple-600">{weeksToGoal} weeks</span>
            <br />
            to transform your life
          </h1>
          
          <p className="text-lg text-slate-500 max-w-md mx-auto">
            {planName} will guide you every step of the way to reach your goal of {profile.targetWeight} kg
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-2xl p-4 text-center border border-slate-200 shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{profile.currentWeight}</div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium">Current (kg)</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-purple-100 shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-purple-600">-{weightToLose}</div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium">To Lose (kg)</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-slate-200 shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-emerald-500">{profile.targetWeight}</div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium">Goal (kg)</div>
          </div>
        </div>

        {/* Projection Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Your Weight Journey</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              {weeksToGoal} weeks
            </div>
          </div>

          {/* SVG Chart */}
          <div className="relative h-48 sm:h-56 mb-6">
            <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              <line x1="40" y1="20" x2="40" y2="130" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="40" y1="130" x2="380" y2="130" stroke="#e2e8f0" strokeWidth="1" />
              
              {/* Horizontal grid lines */}
              <line x1="40" y1="50" x2="380" y2="50" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="40" y1="90" x2="380" y2="90" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" />
              
              {/* Usual journey (dashed red) */}
              <path
                d="M 50 35 Q 120 50, 180 60 Q 250 70, 300 55 Q 340 45, 370 50"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="6,4"
                opacity="0.7"
              />
              
              {/* Perfect Body journey (solid gradient) */}
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Area fill */}
              <path
                d="M 50 35 Q 100 55, 160 75 Q 240 100, 370 115 L 370 130 L 50 130 Z"
                fill="url(#areaGradient)"
              />
              
              {/* Main line */}
              <path
                d="M 50 35 Q 100 55, 160 75 Q 240 100, 370 115"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              
              {/* Start point */}
              <circle cx="50" cy="35" r="8" fill="#0ea5e9" />
              <circle cx="50" cy="35" r="4" fill="white" />
              
              {/* End point */}
              <circle cx="370" cy="115" r="10" fill="#10b981" />
              <circle cx="370" cy="115" r="5" fill="white" />
              
              {/* Labels */}
              <text x="50" y="155" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="500">Now</text>
              <text x="370" y="155" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="500">Week {weeksToGoal}</text>
            </svg>

            {/* Floating labels */}
            <div className="absolute top-2 left-8 sm:left-12 px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
              {profile.currentWeight} kg
            </div>
            <div className="absolute bottom-8 right-4 sm:right-8 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
              {profile.targetWeight} kg ✓
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-gradient-to-r from-purple-600 to-emerald-500 rounded-full" />
              <span className="text-slate-700 font-medium">With PCOS Plan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-red-400 rounded-full" style={{ 
                background: "repeating-linear-gradient(90deg, #ef4444, #ef4444 4px, transparent 4px, transparent 8px)" 
              }} />
              <span className="text-slate-500">Typical diet attempts</span>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Your Milestones</h3>
          <div className="space-y-4">
            {[
              { week: 1, text: "Establish healthy eating habits", icon: "🌱" },
              { week: Math.ceil(weeksToGoal / 3), text: "First visible results", icon: "✨" },
              { week: Math.ceil(weeksToGoal * 2 / 3), text: "Halfway to your goal", icon: "🎯" },
              { week: weeksToGoal, text: "Reach your target weight!", icon: "🏆" },
            ].map((milestone, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {milestone.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900">{milestone.text}</div>
                  <div className="text-xs text-slate-500">Week {milestone.week}</div>
                </div>
                <TrendingDown className="w-5 h-5 text-emerald-500" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/summary"
          className="flex items-center justify-center gap-2 w-full h-14 sm:h-16 text-base sm:text-lg font-bold rounded-full
                   bg-purple-600 text-white
                   hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-900/20 hover:-translate-y-0.5
                   transition-all duration-200 group"
        >
          Continue
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <p className="text-center text-sm text-slate-400 mt-4">
          This is a personalized projection based on your profile
        </p>
      </main>
    </div>
  );
}

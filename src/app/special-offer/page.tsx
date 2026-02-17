"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, Star, Heart, Zap, Shield, Sparkles } from "lucide-react";

// --- Configuration ---
const INITIAL_TIMER_SECONDS = 10 * 60; // 10 minutes for this variation

const PLANS = [
  { id: "1month", title: "Monthly Transformation", original: 44.40, price: 15.19, daily: 0.50, featured: false },
  { id: "3month", title: "90-Day Reset", original: 75.49, price: 25.99, daily: 0.28, featured: true, tag: "MOST POPULAR" },
  { id: "6month", title: "Complete Lifestyle", original: 120.00, price: 39.99, daily: 0.22, featured: false },
];

export default function SpecialOfferPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("3month");

  useEffect(() => { setMounted(true); }, []);

  const handleCheckout = () => {
    console.log("Selected plan:", selectedPlan);
    alert("Checkout functionality coming soon!");
  };

  if (!mounted) return <SkeletonLoader />;

  return (
    <div className="min-h-screen bg-[#FDFBFF] antialiased pb-20">
      <main className="max-w-2xl mx-auto px-4 mt-8">
        <section className="bg-white rounded-3xl shadow-xl shadow-purple-200/20 overflow-hidden border border-purple-100">
          
          {/* Hero Section */}
          <div className="p-10 text-center bg-gradient-to-b from-purple-50/50 to-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-full text-purple-700 text-xs font-bold uppercase mb-4">
              <Sparkles size={14} />
              Personalized for you
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Unlock Your <span className="text-purple-600">PCOS Reset</span> Results
            </h1>
            <p className="mt-6 text-slate-600 text-lg max-w-lg mx-auto">
              Join 28,000+ women who have transformed their hormonal health with our step-by-step method.
            </p>
          </div>

          <div className="p-8 pt-0 space-y-10">
            {/* Pricing */}
            <div className="bg-purple-50/30 rounded-3xl p-6 border border-purple-100 space-y-4">
              <h2 className="text-xl font-black text-slate-900 text-center mb-2">Choose Your Path</h2>
              <div className="space-y-4">
                {PLANS.map((plan) => (
                  <PlanCard 
                    key={plan.id}
                    {...plan}
                    isActive={selectedPlan === plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                  />
                ))}
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg shadow-purple-200 hover:bg-purple-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                CLAIM MY RESULTS
                <ChevronRight size={24} />
              </button>

              <div className="flex items-center justify-center gap-4 py-2 opacity-60">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                  <Shield size={12} />
                  SECURE
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                  <Heart size={12} />
                  PCOS SAFE
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                  <Zap size={12} />
                  FAST RESULTS
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 text-center">Real Stories, Real Change</h3>
              <div className="grid gap-4">
                <TestimonialCard 
                  author="Sarah M."
                  text="I've finally found something that works for my PCOS. The meal plans are delicious and my energy is back! ✨"
                />
                <TestimonialCard 
                  author="Jessica L."
                  text="Lost 12kg in 3 months and my cycles are regular for the first time in years. This method is a lifesaver. ✅"
                />
              </div>
            </div>

            {/* Money Back */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                <Shield className="text-purple-600" size={24} />
              </div>
              <p className="text-lg font-bold text-slate-900 mb-1">100% Risk-Free Guarantee</p>
              <p className="text-sm text-slate-600">If you're not seeing results within 30 days, we'll refund your entire purchase. No questions asked.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// --- Sub-components ---

function PlanCard({ title, original, price, daily, tag, isActive, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
        isActive ? 'border-purple-600 bg-purple-100/50 shadow-md' : 'border-slate-100 bg-white hover:border-purple-200'
      }`}
    >
      {tag && (
        <span className="absolute -top-3 left-6 bg-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-full ring-4 ring-white">
          {tag}
        </span>
      )}
      <div className="flex items-center gap-4">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-purple-600' : 'border-slate-200'}`}>
          {isActive && <div className="w-3 h-3 bg-purple-600 rounded-full" />}
        </div>
        <div>
          <h3 className={`font-bold transition-colors ${isActive ? 'text-purple-900' : 'text-slate-900'}`}>{title}</h3>
          <p className="text-xs text-slate-500 font-medium">${daily} / day</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-400 line-through">${original.toFixed(2)}</p>
        <p className={`text-2xl font-black ${isActive ? 'text-purple-700' : 'text-slate-900'}`}>${price}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ author, text }: { author: string, text: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-100/50 shadow-sm italic text-slate-600 text-sm leading-relaxed">
      "{text}"
      <div className="mt-2 not-italic font-bold text-slate-900 text-xs">— {author}</div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-8">
      <div className="w-full max-w-2xl bg-white h-96 rounded-3xl animate-pulse" />
    </div>
  );
}

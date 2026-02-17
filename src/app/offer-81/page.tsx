"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/hooks/useQuizState";
import { kgToLbs } from "@/lib/bmi";
import { CheckCircle2, ChevronRight, TrendingDown, Star } from "lucide-react";

// --- Configuration ---
const INITIAL_TIMER_SECONDS = 15 * 60;
const CONSERVATIVE_WEEKLY_LOSS_KG = 0.7;
const DEFAULT_NAME = "Guest";
const DISCOUNT_PERCENTAGE = 81;

const PLANS = [
  { id: "7day", title: "7-day plan", original: 22.20, price: 4.22, daily: 0.60, featured: false },
  { id: "1month", title: "1-month plan", original: 44.40, price: 8.44, daily: 0.28, featured: false },
  { id: "3month", title: "3-month plan", original: 75.49, price: 14.34, daily: 0.16, featured: true, tag: "BEST VALUE" },
];

export default function Offer81Page() {
  const router = useRouter();
  const { responses } = useQuizStore();
  const [mounted, setMounted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("3month");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const userData = useMemo(() => {
    const name = (responses["name"] as string) || 
                 (mounted && typeof window !== 'undefined' ? localStorage.getItem("pcos-user-name") : null) || 
                 DEFAULT_NAME;

    const rawWeight = responses["current-weight"] as number || 68;
    
    return {
      userName: name,
      currentWeightKg: rawWeight,
      targetWeight: rawWeight - (CONSERVATIVE_WEEKLY_LOSS_KG * 4),
    };
  }, [responses, mounted]);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const email = mounted && typeof window !== 'undefined' ? localStorage.getItem("pcos-user-email") : null;
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: `${selectedPlan}_81`,
          sessionId: responses.sessionId || "",
          email: email || undefined,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong with the checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return <SkeletonLoader />;

  return (
    <div className="min-h-screen bg-[#FDFBFF] antialiased pb-20">
      <main className="max-w-2xl mx-auto px-4 mt-8">
        <section className="bg-white rounded-3xl shadow-xl shadow-purple-200/20 overflow-hidden border border-purple-100">
          
          {/* Hero Section */}
          <div className="p-8 text-center bg-gradient-to-b from-purple-50/30 to-white">
            <div className="inline-block px-4 py-1 bg-purple-100 rounded-full text-purple-700 text-xs font-black uppercase mb-4">
              Exclusive Flash Sale: {DISCOUNT_PERCENTAGE}% OFF
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Transform Your Hormonal Health
            </h1>
            <p className="mt-3 text-slate-600 text-lg">Join the PCOS Reset Method <span className="font-bold text-purple-600">with {DISCOUNT_PERCENTAGE}% discount</span>.</p>
          </div>

          <div className="p-8 pt-0 space-y-10">
            {/* Snapshot */}
            <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-center gap-2">
                <Star size={18} className="fill-purple-400 text-purple-400" />
                Goal Snapshot
              </h2>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <SnapshotItem label="Body Fat" value="Lower" />
                <SnapshotItem label="Symptoms" value="Reduced" />
                <SnapshotItem label="Energy" value="Higher" />
                <SnapshotItem label="Stress" value="Optimized" />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Select Your Transformation</h2>
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
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Claim {DISCOUNT_PERCENTAGE}% Discount
                    <ChevronRight size={20} />
                  </>
                )}
              </button>

              <p className="mt-2 text-center text-sm text-slate-500 italic">
                Most women choose the 3-month plan for more stable metabolic adaptation.
              </p>
            </div>

            {/* App Preview & Ratings */}
            <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">
                Personal progress journal to monitor your results
              </h3>
              <div className="relative max-w-sm mx-auto mb-6">
                <img 
                  src="/images/progress-journal.png" 
                  alt="Before and after transformation" 
                  className="w-full rounded-2xl shadow-md"
                />
              </div>
              
              {/* Ratings */}
              <div className="text-center space-y-2">
                <p className="text-sm font-bold text-slate-900">28,000+ five-star user ratings</p>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-900">4.8</span>
                    <span className="text-slate-500">App Store</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-900">4.8</span>
                    <span className="text-slate-500">Google Play</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">One of the highest-rated personalized weight-loss companions</p>
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Success stories from our users</h3>
              <div className="space-y-4">
                <TestimonialCard 
                  date="18 Oct"
                  title="Simple to follow and very flexible"
                  text="The program is easy to follow and helped me manage my PCOS-related symptoms better. I also started drinking more water, something I struggled with before, and I love that I can choose different meal options whenever I want. The daily tips are practical and easy to apply, especially the small nutrition suggestions. The best part is that I don't feel constantly hungry anymore."
                  author="Amanda"
                />
                <TestimonialCard 
                  date="12 Aug"
                  title="It helped me get back on track"
                  text="I first tried the program earlier this year and saw noticeable progress, so I decided to return to it again. During a stressful period I gained weight quickly, but following the structured plan again helped me regain control. Based on my previous experience, I expect to reach my goal within the next several weeks."
                  author="Nicole"
                />
              </div>
            </div>

            {/* Stats Banner */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-100 text-center">
              <p className="text-2xl font-bold text-slate-900 mb-2">9 out of 10 women</p>
              <p className="text-sm text-slate-600">reported improvements in PCOS-related symptoms</p>
              <p className="text-xs text-slate-400 mt-3 italic">Results are not typical. Individual results may vary.</p>
            </div>

            {/* Final CTA Section */}
            <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100 space-y-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-900 mb-2">
                  Get Started with PCOS Reset Method.
                </p>
                <p className="text-sm text-purple-600 font-medium">
                  ✅ {DISCOUNT_PERCENTAGE}% flash sale has been successfully applied
                </p>
              </div>

              {/* Pricing Repeat */}
              <div className="space-y-3 py-4">
                {PLANS.map((plan) => (
                  <PlanCardCompact 
                    key={plan.id}
                    {...plan}
                    isActive={selectedPlan === plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                  />
                ))}
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Get My Plan
                    <ChevronRight size={20} />
                  </>
                )}
              </button>

              <p className="text-xs text-slate-500 text-center leading-relaxed">
                We've automatically applied your {DISCOUNT_PERCENTAGE}% exclusive discount to the first subscription payment. Subscription renews automatically. Cancel anytime directly within the app.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
                <CheckCircle2 size={16} className="text-purple-600" />
                <span>Guaranteed Safe Checkout</span>
              </div>
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center">
                <p className="text-sm font-bold text-slate-900 mb-1">30-Day Money-Back Guarantee</p>
                <p className="text-xs text-slate-600">If you do not notice meaningful progress, you can request a full refund within 30 days of purchase.</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-center space-y-3 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>DISCLAIMER:</strong> The PCOS Reset Method website, app, services, and products are designed to support general wellness. Our programs are not intended to diagnose, treat, cure, or prevent any disease and should not replace professional medical advice or treatment. Please consult a qualified healthcare professional before making medical decisions.
              </p>
              <p className="text-xs text-slate-400">
                © 2026 PCOS Reset Method. All rights reserved.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// --- Sub-components ---

function WeightCard({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border ${highlight ? 'border-purple-200 bg-purple-50/50' : 'border-slate-100 bg-slate-50/50'}`}>
      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-black ${highlight ? 'text-purple-600' : 'text-slate-900'}`}>{value}</p>
    </div>
  );
}

function SnapshotItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">{label}</span>
      <span className="text-lg font-extrabold text-slate-900">{value}</span>
    </div>
  );
}

function PlanCard({ title, original, price, daily, featured, tag, isActive, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
        isActive ? 'border-purple-500 bg-purple-50/30' : 'border-slate-100 bg-white hover:border-slate-200'
      }`}
    >
      {tag && (
        <span className="absolute -top-3 left-6 bg-purple-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-4 ring-white">
          {tag}
        </span>
      )}
      <div className="flex items-center gap-4">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-purple-500' : 'border-slate-200'}`}>
          {isActive && <div className="w-3 h-3 bg-purple-500 rounded-full" />}
        </div>
        <div>
          <h3 className="font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 font-medium">${daily} / day</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-400 line-through">${original.toFixed(2)}</p>
        <p className="text-2xl font-black text-slate-900">${price}</p>
      </div>
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

function PlanCardCompact({ title, original, price, daily, isActive, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
        isActive ? 'border-purple-500 bg-purple-50/30' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-purple-500' : 'border-slate-200'}`}>
          {isActive && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full" />}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
          <p className="text-xs text-slate-500">${daily} / day</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-400 line-through">${original.toFixed(2)}</p>
        <p className="text-xl font-bold text-slate-900">${price}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ date, title, text, author }: { date: string, title: string, text: string, author: string }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500">{date}</span>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
      <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">{text}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">{author}</p>
        <span className="text-xs text-purple-600 font-medium">✅ Verified Customer</span>
      </div>
    </div>
  );
}

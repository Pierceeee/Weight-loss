"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, Lock, CreditCard, ShieldCheck, Zap } from "lucide-react";

const PLANS = [
  { id: "7day", title: "7-Day Trial", price: 6.93, description: "Try the method for one week" },
  { id: "3month", title: "Most Popular: 3-Month", price: 25.99, description: "Best for metabolic adaptation", featured: true },
  { id: "lifetime", title: "Lifetime Access", price: 99.00, description: "One-time payment, forever yours" },
];

export default function CheckoutOptionsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("3month");

  useEffect(() => { setMounted(true); }, []);

  const handleCheckout = () => {
    alert("Proceeding to secure checkout...");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FAF5FF] antialiased py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-purple-600 font-bold text-sm uppercase tracking-widest mb-2">
            <Lock size={14} />
            Secure Checkout
          </div>
          <h1 className="text-3xl font-black text-slate-900">Select Your Transformation</h1>
        </div>

        <div className="space-y-4 mb-10">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full text-left p-6 rounded-3xl border-2 transition-all flex items-center justify-between group ${
                selectedPlan === plan.id 
                  ? 'border-purple-600 bg-white shadow-xl shadow-purple-200/50 translate-y-[-2px]' 
                  : 'border-white bg-white/50 hover:border-purple-200'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-bold text-lg ${selectedPlan === plan.id ? 'text-purple-900' : 'text-slate-900'}`}>
                    {plan.title}
                  </h3>
                  {plan.featured && (
                    <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">BEST VALUE</span>
                  )}
                </div>
                <p className="text-slate-500 text-sm">{plan.description}</p>
              </div>
              <div className="text-right ml-4">
                <div className={`text-2xl font-black ${selectedPlan === plan.id ? 'text-purple-600' : 'text-slate-900'}`}>
                  ${plan.price}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-purple-200/20 border border-purple-100">
          <div className="space-y-6 mb-8">
            <h4 className="font-bold text-slate-900 text-lg">Included with your order:</h4>
            <div className="grid gap-4">
              <FeatureItem text="Personalized Daily Meal Plan" />
              <FeatureItem text="PCOS Symptom Tracker" />
              <FeatureItem text="24/7 Priority Support" />
              <FeatureItem text="Lifetime Content Updates" />
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full bg-purple-600 text-white py-5 rounded-[24px] font-black text-xl shadow-lg shadow-purple-200 hover:bg-purple-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            CONTINUE TO PAYMENT
            <ChevronRight size={24} />
          </button>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex gap-4 items-center grayscale opacity-50">
              <CreditCard size={24} />
              <ShieldCheck size={24} />
              <Zap size={24} />
            </div>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest text-center">
              Secure 256-bit SSL Encrypted Connection
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            By clicking continue, you agree to our Terms of Service and Privacy Policy. All plans are billed in USD.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 size={14} className="text-purple-600" />
      </div>
      <span className="text-sm font-semibold text-slate-700">{text}</span>
    </div>
  );
}

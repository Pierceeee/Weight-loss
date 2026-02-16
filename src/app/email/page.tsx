"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuizStore } from "@/hooks/useQuizState";
import { completeFunnelWithEmail } from "@/lib/actions/submit-quiz";
import { Heart, Lock } from "lucide-react";
import { kgToLbs } from "@/lib/bmi";

export default function EmailCapturePage() {
  const router = useRouter();
  const { responses, sessionId } = useQuizStore();
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const targetWeightLbs = (responses["target-weight-lbs"] as number | undefined) ||
    (responses["target-weight"] ? Math.round(kgToLbs(responses["target-weight"] as number)) : 120);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!agreed) {
      setError("Please agree to the privacy policy");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      localStorage.setItem("pcos-user-email", email);

      if (sessionId) {
        await completeFunnelWithEmail(sessionId, email);
      }

      router.push("/name");
    } catch (err) {
      console.error("Error saving email:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-purple-100">
        <div className="h-1 bg-[#E9D5FF]">
          <div className="h-full bg-[#A855F7]" style={{ width: "100%" }} />
        </div>
        <div className="px-4 py-3 flex items-center justify-center gap-2">
          <div className="bg-[#9333EA] p-1 rounded-md">
            <Heart className="w-[18px] h-[18px] text-white fill-current" />
          </div>
          <span className="font-bold text-xl text-gray-800">PCOS Reset Method</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl leading-snug font-bold text-gray-900">
            Enter your email to unlock your personalized PCOS metabolism breakdown and projected progress plan.
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-gray-800">
              Your email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={`w-full h-12 px-4 rounded-xl border bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors outline-none focus:border-gray-400 ${error && !email ? "border-red-400" : "border-gray-200"}`}
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={isLoading}
                className="sr-only peer"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${agreed ? "bg-gray-900 border-gray-900" : "bg-white border-gray-300"} ${error && !agreed ? "border-red-400" : ""}`}>
                {agreed && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-700 leading-relaxed">
              I agree to the{" "}
              <Link href="#" className="text-gray-900 font-medium underline">
                Privacy Policy
              </Link>{" "}
              and consent to receive important updates related to the PCOS Reset Method
            </span>
          </label>

          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!email || !agreed || isLoading}
            className="w-full h-12 text-sm font-semibold rounded-xl bg-black text-white hover:bg-gray-900 disabled:bg-gray-300 disabled:text-white disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="mx-auto w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Continue"
            )}
          </button>
        </form>

        <div className="mt-6 flex items-start gap-3 text-xs text-gray-600">
          <Lock className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
          <p className="leading-relaxed">
            We respect your privacy. Your email will only be used to deliver your personalized program details and essential updates. No spam — ever.
          </p>
        </div>
      </main>
    </div>
  );
}

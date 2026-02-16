"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/hooks/useQuizState";
import { Heart } from "lucide-react";

export default function NameCapturePage() {
  const router = useRouter();
  const { setResponse } = useQuizStore();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      // Store the name in quiz responses
      setResponse("name", name.trim());
      
      // Store in localStorage as well
      localStorage.setItem("pcos-user-name", name.trim());

      // Navigate to offer page
      router.push("/offer");
    } catch (err) {
      console.error("Error saving name:", err);
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
            What is your name?
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors outline-none focus:border-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || isLoading}
            className="w-full h-12 text-sm font-semibold rounded-xl bg-black text-white hover:bg-gray-900 disabled:bg-gray-300 disabled:text-white disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="mx-auto w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

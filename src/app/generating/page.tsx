"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

const testimonialsRow1 = [
  {
    text: "PCOS Reset Method is worth it. Straight forward, clean eating meal plans and shopping lists. Blood results confirm I'm doing better.",
    name: "Lucy T.",
    stars: 5,
  },
  {
    text: "Lots of options to customize recipes: foods you love/don't like, time to prepare, complexity, health concerns, so much more! Just about everything is perfect.",
    name: "Emily S.",
    stars: 5,
  },
  {
    text: "I've been using PCOS Reset Method for many years. I was really overweight and now I'm back to 130lbs! It's wonderful, thank you. 😃😃🎊🙌",
    name: "Caroline N.",
    stars: 5,
  },
  {
    text: "PCOS Reset Method is worth it. Straight forward, clean eating meal plans and shopping lists. Blood results confirm I'm doing better.",
    name: "Lucy T.",
    stars: 5,
  },
  {
    text: "Lots of options to customize recipes: foods you love/don't like, time to prepare, complexity, health concerns, so much more! Just about everything is perfect.",
    name: "Emily S.",
    stars: 5,
  },
  {
    text: "I've been using PCOS Reset Method for many years. I was really overweight and now I'm back to 130lbs! It's wonderful, thank you. 😃😃🎊🙌",
    name: "Caroline N.",
    stars: 5,
  },
];

const testimonialsRow2 = [
  {
    text: "Healthy diets are a real thing! I quite literally lost over 40 lbs and I've never felt more beautiful 😃💖 Love this thing!",
    name: "Nicholas H.",
    stars: 5,
  },
  {
    text: "Honestly idk where id be if not for this. I quite literally lost over 40 lbs and I've never felt more beautiful 😃💖 Love this thing!",
    name: "Megan W.",
    stars: 5,
  },
  {
    text: "Couldn't do the exercises in the app due to my poor joints (too many years playing tennis) but the food is really good and I already notice my double chin becoming one again.",
    name: "Laura G.",
    stars: 5,
  },
  {
    text: "A thing PB really gave me is a sense of community. People are active and the team is super helpful. This could be just what you need.",
    name: "Sarah G.",
    stars: 5,
  },
  {
    text: "If you told me a month ago that I'd be 20 pounds lighter I would've called you a liar... but I'm proof this works!",
    name: "Katherine B.",
    stars: 5,
  },
  {
    text: "If you need something to manage your weight in a safe way, this is the best option out there. I had been battling menopause weight gain for a while but look at me now!",
    name: "Elizabeth M.",
    stars: 5,
  },
  {
    text: "I was skeptical because diets come and go, but this 😃🎊 plus it's cheap, can't complain.",
    name: "",
    stars: 5,
  },
];

export default function GeneratingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 100;
        }
        return prev + 1;
      });
    }, 60);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        router.push("/email");
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [progress, router]);

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#FAF5FF] overflow-hidden">
      {/* Header */}
      <header className="bg-white px-4 py-3 border-b border-purple-100">
        <div className="flex items-center justify-center gap-2">
          <div className="bg-[#9333EA] p-1 rounded-md">
            <Heart className="w-[18px] h-[18px] text-white fill-current" />
          </div>
          <span className="font-bold text-xl text-gray-800">PCOS Reset Method</span>
        </div>
      </header>

      <main className="py-10">
        {/* Progress circle */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="rgba(147,51,234,0.1)"
                strokeWidth="6"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#9333EA"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-100 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-900">{progress}%</span>
            </div>
          </div>

          <p className="text-center mt-4 text-sm font-medium text-purple-700">
            Calculating your results
          </p>
        </div>

        {/* Heading */}
        <h1 className="text-center mt-8 text-3xl md:text-4xl font-extrabold text-gray-900">
          What our users are saying
        </h1>

        {/* Testimonials Row 1 - scrolling left */}
        <div className="mt-8 overflow-hidden">
          <div className="flex gap-4 animate-scroll-left">
            {[...testimonialsRow1, ...testimonialsRow1].map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-64 rounded-xl bg-white p-4 border border-purple-100 shadow-sm"
              >
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">
                  {t.text}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-semibold text-gray-800">{t.name}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <span key={j} className="text-purple-400 text-xs">⭐</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Row 2 - scrolling right */}
        <div className="mt-4 overflow-hidden">
          <div className="flex gap-4 animate-scroll-right">
            {[...testimonialsRow2, ...testimonialsRow2].map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-64 rounded-xl bg-white p-4 border border-purple-100 shadow-sm"
              >
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">
                  {t.text}
                </p>
                <div className="flex items-center justify-between mt-3">
                  {t.name && (
                    <span className="text-xs font-semibold text-gray-800">{t.name}</span>
                  )}
                  <div className="flex gap-0.5 ml-auto">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <span key={j} className="text-purple-400 text-xs">⭐</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

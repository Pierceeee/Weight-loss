"use client";

import { QuizQuestion } from "@/types/quiz";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMemo } from "react";

const categoryConfig: Record<string, { icon: string; borderColor: string; lineColor: string }> = {
  greens: { icon: "/images/icons/emoji-broccoli.avif", borderColor: "border-green-500", lineColor: "bg-green-500" },
  "fiber-grains": { icon: "/images/icons/emoji-sheaf-of-rice.avif", borderColor: "border-yellow-400", lineColor: "bg-yellow-400" },
  protein: { icon: "/images/icons/emoji-cut-of-meat.avif", borderColor: "border-red-500", lineColor: "bg-red-500" },
  seafood: { icon: "/images/icons/emoji-fish.avif", borderColor: "border-blue-400", lineColor: "bg-blue-400" },
  dairy: { icon: "/images/icons/emoji-cheese-wedge.avif", borderColor: "border-purple-400", lineColor: "bg-purple-400" },
  "fresh-fruits": { icon: "/images/icons/emoji-banana.avif", borderColor: "border-red-500", lineColor: "bg-red-500" },
};

interface IngredientSelectProps {
  question: QuizQuestion;
  value: string[];
  onChange: (value: string[]) => void;
}

export function IngredientSelect({ question, value = [], onChange }: IngredientSelectProps) {
  const categories = question.categories || [];

  const allOptionIds = useMemo(() => {
    return categories.flatMap((cat) => cat.options.map((opt) => opt.id));
  }, [categories]);

  const allSelected = allOptionIds.length > 0 && allOptionIds.every((id) => value.includes(id));

  const toggleOption = (optionId: string) => {
    if (value.includes(optionId)) {
      onChange(value.filter((item) => item !== optionId));
      return;
    }
    onChange([...value, optionId]);
  };

  const toggleAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(allOptionIds);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Select everything toggle */}
      <button
        onClick={toggleAll}
        className="flex items-center gap-2 text-sm font-medium text-gray-700"
      >
        <div
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
            allSelected
              ? "bg-black border-black"
              : "border-gray-300 bg-white"
          )}
        >
          {allSelected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        Select everything
      </button>

      {categories.map((category) => {
        const config = categoryConfig[category.id];
        return (
          <div key={category.id} className={cn("rounded-xl border bg-white overflow-hidden shadow-sm", config?.borderColor)}>
            <div className="px-4 py-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">{category.title}</p>
              {config && (
                <div className="relative w-6 h-6 flex-shrink-0">
                  <Image src={config.icon} alt={category.title} fill className="object-contain" />
                </div>
              )}
            </div>
            <div className={cn("h-0.5 mx-4", config?.lineColor)} />

            <div className="p-3 flex flex-wrap gap-2">
              {category.options.map((option) => {
                const selected = value.includes(option.id);

                return (
                  <button
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    className={cn(
                      "px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200 active:scale-95",
                      selected
                        ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { QuizQuestion } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const categoryConfig: Record<string, { icon: string; borderColor: string; lineColor: string; selectedBg: string; selectedBorder: string }> = {
  symptoms: { icon: "🌸", borderColor: "border-pink-400", lineColor: "bg-pink-400", selectedBg: "bg-pink-600", selectedBorder: "border-pink-600" },
  metabolism: { icon: "⚡", borderColor: "border-yellow-400", lineColor: "bg-yellow-400", selectedBg: "bg-yellow-600", selectedBorder: "border-yellow-600" },
  nutrition: { icon: "🥗", borderColor: "border-green-500", lineColor: "bg-green-500", selectedBg: "bg-green-600", selectedBorder: "border-green-600" },
  movement: { icon: "💪", borderColor: "border-blue-400", lineColor: "bg-blue-400", selectedBg: "bg-blue-600", selectedBorder: "border-blue-600" },
  habits: { icon: "🧘‍♀️", borderColor: "border-purple-400", lineColor: "bg-purple-400", selectedBg: "bg-purple-600", selectedBorder: "border-purple-600" },
  lifestyle: { icon: "🏠", borderColor: "border-orange-400", lineColor: "bg-orange-400", selectedBg: "bg-orange-600", selectedBorder: "border-orange-600" },
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
              ? "bg-purple-600 border-purple-600 shadow-sm"
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
                <span className="text-xl flex-shrink-0">
                  {config.icon}
                </span>
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
                        ? `${config?.selectedBg || "bg-purple-600"} text-white ${config?.selectedBorder || "border-purple-600"} shadow-sm`
                        : "bg-white text-gray-700 border-gray-300 hover:border-purple-200 hover:bg-purple-50/50"
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

"use client";

import { QuizOption } from "@/types/quiz";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MultiSelectProps {
  options: QuizOption[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiSelect({ options, value = [], onChange }: MultiSelectProps) {
  const handleToggle = (optionId: string) => {
    // Handle "none" option - clear all others when selected
    if (optionId === "none") {
      onChange(value.includes("none") ? [] : ["none"]);
      return;
    }

    // If selecting a non-none option, remove "none" from selection
    const filteredValue = value.filter((v) => v !== "none");

    if (filteredValue.includes(optionId)) {
      onChange(filteredValue.filter((v) => v !== optionId));
    } else {
      onChange([...filteredValue, optionId]);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-2.5 w-full">
      {options.map((option, index) => {
        const isSelected = value.includes(option.id);
        const isNoneOption = option.id === "none";
        return (
          <div key={option.id}>
            {isNoneOption && (
              <div className="h-px bg-gray-200 my-2.5" />
            )}
            <button
              onClick={() => handleToggle(option.id)}
              className={cn(
                "flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-200 text-left active:scale-[0.98] w-full",
                "hover:border-gray-300 hover:shadow-sm",
                isSelected
                  ? "border-gray-300 bg-white shadow-sm"
                  : "border-gray-200 bg-white"
              )}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {option.image ? (
                <div className="w-7 h-7 sm:w-8 sm:h-8 relative flex-shrink-0">
                  <Image
                    src={option.image}
                    alt={option.label}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : option.icon ? (
                <span className="text-lg sm:text-xl flex-shrink-0">{option.icon}</span>
              ) : null}
              <span className="flex-1 font-medium text-[15px] text-gray-900 leading-snug">{option.label}</span>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                  isSelected
                    ? "border-gray-400 bg-white"
                    : "border-gray-300 bg-white"
                )}
              >
                {isSelected && <span className="block w-2.5 h-2.5 rounded-full bg-gray-800" />}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

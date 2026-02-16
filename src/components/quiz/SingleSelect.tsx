"use client";

import { QuizOption } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface SingleSelectProps {
  options: QuizOption[];
  value: string | undefined;
  onChange: (value: string) => void;
}

export function SingleSelect({ options, value, onChange }: SingleSelectProps) {
  return (
    <div className="flex flex-col gap-2.5 sm:gap-4 w-full">
      {options.map((option, index) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "w-full transition-all duration-200 rounded-xl p-3.5 sm:p-5 flex items-center justify-between shadow-sm border active:scale-[0.98]",
              isSelected
                ? "bg-purple-100 border-purple-500 ring-4 ring-purple-50"
                : "bg-white hover:bg-purple-50/50 border-transparent hover:border-purple-200"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              {option.image ? (
                <div className="w-9 h-9 sm:w-10 sm:h-10 relative flex-shrink-0">
                  <Image
                    src={option.image}
                    alt={option.label}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : option.icon ? (
                <span className="text-xl sm:text-2xl">{option.icon}</span>
              ) : null}
              <span className={cn(
                "font-semibold text-[15px] sm:text-lg leading-snug text-left transition-colors",
                isSelected ? "text-purple-900" : "text-gray-900"
              )}>{option.label}</span>
            </div>
            <ArrowRight className={cn(
              "flex-shrink-0 ml-2 transition-all",
              isSelected ? "text-purple-600 translate-x-1" : "text-gray-400"
            )} size={18} />
          </button>
        );
      })}
    </div>
  );
}

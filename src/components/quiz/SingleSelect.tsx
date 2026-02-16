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
              "w-full bg-white hover:bg-gray-50 transition-colors duration-200 rounded-xl p-3.5 sm:p-5 flex items-center justify-between shadow-sm border border-transparent active:scale-[0.98]"
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
              <span className="text-gray-900 font-semibold text-[15px] sm:text-lg leading-snug text-left">{option.label}</span>
            </div>
            <ArrowRight className="text-gray-400 flex-shrink-0 ml-2" size={18} />
          </button>
        );
      })}
    </div>
  );
}

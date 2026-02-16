"use client";

import { QuizOption } from "@/types/quiz";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Check } from "lucide-react";

interface VisualSelectProps {
  options: QuizOption[];
  value: string | undefined;
  onChange: (value: string) => void;
}

export function VisualSelect({ options, value, onChange }: VisualSelectProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 w-full mx-auto">
      {options.map((option, index) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all duration-300 group active:scale-[0.98]",
              isSelected 
                ? "border-purple-500 shadow-md ring-4 ring-purple-50" 
                : "border-gray-100 hover:border-gray-300 hover:shadow-md"
            )}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Selection Checkmark */}
            <div className={cn(
              "absolute top-2 right-2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-300",
              isSelected ? "bg-purple-500 scale-100 opacity-100" : "bg-gray-200 scale-0 opacity-0"
            )}>
              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white stroke-[3]" />
            </div>

            {/* Image Container */}
            <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
              {option.image && (
                <Image
                  src={option.image}
                  alt={option.label}
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                  className={cn(
                    "object-contain p-2 transition-transform duration-700",
                    isSelected ? "scale-105" : "group-hover:scale-105"
                  )}
                  priority={index < 3}
                />
              )}
              {/* Overlay for better selected state */}
              <div className={cn(
                "absolute inset-0 bg-purple-500/5 transition-opacity duration-300",
                isSelected ? "opacity-100" : "opacity-0"
              )} />
            </div>

            {/* Label Container */}
            <div className={cn(
              "py-2 px-0.5 sm:py-3 sm:px-1 md:p-4 text-center transition-colors duration-300",
              isSelected ? "bg-purple-100" : "bg-white"
            )}>
              <span className={cn(
                "font-bold text-[9px] sm:text-sm md:text-base lg:text-lg block leading-tight tracking-tight uppercase",
                isSelected ? "text-purple-600" : "text-gray-900"
              )}>
                {option.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

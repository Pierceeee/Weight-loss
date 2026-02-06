"use client";

import { QuizOption } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";

interface VisualSelectProps {
  options: QuizOption[];
  value: string | undefined;
  onChange: (value: string) => void;
}

export function VisualSelect({ options, value, onChange }: VisualSelectProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 w-full">
      {options.map((option) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200",
              "hover:border-primary/50 hover:bg-primary/5",
              "w-[140px] sm:w-[160px]",
              isSelected
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            )}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}

            {option.image ? (
              <div className="relative w-20 h-32 mb-3">
                <Image
                  src={option.image}
                  alt={option.label}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-20 h-32 mb-3 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
            )}

            <span className="font-medium text-center">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

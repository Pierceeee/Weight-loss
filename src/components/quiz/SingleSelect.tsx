"use client";

import { QuizOption } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SingleSelectProps {
  options: QuizOption[];
  value: string | undefined;
  onChange: (value: string) => void;
}

export function SingleSelect({ options, value, onChange }: SingleSelectProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {options.map((option) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
              "hover:border-primary/50 hover:bg-primary/5",
              isSelected
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            )}
          >
            <div className="flex items-center gap-3">
              {option.icon && (
                <span className="text-xl">{option.icon}</span>
              )}
              <span className="font-medium text-left">{option.label}</span>
            </div>
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30"
              )}
            >
              {isSelected && <Check className="w-4 h-4" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

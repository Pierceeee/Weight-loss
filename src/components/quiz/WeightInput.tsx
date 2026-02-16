"use client";

import { useState, useEffect } from "react";
import { lbsToKg, kgToLbs } from "@/lib/bmi";
import { cn } from "@/lib/utils";

interface WeightInputProps {
  valueKg?: number;
  onChange: (valueKg: number) => void;
  minLbs?: number;
  maxLbs?: number;
}

type WeightUnit = "lbs" | "kg";

export function WeightInput({ valueKg, onChange, minLbs = 100, maxLbs = 440 }: WeightInputProps) {
  const [unit, setUnit] = useState<WeightUnit>("kg");
  const [inputValue, setInputValue] = useState<string>("");

  // Convert current valueKg to the selected unit for display
  useEffect(() => {
    if (valueKg) {
      const displayValue = unit === "lbs" ? Math.round(kgToLbs(valueKg)) : Math.round(valueKg);
      setInputValue(displayValue.toString());
    }
  }, [valueKg, unit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setInputValue(nextValue);
    
    const numValue = parseFloat(nextValue);
    if (!isNaN(numValue)) {
      const kgValue = unit === "lbs" ? lbsToKg(numValue) : numValue;
      onChange(kgValue);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="w-fit mx-auto p-0.5 rounded-lg border border-purple-200 bg-white mb-6">
        <button
          className={cn(
            "px-6 sm:px-10 py-2 text-sm font-semibold rounded-lg transition-all",
            unit === "kg" ? "bg-purple-600 text-white" : "text-purple-600 hover:bg-purple-50"
          )}
          onClick={() => setUnit("kg")}
        >
          kg
        </button>
        <button
          className={cn(
            "px-6 sm:px-10 py-2 text-sm font-semibold rounded-lg transition-all",
            unit === "lbs" ? "bg-purple-600 text-white" : "text-purple-600 hover:bg-purple-50"
          )}
          onClick={() => setUnit("lbs")}
        >
          lbs
        </button>
      </div>

      <div className="relative h-14 rounded-xl border border-purple-200 bg-white focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-50 transition-all">
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="0"
          className="w-full h-full px-4 pr-14 text-center text-3xl font-medium text-purple-900 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-purple-400">
          {unit}
        </span>
      </div>
    </div>
  );
}

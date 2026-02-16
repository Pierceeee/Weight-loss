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
      <div className="w-fit mx-auto p-0.5 rounded-lg border border-gray-300 bg-white mb-6">
        <button
          className={cn(
            "px-6 sm:px-10 py-2 text-sm font-semibold rounded-lg transition-all",
            unit === "kg" ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"
          )}
          onClick={() => setUnit("kg")}
        >
          kg
        </button>
        <button
          className={cn(
            "px-6 sm:px-10 py-2 text-sm font-semibold rounded-lg transition-all",
            unit === "lbs" ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"
          )}
          onClick={() => setUnit("lbs")}
        >
          lbs
        </button>
      </div>

      <div className="relative h-14 rounded-xl border border-gray-300 bg-white">
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="0"
          className="w-full h-full px-4 pr-14 text-center text-3xl font-medium text-gray-700 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700">
          {unit}
        </span>
      </div>
    </div>
  );
}

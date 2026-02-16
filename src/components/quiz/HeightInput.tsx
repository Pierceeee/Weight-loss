"use client";

import { useMemo, useState } from "react";
import { cmToFeet, feetToCm } from "@/lib/bmi";
import { cn } from "@/lib/utils";

interface HeightInputProps {
  valueCm?: number;
  onChange: (valueCm: number) => void;
}

type HeightUnit = "ft" | "cm";

export function HeightInput({ valueCm, onChange }: HeightInputProps) {
  const [unit, setUnit] = useState<HeightUnit>("cm");
  const [feet, setFeet] = useState<number | "">(0);
  const [inches, setInches] = useState<number | "">(0);
  const [cm, setCm] = useState<number | "">(0);

  const applyFeetInches = (nextFeet: number | "", nextInches: number | "") => {
    const safeFeet = nextFeet === "" ? 0 : Number.isFinite(nextFeet) ? Math.max(0, nextFeet) : 0;
    const safeInches = nextInches === "" ? 0 : Number.isFinite(nextInches) ? Math.max(0, Math.min(11, nextInches)) : 0;
    setFeet(nextFeet);
    setInches(nextInches);
    if (nextFeet !== "" || nextInches !== "") {
      onChange(Math.round(feetToCm(safeFeet, safeInches)));
    }
  };

  const applyCm = (nextCm: number | "") => {
    const safeCm = nextCm === "" ? 0 : Number.isFinite(nextCm) ? Math.max(80, Math.min(250, nextCm)) : 80;
    setCm(nextCm);
    if (nextCm !== "") {
      onChange(safeCm);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="w-fit mx-auto p-0.5 rounded-lg border border-gray-300 bg-white mb-6">
        <button
          className={cn(
            "px-6 sm:px-10 py-2 text-sm font-semibold rounded-lg transition-all",
            unit === "cm" ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"
          )}
          onClick={() => setUnit("cm")}
        >
          cm
        </button>
        <button
          className={cn(
            "px-6 sm:px-10 py-2 text-sm font-semibold rounded-lg transition-all",
            unit === "ft" ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"
          )}
          onClick={() => setUnit("ft")}
        >
          ft
        </button>
      </div>

      {unit === "ft" ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="relative h-14 rounded-xl border border-gray-300 bg-white">
            <input
              type="number"
              min={0}
              value={feet === 0 ? "" : feet}
              onChange={(event) => applyFeetInches(event.target.value === "" ? "" : Number(event.target.value), inches)}
              className="w-full h-full px-3 pr-10 text-center text-3xl font-medium text-gray-700 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700">ft</span>
          </div>

          <div className="relative h-14 rounded-xl border border-gray-300 bg-white">
            <input
              type="number"
              min={0}
              max={11}
              value={inches === 0 ? "" : inches}
              onChange={(event) => applyFeetInches(feet, event.target.value === "" ? "" : Number(event.target.value))}
              className="w-full h-full px-3 pr-10 text-center text-3xl font-medium text-gray-700 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700">in</span>
          </div>
        </div>
      ) : (
        <div className="relative h-14 rounded-xl border border-gray-300 bg-white">
          <input
            type="number"
            min={80}
            max={250}
            value={cm === 0 ? "" : cm}
            onChange={(event) => applyCm(event.target.value === "" ? "" : Number(event.target.value))}
            className="w-full h-full px-3 pr-12 text-center text-3xl font-medium text-gray-700 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700">cm</span>
        </div>
      )}
    </div>
  );
}


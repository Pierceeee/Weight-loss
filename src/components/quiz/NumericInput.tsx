"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NumericInputProps {
  value: number | undefined;
  onChange: (value: number) => void;
  unit?: string;
  unitOptions?: string[];
  min?: number;
  max?: number;
  placeholder?: string;
}

export function NumericInput({
  value,
  onChange,
  unit = "",
  unitOptions,
  min = 0,
  max = 999,
  placeholder = "0",
}: NumericInputProps) {
  const [selectedUnit, setSelectedUnit] = useState(unit);
  const [inputValue, setInputValue] = useState(value?.toString() || "");

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value.toString());
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const numValue = parseFloat(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleIncrement = () => {
    const currentValue = value || 0;
    if (currentValue < max) {
      const newValue = currentValue + 1;
      setInputValue(newValue.toString());
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const currentValue = value || 0;
    if (currentValue > min) {
      const newValue = currentValue - 1;
      setInputValue(newValue.toString());
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
      {unitOptions && unitOptions.length > 1 && (
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          {unitOptions.map((u) => (
            <Button
              key={u}
              variant={selectedUnit === u ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedUnit(u)}
              className="px-4"
            >
              {u}
            </Button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full text-2xl"
          onClick={handleDecrement}
          disabled={(value || 0) <= min}
        >
          −
        </Button>

        <div className="relative">
          <Input
            type="number"
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
            className={cn(
              "text-center text-4xl font-bold h-20 w-32",
              "border-2 rounded-xl focus:ring-2 focus:ring-primary",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            )}
            min={min}
            max={max}
          />
          {selectedUnit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              {selectedUnit}
            </span>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full text-2xl"
          onClick={handleIncrement}
          disabled={(value || 0) >= max}
        >
          +
        </Button>
      </div>
    </div>
  );
}

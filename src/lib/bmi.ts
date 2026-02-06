import { BMIResult } from "@/types/quiz";

/**
 * Calculate BMI from weight (kg) and height (cm)
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

/**
 * Get BMI category and color based on BMI value
 */
export function getBMIResult(bmi: number): BMIResult {
  if (bmi < 18.5) {
    return { value: bmi, category: "Underweight", color: "#3B82F6" };
  } else if (bmi < 25) {
    return { value: bmi, category: "Normal", color: "#22C55E" };
  } else if (bmi < 30) {
    return { value: bmi, category: "Overweight", color: "#F59E0B" };
  } else {
    return { value: bmi, category: "Obese", color: "#EF4444" };
  }
}

/**
 * Convert height from feet/inches to cm
 */
export function feetToCm(feet: number, inches: number = 0): number {
  return feet * 30.48 + inches * 2.54;
}

/**
 * Convert height from cm to feet/inches
 */
export function cmToFeet(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

/**
 * Convert weight from lbs to kg
 */
export function lbsToKg(lbs: number): number {
  return lbs * 0.453592;
}

/**
 * Convert weight from kg to lbs
 */
export function kgToLbs(kg: number): number {
  return kg / 0.453592;
}

/**
 * Calculate estimated weeks to reach target weight
 * Assumes healthy weight loss of 0.5-1kg per week
 */
export function estimateWeeksToGoal(
  currentWeight: number,
  targetWeight: number,
  weeklyLossRate: number = 0.75
): number {
  const weightDiff = Math.abs(currentWeight - targetWeight);
  return Math.ceil(weightDiff / weeklyLossRate);
}

/**
 * Get health risks based on BMI category
 */
export function getHealthRisks(category: BMIResult["category"]): string[] {
  const risks: Record<BMIResult["category"], string[]> = {
    Underweight: [
      "Nutritional deficiencies",
      "Weakened immune system",
      "Bone density loss",
    ],
    Normal: [],
    Overweight: [
      "Increased risk of heart disease",
      "Higher blood pressure",
      "Type 2 diabetes risk",
    ],
    Obese: [
      "High blood pressure",
      "Heart disease",
      "Type 2 diabetes",
      "Sleep apnea",
      "Joint problems",
    ],
  };
  return risks[category];
}

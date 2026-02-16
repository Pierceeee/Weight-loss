export type QuestionType =
  | "single-select"
  | "multi-select"
  | "numeric-input"
  | "height-input"
  | "weight-input"
  | "ingredient-select"
  | "science-list"
  | "goal-projection"
  | "personal-summary"
  | "visual-select"
  | "interstitial";

export interface QuizOption {
  id: string;
  label: string;
  icon?: string;
  image?: string;
}

export interface QuizQuestion {
  id: string;
  step: number;
  type: QuestionType;
  question?: string;
  subtitle?: string;
  options?: QuizOption[];
  unit?: string;
  unitOptions?: string[];
  content?: {
    title: string;
    description: string;
    image?: string;
    highlight?: string;
  };
  benefits?: string[];
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
  };
  categories?: {
    id: string;
    title: string;
    options: QuizOption[];
  }[];
}

export interface QuizResponse {
  questionId: string;
  value: string | string[] | number;
}

export interface QuizState {
  currentStep: number;
  responses: Record<string, string | string[] | number>;
  sessionId: string;
}

export interface UserProfile {
  gender: "male" | "female";
  name?: string;
  age: number;
  height: number;
  currentWeight: number;
  targetWeight: number;
  bodyType: string;
  goals: string[];
  symptoms: string[];
  activityLevel: string;
  exercisePreference: string;
  hydration: string;
  badHabits: string[];
  ingredients?: string[];
  periodRegularity: string;
  moodIssues: string;
  weightLossHistory: string;
  energyLevels: string;
  fitnessLevel?: string; // Male-specific field
}

export interface BMIResult {
  value: number;
  category: "Underweight" | "Normal" | "Overweight" | "Obese";
  color: string;
}

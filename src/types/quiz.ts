export type QuestionType =
  | "single-select"
  | "multi-select"
  | "numeric-input"
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
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
  };
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
  periodRegularity: string;
  moodIssues: string;
  weightLossHistory: string;
  energyLevels: string;
}

export interface BMIResult {
  value: number;
  category: "Underweight" | "Normal" | "Overweight" | "Obese";
  color: string;
}

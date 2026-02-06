"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { QuizState, UserProfile } from "@/types/quiz";

interface QuizStore extends QuizState {
  // Actions
  setResponse: (questionId: string, value: string | string[] | number) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetQuiz: () => void;
  getResponse: (questionId: string) => string | string[] | number | undefined;
  getUserProfile: () => UserProfile | null;
  isComplete: () => boolean;
}

const initialState: QuizState = {
  currentStep: 1,
  responses: {},
  sessionId: "",
};

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      sessionId: typeof window !== "undefined" ? uuidv4() : "",

      setResponse: (questionId, value) =>
        set((state) => ({
          responses: { ...state.responses, [questionId]: value },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 21),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      resetQuiz: () =>
        set({
          ...initialState,
          sessionId: uuidv4(),
        }),

      getResponse: (questionId) => get().responses[questionId],

      getUserProfile: () => {
        const { responses } = get();
        
        // Check if we have enough data
        if (!responses["age"] || !responses["current-weight"] || !responses["height"]) {
          return null;
        }

        return {
          age: responses["age"] as number,
          height: responses["height"] as number,
          currentWeight: responses["current-weight"] as number,
          targetWeight: (responses["target-weight"] as number) || (responses["current-weight"] as number),
          bodyType: (responses["body-type"] as string) || "",
          goals: (responses["goals"] as string[]) || [],
          symptoms: (responses["symptoms"] as string[]) || [],
          activityLevel: (responses["activity-level"] as string) || "",
          exercisePreference: (responses["exercise-preference"] as string) || "",
          hydration: (responses["hydration"] as string) || "",
          badHabits: (responses["bad-habits"] as string[]) || [],
          periodRegularity: (responses["period-regularity"] as string) || "",
          moodIssues: (responses["mood-issues"] as string) || "",
          weightLossHistory: (responses["weight-loss-history"] as string) || "",
          energyLevels: (responses["energy-levels"] as string) || "",
        };
      },

      isComplete: () => {
        const { responses } = get();
        const requiredFields = [
          "symptoms",
          "period-regularity",
          "mood-issues",
          "weight-loss-history",
          "energy-levels",
          "goals",
          "body-type",
          "height",
          "current-weight",
          "target-weight",
          "age",
          "activity-level",
          "exercise-preference",
          "hydration",
          "bad-habits",
        ];
        return requiredFields.every((field) => responses[field] !== undefined);
      },
    }),
    {
      name: "pcos-quiz-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

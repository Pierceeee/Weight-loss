import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserProfile } from "@/types/quiz";
import { WeeklyMealPlan } from "@/types/user";
import { AIProvider, getMealPlanPrompt, parseMealPlanResponse } from "./provider";

/**
 * Google Gemini Provider Implementation
 */
export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor(apiKey: string, model: string = "gemini-2.5-flash") {
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = model;
  }

  getName(): string {
    return `Google Gemini (${this.model})`;
  }

  async generateMealPlan(userProfile: UserProfile): Promise<WeeklyMealPlan> {
    const prompt = getMealPlanPrompt(userProfile);

    try {
      const model = this.client.getGenerativeModel({
        model: this.model,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8000,
          responseMimeType: "application/json",
        },
      });

      const systemPrompt = `You are an expert nutritionist specializing in PCOS management. You provide detailed, practical meal plans tailored to individual needs. Always respond with valid JSON only.

${prompt}`;

      const result = await model.generateContent(systemPrompt);
      const response = result.response;
      const content = response.text();

      if (!content) {
        throw new Error("Empty response from Gemini");
      }

      return parseMealPlanResponse(content);
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error(
        `Failed to generate meal plan with Gemini: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}

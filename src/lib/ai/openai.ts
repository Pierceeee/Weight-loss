import OpenAI from "openai";
import { UserProfile } from "@/types/quiz";
import { WeeklyMealPlan } from "@/types/user";
import { AIProvider, getMealPlanPrompt, parseMealPlanResponse } from "./provider";

/**
 * OpenAI Provider Implementation
 */
export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = "gpt-4o") {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  getName(): string {
    return `OpenAI (${this.model})`;
  }

  async generateMealPlan(userProfile: UserProfile): Promise<WeeklyMealPlan> {
    const prompt = getMealPlanPrompt(userProfile);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert nutritionist specializing in PCOS management. You provide detailed, practical meal plans tailored to individual needs. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 8000,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response from OpenAI");
      }

      return parseMealPlanResponse(content);
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error(
        `Failed to generate meal plan with OpenAI: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}

import { UserProfile } from "@/types/quiz";
import { WeeklyMealPlan } from "@/types/user";

/**
 * AI Provider Interface
 * Defines the contract for AI providers (OpenAI, Gemini, etc.)
 */
export interface AIProvider {
  /**
   * Generate a personalized meal plan based on user profile
   */
  generateMealPlan(userProfile: UserProfile): Promise<WeeklyMealPlan>;

  /**
   * Get the provider name for logging/debugging
   */
  getName(): string;
}

/**
 * Base prompt template for meal plan generation
 */
export function getMealPlanPrompt(profile: UserProfile): string {
  return `You are a certified nutritionist specializing in PCOS (Polycystic Ovary Syndrome) management. Generate a detailed 7-day PCOS-friendly meal plan for a user with the following profile:

## User Profile
- Age: ${profile.age} years old
- Current Weight: ${profile.currentWeight} kg
- Target Weight: ${profile.targetWeight} kg
- Height: ${profile.height} cm
- Body Type: ${profile.bodyType}
- Activity Level: ${profile.activityLevel}
- Exercise Preference: ${profile.exercisePreference}

## Health Goals
${profile.goals.map((g) => `- ${g}`).join("\n")}

## Current Symptoms
${profile.symptoms.map((s) => `- ${s}`).join("\n")}

## Lifestyle Factors
- Period Regularity: ${profile.periodRegularity}
- Mood Issues: ${profile.moodIssues}
- Energy Levels: ${profile.energyLevels}
- Hydration: ${profile.hydration}
- Bad Habits to Address: ${profile.badHabits.join(", ")}

## Guidelines for the Meal Plan
1. Focus on low glycemic index (GI) foods to manage insulin resistance
2. Include anti-inflammatory ingredients (fatty fish, leafy greens, berries)
3. Emphasize hormone-balancing nutrients (zinc, magnesium, B vitamins, vitamin D)
4. Include adequate protein to support metabolism and satiety
5. Limit processed foods, refined carbs, and added sugars
6. Include healthy fats from avocados, nuts, seeds, and olive oil
7. Ensure each meal is practical and easy to prepare

## Response Format
Return the meal plan as a valid JSON object with this exact structure:
{
  "days": [
    {
      "day": "Monday",
      "breakfast": {
        "name": "Meal name",
        "description": "Brief description",
        "calories": 400,
        "protein": 25,
        "carbs": 30,
        "fat": 15,
        "ingredients": ["ingredient1", "ingredient2"],
        "instructions": ["step1", "step2"]
      },
      "lunch": { ...same structure... },
      "dinner": { ...same structure... },
      "snacks": [{ ...same structure... }]
    }
    // ... repeat for all 7 days
  ]
}

IMPORTANT: Return ONLY the JSON object, no additional text or markdown formatting.`;
}

/**
 * Parse and validate the meal plan response
 */
export function parseMealPlanResponse(response: string): WeeklyMealPlan {
  // Remove any markdown code blocks if present
  let cleanResponse = response.trim();
  if (cleanResponse.startsWith("```json")) {
    cleanResponse = cleanResponse.slice(7);
  }
  if (cleanResponse.startsWith("```")) {
    cleanResponse = cleanResponse.slice(3);
  }
  if (cleanResponse.endsWith("```")) {
    cleanResponse = cleanResponse.slice(0, -3);
  }

  try {
    const parsed = JSON.parse(cleanResponse.trim());
    
    // Validate structure
    if (!parsed.days || !Array.isArray(parsed.days)) {
      throw new Error("Invalid meal plan structure: missing 'days' array");
    }

    return parsed as WeeklyMealPlan;
  } catch (error) {
    console.error("Failed to parse meal plan response:", error);
    throw new Error("Failed to parse AI response into meal plan");
  }
}

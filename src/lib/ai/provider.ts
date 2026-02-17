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
   * Generate personalized analysis text for the result offer page
   */
  generateAnalysis(userProfile: UserProfile): Promise<string>;

  /**
   * Get the provider name for logging/debugging
   */
  getName(): string;
}

/**
 * Base prompt template for meal plan generation
 */
export function getMealPlanPrompt(profile: UserProfile): string {
  const isMale = profile.gender === "male";
  
  const expertRole = isMale 
    ? "You are a certified sports nutritionist and men's health expert."
    : "You are a certified nutritionist specializing in PCOS (Polycystic Ovary Syndrome) management.";
    
  const planType = isMale
    ? "performance-focused meal plan for a man"
    : "PCOS-friendly meal plan for a woman";
    
  const lifestyleFactors = isMale
    ? `- Fitness Level: ${profile.fitnessLevel || "Not specified"}
- Stress/Mood Issues: ${profile.moodIssues}
- Energy Levels: ${profile.energyLevels}
- Hydration: ${profile.hydration}
- Habits to Improve: ${profile.badHabits.join(", ")}`
    : `- Period Regularity: ${profile.periodRegularity}
- Mood Issues: ${profile.moodIssues}
- Energy Levels: ${profile.energyLevels}
- Hydration: ${profile.hydration}
- Bad Habits to Address: ${profile.badHabits.join(", ")}`;

  const guidelines = isMale
    ? `1. Focus on high-quality protein sources to support muscle maintenance and growth
2. Include complex carbohydrates for sustained energy
3. Emphasize testosterone-supporting nutrients (zinc, vitamin D, healthy fats)
4. Include adequate fiber for digestive health
5. Limit processed foods, refined carbs, and added sugars
6. Include healthy fats from fatty fish, avocados, nuts, seeds, and olive oil
7. Ensure each meal is practical and easy to prepare`
    : `1. Focus on low glycemic index (GI) foods to manage insulin resistance
2. Include anti-inflammatory ingredients (fatty fish, leafy greens, berries)
3. Emphasize hormone-balancing nutrients (zinc, magnesium, B vitamins, vitamin D)
4. Include adequate protein to support metabolism and satiety
5. Limit processed foods, refined carbs, and added sugars
6. Include healthy fats from avocados, nuts, seeds, and olive oil
7. Ensure each meal is practical and easy to prepare`;

  return `${expertRole} Generate a detailed 7-day ${planType} with the following profile:

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

## Current Challenges
${profile.symptoms.map((s) => `- ${s}`).join("\n")}

## Lifestyle Factors
${lifestyleFactors}

## Guidelines for the Meal Plan
${guidelines}

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
 * Prompt template for personalized analysis generation
 */
export function getAnalysisPrompt(profile: UserProfile): string {
  const weightToLose = profile.currentWeight - profile.targetWeight;
  const bmi = (profile.currentWeight / Math.pow(profile.height / 100, 2)).toFixed(1);
  const isMale = profile.gender === "male";
  
  const expertRole = isMale
    ? "You are a certified men's health and fitness expert."
    : "You are a certified PCOS wellness expert and health consultant.";
    
  const healthSituation = isMale
    ? `- Current Challenges: ${profile.symptoms.join(", ")}
- Fitness Level: ${profile.fitnessLevel || "Not specified"}
- Stress/Mood: ${profile.moodIssues}
- Energy Levels: ${profile.energyLevels}
- Weight/Fitness History: ${profile.weightLossHistory}`
    : `- PCOS Symptoms: ${profile.symptoms.join(", ")}
- Period Regularity: ${profile.periodRegularity}
- Mood Issues: ${profile.moodIssues}
- Energy Levels: ${profile.energyLevels}
- Weight Loss History: ${profile.weightLossHistory}`;

  const guidelines = isMale
    ? `1. Start with "Based on your answers..." to create continuity
2. Acknowledge their specific fitness/health struggles (be empathetic)
3. Explain factors that may be making it harder for them to reach their goals (metabolism, lifestyle, stress)
4. Highlight how their challenges can be addressed with the right approach
5. Create hope by explaining how a personalized plan addresses their specific needs
6. Mention 2-3 specific strategies tailored to their profile (nutrition, training, recovery)
7. End with encouragement about achievable results
8. Keep it 2-3 paragraphs, motivating but professional tone
9. Use "you/your" language (second person)
10. DO NOT mention prices, plans, or make it sound like a sales pitch`
    : `1. Start with "Based on your answers..." to create continuity
2. Acknowledge their specific struggles (be empathetic)
3. Explain why PCOS makes weight loss harder for them specifically
4. Highlight that their symptoms indicate hormonal imbalance (insulin resistance, inflammation)
5. Create hope by explaining how a personalized plan addresses their specific needs
6. Mention 2-3 specific strategies tailored to their profile
7. End with encouragement about achievable results
8. Keep it 2-3 paragraphs, warm but professional tone
9. Use "you/your" language (second person)
10. DO NOT mention prices, plans, or make it sound like a sales pitch`;

  return `${expertRole} Based on the user's quiz responses, create a personalized, empathetic, and motivating analysis for the result offer page.

## User Profile
- Gender: ${isMale ? "Male" : "Female"}
- Age: ${profile.age} years old
- Current Weight: ${profile.currentWeight} kg
- Target Weight: ${profile.targetWeight} kg (${weightToLose > 0 ? `needs to lose ${weightToLose} kg` : "at or near target"})
- Height: ${profile.height} cm
- BMI: ${bmi}
- Body Type: ${profile.bodyType}

## Health Situation
${healthSituation}

## Goals
${profile.goals.map((g) => `- ${g}`).join("\n")}

## Lifestyle
- Activity Level: ${profile.activityLevel}
- Exercise Preference: ${profile.exercisePreference}
- Hydration: ${profile.hydration}
- Habits to Improve: ${profile.badHabits.join(", ")}

## Guidelines
${guidelines}

Write the analysis text directly without any labels, formatting, or markdown. Just natural, flowing paragraphs.`;
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

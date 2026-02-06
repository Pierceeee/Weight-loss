import { NextRequest, NextResponse } from "next/server";
import { getAIProvider, isAIConfigured } from "@/lib/ai";
import { UserProfile } from "@/types/quiz";
import { z } from "zod";

// Request body validation schema
const userProfileSchema = z.object({
  age: z.number().min(18).max(100),
  height: z.number().min(100).max(250),
  currentWeight: z.number().min(30).max(300),
  targetWeight: z.number().min(30).max(300),
  bodyType: z.string(),
  goals: z.array(z.string()),
  symptoms: z.array(z.string()),
  activityLevel: z.string(),
  exercisePreference: z.string(),
  hydration: z.string(),
  badHabits: z.array(z.string()),
  periodRegularity: z.string(),
  moodIssues: z.string(),
  weightLossHistory: z.string(),
  energyLevels: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Check if AI is configured
    if (!isAIConfigured()) {
      return NextResponse.json(
        { error: "AI provider is not configured. Please set the required API keys." },
        { status: 503 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = userProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const userProfile: UserProfile = validationResult.data;

    // Get AI provider and generate meal plan
    const provider = getAIProvider();
    console.log(`Generating meal plan using ${provider.getName()}`);

    const mealPlan = await provider.generateMealPlan(userProfile);

    return NextResponse.json({
      success: true,
      provider: provider.getName(),
      mealPlan,
    });
  } catch (error) {
    console.error("Error generating meal plan:", error);

    const message = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: "Failed to generate meal plan", message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "PCOS Plan API - Generate Meal Plan",
    method: "POST",
    description: "Send a user profile to generate a personalized PCOS-friendly meal plan",
    configured: isAIConfigured(),
  });
}

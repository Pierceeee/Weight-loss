export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: "active" | "canceled" | "past_due" | "trialing";
  plan: "monthly" | "yearly" | "lifetime";
  currentPeriodEnd: Date;
  createdAt: Date;
}

export interface MealPlan {
  id: string;
  userId: string;
  weekNumber: number;
  planData: WeeklyMealPlan;
  createdAt: Date;
}

export interface WeeklyMealPlan {
  days: DayMealPlan[];
}

export interface DayMealPlan {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions?: string[];
}

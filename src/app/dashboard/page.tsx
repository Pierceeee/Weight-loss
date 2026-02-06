"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuizStore } from "@/hooks/useQuizState";
import {
  Heart,
  ChefHat,
  RefreshCw,
  Calendar,
  Utensils,
  ShoppingCart,
  LogOut,
  Crown,
} from "lucide-react";
import { DayMealPlan, WeeklyMealPlan } from "@/types/user";

// Demo meal plan for development
const demoMealPlan: WeeklyMealPlan = {
  days: [
    {
      day: "Monday",
      breakfast: {
        name: "Greek Yogurt Parfait",
        description: "Protein-rich breakfast to stabilize blood sugar",
        calories: 350,
        protein: 20,
        carbs: 35,
        fat: 12,
        ingredients: ["1 cup Greek yogurt", "1/4 cup mixed berries", "1 tbsp chia seeds", "1 tbsp honey"],
        instructions: ["Layer yogurt in a bowl", "Top with berries and chia seeds", "Drizzle with honey"],
      },
      lunch: {
        name: "Grilled Salmon Salad",
        description: "Anti-inflammatory omega-3 rich lunch",
        calories: 450,
        protein: 35,
        carbs: 20,
        fat: 25,
        ingredients: ["4oz grilled salmon", "Mixed greens", "Avocado", "Cherry tomatoes", "Olive oil dressing"],
        instructions: ["Grill salmon with herbs", "Arrange greens on plate", "Top with salmon and vegetables"],
      },
      dinner: {
        name: "Chicken Stir-Fry",
        description: "Low-GI dinner with plenty of vegetables",
        calories: 400,
        protein: 30,
        carbs: 30,
        fat: 15,
        ingredients: ["5oz chicken breast", "Broccoli", "Bell peppers", "Cauliflower rice", "Coconut aminos"],
        instructions: ["Slice chicken and stir-fry", "Add vegetables and cook until tender", "Serve over cauliflower rice"],
      },
      snacks: [
        {
          name: "Almonds & Apple",
          description: "Balanced snack with protein and fiber",
          calories: 200,
          protein: 6,
          carbs: 20,
          fat: 12,
          ingredients: ["1/4 cup almonds", "1 medium apple"],
        },
      ],
    },
    {
      day: "Tuesday",
      breakfast: {
        name: "Spinach & Mushroom Omelette",
        description: "High-protein, low-carb start to manage insulin",
        calories: 320,
        protein: 24,
        carbs: 8,
        fat: 22,
        ingredients: ["3 eggs", "1 cup spinach", "1/2 cup mushrooms", "1 tbsp olive oil", "Salt & pepper"],
        instructions: ["Sauté mushrooms and spinach in olive oil", "Beat eggs and pour over vegetables", "Cook until set, fold and serve"],
      },
      lunch: {
        name: "Turkey & Avocado Lettuce Wraps",
        description: "Low-carb lunch packed with healthy fats",
        calories: 380,
        protein: 28,
        carbs: 12,
        fat: 26,
        ingredients: ["4oz sliced turkey breast", "1 avocado", "Large lettuce leaves", "Tomato slices", "Mustard"],
        instructions: ["Layer turkey and avocado on lettuce leaves", "Add tomato slices", "Drizzle with mustard and roll up"],
      },
      dinner: {
        name: "Baked Cod with Roasted Vegetables",
        description: "Lean protein with fiber-rich vegetables",
        calories: 420,
        protein: 34,
        carbs: 28,
        fat: 18,
        ingredients: ["5oz cod fillet", "Zucchini", "Sweet potato", "Red onion", "Lemon & herbs"],
        instructions: ["Season cod with lemon and herbs", "Chop vegetables and toss with olive oil", "Bake everything at 400°F for 20 minutes"],
      },
      snacks: [
        {
          name: "Hummus & Veggie Sticks",
          description: "Fiber and protein-rich mid-day snack",
          calories: 180,
          protein: 6,
          carbs: 18,
          fat: 10,
          ingredients: ["1/4 cup hummus", "Carrot sticks", "Cucumber sticks", "Bell pepper strips"],
        },
      ],
    },
    {
      day: "Wednesday",
      breakfast: {
        name: "Berry Smoothie Bowl",
        description: "Antioxidant-rich breakfast with anti-inflammatory berries",
        calories: 380,
        protein: 18,
        carbs: 45,
        fat: 14,
        ingredients: ["1 cup frozen mixed berries", "1 banana", "1 scoop protein powder", "1 tbsp flaxseed", "Almond milk"],
        instructions: ["Blend berries, banana, protein powder and almond milk", "Pour into bowl", "Top with flaxseed and extra berries"],
      },
      lunch: {
        name: "Quinoa Buddha Bowl",
        description: "Plant-based power bowl with hormone-balancing nutrients",
        calories: 460,
        protein: 18,
        carbs: 52,
        fat: 20,
        ingredients: ["1 cup cooked quinoa", "Roasted chickpeas", "Sweet potato", "Kale", "Tahini dressing"],
        instructions: ["Arrange quinoa as base", "Top with roasted chickpeas, sweet potato, and kale", "Drizzle with tahini dressing"],
      },
      dinner: {
        name: "Herb-Crusted Chicken Breast",
        description: "Lean protein dinner with Mediterranean flavors",
        calories: 410,
        protein: 38,
        carbs: 22,
        fat: 18,
        ingredients: ["5oz chicken breast", "Mixed herbs", "Asparagus", "Brown rice", "Garlic"],
        instructions: ["Coat chicken in mixed herbs and garlic", "Bake at 375°F for 25 minutes", "Serve with steamed asparagus and brown rice"],
      },
      snacks: [
        {
          name: "Walnuts & Dark Chocolate",
          description: "Omega-3 and magnesium-rich treat",
          calories: 210,
          protein: 5,
          carbs: 14,
          fat: 16,
          ingredients: ["1/4 cup walnuts", "1oz dark chocolate (70%+)"],
        },
      ],
    },
    {
      day: "Thursday",
      breakfast: {
        name: "Overnight Oats with Cinnamon",
        description: "Slow-release carbs with blood sugar-balancing cinnamon",
        calories: 340,
        protein: 14,
        carbs: 48,
        fat: 12,
        ingredients: ["1/2 cup rolled oats", "1 cup almond milk", "1 tbsp chia seeds", "1 tsp cinnamon", "1 tbsp almond butter"],
        instructions: ["Combine oats, milk, chia seeds and cinnamon in a jar", "Refrigerate overnight", "Top with almond butter before serving"],
      },
      lunch: {
        name: "Mediterranean Lentil Soup",
        description: "High-fiber lunch for steady energy and gut health",
        calories: 390,
        protein: 22,
        carbs: 48,
        fat: 12,
        ingredients: ["1 cup lentils", "Diced tomatoes", "Onion", "Garlic", "Cumin", "Olive oil"],
        instructions: ["Sauté onion and garlic in olive oil", "Add lentils, tomatoes, cumin and water", "Simmer for 25 minutes until lentils are tender"],
      },
      dinner: {
        name: "Grilled Shrimp with Zucchini Noodles",
        description: "Low-carb, high-protein dinner with anti-inflammatory benefits",
        calories: 380,
        protein: 32,
        carbs: 14,
        fat: 22,
        ingredients: ["6oz shrimp", "2 zucchini (spiralized)", "Cherry tomatoes", "Garlic", "Olive oil", "Basil"],
        instructions: ["Grill shrimp with garlic and olive oil", "Sauté zucchini noodles until tender", "Toss together with tomatoes and fresh basil"],
      },
      snacks: [
        {
          name: "Pumpkin Seeds & Berries",
          description: "Zinc-rich snack for hormonal support",
          calories: 190,
          protein: 8,
          carbs: 16,
          fat: 12,
          ingredients: ["2 tbsp pumpkin seeds", "1/2 cup fresh blueberries"],
        },
      ],
    },
    {
      day: "Friday",
      breakfast: {
        name: "Avocado Toast with Eggs",
        description: "Healthy fats and protein for a balanced start",
        calories: 400,
        protein: 18,
        carbs: 30,
        fat: 24,
        ingredients: ["1 slice whole grain bread", "1/2 avocado", "2 poached eggs", "Red pepper flakes", "Lemon juice"],
        instructions: ["Toast bread", "Mash avocado with lemon juice on toast", "Top with poached eggs and red pepper flakes"],
      },
      lunch: {
        name: "Chicken & Vegetable Curry",
        description: "Turmeric-rich anti-inflammatory lunch",
        calories: 440,
        protein: 32,
        carbs: 35,
        fat: 18,
        ingredients: ["4oz chicken thigh", "Coconut milk", "Turmeric", "Ginger", "Spinach", "Cauliflower rice"],
        instructions: ["Cook chicken with turmeric and ginger", "Add coconut milk and spinach, simmer", "Serve over cauliflower rice"],
      },
      dinner: {
        name: "Baked Salmon with Sweet Potato",
        description: "Omega-3 rich dinner for hormonal balance",
        calories: 460,
        protein: 36,
        carbs: 32,
        fat: 20,
        ingredients: ["5oz salmon fillet", "1 medium sweet potato", "Green beans", "Lemon", "Dill"],
        instructions: ["Season salmon with lemon and dill", "Bake sweet potato and salmon at 400°F", "Steam green beans and serve together"],
      },
      snacks: [
        {
          name: "Celery with Almond Butter",
          description: "Crunchy, satisfying snack with healthy fats",
          calories: 170,
          protein: 5,
          carbs: 8,
          fat: 14,
          ingredients: ["3 celery stalks", "2 tbsp almond butter"],
        },
      ],
    },
    {
      day: "Saturday",
      breakfast: {
        name: "Sweet Potato Hash with Eggs",
        description: "Nutrient-dense, slow-digesting breakfast",
        calories: 410,
        protein: 20,
        carbs: 38,
        fat: 20,
        ingredients: ["1 cup diced sweet potato", "2 eggs", "Bell pepper", "Onion", "Olive oil", "Paprika"],
        instructions: ["Sauté sweet potato and vegetables in olive oil", "Season with paprika", "Create wells and crack eggs in, cover until set"],
      },
      lunch: {
        name: "Tuna Nicoise Salad",
        description: "Protein-packed salad with heart-healthy fats",
        calories: 420,
        protein: 34,
        carbs: 22,
        fat: 22,
        ingredients: ["1 can tuna (in olive oil)", "Mixed greens", "Hard-boiled egg", "Olives", "Green beans", "Dijon vinaigrette"],
        instructions: ["Arrange greens on plate", "Top with tuna, egg, olives, and green beans", "Drizzle with Dijon vinaigrette"],
      },
      dinner: {
        name: "Turkey Meatballs with Marinara",
        description: "Lean protein with lycopene-rich tomato sauce",
        calories: 430,
        protein: 34,
        carbs: 30,
        fat: 18,
        ingredients: ["5oz ground turkey", "Whole wheat pasta (small portion)", "Marinara sauce", "Garlic", "Italian herbs", "Parmesan"],
        instructions: ["Mix turkey with herbs, form meatballs", "Bake at 375°F for 20 minutes", "Serve with marinara sauce over pasta"],
      },
      snacks: [
        {
          name: "Greek Yogurt with Honey",
          description: "Probiotic-rich snack for gut health",
          calories: 160,
          protein: 12,
          carbs: 18,
          fat: 4,
          ingredients: ["3/4 cup Greek yogurt", "1 tsp honey", "Sprinkle of cinnamon"],
        },
      ],
    },
    {
      day: "Sunday",
      breakfast: {
        name: "Banana Protein Pancakes",
        description: "Wholesome pancakes for a relaxed Sunday morning",
        calories: 380,
        protein: 22,
        carbs: 42,
        fat: 14,
        ingredients: ["1 banana", "2 eggs", "1/4 cup oat flour", "1 scoop protein powder", "Berries for topping"],
        instructions: ["Mash banana and mix with eggs, oat flour, and protein powder", "Cook small pancakes on a non-stick pan", "Top with fresh berries"],
      },
      lunch: {
        name: "Stuffed Bell Peppers",
        description: "Colorful, fiber-rich meal with balanced macros",
        calories: 420,
        protein: 26,
        carbs: 36,
        fat: 20,
        ingredients: ["2 bell peppers", "Lean ground beef or turkey", "Brown rice", "Black beans", "Cumin", "Cheese"],
        instructions: ["Cook meat with rice, beans, and cumin", "Stuff into halved bell peppers", "Top with cheese and bake at 375°F for 25 minutes"],
      },
      dinner: {
        name: "Lemon Herb Roasted Chicken",
        description: "Simple, flavorful dinner to prep for the week",
        calories: 440,
        protein: 38,
        carbs: 24,
        fat: 22,
        ingredients: ["5oz chicken thigh (bone-in)", "Lemon", "Rosemary", "Roasted broccoli", "Quinoa"],
        instructions: ["Season chicken with lemon and rosemary", "Roast at 425°F for 35 minutes", "Serve with roasted broccoli and quinoa"],
      },
      snacks: [
        {
          name: "Trail Mix",
          description: "Energy-boosting mix with seeds and dried fruit",
          calories: 220,
          protein: 7,
          carbs: 22,
          fat: 14,
          ingredients: ["Almonds", "Pumpkin seeds", "Dried cranberries", "Dark chocolate chips"],
        },
      ],
    },
  ],
};

export default function DashboardPage() {
  const { getUserProfile } = useQuizStore();
  const [mealPlan, setMealPlan] = useState<WeeklyMealPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load demo plan for development
    setMealPlan(demoMealPlan);
  }, []);

  const generateNewPlan = async () => {
    setIsGenerating(true);
    try {
      const profile = getUserProfile();
      if (!profile) {
        alert("Please complete the quiz first");
        return;
      }

      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate plan");
      }

      const data = await response.json();
      setMealPlan(data.mealPlan);
    } catch (error) {
      console.error("Error generating plan:", error);
      alert(error instanceof Error ? error.message : "Failed to generate plan");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const currentDay: DayMealPlan | undefined = mealPlan?.days[selectedDay];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">PCOS Plan</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">Premium</span>
              </div>
              <Button variant="ghost" size="icon">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s your personalized PCOS meal plan for this week.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Today&apos;s Meals</h3>
                <p className="text-sm text-muted-foreground">View today&apos;s plan</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Shopping List</h3>
                <p className="text-sm text-muted-foreground">Get ingredients</p>
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={generateNewPlan}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <RefreshCw
                  className={`w-6 h-6 text-primary ${isGenerating ? "animate-spin" : ""}`}
                />
              </div>
              <div>
                <h3 className="font-semibold">New Plan</h3>
                <p className="text-sm text-muted-foreground">
                  {isGenerating ? "Generating..." : "Generate new plan"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Day Selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
            <Button
              key={day}
              variant={selectedDay === index ? "default" : "outline"}
              className="min-w-[60px]"
              onClick={() => setSelectedDay(index)}
              disabled={!mealPlan?.days[index]}
            >
              {day}
            </Button>
          ))}
        </div>

        {/* Meal Plan */}
        {currentDay ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">{currentDay.day}</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Breakfast */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌅</span>
                    <CardTitle className="text-lg">Breakfast</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-1">{currentDay.breakfast.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {currentDay.breakfast.description}
                  </p>
                  <div className="flex gap-3 text-xs">
                    <span className="px-2 py-1 bg-muted rounded">
                      {currentDay.breakfast.calories} cal
                    </span>
                    <span className="px-2 py-1 bg-muted rounded">
                      {currentDay.breakfast.protein}g protein
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Lunch */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">☀️</span>
                    <CardTitle className="text-lg">Lunch</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-1">{currentDay.lunch.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {currentDay.lunch.description}
                  </p>
                  <div className="flex gap-3 text-xs">
                    <span className="px-2 py-1 bg-muted rounded">
                      {currentDay.lunch.calories} cal
                    </span>
                    <span className="px-2 py-1 bg-muted rounded">
                      {currentDay.lunch.protein}g protein
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Dinner */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌙</span>
                    <CardTitle className="text-lg">Dinner</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-1">{currentDay.dinner.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {currentDay.dinner.description}
                  </p>
                  <div className="flex gap-3 text-xs">
                    <span className="px-2 py-1 bg-muted rounded">
                      {currentDay.dinner.calories} cal
                    </span>
                    <span className="px-2 py-1 bg-muted rounded">
                      {currentDay.dinner.protein}g protein
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Snacks */}
            {currentDay.snacks && currentDay.snacks.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Snacks</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {currentDay.snacks.map((snack, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-medium">{snack.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {snack.calories} cal
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <ChefHat className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Meal Plan Yet</h3>
              <p className="text-muted-foreground mb-4">
                Click &quot;Generate New Plan&quot; to create your personalized PCOS-friendly meal plan.
              </p>
              <Button onClick={generateNewPlan} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Plan"}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-8">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Need help?{" "}
            <Link href="#" className="text-primary hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

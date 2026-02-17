import { QuizQuestion } from "@/types/quiz";

export const femaleQuizQuestions: QuizQuestion[] = [
  {
    id: "age-range",
    step: 1,
    type: "single-select",
    question: "PCOS RESET METHOD",
    subtitle: "Let's personalize this for your body and life stage.",
    options: [
      { id: "18-27", label: "18-27" },
      { id: "27-40", label: "27-40" },
      { id: "41-50", label: "41-50" },
      { id: "50+", label: "50+" },
    ],
    required: true,
  },
  {
    id: "symptoms",
    step: 2,
    type: "multi-select",
    question: "Many women with PCOS experience some of the following. Which feel familiar to you?",
    options: [
      { id: "irregular-periods", label: "Missed or irregular menstrual cycles", icon: "🔴" },
      { id: "weight-gain", label: "Unexplained weight gain", icon: "📈" },
      { id: "acne", label: "Oily skin or acne breakouts", icon: "🫧" },
      { id: "hair-thinning", label: "Hair thinning or increased hair shedding", icon: "💇‍♀️" },
      { id: "fatigue", label: "Ongoing tiredness or low energy", icon: "💤" },
      { id: "mood-swings", label: "Emotional ups and downs", icon: "🌪️" },
      { id: "difficulty-losing-weight", label: "Trouble losing weight", icon: "🧱" },
      { id: "sugar-cravings", label: "Frequent cravings for sweets", icon: "🧁" },
    ],
    required: true,
  },
  {
    id: "period-regularity",
    step: 3,
    type: "single-select",
    question: "How predictable does your cycle feel to you?",
    options: [
      { id: "rarely", label: "I rarely experience a period", icon: "😰" },
      { id: "irregular", label: "My cycle is highly irregular", icon: "🌧️" },
      { id: "somewhat-regular", label: "Fairly regular, but not always predictable", icon: "⛅" },
      { id: "very-regular", label: "Very consistent", icon: "☀️" },
    ],
    required: true,
  },
  {
    id: "mood-issues",
    step: 4,
    type: "single-select",
    question: "Do you often feel stressed, anxious, or emotionally overwhelmed?",
    options: [
      { id: "yes-often", label: "Yes, quite often", icon: "🌪️" },
      { id: "sometimes", label: "Sometimes, but I usually cope well", icon: "🍃" },
      { id: "no", label: "Rarely", icon: "✨" },
    ],
    required: true,
  },
  {
    id: "weight-loss-history",
    step: 5,
    type: "single-select",
    question: "Have you tried to lose weight — only to feel like your body won't respond?",
    options: [
      { id: "yes-nothing-works", label: "Yes, results never seem to come", icon: "🧱" },
      { id: "comes-back", label: "I lose some weight, but it doesn't last", icon: "🔄" },
      { id: "havent-tried", label: "I haven't seriously attempted yet", icon: "🌿" },
    ],
    required: true,
  },
  {
    id: "energy-levels",
    step: 6,
    type: "single-select",
    question: "How would you rate your typical daily energy?",
    options: [
      { id: "always-exhausted", label: "Frequently drained, even after rest", icon: "🥱" },
      { id: "afternoon-crashes", label: "I experience noticeable afternoon fatigue", icon: "📉" },
      { id: "inconsistent", label: "My energy varies depending on the day", icon: "🌊" },
      { id: "fine", label: "My energy is generally steady", icon: "☀️" },
    ],
    required: true,
  },

  // Phase 2: Goals & Biometrics (Steps 7-13)
  {
    id: "motivation-1",
    step: 7,
    type: "interstitial",
    content: {
      title: "Take Back Control of Your PCOS Health",
      description: "Based on your answers, your symptoms may not be a willpower issue — they often reflect how PCOS affects metabolism, appetite signals, and energy regulation.",
      highlight: "Most women begin noticing measurable symptom improvements within weeks.",
      image: "/images/interstitial-motivation-1.png",
    },
    benefits: [
      "Support hormone-driven appetite balance",
      "Reduce biological resistance to weight loss",
      "Stabilize energy fluctuations",
      "Create sustainable progress without extreme restriction",
    ],
  },
  {
    id: "goals",
    step: 8,
    type: "multi-select",
    question: "What would you like to achieve?",
    options: [
      { id: "lose-weight", label: "Lose excess weight", icon: "📉" },
      { id: "get-fit", label: "Improve overall fitness", icon: "👟" },
      { id: "boost-metabolism", label: "Support a faster metabolism", icon: "⚡" },
      { id: "improve-energy", label: "Increase daily energy", icon: "🌟" },
      { id: "stabilize-mood", label: "Maintain a more stable mood", icon: "🧘‍♀️" },
      { id: "hormonal-balance", label: "Support hormonal harmony", icon: "⚖️" },
      { id: "reduce-cravings", label: "Reduce sugar and snack cravings", icon: "🍎" },
    ],
    required: true,
  },
  {
    id: "body-type",
    step: 9,
    type: "visual-select",
    question: "Which silhouette feels closest to your current shape?",
    options: [
      { id: "regular", label: "STANDARD", image: "/images/body-type-regular.png" },
      { id: "plump", label: "CURVY", image: "/images/body-type-plump.png" },
      { id: "extra", label: "PLUS", image: "/images/body-type-extra.png" },
    ],
    required: true,
  },
  {
    id: "motivation-pcos-pattern",
    step: 10,
    type: "interstitial",
    content: {
      title: "Understanding Your PCOS Pattern",
      description: "PCOS doesn't just affect cycles. It can influence how your body responds to food, stress, sleep, and activity.",
      highlight: "PCOS Reset Method is powered by AI technology trained on evidence-based lifestyle frameworks and clinical PCOS guidance — allowing your plan to adapt to your specific symptom pattern and preferences.",
      image: "/images/interstitial-transformation.png",
    },
    benefits: [
      "Cravings feel stronger",
      "Energy fluctuates more",
      "Weight responds differently than expected",
      "That's why personalization matters.",
    ],
  },
  {
    id: "height",
    step: 11,
    type: "height-input",
    question: "What is your height?",
    subtitle: "This helps us estimate a realistic and safe progress range for you.",
    required: true,
  },
  {
    id: "current-weight",
    step: 12,
    type: "weight-input",
    question: "What is your current weight?",
    subtitle: "Weight helps us calculate your BMI.",
    validation: { min: 100, max: 440 },
    required: true,
  },
  {
    id: "target-weight",
    step: 13,
    type: "weight-input",
    question: "What is your desired weight?",
    validation: { min: 100, max: 440 },
    required: true,
  },
  {
    id: "age",
    step: 14,
    type: "numeric-input",
    question: "What is your age?",
    validation: { min: 18, max: 100 },
    required: true,
  },

  // Phase 3: Lifestyle & Habits (Steps 15-19)
  {
    id: "motivation-2",
    step: 15,
    type: "interstitial",
    content: {
      title: "Stay on Track with Healthy Habits",
      description:
        "Women in their 30s, a gentle reminder: building consistent daily habits that help you reach and maintain a weight range of 64kg to 72kg can accelerate your progress toward a stronger, healthier body.",
      image: "/images/motivation-2.png",
    },
  },
  {
    id: "activity-level",
    step: 16,
    type: "single-select",
    question: "What does your typical day look like?",
    subtitle: "Choose the option that best matches your daily routine",
    options: [
      { id: "desk-job", label: "Mostly seated work", icon: "💻" },
      { id: "moving-a-lot", label: "Frequently on the move", icon: "👟" },
      { id: "always-working-out", label: "Regularly exercising or training", icon: "💪" },
      { id: "home", label: "Mostly at home or low-activity routine", icon: "🏠" },
    ],
    required: true,
  },
  {
    id: "exercise-preference",
    step: 17,
    type: "single-select",
    question: "Do you enjoy physical activity?",
    subtitle: "Regular movement can help accelerate your progress.",
    options: [
      { id: "no", label: "Not really", icon: "🛋️" },
      { id: "try-to-stay-active", label: "Not much, but I try to stay somewhat active", icon: "👟" },
      { id: "occasionally", label: "Yes, from time to time", icon: "🚶‍♀️" },
      { id: "regularly", label: "Yes, I exercise consistently", icon: "💪" },
    ],
    required: true,
  },
  {
    id: "hydration",
    step: 18,
    type: "single-select",
    question: "How much water do you usually drink per day?",
    subtitle: "We mean plain water, not including coffee, tea, or other beverages.",
    options: [
      { id: "only-coffee-tea", label: "Mostly coffee or tea", icon: "☕" },
      { id: "less-than-2", label: "Under 500ml (fewer than 2 glasses)", icon: "💧" },
      { id: "2-6-glasses", label: "0.5L – 1.5L (about 2–6 glasses)", icon: "🥤" },
      { id: "7-10-glasses", label: "1.7L – 2.5L (around 7–10 glasses)", icon: "🚰" },
      { id: "dont-count", label: "I don't track it, it varies daily", icon: "🌊" },
    ],
    required: true,
  },
  {
    id: "bad-habits",
    step: 19,
    type: "multi-select",
    question: "Which of the following habits apply to you? (Select all that fit)",
    options: [
      { id: "eat-late", label: "I tend to eat late in the evening", icon: "🌃" },
      { id: "sweets", label: "I often crave sugary snacks or desserts", icon: "🧁" },
      { id: "soft-drinks", label: "I frequently drink soda or sweetened beverages", icon: "🥤" },
      { id: "alcohol", label: "I occasionally drink alcoholic beverages", icon: "🍷" },
      { id: "fatty-salty", label: "I often choose high-fat or salty foods", icon: "🥨" },
      { id: "none", label: "None of these apply", icon: "✅" },
    ],
    required: true,
  },

  // Phase 4: Trust, Processing & Results (Steps 20-23)
  {
    id: "focus-areas",
    step: 20,
    type: "ingredient-select",
    question: "Which areas should your personalized plan focus on most?",
    categories: [
      {
        id: "symptoms",
        title: "Symptoms & Body Signals",
        options: [
          { id: "weight-resistance", label: "Weight loss resistance" },
          { id: "fatigue", label: "Constant fatigue / low energy" },
          { id: "sugar-cravings", label: "Strong sugar cravings" },
          { id: "brain-fog", label: "Brain fog" },
          { id: "bloating", label: "Bloating after meals" },
          { id: "irregular-cycles", label: "Irregular cycles" },
          { id: "breakouts", label: "Skin breakouts / acne" },
          { id: "hair-issues", label: "Hair thinning or excess hair" },
          { id: "mood-swings", label: "Mood swings" },
          { id: "poor-sleep", label: "Poor sleep" },
        ],
      },
      {
        id: "metabolism",
        title: "Energy & Metabolism Support",
        options: [
          { id: "afternoon-crashes", label: "Reduce afternoon energy crashes" },
          { id: "blood-sugar", label: "Stabilize blood sugar" },
          { id: "morning-energy", label: "Improve morning energy" },
          { id: "carb-cravings", label: "Reduce carb cravings" },
          { id: "sleep-quality", label: "Improve sleep quality" },
          { id: "digestion", label: "Improve digestion" },
          { id: "inflammation", label: "Reduce inflammation" },
          { id: "sustainable-habits", label: "Build sustainable habits" },
        ],
      },
      {
        id: "nutrition",
        title: "Nutrition Coaching Style",
        options: [
          { id: "meal-structure", label: "Simple meal structure guidance" },
          { id: "portion-guidance", label: "Portion guidance (no calorie counting)" },
          { id: "grocery-planning", label: "Grocery planning support" },
          { id: "eating-out", label: "Eating out guidance" },
          { id: "snack-strategies", label: "Snack & craving strategies" },
          { id: "pcos-recipes", label: "PCOS-friendly recipes" },
          { id: "meal-timing", label: "Meal timing guidance" },
        ],
      },
      {
        id: "movement",
        title: "Movement & Activity Coaching",
        options: [
          { id: "gentle-movement", label: "Gentle movement routines" },
          { id: "strength-training", label: "Strength training guidance" },
          { id: "walking", label: "Walking & daily activity" },
          { id: "low-energy-workouts", label: "Low-energy workout options" },
          { id: "gym-confidence", label: "Gym confidence guidance" },
          { id: "exercise-consistency", label: "Building consistency with exercise" },
        ],
      },
      {
        id: "habits",
        title: "Habit & Mindset Coaching",
        options: [
          { id: "accountability", label: "Accountability & reminders" },
          { id: "motivation", label: "Motivation & consistency" },
          { id: "stress-management", label: "Stress management" },
          { id: "emotional-eating", label: "Emotional eating support" },
          { id: "routines", label: "Building routines" },
          { id: "overwhelm", label: "Reducing overwhelm" },
          { id: "long-term-consistency", label: "Staying consistent long-term" },
        ],
      },
      {
        id: "lifestyle",
        title: "Personalization & Lifestyle",
        options: [
          { id: "busy-schedule", label: "Busy schedule / limited time" },
          { id: "family-meals", label: "Family-friendly meals" },
          { id: "budget-options", label: "Budget-friendly options" },
          { id: "quick-recipes", label: "Quick & simple recipes" },
          { id: "flexible-approach", label: "Flexible (not restrictive) approach" },
          { id: "step-by-step", label: "Step-by-step daily guidance" },
        ],
      },
    ],
    required: true,
  },
  {
    id: "science-trust",
    step: 21,
    type: "science-list",
    question: "The research behind your personalized health plan",
  },
  {
    id: "goal-projection",
    step: 22,
    type: "goal-projection",
    question: "With PCOS Reset Method, you could reach your target weight of",
  },
  {
    id: "personal-summary",
    step: 23,
    type: "personal-summary",
    question: "Your personal summary",
  },
];

export const maleQuizQuestions: QuizQuestion[] = femaleQuizQuestions;

// Legacy export for backwards compatibility
export const quizQuestions = femaleQuizQuestions;

export const TOTAL_STEPS = femaleQuizQuestions.length;

export function getQuestionByStep(step: number, gender: "male" | "female" = "female"): QuizQuestion | undefined {
  const questions = gender === "male" ? maleQuizQuestions : femaleQuizQuestions;
  return questions.find((q) => q.step === step);
}

export function getTotalSteps(gender: "male" | "female" = "female"): number {
  const questions = gender === "male" ? maleQuizQuestions : femaleQuizQuestions;
  return questions.length;
}

export function getNextStep(currentStep: number): number | null {
  const nextStep = currentStep + 1;
  return nextStep <= TOTAL_STEPS ? nextStep : null;
}

export function getPreviousStep(currentStep: number): number | null {
  const prevStep = currentStep - 1;
  return prevStep >= 1 ? prevStep : null;
}

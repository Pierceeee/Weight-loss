import { QuizQuestion } from "@/types/quiz";

export const quizQuestions: QuizQuestion[] = [
  // Phase 1: Initial Engagement & Symptoms (Steps 1-5)
  {
    id: "symptoms",
    step: 1,
    type: "multi-select",
    question: "Do you experience any of these symptoms?",
    options: [
      { id: "irregular-periods", label: "Irregular or missing periods", icon: "🗓️" },
      { id: "weight-gain", label: "Weight gain", icon: "⚖️" },
      { id: "acne", label: "Acne or oily skin", icon: "✨" },
      { id: "hair-thinning", label: "Hair thinning or hair loss", icon: "💇" },
      { id: "fatigue", label: "Fatigue", icon: "😴" },
      { id: "mood-swings", label: "Mood swings", icon: "🎭" },
      { id: "difficulty-losing-weight", label: "Difficulty losing weight", icon: "📉" },
      { id: "sugar-cravings", label: "Sugar cravings", icon: "🍬" },
      { id: "other", label: "Other", icon: "📝" },
      { id: "none", label: "None", icon: "✅" },
    ],
    required: true,
  },
  {
    id: "period-regularity",
    step: 2,
    type: "single-select",
    question: "How regular are your periods?",
    options: [
      { id: "rarely", label: "I rarely get a period" },
      { id: "irregular", label: "My cycle is all over the place" },
      { id: "somewhat-regular", label: "Somewhat regular but inconsistent" },
      { id: "very-regular", label: "Very regular" },
    ],
    required: true,
  },
  {
    id: "mood-issues",
    step: 3,
    type: "single-select",
    question: "Do you experience mood swings, stress, or anxiety?",
    options: [
      { id: "yes-often", label: "Yes, I feel anxious or overwhelmed often" },
      { id: "sometimes", label: "I have some mood swings but manage them" },
      { id: "no", label: "Not really" },
    ],
    required: true,
  },
  {
    id: "weight-loss-history",
    step: 4,
    type: "single-select",
    question: "Have you struggled with losing weight despite diet and exercise?",
    options: [
      { id: "yes-nothing-works", label: "Yes, nothing works!" },
      { id: "comes-back", label: "I lose a little, but it always comes back" },
      { id: "havent-tried", label: "I haven't tried much yet" },
    ],
    required: true,
  },
  {
    id: "energy-levels",
    step: 5,
    type: "single-select",
    question: "How would you describe your energy levels?",
    options: [
      { id: "always-exhausted", label: "Always exhausted, even after sleeping" },
      { id: "afternoon-crashes", label: "I get afternoon crashes" },
      { id: "inconsistent", label: "I have energy, but it's inconsistent" },
      { id: "fine", label: "I feel fine most of the time" },
    ],
    required: true,
  },

  // Phase 2: Goals & Biometrics (Steps 6-12)
  {
    id: "motivation-1",
    step: 6,
    type: "interstitial",
    content: {
      title: "We're Here to Help You Take Control of PCOS",
      description: "Our personalized plan is designed to:",
      highlight: "9 out of 10 women saw improved PCOS symptoms",
      image: "/images/motivation-1.jpg",
    },
  },
  {
    id: "goals",
    step: 7,
    type: "multi-select",
    question: "What is your goal?",
    options: [
      { id: "lose-weight", label: "Lose weight", icon: "⚖️" },
      { id: "get-fit", label: "Get fit", icon: "🏃" },
      { id: "boost-metabolism", label: "Boost metabolism", icon: "🔥" },
      { id: "improve-energy", label: "Improve energy levels", icon: "⚡" },
      { id: "stabilize-mood", label: "Stabilize mood", icon: "😊" },
      { id: "hormonal-balance", label: "Achieve hormonal balance", icon: "🧬" },
      { id: "reduce-cravings", label: "Reduce cravings", icon: "🍫" },
    ],
    required: true,
  },
  {
    id: "body-type",
    step: 8,
    type: "visual-select",
    question: "Choose your body type",
    options: [
      { id: "regular", label: "Regular", image: "/images/body-type-regular.svg" },
      { id: "plump", label: "Plump", image: "/images/body-type-plump.svg" },
      { id: "extra", label: "Extra", image: "/images/body-type-extra.svg" },
    ],
    required: true,
  },
  {
    id: "height",
    step: 9,
    type: "numeric-input",
    question: "What is your height?",
    subtitle: "Height helps us calculate your BMI.",
    unit: "cm",
    unitOptions: ["cm", "ft"],
    validation: { min: 100, max: 250 },
    required: true,
  },
  {
    id: "current-weight",
    step: 10,
    type: "numeric-input",
    question: "What is your current weight?",
    subtitle: "Weight helps us calculate your BMI.",
    unit: "kg",
    unitOptions: ["kg", "lbs"],
    validation: { min: 30, max: 300 },
    required: true,
  },
  {
    id: "target-weight",
    step: 11,
    type: "numeric-input",
    question: "What is your desired weight?",
    unit: "kg",
    unitOptions: ["kg", "lbs"],
    validation: { min: 30, max: 300 },
    required: true,
  },
  {
    id: "age",
    step: 12,
    type: "numeric-input",
    question: "What is your age?",
    validation: { min: 18, max: 100 },
    required: true,
  },

  // Phase 3: Lifestyle & Habits (Steps 13-17)
  {
    id: "motivation-2",
    step: 13,
    type: "interstitial",
    content: {
      title: "Keep It Healthy",
      description:
        "Women in their 20s, take note: Improving your habits to achieve and maintain a healthy weight range can speed up your journey toward a healthy, strong body.",
      image: "/images/motivation-2.jpg",
    },
  },
  {
    id: "activity-level",
    step: 14,
    type: "single-select",
    question: "What does your day-to-day look like?",
    subtitle: "Select which fits your routine the best",
    options: [
      { id: "desk-job", label: "Desk job", icon: "💻" },
      { id: "moving-a-lot", label: "Moving a lot", icon: "🚶" },
      { id: "always-working-out", label: "Always working out", icon: "🏋️" },
      { id: "home", label: "Spending time at home", icon: "🏠" },
    ],
    required: true,
  },
  {
    id: "exercise-preference",
    step: 15,
    type: "single-select",
    question: "Do you enjoy exercising?",
    subtitle: "A great way to quicken your results is by working out.",
    options: [
      { id: "no", label: "No" },
      { id: "try-to-stay-active", label: "No, but I try to stay active" },
      { id: "occasionally", label: "Yes, occasionally" },
      { id: "regularly", label: "Yes, regularly" },
    ],
    required: true,
  },
  {
    id: "hydration",
    step: 16,
    type: "single-select",
    question: "How much water do you drink daily?",
    subtitle: "We mean clean water, excluding coffee, tea and other drinks",
    options: [
      { id: "only-coffee-tea", label: "Only coffee or tea" },
      { id: "less-than-2", label: "Less than 16 oz (Less than 2 glasses)" },
      { id: "2-6-glasses", label: "16 oz - 48 oz (2 - 6 glasses)" },
      { id: "7-10-glasses", label: "56 oz - 80 oz (7 - 10 glasses)" },
      { id: "dont-count", label: "Don't count, it depends" },
    ],
    required: true,
  },
  {
    id: "bad-habits",
    step: 17,
    type: "multi-select",
    question: "Select all that you tend to do:",
    options: [
      { id: "eat-late", label: "I eat late at night", icon: "🌙" },
      { id: "sweets", label: "I can't give up eating sweets", icon: "🍬" },
      { id: "soft-drinks", label: "I love soft drinks", icon: "🥤" },
      { id: "alcohol", label: "I consume hard drinks from time to time", icon: "🍸" },
      { id: "fatty-salty", label: "I love fatty or salty foods", icon: "🍟" },
      { id: "none", label: "None of the above", icon: "✅" },
    ],
    required: true,
  },

  // Phase 4: Trust, Processing & Results (Steps 18-21)
  {
    id: "diet-preference",
    step: 18,
    type: "single-select",
    question: "Do you have any dietary preferences?",
    options: [
      { id: "no-preference", label: "No specific preference" },
      { id: "vegetarian", label: "Vegetarian" },
      { id: "vegan", label: "Vegan" },
      { id: "pescatarian", label: "Pescatarian" },
      { id: "keto", label: "Keto / Low-carb" },
      { id: "gluten-free", label: "Gluten-free" },
    ],
    required: true,
  },
  {
    id: "science-trust",
    step: 19,
    type: "interstitial",
    content: {
      title: "The science behind your personalised weight loss plan",
      description:
        "Our recommendations are based on scientific research from leading health organizations.",
      image: "/images/science-logos.png",
    },
  },
  {
    id: "processing",
    step: 20,
    type: "interstitial",
    content: {
      title: "Analyzing your answers...",
      description: "We're creating your personalized PCOS management plan.",
    },
  },
];

export const TOTAL_STEPS = quizQuestions.length;

export function getQuestionByStep(step: number): QuizQuestion | undefined {
  return quizQuestions.find((q) => q.step === step);
}

export function getNextStep(currentStep: number): number | null {
  const nextStep = currentStep + 1;
  return nextStep <= TOTAL_STEPS ? nextStep : null;
}

export function getPreviousStep(currentStep: number): number | null {
  const prevStep = currentStep - 1;
  return prevStep >= 1 ? prevStep : null;
}

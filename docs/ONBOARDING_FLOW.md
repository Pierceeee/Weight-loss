# Onboarding Flow & Quiz Structure

This document outlines the step-by-step user flow for the PCOS Weight Loss App, based on the implemented 20-step quiz and post-quiz navigation.

## Phase 1: Initial Engagement & Symptoms (Steps 1-5)
The flow begins with understanding the user's specific PCOS symptoms and pain points.

*   **Step 1/20: Symptoms**
    *   **Question:** Do you experience any of these symptoms?
    *   **Type:** Multi-select
    *   **Options:** Irregular periods, Weight gain, Acne, Hair thinning, Fatigue, Mood swings, Sugar cravings, etc.
*   **Step 2/20: Menstrual Health**
    *   **Question:** How regular are your periods?
    *   **Options:** Rarely get a period, All over the place, Somewhat regular, Very regular.
*   **Step 3/20: Mental Wellbeing**
    *   **Question:** Do you experience mood swings, stress, or anxiety?
    *   **Options:** Yes (anxious/overwhelmed), Some mood swings, Not really.
*   **Step 4/20: Weight Loss History**
    *   **Question:** Have you struggled with losing weight despite diet and exercise?
    *   **Options:** Yes (nothing works), Lose but comes back, Haven't tried much.
*   **Step 5/20: Energy Levels**
    *   **Question:** How would you describe your energy levels?
    *   **Options:** Always exhausted, Afternoon crashes, Inconsistent, Fine.

## Phase 2: Goals & Biometrics (Steps 6-12)
After identifying problems, the quiz shifts to goals and collecting physical data for the plan.

*   **Step 6/20: Motivation (Interstitial)**
    *   **Content:** "We're Here to Help You Take Control..." (Benefits: Balance hormones, Boost metabolism, etc.).
    *   **Action:** Continue.
*   **Step 7/20: Primary Goal**
    *   **Question:** What is your goal?
    *   **Options:** Lose weight, Get fit, Boost metabolism, Hormone balance, etc.
*   **Step 8/20: Body Type**
    *   **Question:** Choose your body type.
    *   **Options:** Visual selection (Regular, Plump, Extra).
*   **Step 9/20: Height**
    *   **Question:** What is your height?
    *   **Input:** Numeric (ft/cm).
*   **Step 10/20: Current Weight**
    *   **Question:** What is your current weight?
    *   **Input:** Numeric (kg/lbs).
*   **Step 11/20: Desired Weight**
    *   **Question:** What is your desired weight?
    *   **Input:** Numeric (kg/lbs).
*   **Step 12/20: Age**
    *   **Question:** What is your age?
    *   **Input:** Numeric.

## Phase 3: Lifestyle & Habits (Steps 13-17)
Refining the plan based on daily activity and habits.

*   **Step 13/20: Motivation (Interstitial)**
    *   **Content:** "Keep It Healthy" - Personalized tip based on age.
    *   **Action:** Continue.
*   **Step 14/20: Activity Level**
    *   **Question:** What does your day-to-day look like?
    *   **Options:** Desk job, Moving a lot, Always working out, Home.
*   **Step 15/20: Exercise Preference**
    *   **Question:** Do you enjoy exercising?
    *   **Options:** No, Try to stay active, Occasionally, Regularly.
*   **Step 16/20: Hydration**
    *   **Question:** How much water do you drink daily?
    *   **Options:** Coffee/Tea only, <2 glasses, 2-6 glasses, 7-10 glasses, Don't count.
*   **Step 17/20: Bad Habits**
    *   **Question:** Select all that you tend to do.
    *   **Options:** Eat late, Sweets, Soft drinks, Alcohol, Fatty/Salty foods.

## Phase 4: Trust, Processing & Results (Steps 18-20)
Building authority and presenting the solution.

*   **Step 18/20: Dietary Preferences**
    *   **Question:** Do you have any dietary preferences?
    *   **Options:** No preference, Vegetarian, Vegan, Pescatarian, Keto, Gluten-free.
*   **Step 19/20: Science & Trust**
    *   **Title:** "The science behind your personalised weight loss plan"
    *   **Content:** Logos of medical/health organizations.
*   **Step 20/20: Analysis & Calculation**
    *   **Title:** "Analyzing your answers..."
    *   **Content:** 5-second animation simulating data processing (BMI, metabolic rate, hormone profile).
    *   **Action:** Automatically redirects to Timeline page upon completion.

## Phase 5: Results & Conversion (Post-Quiz Flow)
The sequence of pages after the quiz completes.

1.  **Timeline Page (`/timeline`)**
    *   **Content:** Graph showing projected weight loss with the PCOS Reset Method vs. usual journey.
    *   **CTA:** Continue -> Goes to Summary.
2.  **Summary Page (`/summary`)**
    *   **Content:** Results dashboard showing BMI gauge (e.g., "Obese"), Health Risks, and confirmation of inputs.
    *   **CTA:** Continue -> Goes to Email Capture.
3.  **Email Capture (`/email`)**
    *   **Headline:** "Enter your email to see how you can reach [Target Weight]..."
    *   **Fields:** Email address, Privacy checkbox.
    *   **CTA:** Continue -> Goes to Offer.
4.  **Offer Page (`/offer`)**
    *   **Content:** Subscription plans (Monthly, 3-Month, Lifetime) and checkout.

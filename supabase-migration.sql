-- PCOS Reset Method Database Migration
-- This file creates the required tables for the funnel tracking system
-- Run this in your Supabase SQL Editor

-- Create funnel_submissions table
CREATE TABLE IF NOT EXISTS public.funnel_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    ai_analysis TEXT,
    status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'completed', 'purchased')),
    email TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_funnel_submissions_status ON public.funnel_submissions(status);
CREATE INDEX IF NOT EXISTS idx_funnel_submissions_email ON public.funnel_submissions(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_funnel_submissions_created_at ON public.funnel_submissions(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.funnel_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage all rows
CREATE POLICY "Service role can manage all funnel_submissions"
ON public.funnel_submissions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create policy to allow anon users to insert their own submissions
CREATE POLICY "Users can insert their own funnel_submissions"
ON public.funnel_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create policy to allow users to read their own submissions by ID
CREATE POLICY "Users can read their own funnel_submissions"
ON public.funnel_submissions
FOR SELECT
TO anon, authenticated
USING (true);

-- Optional: Create a function to automatically update the answers field
CREATE OR REPLACE FUNCTION update_funnel_submission_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_at = COALESCE(NEW.created_at, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update timestamp
DROP TRIGGER IF EXISTS set_funnel_submission_timestamp ON public.funnel_submissions;
CREATE TRIGGER set_funnel_submission_timestamp
    BEFORE INSERT ON public.funnel_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_funnel_submission_timestamp();

-- Grant necessary permissions
GRANT ALL ON public.funnel_submissions TO service_role;
GRANT INSERT, SELECT ON public.funnel_submissions TO anon;
GRANT INSERT, SELECT ON public.funnel_submissions TO authenticated;

-- Create profiles table if it doesn't exist (for user management)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create subscriptions table if it doesn't exist (for Stripe integration)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT UNIQUE,
    status TEXT,
    plan TEXT,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);

-- Create meal_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    week_number INTEGER,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own meal plans"
ON public.meal_plans
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal plans"
ON public.meal_plans
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create index for meal_plans
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON public.meal_plans(user_id);

-- Grant permissions
GRANT ALL ON public.subscriptions TO service_role;
GRANT SELECT ON public.subscriptions TO authenticated;

GRANT ALL ON public.meal_plans TO service_role;
GRANT SELECT, INSERT ON public.meal_plans TO authenticated;

GRANT ALL ON public.profiles TO service_role;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully! Tables created: funnel_submissions, profiles, subscriptions, meal_plans';
END $$;

-- Database schema for today's tasks
-- Run this in your Supabase SQL editor

-- Create today_tasks table
CREATE TABLE IF NOT EXISTS today_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    estimated_minutes INTEGER DEFAULT 25,
    completed BOOLEAN DEFAULT FALSE,
    priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security (RLS)
ALTER TABLE today_tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only access their own tasks
CREATE POLICY "Users can only access their own tasks" ON today_tasks
    FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS today_tasks_user_id_created_at_idx ON today_tasks(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS today_tasks_user_id_completed_idx ON today_tasks(user_id, completed);
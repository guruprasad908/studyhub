-- Complete StudyHub Database Setup
-- Run these commands in your Supabase SQL Editor

-- 1. Create roadmap_items table (if not exists)
CREATE TABLE IF NOT EXISTS roadmap_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_hours INTEGER DEFAULT 20,
    completed_hours INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('active', 'completed', 'paused')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create today_tasks table (if not exists)
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

-- 3. Create practice_sessions table (if not exists)
CREATE TABLE IF NOT EXISTS practice_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES roadmap_items(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    pomodoro BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE today_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for roadmap_items
DROP POLICY IF EXISTS "Users can only access their own roadmap items" ON roadmap_items;
CREATE POLICY "Users can only access their own roadmap items" ON roadmap_items
    FOR ALL USING (auth.uid() = user_id);

-- 6. Create RLS policies for today_tasks
DROP POLICY IF EXISTS "Users can only access their own tasks" ON today_tasks;
CREATE POLICY "Users can only access their own tasks" ON today_tasks
    FOR ALL USING (auth.uid() = user_id);

-- 7. Create RLS policies for practice_sessions
DROP POLICY IF EXISTS "Users can only access their own practice sessions" ON practice_sessions;
CREATE POLICY "Users can only access their own practice sessions" ON practice_sessions
    FOR ALL USING (auth.uid() = user_id);

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS roadmap_items_user_id_created_at_idx ON roadmap_items(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS roadmap_items_user_id_status_idx ON roadmap_items(user_id, status);

CREATE INDEX IF NOT EXISTS today_tasks_user_id_created_at_idx ON today_tasks(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS today_tasks_user_id_completed_idx ON today_tasks(user_id, completed);

CREATE INDEX IF NOT EXISTS practice_sessions_user_id_created_at_idx ON practice_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS practice_sessions_item_id_created_at_idx ON practice_sessions(item_id, created_at DESC);
CREATE INDEX IF NOT EXISTS practice_sessions_user_id_item_id_idx ON practice_sessions(user_id, item_id);

-- 9. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Create trigger for roadmap_items
DROP TRIGGER IF EXISTS update_roadmap_items_updated_at ON roadmap_items;
CREATE TRIGGER update_roadmap_items_updated_at
    BEFORE UPDATE ON roadmap_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Setup Complete! 
-- Your StudyHub database is now ready with:
-- ✅ User authentication integration
-- ✅ Row Level Security for data privacy
-- ✅ Optimized indexes for performance
-- ✅ Automatic timestamp management
-- ✅ Support for roadmaps, daily tasks, and practice sessions
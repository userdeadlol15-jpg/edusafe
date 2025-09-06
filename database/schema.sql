-- Disaster Preparedness App Database Schema
-- This file contains all the necessary tables for the application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'parent', 'admin')),
    student_id VARCHAR(100),
    parent_of VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE quizzes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    questions JSONB NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz attempts table
CREATE TABLE quiz_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges table
CREATE TABLE user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_type VARCHAR(50) NOT NULL CHECK (badge_type IN ('beginner', 'intermediate', 'advanced', 'expert')),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning videos table
CREATE TABLE learning_videos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('youtube', 'uploaded')),
    url VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL, -- in seconds
    thumbnail VARCHAR(500),
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video progress table
CREATE TABLE video_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES learning_videos(id) ON DELETE CASCADE,
    progress DECIMAL(5,2) NOT NULL DEFAULT 0, -- percentage
    completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, video_id)
);

-- Mock drills table
CREATE TABLE mock_drills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('earthquake', 'fire', 'flood', 'general')),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255) NOT NULL,
    instructions TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drill registrations table
CREATE TABLE drill_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    drill_id UUID REFERENCES mock_drills(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, drill_id)
);

-- Drill attendance table
CREATE TABLE drill_attendance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    drill_id UUID REFERENCES mock_drills(id) ON DELETE CASCADE,
    attended BOOLEAN DEFAULT FALSE,
    marked_by UUID REFERENCES users(id),
    marked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, drill_id)
);

-- Emergency contacts table
CREATE TABLE emergency_contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    department VARCHAR(100) NOT NULL,
    priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 3),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency alerts table
CREATE TABLE emergency_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('emergency', 'warning', 'info')),
    target_roles JSONB, -- array of roles to target
    sent_by UUID REFERENCES users(id),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System settings table
CREATE TABLE system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_video_progress_user_id ON video_progress(user_id);
CREATE INDEX idx_video_progress_video_id ON video_progress(video_id);
CREATE INDEX idx_drill_registrations_user_id ON drill_registrations(user_id);
CREATE INDEX idx_drill_registrations_drill_id ON drill_registrations(drill_id);
CREATE INDEX idx_drill_attendance_user_id ON drill_attendance(user_id);
CREATE INDEX idx_drill_attendance_drill_id ON drill_attendance(drill_id);
CREATE INDEX idx_emergency_contacts_priority ON emergency_contacts(priority);
CREATE INDEX idx_emergency_alerts_sent_at ON emergency_alerts(sent_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_videos_updated_at BEFORE UPDATE ON learning_videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mock_drills_updated_at BEFORE UPDATE ON mock_drills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_contacts_updated_at BEFORE UPDATE ON emergency_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_progress_updated_at BEFORE UPDATE ON video_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO emergency_contacts (name, phone, email, department, priority, description) VALUES
('Emergency Services', '+1-911', 'emergency@school.edu', 'Emergency Response', 1, '24/7 emergency response team'),
('Dr. Sarah Johnson', '+1-555-0101', 'sarah.johnson@school.edu', 'Medical Services', 1, 'Chief Medical Officer'),
('Fire Safety Department', '+1-555-0102', 'firesafety@school.edu', 'Fire Safety', 2, 'Fire prevention and emergency response'),
('Security Office', '+1-555-0103', 'security@school.edu', 'Security', 2, 'Campus security services'),
('Administration Office', '+1-555-0104', 'admin@school.edu', 'Administration', 3, 'General administration'),
('IT Support', '+1-555-0105', 'itsupport@school.edu', 'Information Technology', 3, 'Technical support');

-- Insert sample quizzes
INSERT INTO quizzes (title, description, category, difficulty, questions, created_by) VALUES
('Earthquake Safety Basics', 'Test your knowledge of earthquake safety procedures', 'earthquake', 'easy', 
 '[{"id": 1, "question": "What should you do during an earthquake?", "options": ["Run outside immediately", "Drop, Cover, and Hold On", "Stand in a doorway", "Go to the basement"], "correct_answer": 1, "explanation": "Drop, Cover, and Hold On is the recommended safety procedure during an earthquake."}, {"id": 2, "question": "Where is the safest place to be during an earthquake?", "options": ["Under a table", "In a doorway", "Near windows", "In the kitchen"], "correct_answer": 0, "explanation": "Under a sturdy table provides the best protection from falling objects."}]', 
 (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),

('Fire Prevention Quiz', 'Learn about fire safety and prevention measures', 'fire', 'medium',
 '[{"id": 1, "question": "What is the first thing you should do if you discover a fire?", "options": ["Try to put it out", "Call 911", "Evacuate immediately", "Close all doors"], "correct_answer": 1, "explanation": "Always call 911 first when you discover a fire."}, {"id": 2, "question": "How often should you test smoke detectors?", "options": ["Once a year", "Once a month", "Once a week", "Never"], "correct_answer": 1, "explanation": "Smoke detectors should be tested monthly to ensure they are working properly."}]',
 (SELECT id FROM users WHERE role = 'admin' LIMIT 1));

-- Insert sample learning videos
INSERT INTO learning_videos (title, description, type, url, category, duration, uploaded_by) VALUES
('Earthquake Preparedness Guide', 'Comprehensive guide to earthquake safety and preparedness', 'youtube', 'dQw4w9WgXcQ', 'earthquake', 600, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('Fire Safety Training', 'Learn essential fire safety procedures and prevention', 'youtube', 'dQw4w9WgXcQ', 'fire', 480, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('Flood Preparedness', 'Understanding flood risks and safety measures', 'youtube', 'dQw4w9WgXcQ', 'flood', 720, (SELECT id FROM users WHERE role = 'admin' LIMIT 1));

-- Insert sample mock drills
INSERT INTO mock_drills (title, description, type, scheduled_date, location, instructions, created_by) VALUES
('Earthquake Drill - Building A', 'Comprehensive earthquake preparedness drill', 'earthquake', NOW() + INTERVAL '7 days', 'Building A - Ground Floor', 'Follow evacuation procedures and gather at designated assembly point', (SELECT id FROM users WHERE role = 'teacher' LIMIT 1)),
('Fire Safety Drill - Building B', 'Fire evacuation and safety procedures drill', 'fire', NOW() + INTERVAL '14 days', 'Building B - All Floors', 'Practice fire evacuation routes and use of fire extinguishers', (SELECT id FROM users WHERE role = 'teacher' LIMIT 1));

-- Insert system settings
INSERT INTO system_settings (key, value, description) VALUES
('app_name', '"Disaster Preparedness App"', 'Application name'),
('maintenance_mode', 'false', 'Whether the application is in maintenance mode'),
('max_quiz_attempts', '3', 'Maximum number of quiz attempts per user'),
('video_autoplay', 'false', 'Whether videos should autoplay by default'),
('notification_enabled', 'true', 'Whether push notifications are enabled');

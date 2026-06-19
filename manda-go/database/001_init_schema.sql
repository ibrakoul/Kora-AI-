-- =============================================================
-- MANDA GO — Schéma PostgreSQL Initial
-- Version: 1.0.0 | Production-Ready
-- =============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- =============================================================
-- ENUMS
-- =============================================================
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'paused');
CREATE TYPE subscription_plan AS ENUM ('free', 'plus_monthly', 'plus_yearly', 'family_yearly', 'lifetime');
CREATE TYPE exercise_type AS ENUM ('vocabulary', 'grammar', 'listening', 'speaking', 'writing', 'reading', 'translation');
CREATE TYPE lesson_type AS ENUM ('vocabulary', 'grammar', 'conversation', 'culture', 'review');
CREATE TYPE achievement_type AS ENUM ('streak', 'xp', 'lessons', 'vocabulary', 'pronunciation', 'social', 'special');
CREATE TYPE notification_type AS ENUM ('streak_reminder', 'streak_danger', 'achievement', 'league', 'new_content', 'promotion', 'system');
CREATE TYPE league_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond', 'obsidian', 'dragon', 'legend');
CREATE TYPE ai_conversation_mode AS ENUM ('text', 'voice', 'mixed');
CREATE TYPE transaction_type AS ENUM ('subscription', 'lifetime', 'refund', 'credit');

-- =============================================================
-- TABLES UTILISATEURS
-- =============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    avatar_url TEXT,
    display_name VARCHAR(100),
    role user_role DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMPTZ,
    refresh_token_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interface_language VARCHAR(10) DEFAULT 'fr',
    learning_goal VARCHAR(50),          -- travel, work, culture, relationship, hsk, general
    current_hsk_level SMALLINT DEFAULT 0,
    daily_goal_minutes SMALLINT DEFAULT 15,
    learning_style VARCHAR(20),         -- visual, auditory, kinesthetic, mixed
    timezone VARCHAR(50) DEFAULT 'Europe/Paris',
    country_code VARCHAR(5),
    xp_total INTEGER DEFAULT 0,
    xp_this_week INTEGER DEFAULT 0,
    level SMALLINT DEFAULT 1,
    bio TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    show_in_leaderboard BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- STREAKS
-- =============================================================

CREATE TABLE streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    streak_shields INTEGER DEFAULT 0,
    total_active_days INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- CONTENU PÉDAGOGIQUE
-- =============================================================

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hsk_level SMALLINT NOT NULL CHECK (hsk_level BETWEEN 1 AND 9),
    title VARCHAR(200) NOT NULL,
    title_zh VARCHAR(200),
    description TEXT,
    total_lessons INTEGER DEFAULT 0,
    total_vocabulary INTEGER DEFAULT 0,
    estimated_hours SMALLINT,
    thumbnail_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    order_index SMALLINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    title_zh VARCHAR(200),
    description TEXT,
    type lesson_type NOT NULL,
    content_json JSONB NOT NULL DEFAULT '{}',
    order_index SMALLINT NOT NULL,
    xp_reward SMALLINT DEFAULT 10,
    estimated_minutes SMALLINT DEFAULT 10,
    is_premium BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    type exercise_type NOT NULL,
    question_json JSONB NOT NULL,
    answer_json JSONB NOT NULL,
    hints_json JSONB DEFAULT '[]',
    difficulty SMALLINT DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
    tags TEXT[] DEFAULT '{}',
    xp_reward SMALLINT DEFAULT 2,
    order_index SMALLINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    score SMALLINT,
    accuracy_percent SMALLINT,
    time_spent_seconds INTEGER,
    xp_earned SMALLINT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    attempts INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- =============================================================
-- VOCABULAIRE ET SRS
-- =============================================================

CREATE TABLE vocabulary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hanzi VARCHAR(20) NOT NULL,
    hanzi_traditional VARCHAR(20),
    pinyin VARCHAR(100) NOT NULL,
    meaning_fr TEXT NOT NULL,
    meaning_en TEXT,
    meaning_zh TEXT,
    hsk_level SMALLINT NOT NULL CHECK (hsk_level BETWEEN 1 AND 9),
    stroke_count SMALLINT,
    radical VARCHAR(10),
    stroke_order_json JSONB,
    audio_url TEXT,
    example_sentence_zh TEXT,
    example_sentence_pinyin TEXT,
    example_sentence_fr TEXT,
    frequency_rank INTEGER,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_vocabulary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vocab_id UUID NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
    srs_level SMALLINT DEFAULT 0 CHECK (srs_level BETWEEN 0 AND 8),
    ease_factor DECIMAL(4,2) DEFAULT 2.50,
    interval_days INTEGER DEFAULT 0,
    next_review_at TIMESTAMPTZ DEFAULT NOW(),
    total_reviews INTEGER DEFAULT 0,
    correct_reviews INTEGER DEFAULT 0,
    last_reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, vocab_id)
);

-- =============================================================
-- GAMIFICATION
-- =============================================================

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_zh VARCHAR(100),
    description TEXT NOT NULL,
    icon_url TEXT,
    type achievement_type NOT NULL,
    condition_type VARCHAR(50) NOT NULL,
    condition_value INTEGER NOT NULL,
    xp_reward INTEGER DEFAULT 0,
    is_hidden BOOLEAN DEFAULT FALSE,
    rarity VARCHAR(20) DEFAULT 'common', -- common, rare, epic, legendary
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE leagues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tier league_tier NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    name_zh VARCHAR(50),
    min_rank_in_group SMALLINT,
    max_rank_in_group SMALLINT DEFAULT 30,
    icon_url TEXT,
    color_hex VARCHAR(7),
    is_premium_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE league_seasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    season_number INTEGER NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    prizes_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_league_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    season_id UUID NOT NULL REFERENCES league_seasons(id) ON DELETE CASCADE,
    league_id UUID NOT NULL REFERENCES leagues(id),
    group_number INTEGER NOT NULL,
    current_rank SMALLINT,
    xp_this_season INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, season_id)
);

-- =============================================================
-- INTELLIGENCE ARTIFICIELLE
-- =============================================================

CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID DEFAULT uuid_generate_v4(),
    mode ai_conversation_mode DEFAULT 'text',
    teacher_persona VARCHAR(20) DEFAULT 'mei_mei', -- liu_laoshi, mei_mei, master_chen
    messages_json JSONB DEFAULT '[]',
    total_tokens_used INTEGER DEFAULT 0,
    duration_seconds INTEGER,
    user_hsk_level SMALLINT,
    topic VARCHAR(100),
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pronunciation_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vocab_id UUID REFERENCES vocabulary(id),
    text_zh VARCHAR(500) NOT NULL,
    text_pinyin VARCHAR(500),
    audio_url TEXT NOT NULL,
    overall_score SMALLINT CHECK (overall_score BETWEEN 0 AND 100),
    tone_score SMALLINT CHECK (tone_score BETWEEN 0 AND 100),
    clarity_score SMALLINT CHECK (clarity_score BETWEEN 0 AND 100),
    rhythm_score SMALLINT CHECK (rhythm_score BETWEEN 0 AND 100),
    feedback_json JSONB DEFAULT '{}',
    whisper_transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- MINI-JEUX
-- =============================================================

CREATE TABLE mini_game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_type VARCHAR(50) NOT NULL,
    score INTEGER DEFAULT 0,
    max_score INTEGER,
    accuracy_percent SMALLINT,
    duration_seconds INTEGER,
    difficulty VARCHAR(20) DEFAULT 'medium',
    xp_earned SMALLINT DEFAULT 0,
    level_reached SMALLINT,
    metadata_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- ABONNEMENTS ET PAIEMENTS
-- =============================================================

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan subscription_plan NOT NULL DEFAULT 'free',
    status subscription_status DEFAULT 'active',
    stripe_customer_id VARCHAR(100),
    stripe_subscription_id VARCHAR(100) UNIQUE,
    stripe_price_id VARCHAR(100),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    family_seats INTEGER DEFAULT 1,
    metadata_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    type transaction_type NOT NULL,
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    stripe_payment_intent_id VARCHAR(100),
    stripe_invoice_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    metadata_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- NOTIFICATIONS
-- =============================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    data_json JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    push_enabled BOOLEAN DEFAULT TRUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    streak_reminders BOOLEAN DEFAULT TRUE,
    achievement_alerts BOOLEAN DEFAULT TRUE,
    league_updates BOOLEAN DEFAULT TRUE,
    new_content BOOLEAN DEFAULT TRUE,
    reminder_time TIME DEFAULT '19:00:00',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- INDEX DE PERFORMANCE
-- =============================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- User Profiles
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_xp_total ON user_profiles(xp_total DESC);
CREATE INDEX idx_user_profiles_level ON user_profiles(level DESC);

-- Streaks
CREATE INDEX idx_streaks_user_id ON streaks(user_id);
CREATE INDEX idx_streaks_current ON streaks(current_streak DESC);
CREATE INDEX idx_streaks_last_activity ON streaks(last_activity_date);

-- Lessons
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_order ON lessons(course_id, order_index);

-- Exercises
CREATE INDEX idx_exercises_lesson_id ON exercises(lesson_id);
CREATE INDEX idx_exercises_type ON exercises(type);

-- User Progress
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX idx_user_progress_completed ON user_progress(user_id, completed);

-- Vocabulary
CREATE INDEX idx_vocabulary_hsk_level ON vocabulary(hsk_level);
CREATE INDEX idx_vocabulary_hanzi ON vocabulary USING gin(hanzi gin_trgm_ops);
CREATE INDEX idx_vocabulary_pinyin ON vocabulary(pinyin);

-- User Vocabulary (SRS)
CREATE INDEX idx_user_vocab_user_id ON user_vocabulary(user_id);
CREATE INDEX idx_user_vocab_next_review ON user_vocabulary(user_id, next_review_at);
CREATE INDEX idx_user_vocab_srs_level ON user_vocabulary(user_id, srs_level);

-- AI Conversations
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_created ON ai_conversations(user_id, created_at DESC);

-- Pronunciation
CREATE INDEX idx_pronunciation_user_id ON pronunciation_attempts(user_id);
CREATE INDEX idx_pronunciation_created ON pronunciation_attempts(user_id, created_at DESC);

-- Mini-games
CREATE INDEX idx_mini_games_user_id ON mini_game_sessions(user_id);
CREATE INDEX idx_mini_games_type ON mini_game_sessions(game_type);
CREATE INDEX idx_mini_games_score ON mini_game_sessions(game_type, score DESC);

-- Subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- League
CREATE INDEX idx_league_assignments_season ON user_league_assignments(season_id, group_number);
CREATE INDEX idx_league_assignments_xp ON user_league_assignments(season_id, xp_this_season DESC);

-- =============================================================
-- TRIGGERS
-- =============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile and streak on user creation
CREATE OR REPLACE FUNCTION create_user_defaults()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (user_id) VALUES (NEW.id);
    INSERT INTO streaks (user_id) VALUES (NEW.id);
    INSERT INTO subscriptions (user_id, plan, status) VALUES (NEW.id, 'free', 'active');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_user_created
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_user_defaults();

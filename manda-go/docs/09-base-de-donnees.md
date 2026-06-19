# 09 - Base de Données - Manda Go

## Vue d'ensemble

Manda Go utilise une architecture polyglotte:
- **PostgreSQL 16** (AWS RDS Multi-AZ) : source de vérité relationnelle
- **Redis 7.2** (AWS ElastiCache Cluster) : cache, sessions, temps réel
- **AWS S3** : stockage des fichiers audio et médias

---

## Diagramme ERD (entités et relations)

```
users ──────────────────────────────────────────────────────────────────────
  │  1:1  user_profiles
  │  1:1  streaks
  │  1:N  user_progress (lessons)
  │  1:N  user_vocabulary
  │  1:N  user_achievements
  │  1:N  user_league_history
  │  1:N  ai_conversations
  │  1:N  pronunciation_attempts
  │  1:N  subscriptions
  │  1:N  transactions
  │  1:N  notifications
  │  1:N  mini_game_sessions

courses ────────────────────────────────────────────────────────────────────
  │  1:N  lessons
         │  1:N  exercises

vocabulary ─────────────────────────────────────────────────────────────────
  │  N:M (via user_vocabulary)  users
  │  1:N  pronunciation_attempts

achievements ───────────────────────────────────────────────────────────────
  │  N:M (via user_achievements)  users

leagues ────────────────────────────────────────────────────────────────────
  │  1:N  league_seasons
         │  N:M (via user_league_history)  users
```

---

## Schéma SQL Complet

```sql
-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- Recherche floue
CREATE EXTENSION IF NOT EXISTS "unaccent";       -- Recherche sans accents
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- Hachage sécurisé
CREATE EXTENSION IF NOT EXISTS "btree_gin";      -- Index GIN sur types scalaires

-- ============================================================
-- 1. TABLE: users
-- ============================================================
CREATE TABLE users (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email             VARCHAR(320) NOT NULL,
    email_verified    BOOLEAN NOT NULL DEFAULT FALSE,
    email_verify_token VARCHAR(128),
    username          VARCHAR(30) NOT NULL,
    password_hash     VARCHAR(255),                          -- NULL si OAuth
    avatar_url        VARCHAR(512),
    oauth_provider    VARCHAR(20),                           -- 'google' | 'apple' | 'facebook'
    oauth_id          VARCHAR(128),
    hsk_level         SMALLINT NOT NULL DEFAULT 1 CHECK (hsk_level BETWEEN 1 AND 6),
    xp_total          INTEGER NOT NULL DEFAULT 0 CHECK (xp_total >= 0),
    xp_weekly         INTEGER NOT NULL DEFAULT 0 CHECK (xp_weekly >= 0),
    gems              INTEGER NOT NULL DEFAULT 0 CHECK (gems >= 0),
    hearts            SMALLINT NOT NULL DEFAULT 5 CHECK (hearts BETWEEN 0 AND 5),
    hearts_refill_at  TIMESTAMPTZ,
    premium_until     TIMESTAMPTZ,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    is_banned         BOOLEAN NOT NULL DEFAULT FALSE,
    ban_reason        TEXT,
    last_login_at     TIMESTAMPTZ,
    last_active_at    TIMESTAMPTZ,
    timezone          VARCHAR(64) NOT NULL DEFAULT 'UTC',
    locale            VARCHAR(10) NOT NULL DEFAULT 'fr',
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_username_unique UNIQUE (username),
    CONSTRAINT users_oauth_unique UNIQUE (oauth_provider, oauth_id),
    CONSTRAINT users_username_format CHECK (username ~ '^[a-zA-Z0-9_]{3,30}$')
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_premium ON users (premium_until) WHERE premium_until IS NOT NULL;
CREATE INDEX idx_users_hsk ON users (hsk_level);
CREATE INDEX idx_users_xp ON users (xp_total DESC);
CREATE INDEX idx_users_active ON users (last_active_at DESC) WHERE is_active = TRUE;


-- ============================================================
-- 2. TABLE: user_profiles
-- ============================================================
CREATE TABLE user_profiles (
    user_id               UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name            VARCHAR(50),
    last_name             VARCHAR(50),
    birth_date            DATE,
    bio                   VARCHAR(500),
    mother_tongue         VARCHAR(10) NOT NULL DEFAULT 'fr',
    target_languages      JSONB NOT NULL DEFAULT '["zh"]',
    learning_goals        JSONB NOT NULL DEFAULT '[]',
    learning_style        VARCHAR(20) DEFAULT 'balanced'
                            CHECK (learning_style IN ('visual','auditory','kinesthetic','balanced')),
    daily_goal_minutes    SMALLINT NOT NULL DEFAULT 10
                            CHECK (daily_goal_minutes IN (5, 10, 15, 20, 30)),
    daily_goal_xp         SMALLINT NOT NULL DEFAULT 50,
    preferred_teacher     VARCHAR(20) DEFAULT 'mei_mei'
                            CHECK (preferred_teacher IN ('liu_laoshi','mei_mei','master_chen')),
    notification_enabled  BOOLEAN NOT NULL DEFAULT TRUE,
    reminder_time         TIME DEFAULT '20:00',
    sound_enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    haptic_enabled        BOOLEAN NOT NULL DEFAULT TRUE,
    country               CHAR(2),
    profession            VARCHAR(100),
    why_learning          VARCHAR(500),
    onboarding_completed  BOOLEAN NOT NULL DEFAULT FALSE,
    profile_public        BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_country ON user_profiles (country);
CREATE INDEX idx_user_profiles_goals ON user_profiles USING GIN (learning_goals);


-- ============================================================
-- 3. TABLE: courses
-- ============================================================
CREATE TABLE courses (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug              VARCHAR(80) NOT NULL UNIQUE,
    hsk_level         SMALLINT NOT NULL CHECK (hsk_level BETWEEN 1 AND 6),
    title             VARCHAR(200) NOT NULL,
    title_zh          VARCHAR(200),
    description       TEXT,
    description_zh    TEXT,
    thumbnail_url     VARCHAR(512),
    cover_url         VARCHAR(512),
    total_lessons     SMALLINT NOT NULL DEFAULT 0,
    total_xp          INTEGER NOT NULL DEFAULT 0,
    estimated_hours   DECIMAL(5,1),
    difficulty        VARCHAR(20) NOT NULL DEFAULT 'beginner'
                        CHECK (difficulty IN ('beginner','elementary','intermediate','upper_intermediate','advanced','mastery')),
    tags              JSONB NOT NULL DEFAULT '[]',
    prerequisites     JSONB NOT NULL DEFAULT '[]',
    is_published      BOOLEAN NOT NULL DEFAULT FALSE,
    is_premium        BOOLEAN NOT NULL DEFAULT FALSE,
    order_index       SMALLINT NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_hsk ON courses (hsk_level);
CREATE INDEX idx_courses_published ON courses (is_published, order_index) WHERE is_published = TRUE;
CREATE INDEX idx_courses_tags ON courses USING GIN (tags);


-- ============================================================
-- 4. TABLE: lessons
-- ============================================================
CREATE TABLE lessons (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    title_zh        VARCHAR(200),
    type            VARCHAR(30) NOT NULL
                      CHECK (type IN (
                        'vocabulary','grammar','dialogue','pronunciation',
                        'reading','listening','writing','culture','review','test'
                      )),
    content_json    JSONB NOT NULL DEFAULT '{}',
    description     TEXT,
    xp_reward       SMALLINT NOT NULL DEFAULT 10 CHECK (xp_reward > 0),
    gem_reward      SMALLINT NOT NULL DEFAULT 0,
    order_index     SMALLINT NOT NULL DEFAULT 0,
    duration_est_s  SMALLINT NOT NULL DEFAULT 300,
    is_premium      BOOLEAN NOT NULL DEFAULT FALSE,
    is_published    BOOLEAN NOT NULL DEFAULT FALSE,
    thumbnail_url   VARCHAR(512),
    audio_intro_url VARCHAR(512),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lessons_course ON lessons (course_id, order_index);
CREATE INDEX idx_lessons_type ON lessons (type);
CREATE INDEX idx_lessons_published ON lessons (is_published) WHERE is_published = TRUE;


-- ============================================================
-- 5. TABLE: exercises
-- ============================================================
CREATE TABLE exercises (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id        UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    type             VARCHAR(30) NOT NULL
                       CHECK (type IN (
                         'fill_blank','tone_mark','translation_cn_fr',
                         'translation_fr_cn','reorder','multiple_choice',
                         'dictation','tone_pair','measure_word',
                         'image_match','audio_match','stroke_order',
                         'speaking','free_writing'
                       )),
    question         JSONB NOT NULL,
    correct_answer   JSONB NOT NULL,
    distractors      JSONB,
    hint             TEXT,
    explanation      TEXT,
    explanation_zh   TEXT,
    difficulty       SMALLINT NOT NULL DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5),
    xp_value         SMALLINT NOT NULL DEFAULT 5 CHECK (xp_value > 0),
    time_limit_s     SMALLINT,
    tags             JSONB NOT NULL DEFAULT '[]',
    is_ai_generated  BOOLEAN NOT NULL DEFAULT FALSE,
    order_index      SMALLINT NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exercises_lesson ON exercises (lesson_id, order_index);
CREATE INDEX idx_exercises_type ON exercises (type);
CREATE INDEX idx_exercises_difficulty ON exercises (difficulty);
CREATE INDEX idx_exercises_tags ON exercises USING GIN (tags);


-- ============================================================
-- 6. TABLE: user_progress
-- ============================================================
CREATE TABLE user_progress (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id       UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    status          VARCHAR(20) NOT NULL DEFAULT 'not_started'
                      CHECK (status IN ('not_started','in_progress','completed','mastered')),
    score           SMALLINT CHECK (score BETWEEN 0 AND 100),
    attempts        SMALLINT NOT NULL DEFAULT 0,
    best_score      SMALLINT DEFAULT 0 CHECK (best_score BETWEEN 0 AND 100),
    time_spent_s    INTEGER NOT NULL DEFAULT 0,
    xp_earned       SMALLINT NOT NULL DEFAULT 0,
    mistakes_json   JSONB NOT NULL DEFAULT '[]',
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_progress_unique UNIQUE (user_id, lesson_id)
);

CREATE INDEX idx_user_progress_user ON user_progress (user_id);
CREATE INDEX idx_user_progress_lesson ON user_progress (lesson_id);
CREATE INDEX idx_user_progress_status ON user_progress (user_id, status);
CREATE INDEX idx_user_progress_completed ON user_progress (user_id, completed_at DESC)
    WHERE status = 'completed';


-- ============================================================
-- 7. TABLE: vocabulary
-- ============================================================
CREATE TABLE vocabulary (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hanzi           VARCHAR(20) NOT NULL,
    hanzi_traditional VARCHAR(20),
    pinyin          VARCHAR(60) NOT NULL,
    pinyin_numbers  VARCHAR(60),
    meaning_fr      TEXT NOT NULL,
    meaning_en      TEXT,
    meaning_zh      TEXT,
    hsk_level       SMALLINT NOT NULL CHECK (hsk_level BETWEEN 1 AND 9),
    part_of_speech  VARCHAR(30)
                      CHECK (part_of_speech IN (
                        'noun','verb','adjective','adverb','conjunction',
                        'preposition','particle','measure_word','pronoun',
                        'interjection','numeral','proper_noun','idiom','chengyu'
                      )),
    stroke_count    SMALLINT,
    radical         VARCHAR(5),
    stroke_order_gif_url VARCHAR(512),
    audio_url_male  VARCHAR(512),
    audio_url_female VARCHAR(512),
    image_url       VARCHAR(512),
    example_sentence_zh   TEXT,
    example_sentence_pinyin TEXT,
    example_sentence_fr   TEXT,
    related_words   JSONB DEFAULT '[]',
    synonyms        JSONB DEFAULT '[]',
    antonyms        JSONB DEFAULT '[]',
    measure_words   JSONB DEFAULT '[]',
    frequency_rank  INTEGER,
    tags            JSONB DEFAULT '[]',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT vocabulary_hanzi_unique UNIQUE (hanzi)
);

CREATE INDEX idx_vocab_hsk ON vocabulary (hsk_level);
CREATE INDEX idx_vocab_pinyin ON vocabulary (pinyin);
CREATE INDEX idx_vocab_hanzi ON vocabulary USING GIN (hanzi gin_trgm_ops);
CREATE INDEX idx_vocab_pos ON vocabulary (part_of_speech);
CREATE INDEX idx_vocab_frequency ON vocabulary (frequency_rank);
CREATE INDEX idx_vocab_radical ON vocabulary (radical);


-- ============================================================
-- 8. TABLE: user_vocabulary (SRS)
-- ============================================================
CREATE TABLE user_vocabulary (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vocab_id        UUID NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
    status          VARCHAR(20) NOT NULL DEFAULT 'learning'
                      CHECK (status IN ('new','learning','reviewing','mastered','burned')),
    srs_level       SMALLINT NOT NULL DEFAULT 0 CHECK (srs_level BETWEEN 0 AND 8),
    ease_factor     DECIMAL(3,2) NOT NULL DEFAULT 2.50
                      CHECK (ease_factor BETWEEN 1.30 AND 3.00),
    interval_days   SMALLINT NOT NULL DEFAULT 1 CHECK (interval_days > 0),
    repetitions     SMALLINT NOT NULL DEFAULT 0,
    next_review     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_review     TIMESTAMPTZ,
    last_score      SMALLINT CHECK (last_score BETWEEN 0 AND 5),
    correct_count   INTEGER NOT NULL DEFAULT 0,
    wrong_count     INTEGER NOT NULL DEFAULT 0,
    review_history  JSONB NOT NULL DEFAULT '[]',
    notes           TEXT,
    added_from      VARCHAR(30),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_vocab_unique UNIQUE (user_id, vocab_id)
);

CREATE INDEX idx_user_vocab_user ON user_vocabulary (user_id);
CREATE INDEX idx_user_vocab_review ON user_vocabulary (user_id, next_review)
    WHERE status != 'burned';
CREATE INDEX idx_user_vocab_status ON user_vocabulary (user_id, status);
CREATE INDEX idx_user_vocab_due ON user_vocabulary (next_review)
    WHERE status IN ('learning', 'reviewing');


-- ============================================================
-- 9. TABLE: achievements
-- ============================================================
CREATE TABLE achievements (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug             VARCHAR(80) NOT NULL UNIQUE,
    name             VARCHAR(100) NOT NULL,
    name_zh          VARCHAR(100),
    description      TEXT NOT NULL,
    description_zh   TEXT,
    icon_url         VARCHAR(512),
    icon_emoji       VARCHAR(10),
    category         VARCHAR(30) NOT NULL
                       CHECK (category IN (
                         'streak','xp','lesson','vocabulary','pronunciation',
                         'social','special','seasonal','hsk'
                       )),
    xp_reward        SMALLINT NOT NULL DEFAULT 50,
    gem_reward       SMALLINT NOT NULL DEFAULT 0,
    condition_type   VARCHAR(50) NOT NULL,
    condition_value  INTEGER NOT NULL,
    condition_json   JSONB,
    is_hidden        BOOLEAN NOT NULL DEFAULT FALSE,
    is_active        BOOLEAN NOT NULL DEFAULT TRUE,
    rarity           VARCHAR(20) DEFAULT 'common'
                       CHECK (rarity IN ('common','uncommon','rare','epic','legendary')),
    order_index      SMALLINT NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_achievements_category ON achievements (category);
CREATE INDEX idx_achievements_active ON achievements (is_active) WHERE is_active = TRUE;


-- ============================================================
-- 10. TABLE: user_achievements
-- ============================================================
CREATE TABLE user_achievements (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id  UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    progress        INTEGER NOT NULL DEFAULT 0,
    earned_at       TIMESTAMPTZ,
    notified        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_achievements_unique UNIQUE (user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements (user_id);
CREATE INDEX idx_user_achievements_earned ON user_achievements (user_id, earned_at)
    WHERE earned_at IS NOT NULL;


-- ============================================================
-- 11. TABLE: leagues
-- ============================================================
CREATE TABLE leagues (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug        VARCHAR(30) NOT NULL UNIQUE,
    name        VARCHAR(50) NOT NULL,
    name_zh     VARCHAR(50),
    min_xp      INTEGER NOT NULL DEFAULT 0,
    max_xp      INTEGER,
    icon_url    VARCHAR(512),
    icon_emoji  VARCHAR(10),
    color_hex   CHAR(7) NOT NULL DEFAULT '#808080',
    order_index SMALLINT NOT NULL DEFAULT 0,
    description TEXT,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO leagues (slug, name, name_zh, min_xp, max_xp, icon_emoji, color_hex, order_index) VALUES
('bronze',   'Bronze',   '铜牌',   0,      999,    '🥉', '#CD7F32', 1),
('silver',   'Argent',   '银牌',   1000,   4999,   '🥈', '#C0C0C0', 2),
('gold',     'Or',       '金牌',   5000,   14999,  '🥇', '#FFD700', 3),
('platinum', 'Platine',  '白金',   15000,  49999,  '💎', '#E5E4E2', 4),
('diamond',  'Diamant',  '钻石',   50000,  199999, '💠', '#B9F2FF', 5),
('master',   'Maitre',   '大师',   200000, NULL,   '🏆', '#FF6B6B', 6);


-- ============================================================
-- 12. TABLE: league_seasons
-- ============================================================
CREATE TABLE league_seasons (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    season_name   VARCHAR(50) NOT NULL,
    season_number SMALLINT NOT NULL,
    start_date    DATE NOT NULL,
    end_date      DATE NOT NULL,
    prizes_json   JSONB NOT NULL DEFAULT '{}',
    is_active     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT season_dates CHECK (end_date > start_date),
    CONSTRAINT season_number_unique UNIQUE (season_number)
);

CREATE INDEX idx_season_active ON league_seasons (is_active) WHERE is_active = TRUE;
CREATE INDEX idx_season_dates ON league_seasons (start_date, end_date);


-- ============================================================
-- 13. TABLE: user_league_history
-- ============================================================
CREATE TABLE user_league_history (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    season_id       UUID NOT NULL REFERENCES league_seasons(id) ON DELETE CASCADE,
    league_id       UUID NOT NULL REFERENCES leagues(id),
    rank            INTEGER,
    xp_earned       INTEGER NOT NULL DEFAULT 0,
    promoted        BOOLEAN,
    prizes_claimed  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_season_unique UNIQUE (user_id, season_id)
);

CREATE INDEX idx_user_league_user ON user_league_history (user_id);
CREATE INDEX idx_user_league_season ON user_league_history (season_id, xp_earned DESC);
CREATE INDEX idx_user_league_rank ON user_league_history (season_id, league_id, rank);


-- ============================================================
-- 14. TABLE: ai_conversations
-- ============================================================
CREATE TABLE ai_conversations (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id         VARCHAR(64) NOT NULL,
    teacher_persona    VARCHAR(20) NOT NULL DEFAULT 'mei_mei'
                         CHECK (teacher_persona IN ('liu_laoshi','mei_mei','master_chen')),
    topic              VARCHAR(100),
    hsk_level_at_start SMALLINT,
    messages_json      JSONB NOT NULL DEFAULT '[]',
    total_messages     SMALLINT NOT NULL DEFAULT 0,
    total_tokens       INTEGER NOT NULL DEFAULT 0,
    model_used         VARCHAR(50) NOT NULL DEFAULT 'gpt-4o',
    cost_usd           DECIMAL(8,6),
    user_rating        SMALLINT CHECK (user_rating BETWEEN 1 AND 5),
    is_archived        BOOLEAN NOT NULL DEFAULT FALSE,
    summary            TEXT,
    key_learnings      JSONB DEFAULT '[]',
    started_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at           TIMESTAMPTZ,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_conv_user ON ai_conversations (user_id, created_at DESC);
CREATE INDEX idx_ai_conv_session ON ai_conversations (session_id);


-- ============================================================
-- 15. TABLE: pronunciation_attempts (PARTITIONNÉE)
-- ============================================================
CREATE TABLE pronunciation_attempts (
    id              UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vocab_id        UUID REFERENCES vocabulary(id),
    exercise_id     UUID REFERENCES exercises(id),
    target_text     TEXT NOT NULL,
    target_pinyin   TEXT,
    audio_url       VARCHAR(512),
    transcript      TEXT,
    score_overall   SMALLINT CHECK (score_overall BETWEEN 0 AND 100),
    score_tonal     SMALLINT CHECK (score_tonal BETWEEN 0 AND 100),
    score_phonemic  SMALLINT CHECK (score_phonemic BETWEEN 0 AND 100),
    score_rhythm    SMALLINT CHECK (score_rhythm BETWEEN 0 AND 100),
    score_fluency   SMALLINT CHECK (score_fluency BETWEEN 0 AND 100),
    feedback_json   JSONB,
    model_version   VARCHAR(20),
    processing_ms   SMALLINT,
    passed          BOOLEAN,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE pronunciation_attempts_2025_01
    PARTITION OF pronunciation_attempts
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE pronunciation_attempts_2025_02
    PARTITION OF pronunciation_attempts
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

CREATE TABLE pronunciation_attempts_2025_03
    PARTITION OF pronunciation_attempts
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

CREATE TABLE pronunciation_attempts_default
    PARTITION OF pronunciation_attempts DEFAULT;

CREATE INDEX idx_pronun_user ON pronunciation_attempts (user_id, created_at DESC);
CREATE INDEX idx_pronun_vocab ON pronunciation_attempts (vocab_id) WHERE vocab_id IS NOT NULL;
CREATE INDEX idx_pronun_score ON pronunciation_attempts (user_id, score_overall);


-- ============================================================
-- 16. TABLE: subscriptions
-- ============================================================
CREATE TABLE subscriptions (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id              VARCHAR(50) NOT NULL,
    status               VARCHAR(20) NOT NULL DEFAULT 'active'
                           CHECK (status IN ('active','canceled','past_due','paused','trialing','unpaid')),
    stripe_customer_id   VARCHAR(50),
    stripe_sub_id        VARCHAR(50),
    stripe_price_id      VARCHAR(50),
    current_period_start TIMESTAMPTZ,
    current_period_end   TIMESTAMPTZ,
    trial_start          TIMESTAMPTZ,
    trial_end            TIMESTAMPTZ,
    canceled_at          TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    cancel_reason        VARCHAR(200),
    metadata_json        JSONB DEFAULT '{}',
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions (user_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions (stripe_sub_id) WHERE stripe_sub_id IS NOT NULL;
CREATE INDEX idx_subscriptions_status ON subscriptions (status, current_period_end);
CREATE INDEX idx_subscriptions_expiring ON subscriptions (current_period_end)
    WHERE status = 'active';


-- ============================================================
-- 17. TABLE: transactions (PARTITIONNÉE)
-- ============================================================
CREATE TABLE transactions (
    id                    UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id               UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    type                  VARCHAR(30) NOT NULL
                            CHECK (type IN (
                              'subscription_new','subscription_renewal','subscription_refund',
                              'gem_purchase','one_time_purchase','promo_code','refund'
                            )),
    amount_cents          INTEGER NOT NULL,
    currency              CHAR(3) NOT NULL DEFAULT 'EUR',
    status                VARCHAR(20) NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','completed','failed','refunded','disputed')),
    stripe_payment_intent VARCHAR(80),
    stripe_charge_id      VARCHAR(80),
    stripe_refund_id      VARCHAR(80),
    description           VARCHAR(200),
    metadata_json         JSONB DEFAULT '{}',
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE transactions_2025
    PARTITION OF transactions
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE transactions_2026
    PARTITION OF transactions
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

CREATE TABLE transactions_default
    PARTITION OF transactions DEFAULT;

CREATE INDEX idx_transactions_user ON transactions (user_id, created_at DESC);
CREATE INDEX idx_transactions_stripe ON transactions (stripe_payment_intent)
    WHERE stripe_payment_intent IS NOT NULL;
CREATE INDEX idx_transactions_status ON transactions (status);


-- ============================================================
-- 18. TABLE: notifications
-- ============================================================
CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(40) NOT NULL
                  CHECK (type IN (
                    'daily_reminder','streak_at_risk','streak_broken','streak_record',
                    'achievement_earned','league_promotion','league_demotion',
                    'weekly_recap','lesson_reminder','friend_challenge',
                    'system_announcement','premium_expiring','hearts_refilled'
                  )),
    title       VARCHAR(100) NOT NULL,
    body        TEXT NOT NULL,
    data_json   JSONB DEFAULT '{}',
    read_at     TIMESTAMPTZ,
    sent_at     TIMESTAMPTZ,
    sent_via    JSONB DEFAULT '[]',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notif_user ON notifications (user_id, created_at DESC);
CREATE INDEX idx_notif_unread ON notifications (user_id, read_at)
    WHERE read_at IS NULL;
CREATE INDEX idx_notif_type ON notifications (type, created_at DESC);


-- ============================================================
-- 19. TABLE: mini_game_sessions (PARTITIONNÉE)
-- ============================================================
CREATE TABLE mini_game_sessions (
    id            UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_type     VARCHAR(30) NOT NULL
                    CHECK (game_type IN (
                      'flash_cards','tone_battle','stroke_challenge',
                      'pinyin_puzzle','word_chain','translation_rush',
                      'listening_blitz','memory_match','character_builder'
                    )),
    difficulty    VARCHAR(20) DEFAULT 'medium'
                    CHECK (difficulty IN ('easy','medium','hard','expert')),
    hsk_level     SMALLINT,
    score         INTEGER NOT NULL DEFAULT 0,
    max_score     INTEGER,
    accuracy_pct  DECIMAL(5,2),
    combo_max     SMALLINT NOT NULL DEFAULT 0,
    duration_s    SMALLINT NOT NULL DEFAULT 0,
    xp_earned     SMALLINT NOT NULL DEFAULT 0,
    gems_earned   SMALLINT NOT NULL DEFAULT 0,
    moves_json    JSONB DEFAULT '[]',
    metadata_json JSONB DEFAULT '{}',
    completed     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE mini_game_sessions_2025
    PARTITION OF mini_game_sessions
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE mini_game_sessions_2026
    PARTITION OF mini_game_sessions
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

CREATE TABLE mini_game_sessions_default
    PARTITION OF mini_game_sessions DEFAULT;

CREATE INDEX idx_mini_game_user ON mini_game_sessions (user_id, created_at DESC);
CREATE INDEX idx_mini_game_type ON mini_game_sessions (game_type, score DESC);
CREATE INDEX idx_mini_game_leaderboard ON mini_game_sessions (game_type, difficulty, score DESC)
    WHERE completed = TRUE;


-- ============================================================
-- 20. TABLE: streaks
-- ============================================================
CREATE TABLE streaks (
    user_id             UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak      INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
    longest_streak      INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
    last_activity_date  DATE,
    freeze_count        SMALLINT NOT NULL DEFAULT 0,
    freeze_used_dates   JSONB NOT NULL DEFAULT '[]',
    total_active_days   INTEGER NOT NULL DEFAULT 0,
    streak_history      JSONB NOT NULL DEFAULT '[]',
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_streaks_current ON streaks (current_streak DESC);
CREATE INDEX idx_streaks_last_activity ON streaks (last_activity_date);


-- ============================================================
-- VUES UTILITAIRES
-- ============================================================

CREATE VIEW v_user_stats AS
SELECT
    u.id,
    u.username,
    u.hsk_level,
    u.xp_total,
    u.xp_weekly,
    s.current_streak,
    s.longest_streak,
    s.last_activity_date,
    COALESCE(up_count.completed_lessons, 0) AS completed_lessons,
    COALESCE(uv_count.mastered_vocab, 0) AS mastered_vocab,
    COALESCE(ua_count.achievements_count, 0) AS achievements_count,
    CASE WHEN u.premium_until > NOW() THEN TRUE ELSE FALSE END AS is_premium
FROM users u
LEFT JOIN streaks s ON s.user_id = u.id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS completed_lessons
    FROM user_progress WHERE status = 'completed'
    GROUP BY user_id
) up_count ON up_count.user_id = u.id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS mastered_vocab
    FROM user_vocabulary WHERE status = 'mastered'
    GROUP BY user_id
) uv_count ON uv_count.user_id = u.id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS achievements_count
    FROM user_achievements WHERE earned_at IS NOT NULL
    GROUP BY user_id
) ua_count ON ua_count.user_id = u.id;


-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'users','user_profiles','courses','lessons','exercises',
        'user_progress','vocabulary','user_vocabulary','subscriptions'
    ] LOOP
        EXECUTE format('
            CREATE TRIGGER set_updated_at_%s
            BEFORE UPDATE ON %s
            FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
        ', t, t);
    END LOOP;
END $$;

CREATE OR REPLACE FUNCTION trigger_update_user_xp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        UPDATE users SET xp_total = xp_total + NEW.xp_earned,
                         xp_weekly = xp_weekly + NEW.xp_earned
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_xp
    AFTER INSERT OR UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION trigger_update_user_xp();
```

---

## Index de performance additionnels

```sql
-- Cartes SRS dues (requête haute fréquence)
CREATE INDEX idx_srs_due_cards ON user_vocabulary (user_id, next_review, srs_level)
    WHERE status IN ('learning', 'reviewing')
    INCLUDE (vocab_id, ease_factor, interval_days);

-- Classement hebdomadaire live
CREATE INDEX idx_weekly_leaderboard ON users (xp_weekly DESC, id)
    WHERE is_active = TRUE AND is_banned = FALSE;

-- Autocomplete vocabulaire
CREATE INDEX idx_vocab_hanzi_trgm ON vocabulary USING GIN (hanzi gin_trgm_ops);
CREATE INDEX idx_vocab_pinyin_trgm ON vocabulary USING GIN (pinyin gin_trgm_ops);

-- Vérification premium (chaque appel API)
CREATE INDEX idx_users_premium_check ON users (id, premium_until)
    INCLUDE (is_active, is_banned);

-- Badge notifications non lues
CREATE INDEX idx_notif_badge ON notifications (user_id)
    WHERE read_at IS NULL;

-- Statistiques prononciation dashboard (30 derniers jours)
CREATE INDEX idx_pronun_stats_recent ON pronunciation_attempts (user_id, score_tonal, created_at);
```

---

## Schéma Redis

```
# ============================================================
# SESSIONS UTILISATEUR
# Type: Hash | TTL: 7 jours
# ============================================================

HSET session:{uuid}
    user_id         {uuid}
    email           {string}
    hsk_level       {int}
    is_premium      {0|1}
    refresh_token   {string}
    created_at      {timestamp}
    last_active     {timestamp}
    device_id       {string}
EXPIRE session:{uuid} 604800

# Index inverse: toutes les sessions actives d'un utilisateur
SADD user_sessions:{user_id} {session_id}
EXPIRE user_sessions:{user_id} 604800


# ============================================================
# CACHE DES LEÇONS
# Type: String (JSON) | TTL: 1 heure
# ============================================================

SET lesson:{uuid} {json_content} EX 3600
SET courses:hsk:{level} {json_array} EX 3600
SET vocab:hsk:{level}:list {json_array} EX 7200


# ============================================================
# CLASSEMENTS - SORTED SETS
# ============================================================

# Classement hebdomadaire (réinitialisé chaque lundi à 00:00 UTC)
ZADD leaderboard:weekly {xp_weekly} {user_id}
EXPIREAT leaderboard:weekly {timestamp_prochain_lundi}

# Classement par ligue et saison
ZADD leaderboard:season:{season_id}:league:{league_id} {xp_earned} {user_id}

# Top 3 mini-jeux par type (all-time)
ZADD leaderboard:minigame:{game_type} {score} "{user_id}:{timestamp}"

# Lecture: ZREVRANGE leaderboard:weekly 0 49 WITHSCORES
# Rang d'un utilisateur: ZREVRANK leaderboard:weekly {user_id}


# ============================================================
# RATE LIMITING (fenêtre glissante par minute)
# ============================================================

INCR ratelimit:{user_id}:ai_chat:{minute_bucket}
EXPIRE ratelimit:{user_id}:ai_chat:{minute_bucket} 60

# Limites:
# - /ai/chat:                  30/min (free), 120/min (premium)
# - /ai/pronunciation-check:   20/min
# - /api (général):            300/min
# - /auth/login:               10/min (anti-bruteforce)


# ============================================================
# STREAMING IA (SSE chunks)
# Type: List | TTL: 30 secondes
# ============================================================

LPUSH ai_stream:{session_id} {chunk_json}
EXPIRE ai_stream:{session_id} 30


# ============================================================
# CACHE PROFIL UTILISATEUR (hot data)
# Type: Hash | TTL: 5 minutes
# ============================================================

HSET user_profile:{user_id}
    username        {string}
    hsk_level       {int}
    xp_total        {int}
    xp_weekly       {int}
    current_streak  {int}
    is_premium      {0|1}
    premium_until   {timestamp}
    hearts          {int}
    gems            {int}
    teacher         {string}
EXPIRE user_profile:{user_id} 300


# ============================================================
# SRS - CARTES DUES (pré-calculées toutes les 15 min)
# Type: Set | TTL: 15 minutes
# ============================================================

SADD srs_due:{user_id} {vocab_id_1} {vocab_id_2} ...
EXPIRE srs_due:{user_id} 900


# ============================================================
# STREAKS (accès rapide sans DB)
# Type: Hash | TTL: 24 heures
# ============================================================

HSET streak:{user_id}
    current         {int}
    longest         {int}
    last_date       {YYYY-MM-DD}
    freeze_count    {int}
EXPIRE streak:{user_id} 86400


# ============================================================
# JWT BLACKLIST (tokens révoqués)
# Type: String (tombstone) | TTL = remaining lifetime
# ============================================================

SET jwt_blacklist:{jti} 1 EX {remaining_seconds}


# ============================================================
# PRÉSENCE TEMPS RÉEL (WebSocket heartbeat toutes les 30s)
# Type: Set | TTL: 60 secondes
# ============================================================

SADD ws_online {user_id}
EXPIRE ws_online 60


# ============================================================
# LOCKS DISTRIBUÉS (déduplication webhooks)
# Type: String | TTL: 5 minutes
# ============================================================

SET lock:stripe_webhook:{event_id} 1 NX EX 300
# NX = seulement si n'existe pas (garantit l'unicité)
```

---

## Stratégie de migration et déploiement

```bash
# Outil: node-pg-migrate

# Structure des fichiers de migration:
# migrations/
#   001_initial_schema.sql         (tables core)
#   002_add_vocabulary_index.sql   (optimisations)
#   003_add_partitioning.sql       (partitionnement)
#   004_add_ai_tables.sql          (conversation IA)
#   005_add_redis_schema.sql       (commentaires Redis)

# Règles de migration zero-downtime:
# 1. Migrations additives uniquement (pas de DROP immédiat en prod)
# 2. Stratégie expand/contract pour modifications destructives
# 3. Chaque migration a un fichier .down.sql correspondant
# 4. Test obligatoire sur snapshot RDS avant production

# Backup automatique:
# - RDS automated backup: rétention 30 jours
# - Snapshot manuel avant chaque migration majeure
# - Export S3 mensuel (archivage 7 ans, conformité légale)

# Cron pg_cron pour création automatique des partitions mensuelles:
SELECT cron.schedule(
  'create-monthly-partitions',
  '0 0 25 * *',
  $$ SELECT create_next_month_partitions(); $$
);
```

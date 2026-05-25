-- ============================================================
-- AfriLink Pro — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  headline text,
  bio text,
  avatar_url text,
  cover_url text,
  location text,
  country text,
  account_type text not null default 'professional' check (account_type in ('professional', 'student', 'company', 'freelance')),
  premium_tier text not null default 'free' check (premium_tier in ('free', 'pro', 'business', 'enterprise')),
  is_verified boolean not null default false,
  profile_views integer not null default 0,
  profile_impressions integer not null default 0,
  search_appearances integer not null default 0,
  profile_completion integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- EXPERIENCES
-- ============================================================
create table public.experiences (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  company text not null,
  company_logo text,
  location text,
  work_type text not null default 'on-site' check (work_type in ('on-site', 'hybrid', 'remote')),
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  description text,
  skills text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================
-- EDUCATIONS
-- ============================================================
create table public.educations (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  school_name text not null,
  school_logo text,
  degree text not null,
  field_of_study text not null,
  start_year integer not null,
  end_year integer,
  is_current boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- SKILLS
-- ============================================================
create table public.skills (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  proficiency integer not null default 50 check (proficiency between 0 and 100),
  category text,
  endorsements_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- CERTIFICATIONS
-- ============================================================
create table public.certifications (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  issuer text not null,
  issue_date date not null,
  expiration_date date,
  credential_url text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- LANGUAGES
-- ============================================================
create table public.languages (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  proficiency text not null default 'intermediate' check (proficiency in ('native', 'professional', 'intermediate', 'basic')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- CONNECTIONS
-- ============================================================
create table public.connections (
  id uuid primary key default uuid_generate_v4(),
  requester_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(requester_id, receiver_id)
);

-- ============================================================
-- JOBS
-- ============================================================
create table public.jobs (
  id uuid primary key default uuid_generate_v4(),
  created_by uuid references auth.users(id) on delete set null,
  company_id uuid,
  company_name text not null,
  company_logo text,
  title text not null,
  location text not null,
  country text not null,
  salary_min integer,
  salary_max integer,
  currency text not null default 'FCFA',
  job_type text not null check (job_type in ('CDI', 'CDD', 'Freelance', 'Internship')),
  remote_status text not null default 'on-site' check (remote_status in ('on-site', 'hybrid', 'remote')),
  description text not null,
  skills_required text[] not null default '{}',
  experience_level text,
  category text not null,
  applicants_count integer not null default 0,
  is_featured boolean not null default false,
  deadline date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- JOB APPLICATIONS
-- ============================================================
create table public.job_applications (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid references public.jobs(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'accepted', 'rejected')),
  resume_url text,
  cover_letter text,
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(job_id, user_id)
);

-- ============================================================
-- SAVED JOBS
-- ============================================================
create table public.saved_jobs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id uuid references public.jobs(id) on delete cascade not null,
  saved_at timestamptz not null default now(),
  unique(user_id, job_id)
);

-- ============================================================
-- INTERNSHIPS
-- ============================================================
create table public.internships (
  id uuid primary key default uuid_generate_v4(),
  created_by uuid references auth.users(id) on delete set null,
  company_name text not null,
  company_logo text,
  title text not null,
  location text not null,
  country text not null,
  duration_months integer not null,
  education_level text not null,
  sector text not null,
  is_paid boolean not null default false,
  indemnity_amount integer,
  indemnity_currency text not null default 'FCFA',
  skills_required text[] not null default '{}',
  description text not null,
  deadline date,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- COURSES
-- ============================================================
create table public.courses (
  id uuid primary key default uuid_generate_v4(),
  instructor_id uuid references auth.users(id) on delete set null,
  instructor_name text not null,
  title text not null,
  category text not null,
  description text not null,
  duration_hours integer not null,
  lesson_count integer not null,
  level text not null check (level in ('Beginner', 'Intermediate', 'Advanced')),
  price integer not null,
  original_price integer,
  currency text not null default 'FCFA',
  rating numeric(3,2) not null default 0,
  students_enrolled integer not null default 0,
  thumbnail_url text,
  is_certified boolean not null default false,
  is_bestseller boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- COURSE ENROLLMENTS
-- ============================================================
create table public.course_enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  progress integer not null default 0 check (progress between 0 and 100),
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  certificate_url text,
  unique(user_id, course_id)
);

-- ============================================================
-- TENDERS (APPELS D'OFFRES)
-- ============================================================
create table public.tenders (
  id uuid primary key default uuid_generate_v4(),
  created_by uuid references auth.users(id) on delete set null,
  title text not null,
  client_name text not null,
  client_type text not null check (client_type in ('Government', 'International', 'Private')),
  country text not null,
  budget_amount integer,
  budget_currency text not null default 'FCFA',
  sector text not null,
  description text not null,
  deadline date,
  status text not null default 'open' check (status in ('open', 'urgent', 'closed')),
  documents_count integer not null default 0,
  views_count integer not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- CONVERSATIONS
-- ============================================================
create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  participant_1_id uuid references auth.users(id) on delete cascade not null,
  participant_2_id uuid references auth.users(id) on delete cascade not null,
  last_message_at timestamptz,
  last_message_preview text,
  created_at timestamptz not null default now(),
  unique(participant_1_id, participant_2_id)
);

-- ============================================================
-- MESSAGES
-- ============================================================
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  message_type text not null default 'text' check (message_type in ('text', 'image', 'file', 'video')),
  sent_at timestamptz not null default now(),
  read_at timestamptz
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('job_alert', 'connection_request', 'message', 'post_like', 'mention', 'company_job', 'course', 'achievement')),
  title text not null,
  description text not null,
  related_entity_type text,
  related_entity_id uuid,
  action_url text,
  action_text text,
  sender_id uuid references auth.users(id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- POSTS
-- ============================================================
create table public.posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  post_type text not null default 'text' check (post_type in ('text', 'image', 'video', 'article')),
  media_urls text[] not null default '{}',
  visibility text not null default 'public' check (visibility in ('public', 'connections')),
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  shares_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- POST ENGAGEMENTS
-- ============================================================
create table public.post_engagements (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  engagement_type text not null check (engagement_type in ('like', 'comment', 'share', 'save')),
  content text,
  created_at timestamptz not null default now(),
  unique(post_id, user_id, engagement_type)
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  plan text not null default 'free' check (plan in ('free', 'pro', 'business', 'enterprise')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  start_date timestamptz not null default now(),
  renewal_date timestamptz,
  auto_renew boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_jobs_updated_at before update on public.jobs
  for each row execute procedure public.handle_updated_at();

create trigger handle_courses_updated_at before update on public.courses
  for each row execute procedure public.handle_updated_at();

create trigger handle_posts_updated_at before update on public.posts
  for each row execute procedure public.handle_updated_at();

create trigger handle_connections_updated_at before update on public.connections
  for each row execute procedure public.handle_updated_at();

create trigger handle_subscriptions_updated_at before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- TRIGGER: auto-create profile on user signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, first_name, last_name, email, account_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', 'Utilisateur'),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'account_type', 'professional')
  );

  insert into public.subscriptions (user_id, plan)
  values (new.id, 'free');

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- TRIGGER: update conversation last_message on new message
-- ============================================================
create or replace function public.handle_new_message()
returns trigger as $$
begin
  update public.conversations
  set last_message_at = new.sent_at,
      last_message_preview = left(new.content, 100)
  where id = new.conversation_id;
  return new;
end;
$$ language plpgsql;

create trigger on_new_message
  after insert on public.messages
  for each row execute procedure public.handle_new_message();

-- ============================================================
-- TRIGGER: update jobs applicants_count on new application
-- ============================================================
create or replace function public.handle_new_application()
returns trigger as $$
begin
  update public.jobs set applicants_count = applicants_count + 1 where id = new.job_id;
  return new;
end;
$$ language plpgsql;

create trigger on_new_application
  after insert on public.job_applications
  for each row execute procedure public.handle_new_application();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.experiences enable row level security;
alter table public.educations enable row level security;
alter table public.skills enable row level security;
alter table public.certifications enable row level security;
alter table public.languages enable row level security;
alter table public.connections enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.internships enable row level security;
alter table public.courses enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.tenders enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.posts enable row level security;
alter table public.post_engagements enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles: public read, owner write
create policy "Profiles are publicly readable" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = user_id);

-- Experiences, Educations, Skills, Certifications, Languages: public read, owner write
create policy "Experiences public read" on public.experiences for select using (true);
create policy "Experiences owner write" on public.experiences for all using (
  profile_id in (select id from public.profiles where user_id = auth.uid())
);

create policy "Educations public read" on public.educations for select using (true);
create policy "Educations owner write" on public.educations for all using (
  profile_id in (select id from public.profiles where user_id = auth.uid())
);

create policy "Skills public read" on public.skills for select using (true);
create policy "Skills owner write" on public.skills for all using (
  profile_id in (select id from public.profiles where user_id = auth.uid())
);

create policy "Certifications public read" on public.certifications for select using (true);
create policy "Certifications owner write" on public.certifications for all using (
  profile_id in (select id from public.profiles where user_id = auth.uid())
);

create policy "Languages public read" on public.languages for select using (true);
create policy "Languages owner write" on public.languages for all using (
  profile_id in (select id from public.profiles where user_id = auth.uid())
);

-- Connections: users see their own
create policy "Users see their connections" on public.connections for select using (
  auth.uid() in (
    select user_id from public.profiles where id = requester_id or id = receiver_id
  )
);
create policy "Users manage their connections" on public.connections for all using (
  requester_id in (select id from public.profiles where user_id = auth.uid())
);

-- Jobs: public read, authenticated write
create policy "Jobs public read" on public.jobs for select using (true);
create policy "Authenticated users can post jobs" on public.jobs for insert with check (auth.uid() = created_by);
create policy "Job owners can update" on public.jobs for update using (auth.uid() = created_by);

-- Job applications: users see their own
create policy "Users see own applications" on public.job_applications for select using (auth.uid() = user_id);
create policy "Users apply to jobs" on public.job_applications for insert with check (auth.uid() = user_id);

-- Saved jobs
create policy "Users manage saved jobs" on public.saved_jobs for all using (auth.uid() = user_id);

-- Internships & Courses & Tenders: public read
create policy "Internships public read" on public.internships for select using (true);
create policy "Internships authenticated write" on public.internships for insert with check (auth.uid() = created_by);

create policy "Courses public read" on public.courses for select using (true);
create policy "Courses authenticated write" on public.courses for insert with check (auth.uid() = instructor_id);

create policy "Tenders public read" on public.tenders for select using (true);
create policy "Tenders authenticated write" on public.tenders for insert with check (auth.uid() = created_by);

-- Course enrollments
create policy "Users see own enrollments" on public.course_enrollments for select using (auth.uid() = user_id);
create policy "Users enroll in courses" on public.course_enrollments for insert with check (auth.uid() = user_id);

-- Conversations: participants only
create policy "Participants see conversations" on public.conversations for select using (
  auth.uid() = participant_1_id or auth.uid() = participant_2_id
);
create policy "Authenticated users create conversations" on public.conversations for insert with check (
  auth.uid() = participant_1_id or auth.uid() = participant_2_id
);

-- Messages: conversation participants only
create policy "Participants see messages" on public.messages for select using (
  conversation_id in (
    select id from public.conversations
    where participant_1_id = auth.uid() or participant_2_id = auth.uid()
  )
);
create policy "Participants send messages" on public.messages for insert with check (
  auth.uid() = sender_id and
  conversation_id in (
    select id from public.conversations
    where participant_1_id = auth.uid() or participant_2_id = auth.uid()
  )
);

-- Notifications: user only
create policy "Users see own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- Posts: public read, owner write
create policy "Posts public read" on public.posts for select using (visibility = 'public' or auth.uid() = user_id);
create policy "Authenticated users post" on public.posts for insert with check (auth.uid() = user_id);
create policy "Post owner update" on public.posts for update using (auth.uid() = user_id);
create policy "Post owner delete" on public.posts for delete using (auth.uid() = user_id);

-- Post engagements
create policy "Post engagements visible" on public.post_engagements for select using (true);
create policy "Authenticated users engage" on public.post_engagements for insert with check (auth.uid() = user_id);
create policy "Users remove own engagement" on public.post_engagements for delete using (auth.uid() = user_id);

-- Subscriptions: user only
create policy "Users see own subscription" on public.subscriptions for select using (auth.uid() = user_id);
create policy "Users create own subscription" on public.subscriptions for insert with check (auth.uid() = user_id);
create policy "Users update own subscription" on public.subscriptions for update using (auth.uid() = user_id);

-- ============================================================
-- INDEXES for performance
-- ============================================================
create index idx_profiles_user_id on public.profiles(user_id);
create index idx_jobs_country on public.jobs(country);
create index idx_jobs_category on public.jobs(category);
create index idx_jobs_created_at on public.jobs(created_at desc);
create index idx_posts_user_id on public.posts(user_id);
create index idx_posts_created_at on public.posts(created_at desc);
create index idx_messages_conversation_id on public.messages(conversation_id);
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_connections_requester on public.connections(requester_id);
create index idx_connections_receiver on public.connections(receiver_id);

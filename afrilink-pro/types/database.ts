export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// ── Row types ──────────────────────────────────────────────────────────────

export type ProfileRow = {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  headline: string | null
  bio: string | null
  avatar_url: string | null
  cover_url: string | null
  location: string | null
  country: string | null
  account_type: 'professional' | 'student' | 'company' | 'freelance'
  premium_tier: 'free' | 'pro' | 'business' | 'enterprise'
  is_verified: boolean
  profile_views: number
  profile_impressions: number
  search_appearances: number
  profile_completion: number
  created_at: string
  updated_at: string
}

export type ExperienceRow = {
  id: string
  profile_id: string
  title: string
  company: string
  company_logo: string | null
  location: string | null
  work_type: 'on-site' | 'hybrid' | 'remote'
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string | null
  skills: string[]
  created_at: string
}

export type EducationRow = {
  id: string
  profile_id: string
  school_name: string
  school_logo: string | null
  degree: string
  field_of_study: string
  start_year: number
  end_year: number | null
  is_current: boolean
  created_at: string
}

export type SkillRow = {
  id: string
  profile_id: string
  name: string
  proficiency: number
  category: string | null
  endorsements_count: number
  created_at: string
}

export type CertificationRow = {
  id: string
  profile_id: string
  name: string
  issuer: string
  issue_date: string
  expiration_date: string | null
  credential_url: string | null
  created_at: string
}

export type LanguageRow = {
  id: string
  profile_id: string
  name: string
  proficiency: 'native' | 'professional' | 'intermediate' | 'basic'
  created_at: string
}

export type ConnectionRow = {
  id: string
  requester_id: string
  receiver_id: string
  status: 'pending' | 'accepted' | 'blocked'
  created_at: string
  updated_at: string
}

export type JobRow = {
  id: string
  created_by: string | null
  company_id: string | null
  company_name: string
  company_logo: string | null
  title: string
  location: string
  country: string
  salary_min: number | null
  salary_max: number | null
  currency: string
  job_type: 'CDI' | 'CDD' | 'Freelance' | 'Internship'
  remote_status: 'on-site' | 'hybrid' | 'remote'
  description: string
  skills_required: string[]
  experience_level: string | null
  category: string
  applicants_count: number
  is_featured: boolean
  deadline: string | null
  created_at: string
  updated_at: string
}

export type JobApplicationRow = {
  id: string
  job_id: string
  user_id: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  resume_url: string | null
  cover_letter: string | null
  applied_at: string
  updated_at: string
}

export type SavedJobRow = {
  id: string
  user_id: string
  job_id: string
  saved_at: string
}

export type InternshipRow = {
  id: string
  created_by: string | null
  company_name: string
  company_logo: string | null
  title: string
  location: string
  country: string
  duration_months: number
  education_level: string
  sector: string
  is_paid: boolean
  indemnity_amount: number | null
  indemnity_currency: string
  skills_required: string[]
  description: string
  deadline: string | null
  is_featured: boolean
  created_at: string
}

export type CourseRow = {
  id: string
  instructor_id: string | null
  instructor_name: string
  title: string
  category: string
  description: string
  duration_hours: number
  lesson_count: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: number
  original_price: number | null
  currency: string
  rating: number
  students_enrolled: number
  thumbnail_url: string | null
  is_certified: boolean
  is_bestseller: boolean
  created_at: string
  updated_at: string
}

export type CourseEnrollmentRow = {
  id: string
  user_id: string
  course_id: string
  progress: number
  enrolled_at: string
  completed_at: string | null
  certificate_url: string | null
}

export type TenderRow = {
  id: string
  created_by: string | null
  title: string
  client_name: string
  client_type: 'Government' | 'International' | 'Private'
  country: string
  budget_amount: number | null
  budget_currency: string
  sector: string
  description: string
  deadline: string | null
  status: 'open' | 'urgent' | 'closed'
  documents_count: number
  views_count: number
  is_featured: boolean
  created_at: string
}

export type ConversationRow = {
  id: string
  participant_1_id: string
  participant_2_id: string
  last_message_at: string | null
  last_message_preview: string | null
  created_at: string
}

export type MessageRow = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'image' | 'file' | 'video'
  sent_at: string
  read_at: string | null
}

export type NotificationRow = {
  id: string
  user_id: string
  type: 'job_alert' | 'connection_request' | 'message' | 'post_like' | 'mention' | 'company_job' | 'course' | 'achievement'
  title: string
  description: string
  related_entity_type: string | null
  related_entity_id: string | null
  action_url: string | null
  action_text: string | null
  sender_id: string | null
  is_read: boolean
  created_at: string
}

export type PostRow = {
  id: string
  user_id: string
  content: string
  post_type: 'text' | 'image' | 'video' | 'article'
  media_urls: string[]
  visibility: 'public' | 'connections'
  likes_count: number
  comments_count: number
  shares_count: number
  created_at: string
  updated_at: string
}

export type PostEngagementRow = {
  id: string
  post_id: string
  user_id: string
  engagement_type: 'like' | 'comment' | 'share' | 'save'
  content: string | null
  created_at: string
}

export type SubscriptionRow = {
  id: string
  user_id: string
  plan: 'free' | 'pro' | 'business' | 'enterprise'
  status: 'active' | 'cancelled' | 'expired'
  start_date: string
  renewal_date: string | null
  auto_renew: boolean
  created_at: string
  updated_at: string
}

// ── Database type (for Supabase client) ───────────────────────────────────

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: Omit<ProfileRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ProfileRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      experiences: {
        Row: ExperienceRow
        Insert: Omit<ExperienceRow, 'id' | 'created_at'>
        Update: Partial<Omit<ExperienceRow, 'id' | 'created_at'>>
      }
      educations: {
        Row: EducationRow
        Insert: Omit<EducationRow, 'id' | 'created_at'>
        Update: Partial<Omit<EducationRow, 'id' | 'created_at'>>
      }
      skills: {
        Row: SkillRow
        Insert: Omit<SkillRow, 'id' | 'created_at'>
        Update: Partial<Omit<SkillRow, 'id' | 'created_at'>>
      }
      certifications: {
        Row: CertificationRow
        Insert: Omit<CertificationRow, 'id' | 'created_at'>
        Update: Partial<Omit<CertificationRow, 'id' | 'created_at'>>
      }
      languages: {
        Row: LanguageRow
        Insert: Omit<LanguageRow, 'id' | 'created_at'>
        Update: Partial<Omit<LanguageRow, 'id' | 'created_at'>>
      }
      connections: {
        Row: ConnectionRow
        Insert: Omit<ConnectionRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Pick<ConnectionRow, 'status'>>
      }
      jobs: {
        Row: JobRow
        Insert: Omit<JobRow, 'id' | 'applicants_count' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<JobRow, 'id' | 'created_at' | 'updated_at'>>
      }
      job_applications: {
        Row: JobApplicationRow
        Insert: Omit<JobApplicationRow, 'id' | 'applied_at' | 'updated_at'>
        Update: Partial<Pick<JobApplicationRow, 'status' | 'resume_url' | 'cover_letter'>>
      }
      saved_jobs: {
        Row: SavedJobRow
        Insert: Omit<SavedJobRow, 'id' | 'saved_at'>
        Update: Partial<Pick<SavedJobRow, 'job_id'>>
      }
      internships: {
        Row: InternshipRow
        Insert: Omit<InternshipRow, 'id' | 'created_at'>
        Update: Partial<Omit<InternshipRow, 'id' | 'created_at'>>
      }
      courses: {
        Row: CourseRow
        Insert: Omit<CourseRow, 'id' | 'students_enrolled' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CourseRow, 'id' | 'created_at' | 'updated_at'>>
      }
      course_enrollments: {
        Row: CourseEnrollmentRow
        Insert: Omit<CourseEnrollmentRow, 'id' | 'enrolled_at'>
        Update: Partial<Pick<CourseEnrollmentRow, 'progress' | 'completed_at' | 'certificate_url'>>
      }
      tenders: {
        Row: TenderRow
        Insert: Omit<TenderRow, 'id' | 'views_count' | 'created_at'>
        Update: Partial<Omit<TenderRow, 'id' | 'created_at'>>
      }
      conversations: {
        Row: ConversationRow
        Insert: Omit<ConversationRow, 'id' | 'created_at'>
        Update: Partial<Pick<ConversationRow, 'last_message_at' | 'last_message_preview'>>
      }
      messages: {
        Row: MessageRow
        Insert: Omit<MessageRow, 'id' | 'sent_at'>
        Update: Partial<Pick<MessageRow, 'read_at'>>
      }
      notifications: {
        Row: NotificationRow
        Insert: Omit<NotificationRow, 'id' | 'created_at'>
        Update: Partial<Pick<NotificationRow, 'is_read'>>
      }
      posts: {
        Row: PostRow
        Insert: Omit<PostRow, 'id' | 'likes_count' | 'comments_count' | 'shares_count' | 'created_at' | 'updated_at'>
        Update: Partial<Pick<PostRow, 'content' | 'visibility' | 'likes_count' | 'comments_count' | 'shares_count'>>
      }
      post_engagements: {
        Row: PostEngagementRow
        Insert: Omit<PostEngagementRow, 'id' | 'created_at'>
        Update: Partial<Pick<PostEngagementRow, 'content'>>
      }
      subscriptions: {
        Row: SubscriptionRow
        Insert: Omit<SubscriptionRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Pick<SubscriptionRow, 'plan' | 'status' | 'renewal_date' | 'auto_renew'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// ── Convenience aliases ───────────────────────────────────────────────────

export type Profile = ProfileRow
export type Job = JobRow
export type Internship = InternshipRow
export type Course = CourseRow
export type Tender = TenderRow
export type Message = MessageRow
export type Conversation = ConversationRow
export type Notification = NotificationRow
export type Post = PostRow
export type Connection = ConnectionRow
export type Subscription = SubscriptionRow

export type JobWithSaved = JobRow & { is_saved: boolean }
export type PostWithAuthor = PostRow & { author: ProfileRow }
export type ConversationWithParticipant = ConversationRow & {
  other_participant: ProfileRow
  unread_count: number
}
export type ProfileWithDetails = ProfileRow & {
  experiences: ExperienceRow[]
  educations: EducationRow[]
  skills: SkillRow[]
  certifications: CertificationRow[]
  languages: LanguageRow[]
}

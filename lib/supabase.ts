import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for API routes
export const createServerClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Database types
export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  created_at: string
}

export interface StudyRoom {
  id: string
  name: string
  description?: string
  subject: string
  max_members: number
  is_private: boolean
  features: {
    ai_tutor: boolean
    video_enabled: boolean
    whiteboard_enabled: boolean
    pomodoro_enabled: boolean
  }
  created_by: string
  created_at: string
  invite_code: string
}

export interface Document {
  id: string
  name: string
  file_url: string
  subject: string
  user_id: string
  processing_status: "pending" | "processing" | "completed" | "failed"
  ai_results?: {
    summaries: number
    flashcards: number
    quizzes: number
    key_topics: string[]
  }
  created_at: string
}

export interface ChatMessage {
  id: string
  room_id: string
  user_id: string
  message: string
  message_type: "user" | "ai" | "system"
  created_at: string
  user?: User
}

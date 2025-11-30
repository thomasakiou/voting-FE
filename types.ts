export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'student' | 'admin';
  is_active: boolean;
  created_at: string;
}


export interface Test {
  id: number;
  title: string;
  exam_type_id: number;
  subject_id: number;
  duration_minutes: number;
  question_count: number;
  total_marks: number;
  passing_marks: number;
  is_active: boolean;
  created_by: number;
  created_at: string;
}


export interface Question {
  id: number;
  question_text: string;
  question_image?: string | null;
  question_type: string;
  options?: Record<string, any> | null;
  correct_answer: string;
  explanation?: string | null;
  explanation_image?: string | null;
  year?: number | null;
  exam_type_id: number;
  subject_id: number;
  created_at: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  url: string;
  date: string;
  created_at: string;
  updated_at: string;
}


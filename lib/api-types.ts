// API Type Definitions - Generated from OpenAPI Specification

// ============================================================================
// User Types
// ============================================================================

export interface UserCreate {
  username: string;
  email: string;
  full_name: string;
  role?: string;
  password: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserResponse {
  username: string;
  email: string;
  full_name: string;
  role: string;
  id: number;
  is_active: boolean;
  created_at: string;
}

export interface UserUpdate {
  username?: string | null;
  email?: string | null;
  full_name?: string | null;
  role?: string | null;
  is_active?: boolean | null;
  password?: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export interface BulkUserResponse {
  total_processed: number;
  successful: number;
  failed: number;
  details?: Array<Record<string, any>>;
}

// ============================================================================
// Test Types
// ============================================================================

export interface TestCreate {
  exam_type_id: number;
  subject_id: number;
  duration_minutes: number;
  question_count: number;
}

export interface TestResponse {
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

export interface TestUpdate {
  exam_type_id?: number | null;
  subject_id?: number | null;
  duration_minutes?: number | null;
  question_count?: number | null;
  is_active?: boolean | null;
}

export interface TestWithQuestions extends TestResponse {
  questions: QuestionResponse[];
}

// ============================================================================
// Question Types
// ============================================================================

export interface QuestionCreate {
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
}

export interface QuestionResponse {
  question_text: string;
  question_image?: string | null;
  question_type: string;
  options?: Record<string, any> | null;
  correct_answer: string;
  explanation?: string | null;
  explanation_image?: string | null;
  year?: number | null;
  id: number;
  exam_type_id: number;
  subject_id: number;
  created_at: string;
}

export interface QuestionUpdate {
  question_text?: string | null;
  question_image?: string | null;
  question_type?: string | null;
  options?: Record<string, any> | null;
  correct_answer?: string | null;
  explanation?: string | null;
  explanation_image?: string | null;
  year?: number | null;
}

// ============================================================================
// Public Question Types
// ============================================================================

export interface PublicQuestionCreate {
  subject: string;
  question: string;
  solution?: string | null;
}

export interface PublicQuestionResponse {
  id: number;
  subject: string;
  question: string;
  solution?: string | null;
  created_at: string;
}

export interface PublicQuestionUpdate {
  subject?: string;
  question?: string;
  solution?: string | null;
}

// ============================================================================
// Attempt Types
// ============================================================================

export interface AttemptCreate {
  test_id: number;
}

export interface AttemptResponse {
  id: number;
  user_id: number;
  test_id: number;
  start_time: string;
  end_time?: string | null;
  status: string;
  score?: number | null;
  percentage?: number | null;
  passed?: boolean | null;
  time_taken?: number;
  test?: {
    id: number;
    title: string;
    subject: string;
    total_marks: number;
    passing_marks: number;
  };
}

export interface AnswerSubmit {
  question_id: number;
  answer_text: string;
  time_spent?: number | null;
}

export interface AttemptSubmit {
  attempt_id: number;
  answers: AnswerSubmit[];
}

export interface PracticeAttemptCreate {
  user_id: number;
  subject_id: number;
  exam_type_id: number;
  score: number;
  total_questions: number;
  time_spent: number;
  answers: {
    question_id: number;
    answer_text: string;
    is_correct: boolean;
  }[];
}

// ============================================================================
// Result Types
// ============================================================================

export interface AnswerResult {
  question_id: number;
  question_text: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  marks_obtained: number;
  total_marks: number;
  explanation?: string | null;
}

export interface ResultResponse {
  attempt_id: number;
  user_id: number;
  test_id: number;
  test_title: string;
  start_time: string;
  end_time: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  percentage: number;
  passed: boolean;
  answers: AnswerResult[];
}

export interface ResultSummary {
  attempt_id: number;
  test_title: string;
  score: number;
  percentage: number;
  passed: boolean;
  completed_at: string;
}

// ============================================================================
// Exam Type & Subject Types
// ============================================================================

export interface ExamTypeCreate {
  name: string;
  description?: string | null;
}

export interface ExamTypeResponse {
  name: string;
  description?: string | null;
  id: number;
  created_at: string;
}

export interface ExamTypeUpdate {
  name?: string | null;
  description?: string | null;
}

export interface SubjectCreate {
  name: string;
  description?: string | null;
}

export interface SubjectResponse {
  name: string;
  description?: string | null;
  id: number;
  created_at: string;
}

export interface SubjectUpdate {
  name?: string | null;
  description?: string | null;
}

// ============================================================================
// News Types
// ============================================================================

export interface NewsCreate {
  title: string;
  content: string;
  url: string;
  date: string;
}

export interface NewsResponse {
  title: string;
  content: string;
  url: string;
  date: string;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface NewsUpdate {
  title?: string | null;
  content?: string | null;
  url?: string | null;
  date?: string | null;
}

// ============================================================================
// Forum Types
// ============================================================================

export interface ForumAuthor {
  id: number;
  name: string;
  avatar?: string | null;
}

export interface ForumPostResponse {
  id: number;
  title: string;
  content: string;
  subject: string;
  imageUrl?: string | null;
  likes: number;
  replyCount: number;
  replies?: ForumReplyResponse[] | null;
  author: ForumAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface ForumPostListResponse {
  posts: ForumPostResponse[];
  totalPages: number;
  currentPage: number;
}

export interface ForumReplyCreate {
  content: string;
}

export interface ForumReplyResponse {
  id: number;
  postId: number;
  user: ForumAuthor;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumLikeResponse {
  postId: number;
  likes: number;
  message: string;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

export interface APIError {
  detail?: string;
  message?: string;
}

export interface LeaderboardEntry {
  user_id: number;
  username: string;
  full_name: string | null;
  score: number;
  test_title: string;
  subject_name: string | null;
  date: string;
  is_practice: boolean | null;
}

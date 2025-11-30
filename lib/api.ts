import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type {
    UserCreate,
    UserLogin,
    LoginResponse,
    UserResponse,
    UserUpdate,
    BulkUserResponse,
    TestCreate,
    TestResponse,
    TestUpdate,
    TestWithQuestions,
    QuestionCreate,
    QuestionResponse,
    QuestionUpdate,
    AttemptCreate,
    AttemptResponse,
    AttemptSubmit,
    ResultResponse,
    ResultSummary,
    ExamTypeCreate,
    ExamTypeResponse,
    ExamTypeUpdate,
    SubjectCreate,
    SubjectResponse,
    SubjectUpdate,
    NewsCreate,
    NewsResponse,
    NewsUpdate,
    ForumPostListResponse,
    ForumPostResponse,
    ForumReplyCreate,
    ForumReplyResponse,
    ForumLikeResponse,
    PublicQuestionCreate,
    PublicQuestionResponse,
    PublicQuestionUpdate,
    LeaderboardEntry,
} from './api-types';

// ============================================================================
// API Client Configuration
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

class APIClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = localStorage.getItem('access_token');
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.location.href = '/#/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // ============================================================================
    // Authentication & User Management
    // ============================================================================

    async register(data: UserCreate): Promise<UserResponse> {
        const response = await this.client.post<UserResponse>('/api/v1/users/register', data);
        return response.data;
    }

    async login(data: UserLogin): Promise<LoginResponse> {
        const response = await this.client.post<LoginResponse>('/api/v1/users/login', data);
        return response.data;
    }

    async refreshToken(): Promise<{ access_token: string; token_type: string }> {
        const response = await this.client.post('/api/v1/users/refresh-token');
        return response.data;
    }

    async getAllUsers(skip = 0, limit = 100): Promise<UserResponse[]> {
        const response = await this.client.get<UserResponse[]>('/api/v1/users/', {
            params: { skip, limit },
        });
        return response.data;
    }

    async getUser(userId: number): Promise<UserResponse> {
        const response = await this.client.get<UserResponse>(`/api/v1/users/${userId}`);
        return response.data;
    }

    async updateUser(userId: number, data: UserUpdate): Promise<UserResponse> {
        const response = await this.client.put<UserResponse>(`/api/v1/users/${userId}`, data);
        return response.data;
    }

    async deleteUser(userId: number): Promise<{ message: string }> {
        const response = await this.client.delete(`/api/v1/users/${userId}`);
        return response.data;
    }

    async bulkUploadUsers(file: File): Promise<BulkUserResponse> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await this.client.post<BulkUserResponse>('/api/v1/users/bulk-upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }

    // ============================================================================
    // Test Management
    // ============================================================================

    async createTest(data: TestCreate, createdBy: number): Promise<TestResponse> {
        const response = await this.client.post<TestResponse>('/api/v1/tests/', data, {
            params: { created_by: createdBy },
        });
        return response.data;
    }

    async getTests(skip = 0, limit = 100): Promise<TestResponse[]> {
        const response = await this.client.get<TestResponse[]>('/api/v1/tests/', {
            params: { skip, limit },
        });
        return response.data;
    }

    async getTest(testId: number): Promise<TestResponse> {
        const response = await this.client.get<TestResponse>(`/api/v1/tests/${testId}`);
        return response.data;
    }

    async getTestWithQuestions(testId: number): Promise<TestWithQuestions> {
        const response = await this.client.get<TestWithQuestions>(`/api/v1/tests/${testId}/with-questions`);
        return response.data;
    }

    async updateTest(testId: number, data: TestUpdate): Promise<TestResponse> {
        const response = await this.client.put<TestResponse>(`/api/v1/tests/${testId}`, data);
        return response.data;
    }

    async deleteTest(testId: number): Promise<{ message: string }> {
        const response = await this.client.delete(`/api/v1/tests/${testId}`);
        return response.data;
    }

    async getTestsByExamType(examTypeId: number): Promise<TestResponse[]> {
        const response = await this.client.get<TestResponse[]>(`/api/v1/tests/exam-type/${examTypeId}`);
        return response.data;
    }

    async getTestsBySubject(subjectId: number): Promise<TestResponse[]> {
        const response = await this.client.get<TestResponse[]>(`/api/v1/tests/subject/${subjectId}`);
        return response.data;
    }

    // ============================================================================
    // Question Management
    // ============================================================================

    async createQuestion(data: QuestionCreate): Promise<QuestionResponse> {
        const response = await this.client.post<QuestionResponse>('/api/v1/questions/', data);
        return response.data;
    }

    async getAllQuestions(params?: {
        exam_type_id?: number;
        subject_id?: number;
        year?: number;
        skip?: number;
        limit?: number;
    }): Promise<QuestionResponse[]> {
        const response = await this.client.get<QuestionResponse[]>('/api/v1/questions/', { params });
        return response.data;
    }

    async getQuestion(questionId: number): Promise<QuestionResponse> {
        const response = await this.client.get<QuestionResponse>(`/api/v1/questions/${questionId}`);
        return response.data;
    }

    async updateQuestion(questionId: number, data: QuestionUpdate): Promise<QuestionResponse> {
        const response = await this.client.put<QuestionResponse>(`/api/v1/questions/${questionId}`, data);
        return response.data;
    }

    async deleteQuestion(questionId: number): Promise<{ message: string }> {
        const response = await this.client.delete(`/api/v1/questions/${questionId}`);
        return response.data;
    }

    async getQuestionsByExamTypeAndSubject(
        examTypeId: number,
        subjectId: number,
        year?: number
    ): Promise<QuestionResponse[]> {
        const response = await this.client.get<QuestionResponse[]>(
            `/api/v1/questions/exam-type/${examTypeId}/subject/${subjectId}`,
            { params: year ? { year } : {} }
        );
        return response.data;
    }

    async uploadQuestionImage(questionId: number, file: File): Promise<QuestionResponse> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await this.client.post<QuestionResponse>(
            `/api/v1/questions/${questionId}/upload-question-image`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    }

    async uploadExplanationImage(questionId: number, file: File): Promise<QuestionResponse> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await this.client.post<QuestionResponse>(
            `/api/v1/questions/${questionId}/upload-explanation-image`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    }

    async deleteQuestionImage(questionId: number): Promise<{ message: string }> {
        const response = await this.client.delete(`/api/v1/questions/${questionId}/question-image`);
        return response.data;
    }

    async deleteExplanationImage(questionId: number): Promise<{ message: string }> {
        const response = await this.client.delete(`/api/v1/questions/${questionId}/explanation-image`);
        return response.data;
    }

    async createBulkQuestions(questions: QuestionCreate[]): Promise<QuestionResponse[]> {
        const response = await this.client.post<QuestionResponse[]>('/api/v1/questions/bulk', questions);
        return response.data;
    }

    // ============================================================================
    // Public Question Management
    // ============================================================================

    async createPublicQuestion(data: PublicQuestionCreate): Promise<PublicQuestionResponse> {
        const response = await this.client.post<PublicQuestionResponse>('/api/v1/public-questions/', data);
        return response.data;
    }

    async getAllPublicQuestions(params?: {
        subject?: string;
        skip?: number;
        limit?: number;
    }): Promise<PublicQuestionResponse[]> {
        const response = await this.client.get<PublicQuestionResponse[]>('/api/v1/public-questions/', { params });
        return response.data;
    }

    async getPublicQuestion(questionId: number): Promise<PublicQuestionResponse> {
        const response = await this.client.get<PublicQuestionResponse>(`/api/v1/public-questions/${questionId}`);
        return response.data;
    }

    async updatePublicQuestion(questionId: number, data: PublicQuestionUpdate): Promise<PublicQuestionResponse> {
        const response = await this.client.put<PublicQuestionResponse>(`/api/v1/public-questions/${questionId}`, data);
        return response.data;
    }

    async deletePublicQuestion(questionId: number): Promise<{ message: string }> {
        const response = await this.client.delete(`/api/v1/public-questions/${questionId}`);
        return response.data;
    }

    // ============================================================================
    // Attempt Management
    // ============================================================================

    async startAttempt(data: AttemptCreate, userId: number): Promise<AttemptResponse> {
        const response = await this.client.post<AttemptResponse>('/api/v1/attempts/start', data, {
            params: { user_id: userId },
        });
        return response.data;
    }

    async submitAttempt(data: AttemptSubmit): Promise<ResultResponse> {
        const response = await this.client.post<ResultResponse>('/api/v1/attempts/submit', data);
        return response.data;
    }

    async submitPracticeAttempt(data: import('./api-types').PracticeAttemptCreate): Promise<AttemptResponse> {
        const response = await this.client.post<AttemptResponse>('/api/v1/attempts/practice', data);
        return response.data;
    }

    async getUserAttempts(userId: number): Promise<AttemptResponse[]> {
        const response = await this.client.get<AttemptResponse[]>(`/api/v1/attempts/user/${userId}`);
        return response.data;
    }

    async getAttempt(attemptId: number): Promise<AttemptResponse> {
        const response = await this.client.get<AttemptResponse>(`/api/v1/attempts/${attemptId}`);
        return response.data;
    }

    // ============================================================================
    // Results
    // ============================================================================

    async getAttemptResult(attemptId: number): Promise<ResultResponse> {
        const response = await this.client.get<ResultResponse>(`/api/v1/results/attempt/${attemptId}`);
        return response.data;
    }

    async getUserResults(userId: number): Promise<ResultSummary[]> {
        const response = await this.client.get<ResultSummary[]>(`/api/v1/results/user/${userId}`);
        return response.data;
    }

    async getTestAnalytics(testId: number): Promise<any> {
        const response = await this.client.get(`/api/v1/results/test/${testId}/analytics`);
        return response.data;
    }

    // ============================================================================
    // Exam Types & Subjects
    // ============================================================================

    async createExamType(data: ExamTypeCreate): Promise<ExamTypeResponse> {
        const response = await this.client.post<ExamTypeResponse>('/api/v1/exam-types/', data);
        return response.data;
    }

    async getExamTypes(skip = 0, limit = 100): Promise<ExamTypeResponse[]> {
        const response = await this.client.get<ExamTypeResponse[]>('/api/v1/exam-types/', {
            params: { skip, limit },
        });
        return response.data;
    }

    async getExamType(examTypeId: number): Promise<ExamTypeResponse> {
        const response = await this.client.get<ExamTypeResponse>(`/api/v1/exam-types/${examTypeId}`);
        return response.data;
    }

    async updateExamType(examTypeId: number, data: ExamTypeUpdate): Promise<ExamTypeResponse> {
        const response = await this.client.put<ExamTypeResponse>(`/api/v1/exam-types/${examTypeId}`, data);
        return response.data;
    }

    async deleteExamType(examTypeId: number): Promise<{ message: string }> {
        const response = await this.client.delete(`/api/v1/exam-types/${examTypeId}`);
        return response.data;
    }

    async getSubjects(): Promise<SubjectResponse[]> {
        const response = await this.client.get<SubjectResponse[]>('/api/v1/subjects/');
        return response.data;
    }

    async createSubject(data: SubjectCreate): Promise<SubjectResponse> {
        const response = await this.client.post<SubjectResponse>('/api/v1/subjects/', data);
        return response.data;
    }

    async getSubject(subjectId: number): Promise<SubjectResponse> {
        const response = await this.client.get<SubjectResponse>(`/api/v1/subjects/${subjectId}`);
        return response.data;
    }

    async updateSubject(subjectId: number, data: SubjectUpdate): Promise<SubjectResponse> {
        const response = await this.client.put<SubjectResponse>(`/api/v1/subjects/${subjectId}`, data);
        return response.data;
    }

    async deleteSubject(subjectId: number): Promise<{ message: string }> {
        const response = await this.client.delete(`/api/v1/subjects/${subjectId}`);
        return response.data;
    }

    // ============================================================================
    // News
    // ============================================================================

    async createNews(data: NewsCreate): Promise<NewsResponse> {
        const response = await this.client.post<NewsResponse>('/api/v1/news/', data);
        return response.data;
    }

    async getNews(skip = 0, limit = 100): Promise<NewsResponse[]> {
        const response = await this.client.get<NewsResponse[]>('/api/v1/news/', {
            params: { skip, limit },
        });
        return response.data;
    }

    async getNewsItem(newsId: number): Promise<NewsResponse> {
        const response = await this.client.get<NewsResponse>(`/api/v1/news/${newsId}`);
        return response.data;
    }

    async updateNews(newsId: number, data: NewsUpdate): Promise<NewsResponse> {
        const response = await this.client.put<NewsResponse>(`/api/v1/news/${newsId}`, data);
        return response.data;
    }

    async deleteNews(newsId: number): Promise<void> {
        await this.client.delete(`/api/v1/news/${newsId}`);
    }

    // ============================================================================
    // Forum
    // ============================================================================

    async getForumPosts(params: {
        subject: string;
        page?: number;
        limit?: number;
        sort?: string;
    }): Promise<ForumPostListResponse> {
        const response = await this.client.get<ForumPostListResponse>('/api/v1/forum/posts', { params });
        return response.data;
    }

    async createForumPost(data: {
        title: string;
        content: string;
        subject: string;
        image?: File;
    }): Promise<ForumPostResponse> {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('subject', data.subject);
        if (data.image) {
            formData.append('image', data.image);
        }
        const response = await this.client.post<ForumPostResponse>('/api/v1/forum/posts', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }

    async likeForumPost(postId: number): Promise<ForumLikeResponse> {
        const response = await this.client.post<ForumLikeResponse>(`/api/v1/forum/posts/${postId}/like`);
        return response.data;
    }

    async createForumReply(postId: number, data: ForumReplyCreate): Promise<ForumReplyResponse> {
        const response = await this.client.post<ForumReplyResponse>(`/api/v1/forum/posts/${postId}/replies`, data);
        return response.data;
    }

    async getForumReplies(postId: number): Promise<ForumReplyResponse[]> {
        const response = await this.client.get<ForumReplyResponse[]>(`/api/v1/forum/posts/${postId}/replies`);
        return response.data;
    }

    async getLeaderboard(): Promise<LeaderboardEntry[]> {
        const response = await this.client.get<LeaderboardEntry[]>('/api/v1/attempts/leaderboard/top');
        return response.data;
    }
}

// Export singleton instance
export const api = new APIClient();
export default api;

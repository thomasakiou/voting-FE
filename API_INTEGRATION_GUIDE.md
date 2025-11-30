# MyExamPadi API Integration Guide

## Quick Start

### 1. Environment Setup
Create a `.env.local` file in the project root:
```
VITE_API_BASE_URL=https://vmi2848672.contaboserver.net/cbt
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

---

## API Client Usage

### Import the API Client
```typescript
import api from './api';
import type { TestResponse, UserResponse } from './api-types';
```

### Example: Fetch Data
```typescript
const tests = await api.getTests();
const user = await api.getUser(userId);
const news = await api.getNews(0, 10);
```

### Example: Create Data
```typescript
const newTest = await api.createTest({
  exam_type_id: 1,
  subject_id: 2,
  duration_minutes: 60,
  question_count: 50
}, createdByUserId);
```

### Example: Update Data
```typescript
const updated = await api.updateUser(userId, {
  full_name: "New Name"
});
```

### Example: Upload Files
```typescript
const file = event.target.files[0];
const question = await api.uploadQuestionImage(questionId, file);
```

---

## Authentication

### Using the Auth Hook
```typescript
import { useAuth } from './auth-context';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ username: 'user', password: 'pass' });
      // User is now logged in
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.full_name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Protected Routes
```typescript
import { ProtectedRoute } from './auth-context';

<Route path="/student" element={
  <ProtectedRoute requiredRole="student">
    <StudentLayout />
  </ProtectedRoute>
} />
```

---

## Common Patterns

### Loading & Error States
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await api.getTests();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
return <DataDisplay data={data} />;
```

### Form Submission
```typescript
const [formData, setFormData] = useState({ title: '', content: '' });
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  
  try {
    await api.createNews(formData);
    // Success - redirect or show message
  } catch (error) {
    // Handle error
  } finally {
    setSubmitting(false);
  }
};
```

---

## API Endpoints Quick Reference

### Users
- `api.register(data)` - Register new user
- `api.login(credentials)` - Login
- `api.getAllUsers(skip, limit)` - List users
- `api.getUser(id)` - Get user
- `api.updateUser(id, data)` - Update user
- `api.deleteUser(id)` - Delete user

### Tests
- `api.getTests(skip, limit)` - List tests
- `api.getTest(id)` - Get test
- `api.getTestWithQuestions(id)` - Get test with questions
- `api.createTest(data, createdBy)` - Create test
- `api.updateTest(id, data)` - Update test
- `api.deleteTest(id)` - Delete test

### Attempts & Results
- `api.startAttempt(data, userId)` - Start attempt
- `api.submitAttempt(data)` - Submit answers
- `api.getUserAttempts(userId)` - Get user attempts
- `api.getAttemptResult(attemptId)` - Get result
- `api.getUserResults(userId)` - Get user results

### Questions
- `api.getAllQuestions(params)` - List questions
- `api.createQuestion(data)` - Create question
- `api.updateQuestion(id, data)` - Update question
- `api.deleteQuestion(id)` - Delete question
- `api.uploadQuestionImage(id, file)` - Upload image
- `api.uploadExplanationImage(id, file)` - Upload image

### Exam Types & Subjects
- `api.getExamTypes()` - List exam types
- `api.getSubjects()` - List subjects
- `api.createExamType(data)` - Create exam type
- `api.createSubject(data)` - Create subject

### News
- `api.getNews(skip, limit)` - List news
- `api.createNews(data)` - Create news
- `api.updateNews(id, data)` - Update news
- `api.deleteNews(id)` - Delete news

### Forum
- `api.getForumPosts(params)` - List posts
- `api.createForumPost(data)` - Create post
- `api.likeForumPost(id)` - Like post
- `api.createForumReply(postId, data)` - Create reply
- `api.getForumReplies(postId)` - List replies

---

## TypeScript Types

All API types are available in `api-types.ts`:
- `UserResponse`, `UserCreate`, `UserUpdate`
- `TestResponse`, `TestCreate`, `TestUpdate`
- `QuestionResponse`, `QuestionCreate`, `QuestionUpdate`
- `AttemptResponse`, `ResultResponse`
- `NewsResponse`, `NewsCreate`, `NewsUpdate`
- `ForumPostResponse`, `ForumReplyResponse`
- And many more...

---

## Error Handling

The API client automatically:
- Injects JWT tokens into requests
- Redirects to login on 401 errors
- Throws errors that can be caught with try/catch

```typescript
try {
  const data = await api.someEndpoint();
} catch (error: any) {
  if (error.response?.status === 404) {
    // Handle not found
  } else if (error.response?.status === 403) {
    // Handle forbidden
  } else {
    // Handle other errors
  }
}
```

---

## Next Implementation Steps

1. **Student Dashboard**: Fetch and display user attempts and results
2. **Test Selection**: List available tests with filters
3. **Test Taking**: Start attempt, display questions, submit answers
4. **Test Results**: Show detailed results with correct/incorrect answers
5. **Admin Pages**: Implement CRUD operations for all admin features

Follow the patterns shown in the authentication and news integration!


# MyExamPadi – Product Requirements Document (PRD)

## 1. Product Overview
MyExamPadi is a smart Computer-Based Testing (CBT) and learning platform for Nigerian students preparing for WAEC, NECO, and JAMB.  
The platform provides: practice tests, classroom learning content, exam news, a discussion forum, performance analytics, and affiliate monetization.

---

## 2. Goals & Objectives
- Provide students with real CBT exam experience.
- Offer subject learning materials (formulas, definitions, audio, video).
- Deliver exam news updates.
- Enable community interaction via forum.
- Monetize via affiliate content.
- Support administrative exam and content management.

---

## 3. User Roles
### 3.1 Student
- Register / Login
- Take tests
- View results
- Access classroom content
- Participate in forum

### 3.2 Admin
- Manage users
- Create questions, tests, subjects
- Upload question images
- Manage news
- View analytics

---

## 4. System Architecture
### Frontend:
- Web & Mobile UI
- JWT Authentication
- REST API Integration

### Backend:
- FastAPI
- JWT Authentication
- PostgreSQL
- Image Upload
- News, Forum, CBT Engine

---

## 5. Public Pages (Unauthenticated)
### 5.1 Home Page
- Hero Banner
- About MyExamPadi
- WAEC / NECO / JAMB Info Cards
- Affiliate Cards
- Latest News Section

### 5.2 Classroom Page
- Subject Cards
- No login required

### 5.3 Subject Page
Tabs:
- Formulas
- Definitions
- Quotes
- Videos
- Audio lessons

---

## 6. Authenticated Pages
### 6.1 Authentication Pages
- Login
- Register
- Token Refresh

### 6.2 Dashboard
- Attempt stats
- Scores
- Graphs

### 6.3 Test Flow
- Exam selection
- Real-time exam interface
- Timer
- Navigation
- Submit

### 6.4 Results Page
- Score
- Pass/Fail
- Analytics per question

### 6.5 Forum
- Post creation
- Replies
- Likes
- Subjects

### 6.6 Profile
- Name update
- Password change
- Logout

---

## 7. Admin Pages
### User Management
- View users
- Bulk upload
- Activate/Deactivate

### Subject Management
- CRUD subjects

### Exam Type Management
- WAEC, NECO, JAMB

### Question Management
- CRUD questions
- Upload images
- Explanation editing

### News Module
- Create news
- Update/delete

### Analytics Dashboard
- Student count
- Tests attempted
- Pass rate

---

## 8. API Endpoints Summary

### Authentication
- POST /api/v1/users/register
- POST /api/v1/users/login
- POST /api/v1/users/refresh-token

### CBT Engine
- POST /api/v1/tests
- GET /api/v1/tests
- POST /api/v1/attempts/start
- POST /api/v1/attempts/submit
- GET /api/v1/results/user/{user_id}

### Classroom
- GET /api/v1/subjects
- GET /api/v1/questions/subject/{id}

### Forum
- GET /api/v1/forum/posts
- POST /api/v1/forum/posts
- POST /api/v1/forum/posts/{id}/like

### News
- GET /api/v1/news

---

## 9. Features Specification

### Tests
- Auto shuffle questions
- Scoring engine
- Pass/fail logic

### Results
- Score calculation
- Correct answer review
- Analytics

### Classroom
- Static formulas
- Media playback

### Monetization
- Affiliate cards
- Sponsored content placement

---

## 10. Design Guidelines
- Mobile-first
- Performance optimized
- Simple navigation
- Card-based UI
- Dark mode optional

---

## 11. Non-Functional Requirements
- Security: JWT authentication
- Performance: API < 2 seconds
- Availability: 99%
- Scalability: Handle up to 100k users
- Compatibility: Chrome, Firefox, Edge, Mobile browsers

---

## 12. Risks
- API misuse
- Poor connectivity
- Content management load

Mitigations:
- CDN caching
- Error handling
- Content moderation tools

---

## 13. Future Enhancements
- AI tutor
- Offline mode
- School dashboard
- Subscription model

---

## 14. Success Metrics
- User registrations
- Daily active users
- Test attempts
- Forum engagement
- Affiliate clicks

---

## 15. Approval
Prepared by: MyExamPadi Product Team  
Date: 2025

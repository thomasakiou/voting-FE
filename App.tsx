import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './auth-context';
import { StudentStatsProvider } from './contexts/StudentStatsContext';
import { PublicLayout, StudentLayout, AdminLayout } from './components/Layouts';
import { Login, Signup } from './pages/AuthPages';
import { LandingPage, ContactPage, PrivacyPage, TermsPage } from './pages/PublicPages';
import { PublicForumPage } from './pages/PublicForumPage';
import { PublicQuestionsPage } from './pages/PublicQuestionsPage';
import { PublicNewsPage } from './pages/PublicNewsPage';
import { ExamsPage } from './pages/ExamsPage';
import { VideoPage } from './pages/VideoPage';
import { Dashboard, Classroom, SubjectDetail, Forum, Profile } from './pages/StudentPages';
import { TestSelection, TestInterface, TestResults, PracticeTestInterface, PracticeTestResult } from './pages/TestPages';
import { AdminDashboard, AdminQuestions, AdminNews, AdminUsers, AdminExams, AdminPublicQuestions, AdminSettings } from './pages/AdminPages';

const App: React.FC = () => {
  console.log('API_BASE_URL:', import.meta.env.VITE_API_BASE_URL || '/api');

  // Prevent BFCache issues (Back button showing cached authenticated state)
  React.useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <StudentStatsProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/questions" element={<PublicQuestionsPage />} />
              <Route path="/forum" element={<PublicForumPage />} />
              <Route path="/news" element={<PublicNewsPage />} />
              <Route path="/exams" element={<ExamsPage />} />
              <Route path="/videos" element={<VideoPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Route>

            {/* Student Routes - Protected */}
            <Route path="/student" element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="classroom" element={<Classroom />} />
              <Route path="classroom/:subjectId" element={<SubjectDetail />} />
              <Route path="forum" element={<Forum />} />
              <Route path="profile" element={<Profile />} />
              <Route path="tests" element={<TestSelection />} />
              <Route path="test/:id" element={<TestInterface />} />
              <Route path="result/:id" element={<TestResults />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Standalone Student Routes (Full Screen) - Protected */}
            <Route path="/student/practice-test" element={
              <ProtectedRoute requiredRole="student">
                <PracticeTestInterface />
              </ProtectedRoute>
            } />
            <Route path="/student/practice-result" element={
              <ProtectedRoute requiredRole="student">
                <PracticeTestResult />
              </ProtectedRoute>
            } />

            {/* Admin Routes - Protected */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="public-questions" element={<AdminPublicQuestions />} />
              <Route path="exams" element={<AdminExams />} />
              <Route path="questions" element={<AdminQuestions />} />
              <Route path="news" element={<AdminNews />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </StudentStatsProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

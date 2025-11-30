import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAuth } from '../auth-context';
import api from '../lib/api';
import type { ExamTypeResponse, SubjectResponse, TestResponse } from '../lib/api-types';

// --- Test Selection ---

export const TestSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [examTypes, setExamTypes] = useState<ExamTypeResponse[]>([]);
  const [allSubjects, setAllSubjects] = useState<SubjectResponse[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<SubjectResponse[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [creating, setCreating] = useState(false);

  // Selection State
  const [selectedExamType, setSelectedExamType] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [duration, setDuration] = useState<number>(30);
  const [year, setYear] = useState<number | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(20);

  // Cache for questions to avoid repeated API calls
  const [cachedQuestions, setCachedQuestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [examTypesData, subjectsData] = await Promise.all([
          api.getExamTypes(),
          api.getSubjects(),
        ]);
        setExamTypes(examTypesData);
        setAllSubjects(subjectsData);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // When Exam Type changes, fetch questions to find available subjects
  useEffect(() => {
    const fetchAvailableSubjects = async () => {
      if (!selectedExamType) {
        setAvailableSubjects([]);
        setCachedQuestions([]);
        return;
      }

      setLoadingSubjects(true);
      setSelectedSubject(null); // Reset subject
      setYear(null); // Reset year
      setAvailableYears([]);

      try {
        // Fetch a batch of questions for this exam type to determine availability
        // We limit to 500 to get a representative sample without overloading
        const questions = await api.getAllQuestions({
          exam_type_id: selectedExamType,
          limit: 500
        });

        setCachedQuestions(questions);

        // Extract unique subject IDs
        const subjectIds = new Set(questions.map(q => q.subject_id));

        // Filter allSubjects to only those with questions
        const filtered = allSubjects.filter(s => subjectIds.has(s.id));
        setAvailableSubjects(filtered);

      } catch (error) {
        console.error('Failed to fetch available subjects:', error);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchAvailableSubjects();
  }, [selectedExamType, allSubjects]);

  // When Subject changes, find available years from cached questions
  useEffect(() => {
    if (!selectedSubject || !selectedExamType) {
      setAvailableYears([]);
      setYear(null);
      return;
    }

    setLoadingYears(true);

    // Filter cached questions for this subject
    const subjectQuestions = cachedQuestions.filter(q => q.subject_id === selectedSubject);

    // Extract unique years
    const years = new Set(
      subjectQuestions
        .map(q => q.year)
        .filter((y): y is number => typeof y === 'number')
    );
    const sortedYears = Array.from(years).sort((a, b) => Number(b) - Number(a));

    setAvailableYears(sortedYears);
    if (sortedYears.length > 0) {
      setYear(sortedYears[0]);
    } else {
      setYear(null);
    }

    setLoadingYears(false);

  }, [selectedSubject, cachedQuestions]);


  const handleStartTest = async () => {
    if (!selectedExamType || !selectedSubject || !user) {
      alert('Please select an exam type and subject.');
      return;
    }

    setCreating(true);
    try {
      // Fetch questions based on selection
      const params: any = {
        exam_type_id: selectedExamType,
        subject_id: selectedSubject,
        limit: questionCount,
      };
      if (year) params.year = year;

      // We want random questions, but the API might not support 'random' sort directly
      // If the API supports it, add sort: 'random'
      // For now, we fetch and shuffle client-side if needed, or rely on API default
      const questions = await api.getAllQuestions(params);

      if (questions.length === 0) {
        alert('No questions found matching your criteria. Please try different selections.');
        setCreating(false);
        return;
      }

      // Shuffle questions (Fisher-Yates algorithm)
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }

      // Navigate to a new practice test interface, passing questions and duration
      navigate('/student/practice-test', {
        state: {
          questions: questions,
          duration: duration,
          examTypeName: examTypes.find(e => e.id === selectedExamType)?.name,
          subjectName: allSubjects.find(s => s.id === selectedSubject)?.name,
          year: year,
        }
      });

    } catch (error: any) {
      console.error('Failed to fetch questions:', error);
      alert(error.message || 'Failed to fetch questions. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-navy">Practice Tests</h1>
        <p className="text-slate-500 mt-2">Customize your practice session.</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-8">

        {/* Exam Type Selection */}
        <div>
          <label className="block text-sm font-bold text-navy mb-3">1. Select Exam Type</label>
          <div className="flex flex-wrap gap-3">
            {examTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedExamType(type.id)}
                className={`px-6 py-3 rounded-lg text-sm font-bold transition border ${selectedExamType === type.id
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                  }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-bold text-navy mb-3">
              2. Select Subject
              {loadingSubjects && <span className="ml-2 text-xs font-normal text-slate-400 animate-pulse">Loading subjects...</span>}
            </label>
            <select
              className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary/20 outline-none font-medium text-slate-700 disabled:bg-slate-50 disabled:text-slate-400"
              value={selectedSubject || ''}
              onChange={(e) => setSelectedSubject(e.target.value ? Number(e.target.value) : null)}
              disabled={!selectedExamType || loadingSubjects}
            >
              <option value="">
                {!selectedExamType
                  ? '-- Select Exam Type First --'
                  : availableSubjects.length === 0 && !loadingSubjects
                    ? '-- No Subjects Available --'
                    : '-- Choose Subject --'}
              </option>
              {availableSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selection */}
          <div>
            <label className="block text-sm font-bold text-navy mb-3">
              3. Select Year
              {loadingYears && <span className="ml-2 text-xs font-normal text-slate-400 animate-pulse">Loading years...</span>}
            </label>
            <select
              className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary/20 outline-none font-medium text-slate-700 disabled:bg-slate-50 disabled:text-slate-400"
              value={year || ''}
              onChange={(e) => setYear(Number(e.target.value))}
              disabled={!selectedSubject || loadingYears || availableYears.length === 0}
            >
              <option value="">
                {!selectedSubject
                  ? '-- Select Subject First --'
                  : availableYears.length === 0 && !loadingYears
                    ? '-- No Years Available --'
                    : '-- Choose Year --'}
              </option>
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Duration Selection */}
          <div>
            <label className="block text-sm font-bold text-navy mb-3">4. Duration (Minutes)</label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 45, 60, 90, 120].map((m) => (
                <button
                  key={m}
                  onClick={() => setDuration(m)}
                  className={`py-2 rounded-lg text-sm font-bold transition border ${duration === m
                    ? 'bg-secondary text-white border-secondary'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  {m} mins
                </button>
              ))}
            </div>
          </div>

          {/* Question Count Selection */}
          <div>
            <label className="block text-sm font-bold text-navy mb-3">5. Number of Questions</label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 30, 40, 50, 60].map((c) => (
                <button
                  key={c}
                  onClick={() => setQuestionCount(c)}
                  className={`py-2 rounded-lg text-sm font-bold transition border ${questionCount === c
                    ? 'bg-secondary text-white border-secondary'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  {c} Qs
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleStartTest}
            disabled={!selectedExamType || !selectedSubject || creating}
            className="w-full py-4 bg-primary text-white font-black text-lg rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {creating ? (
              <>
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generating Test...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">play_circle</span>
                Start Practice Test
              </>
            )}
          </button>
          {!selectedSubject && (
            <p className="text-center text-sm text-slate-400 mt-2">Please select a subject to continue</p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Practice Test Interface ---

export const PracticeTestInterface: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { questions, duration, examTypeName, subjectName, year } = state || { questions: [], duration: 0 };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/student/tests');
    }
  }, [questions, navigate]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const toggleFlag = (questionId: number) => {
    setFlagged((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    try {
      // Prepare data for backend
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const score = calculateScore();

      const practiceData = {
        user_id: user.id,
        subject_id: questions[0]?.subject_id || 0, // Assuming all questions from same subject
        exam_type_id: questions[0]?.exam_type_id || 0,
        score: score,
        total_questions: questions.length,
        time_spent: (duration * 60) - timeRemaining,
        answers: questions.map((q: any) => ({
          question_id: q.id,
          answer_text: answers[q.id] || '',
          is_correct: answers[q.id] === q.correct_answer
        }))
      };

      // Try to save to backend
      try {
        await api.submitPracticeAttempt(practiceData);
      } catch (err) {
        console.warn('⚠️ Backend save failed (endpoint might not exist yet):', err);

        // FALLBACK: Save to localStorage so dashboard can still show it
        const localAttempts = JSON.parse(localStorage.getItem('practice_attempts') || '[]');
        const newAttempt = {
          ...practiceData,
          id: Date.now(), // Fake ID
          test_id: Date.now(), // Fake Test ID for consistency
          status: 'completed',
          start_time: new Date(Date.now() - practiceData.time_spent * 1000).toISOString(),
          end_time: new Date().toISOString(),
          percentage: Math.round((practiceData.score / practiceData.total_questions) * 100),
          passed: (practiceData.score / practiceData.total_questions) >= 0.5,
          subject_name: subjectName || 'Practice Test', // Store name directly for display
          test: {
            subject: subjectName || 'Practice Test',
            title: `${examTypeName || 'Exam'}, ${subjectName || 'Subject'}`
          } // Mock test object structure
        };
        localAttempts.push(newAttempt);
        localStorage.setItem('practice_attempts', JSON.stringify(localAttempts));
        console.log('✅ Saved to localStorage:', newAttempt);
      }

      // Navigate to result page with data (client-side fallback)
      navigate('/student/practice-result', {
        state: {
          questions,
          answers,
          examTypeName,
          subjectName,
          year,
          score: score,
        }
      });
    } catch (error) {
      console.error('Error submitting practice test:', error);
      alert('Error submitting test. Please try again.');
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q: any) => {
      if (answers[q.id] === q.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { hours: String(hours).padStart(2, '0'), minutes: String(minutes).padStart(2, '0'), seconds: String(secs).padStart(2, '0') };
  };

  if (!questions || questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const time = formatTime(timeRemaining);

  // Helper to resolve image URL
  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    // Remove /cbt prefix from path if it exists (to avoid double /cbt/cbt/)
    const cleanPath = url.startsWith('/cbt/') ? url.substring(4) : url;
    return `${baseUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-navy">{subjectName || 'Subject'}</h1>
          <div className="flex gap-3 text-sm font-medium text-slate-500">
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{examTypeName || 'Exam'}</span>
            {year && <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{year}</span>}
            <span>{questions.length} Questions</span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full p-6 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-slate-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              {flagged.has(currentQuestion.id) && (
                <span className="text-xs font-bold text-accent bg-yellow-100 px-2 py-1 rounded">FLAGGED</span>
              )}
            </div>
            <p className="text-lg text-slate-900 leading-relaxed font-medium">
              {currentQuestion.question_text}
            </p>
            {currentQuestion.question_image && (
              <img
                src={getImageUrl(currentQuestion.question_image)}
                alt="Question"
                className="mt-4 max-w-full rounded-lg border border-slate-200"
                onError={(e) => {
                  console.error('Failed to load image:', currentQuestion.question_image);
                  console.error('Attempted URL:', getImageUrl(currentQuestion.question_image));
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 mb-2">Choose one option:</h3>
            {currentQuestion.options && typeof currentQuestion.options === 'object' ? (
              Object.entries(currentQuestion.options).map(([key, value]: [string, any]) => (
                <label
                  key={key}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition ${answers[currentQuestion.id] === key
                    ? 'border-secondary bg-secondary/10'
                    : 'border-slate-200 hover:border-primary bg-slate-50'
                    }`}
                >
                  <div
                    className={`size-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${answers[currentQuestion.id] === key
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-slate-300 text-slate-500'
                      }`}
                  >
                    {key}
                  </div>
                  <span className="text-slate-700 font-medium flex-1">{value}</span>
                  <input
                    type="radio"
                    name={`q${currentQuestion.id}`}
                    className="hidden"
                    checked={answers[currentQuestion.id] === key}
                    onChange={() => handleAnswerSelect(currentQuestion.id, key)}
                  />
                </label>
              ))
            ) : (
              <p className="text-slate-500">No options available</p>
            )}
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4">
            <button
              onClick={() => toggleFlag(currentQuestion.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition ${flagged.has(currentQuestion.id)
                ? 'bg-yellow-100 text-accent'
                : 'text-accent hover:bg-yellow-50'
                }`}
            >
              <span className="material-symbols-outlined">flag</span>
              {flagged.has(currentQuestion.id) ? 'Unflag' : 'Flag for Review'}
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">arrow_back</span> Previous
              </button>
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Timer Card */}
          <div className={`bg-yellow-50 border-2 p-6 rounded-xl shadow-sm text-center ${timeRemaining < 300 ? 'border-red-300 bg-red-50' : 'border-yellow-300'
            }`}>
            <h3 className="font-bold text-slate-900 mb-4">Time Remaining</h3>
            <div className="flex justify-center gap-3">
              {[
                { v: time.hours, l: 'Hours' },
                { v: time.minutes, l: 'Minutes' },
                { v: time.seconds, l: 'Seconds' },
              ].map((t, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className={`size-20 rounded-lg flex items-center justify-center text-4xl font-black ${timeRemaining < 300 ? 'bg-red-500 text-white' : 'bg-yellow-400 text-navy'
                    }`}>
                    {t.v}
                  </div>
                  <span className="text-xs text-slate-500">{t.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Question Navigator */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Question Navigator</h3>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {questions.map((q: any, i: number) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`size-9 rounded font-bold text-sm flex items-center justify-center transition ${i === currentQuestionIndex
                    ? 'ring-2 ring-primary text-primary bg-primary/10'
                    : answers[q.id]
                      ? 'bg-green-100 text-green-700'
                      : flagged.has(q.id)
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="w-full py-4 bg-secondary text-white font-bold text-lg rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">check_circle</span>
            SUBMIT TEST
          </button>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-yellow-600 text-3xl">warning</span>
              </div>
              <h2 className="text-2xl font-black text-navy">Confirm Submission</h2>
            </div>

            <p className="text-slate-700 leading-relaxed">
              You are about to submit your test. Once submitted, you <strong>cannot change your answers</strong>.
              Are you sure you want to proceed?
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleSubmit();
                }}
                className="flex-1 px-6 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-green-600 transition shadow-lg shadow-green-500/20"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Practice Test Result ---

export const PracticeTestResult: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { questions, answers, score, examTypeName, subjectName, year } = state || { questions: [], answers: {}, score: 0 };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (!questions || questions.length === 0) {
    return <Navigate to="/student/tests" replace />;
  }

  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 50;

  // Calculate breakdown
  const correctCount = score;
  const wrongCount = questions.filter((q: any) => answers[q.id] && answers[q.id] !== q.correct_answer).length;
  const unansweredCount = questions.filter((q: any) => !answers[q.id]).length;

  // Pagination
  const totalPages = Math.ceil(questions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuestions = questions.slice(startIndex, endIndex);

  // Helper to resolve image URL
  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    // Remove /cbt prefix from path if it exists (to avoid double /cbt/cbt/)
    const cleanPath = url.startsWith('/cbt/') ? url.substring(4) : url;
    return `${baseUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-navy">{subjectName || 'Subject'} Result</h1>
            <p className="text-slate-500">{examTypeName} {year} • Practice Session Completed</p>
          </div>
          <div className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <span className="material-symbols-outlined">{passed ? 'verified' : 'cancel'}</span>
            {passed ? 'PASS' : 'FAIL'}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="text-slate-600 font-medium">Score</p>
            <h2 className="text-4xl font-bold text-navy">{percentage}%</h2>
            <p className="text-slate-400 text-sm mt-2">{score} / {questions.length}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <p className="text-green-700 font-medium">Correct</p>
            <h2 className="text-4xl font-bold text-green-600">{correctCount}</h2>
            <p className="text-green-500 text-sm mt-2">Answers</p>
          </div>
          <div className="bg-red-50 p-6 rounded-xl border border-red-200">
            <p className="text-red-700 font-medium">Wrong</p>
            <h2 className="text-4xl font-bold text-red-600">{wrongCount}</h2>
            <p className="text-red-500 text-sm mt-2">Answers</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <p className="text-slate-700 font-medium">Unanswered</p>
            <h2 className="text-4xl font-bold text-slate-600">{unansweredCount}</h2>
            <p className="text-slate-500 text-sm mt-2">Questions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-navy">Review Answers</h2>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-600">Show:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={questions.length}>All</option>
              </select>
            </div>
          </div>

          {paginatedQuestions.map((q: any, index: number) => {
            const isCorrect = answers[q.id] === q.correct_answer;
            const actualIndex = startIndex + index;
            return (
              <div key={q.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className={`p-4 border-b border-slate-200 flex items-center gap-3 ${isCorrect ? 'bg-green-50' : answers[q.id] ? 'bg-red-50' : 'bg-slate-50'}`}>
                  <div className={`size-8 rounded-lg flex items-center justify-center ${isCorrect ? 'bg-green-500 text-white' : answers[q.id] ? 'bg-red-500 text-white' : 'bg-slate-400 text-white'}`}>
                    <span className="material-symbols-outlined">{isCorrect ? 'check' : answers[q.id] ? 'close' : 'remove'}</span>
                  </div>
                  <span className="font-bold text-slate-800">Question {actualIndex + 1}</span>
                </div>
                <div className="p-6 space-y-4">
                  <p className="font-medium text-slate-900">{q.question_text}</p>
                  {q.question_image && (
                    <img
                      src={getImageUrl(q.question_image)}
                      alt="Question"
                      className="max-w-full rounded-lg border border-slate-200"
                      onError={(e) => {
                        console.error('Failed to load image:', q.question_image);
                        console.error('Attempted URL:', getImageUrl(q.question_image));
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-100' : answers[q.id] ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                      <span className={`text-xs font-bold uppercase ${isCorrect ? 'text-green-600' : answers[q.id] ? 'text-red-600' : 'text-slate-600'}`}>Your Answer</span>
                      <p className="font-medium text-slate-800 mt-1">{q.options?.[answers[q.id]] || answers[q.id] || 'Not Answered'}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <span className="text-xs font-bold text-green-600 uppercase">Correct Answer</span>
                      <p className="font-medium text-slate-800 mt-1">{q.options?.[q.correct_answer] || q.correct_answer}</p>
                    </div>
                  </div>

                  {q.explanation && (
                    <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <span className="font-bold block mb-1 text-slate-800">Explanation:</span>
                      <p>{q.explanation}</p>
                      {q.explanation_image && (
                        <img
                          src={getImageUrl(q.explanation_image)}
                          alt="Explanation"
                          className="mt-3 max-w-full rounded-lg border border-slate-200"
                          onError={(e) => {
                            console.error('Failed to load explanation image:', q.explanation_image);
                            console.error('Attempted URL:', getImageUrl(q.explanation_image));
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 font-bold rounded-lg transition ${currentPage === page
                      ? 'bg-primary text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center pt-8 pb-12">
          <button
            onClick={() => navigate('/student/tests')}
            className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition"
          >
            Take Another Test
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Test Interface ---

export const TestInterface: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [test, setTest] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const startTest = async () => {
      if (!id || !user) return;

      try {
        const testData = await api.getTestWithQuestions(Number(id));
        setTest(testData);
        setQuestions(testData.questions);

        const attemptData = await api.startAttempt({ test_id: Number(id) }, user.id);
        setAttempt(attemptData);

        setTimeRemaining(testData.duration_minutes * 60);
      } catch (error) {
        console.error('Failed to start test:', error);
        alert('Failed to start test. Please try again.');
        navigate('/student/tests');
      } finally {
        setLoading(false);
      }
    };

    startTest();
  }, [id, user, navigate]);

  // DIAGNOSTIC: Log when component mounts
  useEffect(() => {
    console.log('=== TEST INTERFACE COMPONENT LOADED ===');
    console.log('Code version: 2024-11-30-12:20');
    console.log('Submit button should have alert');
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0 || !attempt) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, attempt]);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const toggleFlag = (questionId: number) => {
    setFlagged((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    console.log('='.repeat(60));
    console.log('🔔 HANDLE SUBMIT CALLED');
    console.log('Current time:', new Date().toISOString());
    console.log('Attempt object:', attempt);
    console.log('Submitting state:', submitting);

    if (!attempt || submitting) {
      console.log('❌ BLOCKED: attempt is null or already submitting');
      return;
    }

    const confirmSubmit = window.confirm(
      `You have answered ${Object.keys(answers).length} out of ${questions.length} questions. Are you sure you want to submit?`
    );

    console.log('User confirmed:', confirmSubmit);

    if (!confirmSubmit) return;

    setSubmitting(true);

    try {
      const answerSubmissions = questions.map((q) => ({
        question_id: q.id,
        answer_text: answers[q.id] || '',
        time_spent: null,
      }));

      const submissionData = {
        attempt_id: attempt.id,
        answers: answerSubmissions,
      };

      console.log('='.repeat(60));
      console.log('📤 SENDING PAYLOAD TO BACKEND:');
      console.log('='.repeat(60));
      console.log('Endpoint: POST /api/v1/attempts/submit');
      console.log('Attempt ID:', attempt.id);
      console.log('User ID:', user?.id);
      console.log('Total Questions:', questions.length);
      console.log('Answered Questions:', Object.keys(answers).length);
      console.log('Unanswered Questions:', questions.length - Object.keys(answers).length);
      console.log('\n📦 Full Payload:');
      console.log(JSON.stringify(submissionData, null, 2));
      console.log('\n📋 Sample Answers (first 5):');
      answerSubmissions.slice(0, 5).forEach((ans, idx) => {
        const question = questions.find(q => q.id === ans.question_id);
        console.log(`  ${idx + 1}. Q${ans.question_id}: Answer="${ans.answer_text}" | Correct="${question?.correct_answer}"`);
      });
      console.log('='.repeat(60));

      const result = await api.submitAttempt(submissionData);

      console.log('='.repeat(60));
      console.log('✅ BACKEND RESPONSE RECEIVED:');
      console.log('='.repeat(60));
      console.log(JSON.stringify(result, null, 2));
      console.log('='.repeat(60));

      navigate(`/student/result/${attempt.id}`);
    } catch (error: any) {
      console.log('='.repeat(60));
      console.error('❌ SUBMISSION ERROR:');
      console.log('='.repeat(60));
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error stack:', error.stack);
      console.log('='.repeat(60));
      alert('Failed to submit test. Please try again.');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { hours: String(hours).padStart(2, '0'), minutes: String(minutes).padStart(2, '0'), seconds: String(secs).padStart(2, '0') };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-slate-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 font-bold">Failed to load test</p>
        <button onClick={() => navigate('/student/tests')} className="mt-4 text-primary hover:underline">
          Back to tests
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const time = formatTime(timeRemaining);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-slate-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              {flagged.has(currentQuestion.id) && (
                <span className="text-xs font-bold text-accent bg-yellow-100 px-2 py-1 rounded">FLAGGED</span>
              )}
            </div>
            <p className="text-lg text-slate-900 leading-relaxed font-medium">
              {currentQuestion.question_text}
            </p>
            {currentQuestion.question_image && (
              <img
                src={currentQuestion.question_image}
                alt="Question"
                className="mt-4 max-w-full rounded-lg border border-slate-200"
              />
            )}
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 mb-2">Choose one option:</h3>
            {currentQuestion.options && typeof currentQuestion.options === 'object' ? (
              Object.entries(currentQuestion.options).map(([key, value]: [string, any]) => (
                <label
                  key={key}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition ${answers[currentQuestion.id] === key
                    ? 'border-secondary bg-secondary/10'
                    : 'border-slate-200 hover:border-primary bg-slate-50'
                    }`}
                >
                  <div
                    className={`size-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${answers[currentQuestion.id] === key
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-slate-300 text-slate-500'
                      }`}
                  >
                    {key}
                  </div>
                  <span className="text-slate-700 font-medium flex-1">{value}</span>
                  <input
                    type="radio"
                    name={`q${currentQuestion.id}`}
                    className="hidden"
                    checked={answers[currentQuestion.id] === key}
                    onChange={() => handleAnswerSelect(currentQuestion.id, key)}
                  />
                </label>
              ))
            ) : (
              <p className="text-slate-500">No options available</p>
            )}
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4">
            <button
              onClick={() => toggleFlag(currentQuestion.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition ${flagged.has(currentQuestion.id)
                ? 'bg-yellow-100 text-accent'
                : 'text-accent hover:bg-yellow-50'
                }`}
            >
              <span className="material-symbols-outlined">flag</span>
              {flagged.has(currentQuestion.id) ? 'Unflag' : 'Flag for Review'}
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">arrow_back</span> Previous
              </button>
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`bg-white p-6 rounded-xl border-2 shadow-sm text-center ${timeRemaining < 300 ? 'border-red-300 bg-red-50' : 'border-slate-200'
            }`}>
            <h3 className="font-bold text-slate-900 mb-4">Time Remaining</h3>
            <div className="flex justify-center gap-3">
              {[
                { v: time.hours, l: 'Hours' },
                { v: time.minutes, l: 'Minutes' },
                { v: time.seconds, l: 'Seconds' },
              ].map((t, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className={`size-16 rounded-lg flex items-center justify-center text-3xl font-black ${timeRemaining < 300 ? 'bg-red-500 text-white' : 'bg-accent text-navy'
                    }`}>
                    {t.v}
                  </div>
                  <span className="text-xs text-slate-500">{t.l}</span>
                </div>
              ))}
            </div>
            {timeRemaining < 300 && (
              <p className="text-red-600 text-sm font-bold mt-4">⚠️ Less than 5 minutes remaining!</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Question Navigator</h3>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`size-9 rounded font-bold text-sm flex items-center justify-center transition ${i === currentQuestionIndex
                    ? 'ring-2 ring-primary text-primary bg-primary/10'
                    : answers[q.id]
                      ? 'bg-green-100 text-green-700'
                      : flagged.has(q.id)
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-2">
                <div className="size-4 bg-green-100 rounded"></div>
                <span>Answered ({Object.keys(answers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-4 bg-yellow-100 rounded"></div>
                <span>Flagged ({flagged.size})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-4 bg-slate-100 rounded"></div>
                <span>Not Answered ({questions.length - Object.keys(answers).length})</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              console.log('🔘 Submit button clicked - opening modal');
              setShowSubmitModal(true);
            }}
            disabled={submitting}
            className="w-full py-4 bg-secondary text-white font-bold text-lg rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">check_circle</span>
            {submitting ? 'SUBMITTING...' : 'SUBMIT TEST'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-yellow-600 text-3xl">warning</span>
              </div>
              <h2 className="text-2xl font-black text-navy">Confirm Submission</h2>
            </div>

            <p className="text-slate-700 leading-relaxed">
              You have answered <strong>{Object.keys(answers).length}</strong> out of <strong>{questions.length}</strong> questions.
              Once submitted, you <strong>cannot change your answers</strong>.
              Are you sure you want to proceed?
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  console.log('❌ User clicked Cancel');
                  setShowSubmitModal(false);
                }}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Proceed button clicked! Check console for logs.');
                  console.log('✅ User clicked Proceed - calling handleSubmit()');
                  setShowSubmitModal(false);
                  handleSubmit();
                }}
                className="flex-1 px-6 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-green-600 transition shadow-lg shadow-green-500/20"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Test Results ---

export const TestResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!id) return;

      try {
        const resultData = await api.getAttemptResult(Number(id));
        setResult(resultData);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 font-bold">Failed to load results</p>
        <button onClick={() => navigate('/student/dashboard')} className="mt-4 text-primary hover:underline">
          Back to dashboard
        </button>
      </div>
    );
  }

  const percentage = Math.round(result.percentage);
  const correctCount = result.correct_count;
  const wrongCount = result.total_questions - correctCount;
  const passed = result.passed;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy">{result.test_title}</h1>
          <p className="text-slate-500">Here is a summary of your test results.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            <span className="material-symbols-outlined">{passed ? 'verified' : 'cancel'}</span>
            {passed ? 'PASS' : 'FAIL'}
          </div>
          <button
            onClick={() => navigate('/student/tests')}
            className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined">refresh</span>
            Take Another Test
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <p className="text-slate-600 font-medium">Score %</p>
          <div className="flex items-baseline gap-2 mb-4">
            <h2 className="text-4xl font-bold text-navy">{percentage}%</h2>
          </div>
          <div className="h-40 flex justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ value: percentage }, { value: 100 - percentage }]}
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  <Cell fill={passed ? "#2ECC71" : "#EF4444"} />
                  <Cell fill="#E2E8F0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className={`absolute inset-0 flex items-center justify-center font-bold text-2xl ${passed ? 'text-secondary' : 'text-red-600'
              }`}>
              {percentage}%
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <p className="text-slate-600 font-medium">Correct vs Wrong</p>
          <h2 className="text-4xl font-bold text-navy mb-1">{correctCount} Correct</h2>
          <p className="text-slate-400 text-sm mb-6">Out of {result.total_questions}</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold text-green-600 mb-1">
                <span>Correct</span>
                <span>{correctCount}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary"
                  style={{ width: `${(correctCount / result.total_questions) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-red-500 mb-1">
                <span>Wrong</span>
                <span>{wrongCount}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${(wrongCount / result.total_questions) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <p className="text-slate-600 font-medium">Score</p>
          <h2 className="text-4xl font-bold text-navy mb-1">
            {result.score}/{result.total_marks}
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            Passing: {result.passing_marks}/{result.total_marks}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Your Score</span>
              <span className="font-bold text-navy">{result.score}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Passing Score</span>
              <span className="font-bold text-slate-600">{result.passing_marks}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Marks</span>
              <span className="font-bold text-slate-600">{result.total_marks}</span>
            </div>
          </div>
        </div>
      </div>

      {result.answers && result.answers.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-navy">Per-Question Breakdown</h2>
            <button
              onClick={() => navigate('/student/tests')}
              className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition"
            >
              Take Another Test
            </button>
          </div>

          {result.answers.map((answer: any, index: number) => {
            const isCorrect = answer.is_correct;
            return (
              <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className={`p-4 border-b border-slate-200 flex items-center gap-3 ${isCorrect ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                  <div className={`size-8 rounded-lg flex items-center justify-center ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    <span className="material-symbols-outlined">
                      {isCorrect ? 'check' : 'close'}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800">
                    Question {index + 1}: {answer.question_text}
                  </span>
                </div>
                <div className="p-6">
                  {!isCorrect && (
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                        <span className="text-xs font-bold text-red-600 uppercase">Your Answer</span>
                        <p className="font-medium text-slate-800 mt-1">{answer.user_answer || 'Not answered'}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <span className="text-xs font-bold text-green-600 uppercase">Correct Answer</span>
                        <p className="font-medium text-slate-800 mt-1">{answer.correct_answer}</p>
                      </div>
                    </div>
                  )}
                  {isCorrect && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100 mb-4">
                      <span className="text-xs font-bold text-green-600 uppercase">Your Answer</span>
                      <p className="font-medium text-slate-800 mt-1">{answer.user_answer}</p>
                    </div>
                  )}
                  {answer.explanation && (
                    <div className="text-sm text-slate-600">
                      <span className="font-bold block mb-1">Explanation:</span>
                      <p>{answer.explanation}</p>
                      {answer.explanation_image && (
                        <img
                          src={answer.explanation_image}
                          alt="Explanation"
                          className="mt-3 max-w-full rounded-lg border border-slate-200"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-center gap-4 pt-8">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate('/student/tests')}
          className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition"
        >
          Take Another Test
        </button>
      </div>
    </div>
  );
};

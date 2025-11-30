import React from 'react';
import api from '../lib/api';

// --- Admin Dashboard (Analytics) ---

import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({
    users: 0,
    questions: 0,
    subjects: 0,
    exams: 0,
    news: 0,
    tests: 0,
    publicQuestions: 0,
    waecQuestions: 0,
    necoQuestions: 0,
    jambQuestions: 0,
  });
  const [loading, setLoading] = React.useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      console.log('Fetching admin dashboard stats...');

      // Fetch each resource independently to prevent one failure from breaking all
      const [
        usersResult,
        questionsResult,
        subjectsResult,
        examsResult,
        newsResult,
        testsResult,
        publicQuestionsResult
      ] = await Promise.allSettled([
        api.getAllUsers(0, 10000),
        api.getAllQuestions({ limit: 10000 }),
        api.getSubjects(),
        api.getExamTypes(),
        api.getNews(0, 10000),
        api.getTests(0, 10000),
        api.getAllPublicQuestions({ limit: 10000 }),
      ]);

      const usersData = usersResult.status === 'fulfilled' ? usersResult.value : [];
      const questionsData = questionsResult.status === 'fulfilled' ? questionsResult.value : [];
      const subjectsData = subjectsResult.status === 'fulfilled' ? subjectsResult.value : [];
      const examsData = examsResult.status === 'fulfilled' ? examsResult.value : [];
      const newsData = newsResult.status === 'fulfilled' ? newsResult.value : [];
      const testsData = testsResult.status === 'fulfilled' ? testsResult.value : [];
      const publicQuestionsData = publicQuestionsResult.status === 'fulfilled' ? publicQuestionsResult.value : [];

      if (testsResult.status === 'rejected') {
        console.error('Failed to fetch tests:', testsResult.reason);
      }

      console.log('Stats Data:', {
        users: usersData.length,
        questions: questionsData.length,
        subjects: subjectsData.length,
        exams: examsData.length,
        news: newsData.length,
        tests: testsData.length,
        publicQuestions: publicQuestionsData.length
      });

      // Calculate counts by exam type
      let waecCount = 0;
      let necoCount = 0;
      let jambCount = 0;

      // Create a map of exam type IDs to names for easier lookup
      const examTypeMap = new Map();
      if (Array.isArray(examsData)) {
        examsData.forEach((et: any) => {
          examTypeMap.set(et.id, et.name.toUpperCase());
        });
      }

      if (Array.isArray(questionsData)) {
        questionsData.forEach((q: any) => {
          const examName = examTypeMap.get(q.exam_type_id);
          if (examName?.includes('WAEC')) waecCount++;
          else if (examName?.includes('NECO')) necoCount++;
          else if (examName?.includes('JAMB')) jambCount++;
        });
      }

      setStats({
        users: Array.isArray(usersData) ? usersData.length : 0,
        questions: Array.isArray(questionsData) ? questionsData.length : 0,
        subjects: Array.isArray(subjectsData) ? subjectsData.length : 0,
        exams: Array.isArray(examsData) ? examsData.length : 0,
        news: Array.isArray(newsData) ? newsData.length : 0,
        tests: Array.isArray(testsData) ? testsData.length : 0,
        publicQuestions: Array.isArray(publicQuestionsData) ? publicQuestionsData.length : 0,
        waecQuestions: waecCount,
        necoQuestions: necoCount,
        jambQuestions: jambCount,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', count: stats.users, icon: 'group', color: 'bg-blue-500' },
    { title: 'Questions', count: stats.questions, icon: 'quiz', color: 'bg-green-500' },
    { title: 'Subjects', count: stats.subjects, icon: 'library_books', color: 'bg-purple-500' },
    { title: 'Exam Types', count: stats.exams, icon: 'school', color: 'bg-orange-500' },
    { title: 'News Articles', count: stats.news, icon: 'newspaper', color: 'bg-red-500' },
    { title: 'Public Questions', count: stats.publicQuestions, icon: 'public', color: 'bg-teal-500' },
  ];

  const maxCount = Math.max(stats.waecQuestions, stats.necoQuestions, stats.jambQuestions, 1); // Avoid divide by zero
  const waecHeight = Math.max((stats.waecQuestions / maxCount) * 100, 5); // Min 5% height
  const necoHeight = Math.max((stats.necoQuestions / maxCount) * 100, 5);
  const jambHeight = Math.max((stats.jambQuestions / maxCount) * 100, 5);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-black text-navy">Analytics Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-500 font-medium">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <button
            onClick={fetchStats}
            className="px-3 py-2 bg-primary text-white rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 font-medium mb-1">{card.title}</p>
                <h2 className="text-4xl font-bold text-navy">{card.count.toLocaleString()}</h2>
              </div>
              <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                <span className={`material-symbols-outlined text-2xl ${card.color.replace('bg-', 'text-')}`}>
                  {card.icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 h-80">
          <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/questions')}
              className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition text-left"
            >
              <span className="material-symbols-outlined text-primary mb-2">add_circle</span>
              <p className="font-bold text-navy">New Question</p>
              <p className="text-xs text-slate-500">Add to question bank</p>
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition text-left"
            >
              <span className="material-symbols-outlined text-primary mb-2">person_add</span>
              <p className="font-bold text-navy">New User</p>
              <p className="text-xs text-slate-500">Register student</p>
            </button>
            <button
              onClick={() => navigate('/admin/news')}
              className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition text-left"
            >
              <span className="material-symbols-outlined text-primary mb-2">article</span>
              <p className="font-bold text-navy">Post News</p>
              <p className="text-xs text-slate-500">Update announcements</p>
            </button>
            <button
              onClick={() => alert('Settings page coming soon!')}
              className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition text-left"
            >
              <span className="material-symbols-outlined text-primary mb-2">settings</span>
              <p className="font-bold text-navy">Settings</p>
              <p className="text-xs text-slate-500">System configuration</p>
            </button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 h-80">
          <h3 className="font-bold text-lg mb-2">Questions by Exam Type</h3>
          <div className="flex h-full items-end justify-around pb-8 px-8 gap-4">
            <div
              className="w-1/3 bg-green-500 rounded-t flex flex-col justify-end items-center pb-2 text-white font-bold relative group transition-all duration-500"
              style={{ height: `${waecHeight}%` }}
            >
              <span className="mb-1">{stats.waecQuestions}</span>
              <span>WAEC</span>
              <div className="absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                {stats.waecQuestions} Questions
              </div>
            </div>
            <div
              className="w-1/3 bg-accent rounded-t flex flex-col justify-end items-center pb-2 text-navy font-bold relative group transition-all duration-500"
              style={{ height: `${necoHeight}%` }}
            >
              <span className="mb-1">{stats.necoQuestions}</span>
              <span>NECO</span>
              <div className="absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                {stats.necoQuestions} Questions
              </div>
            </div>
            <div
              className="w-1/3 bg-primary rounded-t flex flex-col justify-end items-center pb-2 text-white font-bold relative group transition-all duration-500"
              style={{ height: `${jambHeight}%` }}
            >
              <span className="mb-1">{stats.jambQuestions}</span>
              <span>JAMB</span>
              <div className="absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                {stats.jambQuestions} Questions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Admin Question Management ---


export const AdminQuestions: React.FC = () => {
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [examTypes, setExamTypes] = React.useState<any[]>([]);
  const [subjects, setSubjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterExamType, setFilterExamType] = React.useState<number | null>(null);
  const [filterSubject, setFilterSubject] = React.useState<number | null>(null);
  const [selectedQuestion, setSelectedQuestion] = React.useState<any>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [questionImage, setQuestionImage] = React.useState<File | null>(null);
  const [explanationImage, setExplanationImage] = React.useState<File | null>(null);
  const [formData, setFormData] = React.useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A',
    explanation: '',
    exam_type_id: '',
    subject_id: '',
    year: new Date().getFullYear(),
  });

  React.useEffect(() => {
    fetchData();
  }, [filterExamType, filterSubject]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [examTypesData, subjectsData] = await Promise.all([
        api.getExamTypes(),
        api.getSubjects(),
      ]);
      setExamTypes(examTypesData);
      setSubjects(subjectsData);

      const params: any = {};
      if (filterExamType) params.exam_type_id = filterExamType;
      if (filterSubject) params.subject_id = filterSubject;

      const questionsData = await api.getAllQuestions(params);
      setQuestions(questionsData);

      if (questionsData.length > 0 && !selectedQuestion) {
        setSelectedQuestion(questionsData[0]);
        populateForm(questionsData[0]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (question: any) => {
    // Backend returns options as { A: "text", B: "text", C: "text", D: "text" }
    // and correct_answer instead of correct_option
    const options = question.options || {};

    setFormData({
      question_text: question.question_text,
      option_a: options.A || options.a || '',
      option_b: options.B || options.b || '',
      option_c: options.C || options.c || '',
      option_d: options.D || options.d || '',
      correct_option: question.correct_answer || 'A',
      explanation: question.explanation || '',
      exam_type_id: question.exam_type_id.toString(),
      subject_id: question.subject_id.toString(),
      year: question.year,
    });
    // Reset image files when editing
    setQuestionImage(null);
    setExplanationImage(null);
  };

  const handleSelectQuestion = (question: any) => {
    setSelectedQuestion(question);
    populateForm(question);
  };

  const handleNewQuestion = () => {
    setSelectedQuestion(null);
    setFormData({
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'A',
      explanation: '',
      exam_type_id: '',
      subject_id: '',
      year: new Date().getFullYear(),
    });
    setQuestionImage(null);
    setExplanationImage(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      // Convert frontend format to backend format
      const data = {
        question_text: formData.question_text,
        question_type: 'multiple_choice',
        options: {
          A: formData.option_a,
          B: formData.option_b,
          C: formData.option_c,
          D: formData.option_d,
        },
        correct_answer: formData.correct_option,
        explanation: formData.explanation,
        exam_type_id: Number(formData.exam_type_id),
        subject_id: Number(formData.subject_id),
        year: formData.year,
      };

      let questionId: number;

      if (selectedQuestion) {
        await api.updateQuestion(selectedQuestion.id, data);
        questionId = selectedQuestion.id;
      } else {
        const created = await api.createQuestion(data);
        setSelectedQuestion(created);
        questionId = created.id;
      }

      // Upload images if provided
      if (questionImage) {
        await api.uploadQuestionImage(questionId, questionImage);
      }
      if (explanationImage) {
        await api.uploadExplanationImage(questionId, explanationImage);
      }

      fetchData();
      setShowModal(false);
      setQuestionImage(null);
      setExplanationImage(null);
      alert('Question saved successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to save question');
    }
  };

  const handleDelete = async () => {
    if (!selectedQuestion || !confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.deleteQuestion(selectedQuestion.id);
      fetchData();
      setSelectedQuestion(null);
      setFormData({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        explanation: '',
        exam_type_id: '',
        subject_id: '',
        year: new Date().getFullYear(),
      });
    } catch (error: any) {
      alert(error.message || 'Failed to delete question');
    }
  };

  const handleImageUpload = async (file: File, type: 'question' | 'explanation') => {
    if (!selectedQuestion) {
      alert('Please save the question first before uploading images');
      return;
    }
    try {
      if (type === 'question') {
        await api.uploadQuestionImage(selectedQuestion.id, file);
      } else {
        await api.uploadExplanationImage(selectedQuestion.id, file);
      }
      fetchData();
      alert('Image uploaded successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to upload image');
    }
  };

  const filteredQuestions = questions.filter(q =>
    q.question_text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    // Remove /cbt prefix from path if it exists
    const cleanPath = url.replace(/^\/?cbt\//, '');
    return `${baseUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-12 flex justify-between items-center mb-4">
        <h1 className="text-3xl font-black text-navy">Questions Management</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-200 transition"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Refresh
          </button>
          <button
            onClick={handleNewQuestion}
            className="px-4 py-2 bg-primary text-white rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90"
          >
            <span className="material-symbols-outlined">add</span> Add Question
          </button>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/50 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
            value={filterExamType || ''}
            onChange={(e) => setFilterExamType(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">All Exams</option>
            {examTypes.map(et => (
              <option key={et.id} value={et.id}>{et.name}</option>
            ))}
          </select>
          <select
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
            value={filterSubject || ''}
            onChange={(e) => setFilterSubject(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="text-sm text-slate-500 font-medium px-1">
          Found {filteredQuestions.length} questions
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                onClick={() => handleSelectQuestion(q)}
                className={`p-4 rounded-lg cursor-pointer border transition ${selectedQuestion?.id === q.id ? 'bg-primary/5 border-primary' : 'bg-white border-slate-200 hover:border-slate-300'}`}
              >
                <p className="font-medium text-slate-800 mb-1 line-clamp-2">{q.question_text}</p>
                <p className="text-xs text-slate-500">
                  {examTypes.find(e => e.id === q.exam_type_id)?.name} • {subjects.find(s => s.id === q.subject_id)?.name} • {q.year}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200">
        {selectedQuestion || showModal ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-navy mb-6">{selectedQuestion ? 'Edit Question' : 'New Question'}</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Exam Type</label>
                <select
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 mt-1"
                  value={formData.exam_type_id}
                  onChange={(e) => setFormData({ ...formData, exam_type_id: e.target.value })}
                >
                  <option value="">Select</option>
                  {examTypes.map(et => (
                    <option key={et.id} value={et.id}>{et.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Subject</label>
                <select
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 mt-1"
                  value={formData.subject_id}
                  onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                >
                  <option value="">Select</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Year</label>
                <input
                  type="number"
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 mt-1"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Question</label>
              <textarea
                rows={3}
                className="w-full p-3 rounded-lg border border-slate-300"
                value={formData.question_text}
                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              ></textarea>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700">Answer Options</label>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-300 rounded-lg">
                  <span className="text-xs font-medium text-green-800">Correct Answer:</span>
                  <span className="text-sm font-bold text-green-900">{formData.correct_option}</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <div
                    key={option}
                    className={`flex items-center gap-2 p-2 border rounded-lg ${formData.correct_option === option ? 'border-secondary bg-secondary/10' : 'border-slate-200'}`}
                  >
                    <input
                      type="radio"
                      name="correct"
                      checked={formData.correct_option === option}
                      onChange={() => setFormData({ ...formData, correct_option: option })}
                    />
                    <input
                      type="text"
                      className="flex-1 border-none outline-none bg-transparent text-slate-900"
                      placeholder={`Option ${option}`}
                      value={formData[`option_${option.toLowerCase()}` as keyof typeof formData] as string}
                      onChange={(e) => setFormData({ ...formData, [`option_${option.toLowerCase()}`]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Explanation (optional)</label>
              <textarea
                rows={3}
                className="w-full p-3 rounded-lg border border-slate-300"
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                placeholder="Provide explanation for the correct answer..."
              ></textarea>
            </div>

            {/* Answer Summary Removed */}

            {/* Image Upload Section - Always visible */}
            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Question Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm border border-slate-300 rounded-lg p-2"
                  onChange={(e) => e.target.files?.[0] && setQuestionImage(e.target.files[0])}
                />
                {questionImage && (
                  <p className="text-xs text-green-600 mt-1">✓ {questionImage.name}</p>
                )}
                {selectedQuestion?.question_image && !questionImage && (
                  <div className="mt-2">
                    <p className="text-xs text-slate-600 font-medium mb-1">Current Image:</p>
                    <a
                      href={getImageUrl(selectedQuestion.question_image)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-fit"
                    >
                      <img
                        src={getImageUrl(selectedQuestion.question_image)}
                        alt="Question"
                        className="h-24 w-auto object-contain rounded-lg border border-slate-200 hover:border-primary transition"
                      />
                    </a>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Explanation Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm border border-slate-300 rounded-lg p-2"
                  onChange={(e) => e.target.files?.[0] && setExplanationImage(e.target.files[0])}
                />
                {explanationImage && (
                  <p className="text-xs text-green-600 mt-1">✓ {explanationImage.name}</p>
                )}
                {selectedQuestion?.explanation_image && !explanationImage && (
                  <div className="mt-2">
                    <p className="text-xs text-slate-600 font-medium mb-1">Current Image:</p>
                    <a
                      href={getImageUrl(selectedQuestion.explanation_image)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-fit"
                    >
                      <img
                        src={getImageUrl(selectedQuestion.explanation_image)}
                        alt="Explanation"
                        className="h-24 w-auto object-contain rounded-lg border border-slate-200 hover:border-primary transition"
                      />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              {selectedQuestion && (
                <button
                  onClick={handleDelete}
                  className="text-red-600 font-bold text-sm flex items-center gap-1 hover:text-red-700"
                >
                  <span className="material-symbols-outlined">delete</span> Delete
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                {showModal && !selectedQuestion && (
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
                >
                  {selectedQuestion ? 'Update Question' : 'Create Question'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <span className="material-symbols-outlined text-6xl mb-4">quiz</span>
            <p className="text-lg">Select a question to edit or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Admin News Management ---


export const AdminNews: React.FC = () => {
  const [newsList, setNewsList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedNews, setSelectedNews] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    title: '',
    content: '',
    url: '',
    date: new Date().toISOString().split('T')[0],
  });

  React.useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await api.getNews();
      setNewsList(data);
      if (data.length > 0 && !selectedNews) {
        setSelectedNews(data[0]);
        setFormData({
          title: data[0].title,
          content: data[0].content,
          url: data[0].url || '',
          date: data[0].date ? new Date(data[0].date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        });
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedNews) {
        await api.updateNews(selectedNews.id, formData);
      } else {
        const created = await api.createNews(formData);
        setSelectedNews(created);
      }
      fetchNews();
      alert('News saved successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to save news');
    }
  };

  const handleDelete = async () => {
    if (!selectedNews || !confirm('Are you sure you want to delete this news article?')) return;
    try {
      await api.deleteNews(selectedNews.id);
      fetchNews();
      setSelectedNews(null);
      setFormData({ title: '', content: '', url: '', date: new Date().toISOString().split('T')[0] });
    } catch (error: any) {
      alert(error.message || 'Failed to delete news');
    }
  };

  const handleSelectNews = (news: any) => {
    setSelectedNews(news);
    setFormData({
      title: news.title,
      content: news.content,
      url: news.url || '',
      date: news.date ? new Date(news.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
  };

  const handleNewArticle = () => {
    setSelectedNews(null);
    setFormData({ title: '', content: '', url: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black text-navy">News Management</h1>
          <button
            onClick={fetchNews}
            className="px-3 py-2 bg-primary text-white rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Refresh
          </button>
        </div>
        <button
          onClick={handleNewArticle}
          className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          Create New Article
        </button>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full px-3 py-2 bg-slate-100 rounded-lg text-sm"
            />
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div>
              {newsList.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleSelectNews(n)}
                  className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${selectedNews?.id === n.id ? 'bg-primary/5' : ''}`}
                >
                  <h4 className={`font-bold text-sm ${selectedNews?.id === n.id ? 'text-primary' : 'text-slate-800'}`}>
                    {n.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(n.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Article Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter article title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Source URL (optional)</label>
            <input
              type="url"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com/article"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <textarea
              rows={12}
              className="w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Start writing..."
            ></textarea>
          </div>
          <div className="flex justify-between items-center pt-4">
            {selectedNews && (
              <button
                onClick={handleDelete}
                className="text-red-600 font-bold text-sm flex items-center gap-1 hover:text-red-700"
              >
                <span className="material-symbols-outlined">delete</span> Delete
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
              >
                {selectedNews ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Admin User Management ---


export const AdminUsers: React.FC = () => {
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    role: 'student',
    is_active: true,
  });

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, formData);
      } else {
        await api.register(formData);
      }
      fetchUsers();
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      alert(error.message || 'Failed to save user');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await api.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      alert('User deleted successfully.');
    } catch (error: any) {
      console.error('Delete failed:', error);

      // Check if it's a server error (likely FK constraint)
      if (error.response?.status === 500 || error.message.includes('500')) {
        if (confirm('Failed to permanently delete user (likely due to associated data like test results).\n\nWould you like to DEACTIVATE the user instead? This will prevent them from logging in.')) {
          try {
            await api.updateUser(id, { is_active: false });
            setUsers(users.map(u => u.id === id ? { ...u, is_active: false } : u));
            alert('User has been deactivated.');
          } catch (updateError: any) {
            alert('Failed to deactivate user: ' + updateError.message);
          }
        }
      } else {
        alert(error.message || 'Failed to delete user');
      }
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      password: '',
      role: user.role,
      is_active: user.is_active,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      full_name: '',
      password: '',
      role: 'student',
      is_active: true,
    });
  };

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-navy">User Management</h1>
        <button
          onClick={fetchUsers}
          className="px-3 py-2 bg-primary text-white rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition"
        >
          <span className="material-symbols-outlined text-[20px]">refresh</span>
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full sm:w-64 px-4 py-2 bg-slate-100 rounded-lg text-sm outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="px-4 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary/90 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">add</span> Add User
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                        {user.full_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{user.full_name}</div>
                        <div className="text-xs">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(user)} className="text-slate-400 hover:text-slate-600 mx-1">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="text-slate-400 hover:text-red-500 mx-1">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-navy mb-4">{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleCreateEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password {editingUser && '(leave blank to keep current)'}</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700">Active</label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 border border-slate-300 rounded-lg font-medium hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90">
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Admin Public Question Management ---

export const AdminPublicQuestions: React.FC = () => {
  const [questions, setQuestions] = React.useState<any[]>([]);
  // Hardcoded subjects for public questions - only these will be available
  const subjects = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'English' },
    { id: 3, name: 'Government' },
    { id: 4, name: 'Economics' },
    { id: 5, name: 'Biology' },
    { id: 6, name: 'Chemistry' },
    { id: 7, name: 'Commerce' },
    { id: 8, name: 'Physics' },
    { id: 9, name: 'Computer Studies' }
  ];
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterSubject, setFilterSubject] = React.useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = React.useState<any>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    question: '',
    solution: '',
    subject: '',
  });

  React.useEffect(() => {
    fetchData();
  }, [filterSubject]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterSubject) params.subject = filterSubject;

      const questionsData = await api.getAllPublicQuestions(params);
      setQuestions(questionsData);

      if (questionsData.length > 0 && !selectedQuestion) {
        setSelectedQuestion(questionsData[0]);
        populateForm(questionsData[0]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (question: any) => {
    setFormData({
      question: question.question || '',
      solution: question.solution || '',
      subject: question.subject || '',
    });
  };

  const handleSelectQuestion = (question: any) => {
    setSelectedQuestion(question);
    populateForm(question);
  };

  const handleNewQuestion = () => {
    setSelectedQuestion(null);
    setFormData({
      question: '',
      solution: '',
      subject: '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.subject || !formData.question) {
        alert('Please fill in all required fields');
        return;
      }

      const data = {
        subject: formData.subject,
        question: formData.question,
        solution: formData.solution || null,
      };

      if (selectedQuestion) {
        await api.updatePublicQuestion(selectedQuestion.id, data);
      } else {
        const created = await api.createPublicQuestion(data);
        setSelectedQuestion(created);
      }

      fetchData();
      setShowModal(false);
      alert('Public question saved successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to save public question');
    }
  };

  const handleDelete = async () => {
    if (!selectedQuestion || !confirm('Are you sure you want to delete this public question?')) return;
    try {
      await api.deletePublicQuestion(selectedQuestion.id);
      fetchData();
      setSelectedQuestion(null);
      setFormData({
        question: '',
        solution: '',
        subject: '',
      });
    } catch (error: any) {
      alert(error.message || 'Failed to delete public question');
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-12 flex justify-between items-center mb-4">
        <h1 className="text-3xl font-black text-navy">Public Questions Management</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-200 transition"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Refresh
          </button>
          <button
            onClick={handleNewQuestion}
            className="px-4 py-2 bg-primary text-white rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90"
          >
            <span className="material-symbols-outlined">add</span> Add Public Question
          </button>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/50 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            value={filterSubject || ''}
            onChange={(e) => setFilterSubject(e.target.value || null)}
          >
            <option value="">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="text-sm text-slate-500 font-medium px-1">
          Found {questions.length} questions
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {questions.filter(q => q.question?.toLowerCase().includes(searchTerm.toLowerCase())).map((q) => (
              <div
                key={q.id}
                onClick={() => handleSelectQuestion(q)}
                className={`p-4 rounded-lg cursor-pointer border transition ${selectedQuestion?.id === q.id ? 'bg-primary/5 border-primary' : 'bg-white border-slate-200 hover:border-slate-300'}`}
              >
                <p className="font-medium text-slate-800 mb-1 line-clamp-2">{q.question}</p>
                <p className="text-xs text-slate-500">
                  {q.subject}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200">
        {selectedQuestion || showModal ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-navy mb-6">{selectedQuestion ? 'Edit Public Question' : 'New Public Question'}</h2>

            <div>
              <label className="text-sm font-medium text-slate-700">Subject *</label>
              <select
                className="w-full h-10 px-3 rounded-lg border border-slate-300 mt-1"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="">Select Subject</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Question *</label>
              <textarea
                rows={4}
                className="w-full p-3 rounded-lg border border-slate-300"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter the question text..."
              ></textarea>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Solution (optional)</label>
              <textarea
                rows={6}
                className="w-full p-3 rounded-lg border border-slate-300"
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                placeholder="Provide the solution or explanation..."
              ></textarea>
            </div>

            <div className="flex justify-between pt-4">
              {selectedQuestion && (
                <button
                  onClick={handleDelete}
                  className="text-red-600 font-bold text-sm flex items-center gap-1 hover:text-red-700"
                >
                  <span className="material-symbols-outlined">delete</span> Delete
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                {showModal && !selectedQuestion && (
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
                >
                  {selectedQuestion ? 'Update Public Question' : 'Create Public Question'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <span className="material-symbols-outlined text-6xl mb-4">quiz</span>
            <p className="text-lg">Select a public question to edit or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Admin Exam Type Management ---


export const AdminExams: React.FC = () => {
  const [examTypes, setExamTypes] = React.useState<any[]>([]);
  const [subjects, setSubjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showExamModal, setShowExamModal] = React.useState(false);
  const [showSubjectModal, setShowSubjectModal] = React.useState(false);
  const [editingExam, setEditingExam] = React.useState<any>(null);
  const [editingSubject, setEditingSubject] = React.useState<any>(null);
  const [examFormData, setExamFormData] = React.useState({
    name: '',
    description: '',
  });
  const [subjectFormData, setSubjectFormData] = React.useState({
    name: '',
    description: '',
  });

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [examTypesData, subjectsData] = await Promise.all([
        api.getExamTypes(),
        api.getSubjects(),
      ]);
      setExamTypes(examTypesData);
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEditExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExam) {
        await api.updateExamType(editingExam.id, examFormData);
      } else {
        await api.createExamType(examFormData);
      }
      fetchData();
      setShowExamModal(false);
      setEditingExam(null);
      setExamFormData({ name: '', description: '' });
    } catch (error: any) {
      alert(error.message || 'Failed to save exam type');
    }
  };

  const handleCreateEditSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await api.updateSubject(editingSubject.id, subjectFormData);
      } else {
        await api.createSubject(subjectFormData);
      }
      fetchData();
      setShowSubjectModal(false);
      setEditingSubject(null);
      setSubjectFormData({ name: '', description: '' });
    } catch (error: any) {
      alert(error.message || 'Failed to save subject');
    }
  };

  const openEditExamModal = (exam: any) => {
    setEditingExam(exam);
    setExamFormData({
      name: exam.name,
      description: exam.description || '',
    });
    setShowExamModal(true);
  };

  const openEditSubjectModal = (subject: any) => {
    setEditingSubject(subject);
    setSubjectFormData({
      name: subject.name,
      description: subject.description || '',
    });
    setShowSubjectModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Exam Types Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black text-navy">Exam Type Management</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-200 transition"
            >
              <span className="material-symbols-outlined text-[20px]">refresh</span>
              Refresh
            </button>
            <button
              onClick={() => { setEditingExam(null); setExamFormData({ name: '', description: '' }); setShowExamModal(true); }}
              className="px-4 py-2 bg-primary text-white rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90"
            >
              <span className="material-symbols-outlined">add</span> Add Exam Type
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Exam Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {examTypes.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900">{e.name}</td>
                    <td className="px-6 py-4">{e.description}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditExamModal(e)} className="text-slate-400 hover:text-slate-600 mx-1">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Subjects Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-navy">Subject Management</h2>
          <button
            onClick={() => { setEditingSubject(null); setSubjectFormData({ name: '', description: '' }); setShowSubjectModal(true); }}
            className="px-4 py-2 bg-secondary text-navy rounded-lg font-bold flex items-center gap-2 hover:bg-secondary/90"
          >
            <span className="material-symbols-outlined">add</span> Add Subject
          </button>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Subject Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900">{s.name}</td>
                    <td className="px-6 py-4">{s.description}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditSubjectModal(s)} className="text-slate-400 hover:text-slate-600 mx-1">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Exam Type Modal */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-navy mb-4">{editingExam ? 'Edit Exam Type' : 'Add Exam Type'}</h2>
            <form onSubmit={handleCreateEditExam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Exam Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={examFormData.name}
                  onChange={(e) => setExamFormData({ ...examFormData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  rows={3}
                  value={examFormData.description}
                  onChange={(e) => setExamFormData({ ...examFormData, description: e.target.value })}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowExamModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg font-medium hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90">
                  {editingExam ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-navy mb-4">{editingSubject ? 'Edit Subject' : 'Add Subject'}</h2>
            <form onSubmit={handleCreateEditSubject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
                  value={subjectFormData.name}
                  onChange={(e) => setSubjectFormData({ ...subjectFormData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  rows={3}
                  value={subjectFormData.description}
                  onChange={(e) => setSubjectFormData({ ...subjectFormData, description: e.target.value })}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowSubjectModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg font-medium hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90">
                  {editingSubject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

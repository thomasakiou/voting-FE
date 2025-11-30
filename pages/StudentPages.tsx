import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth-context';
import { useStudentStats } from '../contexts/StudentStatsContext';
import api from '../lib/api';
import type { ResultSummary } from '../lib/api-types';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, isLoading, refreshStats } = useStudentStats();

  // Refresh stats when dashboard mounts to ensure data is up to date
  useEffect(() => {
    refreshStats();
  }, []);



  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const passRate = stats.totalTests > 0 ? Math.round((stats.passedTests / stats.totalTests) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Your Dashboard</h2>
          <p className="text-slate-500 mt-1">Track your progress and performance</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshStats}
            className="h-11 px-4 bg-slate-100 text-slate-700 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-200 transition"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Refresh
          </button>
          <button
            onClick={() => navigate('/student/tests')}
            className="h-11 px-6 bg-primary text-white rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition shadow-sm shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Start a New Test
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Tests', value: stats.totalTests.toString(), color: 'text-slate-900', icon: 'quiz' },
          { label: 'Passed / Failed', value: `${stats.passedTests} / ${stats.failedTests}`, color: 'text-slate-900', icon: 'task_alt' },
          { label: 'Pass Rate', value: `${passRate}%`, color: passRate >= 50 ? 'text-green-600' : 'text-red-600', icon: 'percent' },
          { label: 'Average Score', value: `${stats.averageScore}%`, color: 'text-accent', icon: 'trending_up' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <span className="material-symbols-outlined text-slate-300">{stat.icon}</span>
            </div>
            <p className={`text-3xl font-bold ${stat.color} tracking-tight`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Top Performers</h3>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Global Ranking</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Rank</th>
                  <th className="pb-3">Student</th>
                  <th className="pb-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.leaderboard && stats.leaderboard.length > 0 ? (
                  stats.leaderboard.map((entry: any, index: number) => {
                    let rankDisplay;
                    let rankClass = "font-bold text-slate-400";

                    if (index === 0) {
                      rankDisplay = <span className="text-2xl">🏆</span>;
                      rankClass = "text-yellow-500";
                    } else if (index === 1) {
                      rankDisplay = <span className="text-2xl">🥈</span>;
                      rankClass = "text-slate-400";
                    } else if (index === 2) {
                      rankDisplay = <span className="text-2xl">🥉</span>;
                      rankClass = "text-amber-700";
                    } else {
                      rankDisplay = `#${index + 1}`;
                    }

                    return (
                      <tr key={index} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition">
                        <td className={`py-3 pl-2 ${rankClass}`}>{rankDisplay}</td>
                        <td className="py-3 font-bold text-slate-700">
                          <div className="flex items-center gap-2">
                            <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold uppercase ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                              index === 1 ? 'bg-slate-100 text-slate-600' :
                                index === 2 ? 'bg-amber-100 text-amber-800' :
                                  'bg-slate-100 text-slate-500'
                              }`}>
                              {entry.full_name?.charAt(0) || entry.username?.charAt(0) || '?'}
                            </div>
                            {entry.full_name || entry.username || 'Anonymous'}
                          </div>
                        </td>
                        <td className="py-3 text-right font-bold text-primary">
                          {typeof entry.score === 'number' && !isNaN(entry.score)
                            ? Math.round(entry.score)
                            : 0}%
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">
                      <div className="flex flex-col items-center">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">leaderboard</span>
                        <p>No leaderboard data available yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recentTests.length > 0 ? (
              stats.recentTests.slice(0, 4).map((attempt: any, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`size-10 rounded-full flex items-center justify-center ${attempt.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {attempt.passed ? 'task_alt' : 'highlight_off'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 line-clamp-1">{attempt.test?.title || attempt.subject_name || attempt.test?.subject || 'Unknown Test'}</p>
                    <p className="text-xs text-slate-500">
                      {attempt.end_time ? format(new Date(attempt.end_time), 'MMM dd, yyyy') : 'In Progress'}
                    </p>
                  </div>
                  <span className={`text-sm font-bold ${attempt.passed ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {Math.round(attempt.percentage || 0)}%
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">history_edu</span>
                <p className="text-sm">No tests taken yet</p>
                <button
                  onClick={() => navigate('/student/tests')}
                  className="mt-4 text-primary font-bold text-sm hover:underline"
                >
                  Take your first test
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


import { subjectResources } from '../lib/subject-resources';

export const SubjectDetail: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'formulas' | 'definitions' | 'videos' | 'tips'>('overview');

  const subject = subjectId ? subjectResources[subjectId] : null;

  if (!subject) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-slate-900">Subject Not Found</h2>
        <button onClick={() => navigate('/student/classroom')} className="mt-4 text-primary font-bold hover:underline">
          Back to Classroom
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <span className="material-symbols-outlined text-9xl">{subject.icon}</span>
        </div>
        <button onClick={() => navigate('/student/classroom')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition font-medium">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Classroom
        </button>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-4xl">{subject.icon}</span>
            </div>
            <h1 className="text-4xl font-black text-navy">{subject.name}</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl">{subject.description}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-6">
        {[
          { id: 'overview', label: 'Overview', icon: 'dashboard' },
          ...(subject.formulas ? [{ id: 'formulas', label: 'Formulas', icon: 'function' }] : []),
          ...(subject.definitions ? [{ id: 'definitions', label: 'Definitions', icon: 'book_2' }] : []),
          ...(subject.videos ? [{ id: 'videos', label: 'Video Lectures', icon: 'play_circle' }] : []),
          { id: 'tips', label: 'Tips & Quotes', icon: 'lightbulb' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 pb-4 px-2 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
          >
            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg text-navy mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">topic</span>
                Key Topics
              </h3>
              <ul className="space-y-3">
                {subject.topics.map((topic, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                    <span className="size-2 rounded-full bg-primary"></span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="font-bold text-lg text-blue-900 mb-4">Why Study {subject.name}?</h3>
              <p className="text-blue-800 leading-relaxed">
                {subject.description} Mastering {subject.name} is essential for success in your exams and provides a strong foundation for future studies and career paths.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'formulas' && subject.formulas && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subject.formulas.map((formula, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                <h3 className="font-bold text-slate-900 mb-3">{formula.title}</h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-center text-lg text-slate-800">
                  {formula.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'definitions' && subject.definitions && (
          <div className="grid grid-cols-1 gap-4">
            {subject.definitions.map((def, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex gap-4">
                <div className="min-w-[4px] bg-purple-500 rounded-full"></div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{def.term}</h3>
                  <p className="text-slate-600 leading-relaxed">{def.definition}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'videos' && subject.videos && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subject.videos.map((video, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="aspect-video w-full bg-slate-100">
                  <iframe
                    width="100%"
                    height="100%"
                    src={video.url}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-8">
            {subject.tips && (
              <section>
                <h3 className="font-bold text-lg text-navy mb-4">Study Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subject.tips.map((tip, idx) => (
                    <div key={idx} className="bg-green-50 p-5 rounded-xl border border-green-100 text-green-800">
                      <span className="material-symbols-outlined mb-2">check_circle</span>
                      <p className="font-medium">{tip}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {subject.quotes && (
              <section>
                <h3 className="font-bold text-lg text-navy mb-4">Inspiration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subject.quotes.map((quote, idx) => (
                    <div key={idx} className="bg-orange-50 p-6 rounded-xl border border-orange-100 relative">
                      <span className="material-symbols-outlined text-orange-200 text-6xl absolute top-4 left-4 opacity-50">format_quote</span>
                      <div className="relative z-10">
                        <p className="text-lg italic text-slate-800 mb-3 font-serif">"{quote.text}"</p>
                        <p className="text-right font-bold text-orange-800">— {quote.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const Classroom: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Convert subjectResources object to array
  const subjects = Object.values(subjectResources);

  const filteredSubjects = subjects.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between gap-4 items-end">
        <div>
          <h1 className="text-4xl font-black text-navy">My Classroom</h1>
          <p className="text-slate-500 mt-2">Select a subject to access study materials, videos, and more.</p>
        </div>
        <div className="relative w-full md:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Search a subject..."
            className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/50 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSubjects.map((sub) => (
            <div key={sub.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition hover:border-primary/30 group flex flex-col h-full">
              <div className="size-14 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-accent">
                <span className="material-symbols-outlined text-3xl">{sub.icon}</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">{sub.name}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                {sub.description}
              </p>
              <button
                onClick={() => navigate(`/student/classroom/${sub.id}`)}
                className="w-full py-2.5 rounded-lg bg-secondary text-white font-bold text-sm hover:bg-green-600 transition flex items-center justify-center gap-2"
              >
                <span>Open Classroom</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <span className="material-symbols-outlined text-6xl mb-4 opacity-50">school</span>
          <p className="text-lg font-medium">
            {searchTerm ? 'No subjects found matching your search' : 'No subjects available'}
          </p>
        </div>
      )}
    </div>
  );
};

export const Forum: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', subject: '' });
  const [submitting, setSubmitting] = useState(false);
  const [replyContent, setReplyContent] = useState<Record<number, string>>({});
  const [showReplies, setShowReplies] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const data = Object.values(subjectResources);
    setSubjects(data);
    if (data.length > 0) {
      setSelectedSubject(data[0].name);
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!selectedSubject) return;
      setLoading(true);
      try {
        const response = await api.getForumPosts({ subject: selectedSubject });
        setPosts(response.posts || []);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedSubject]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPost.title || !newPost.content || !newPost.subject) return;
    setSubmitting(true);
    try {
      const created = await api.createForumPost({
        title: newPost.title,
        content: newPost.content,
        subject: newPost.subject,
      });
      setPosts([created, ...posts]);
      setNewPost({ title: '', content: '', subject: '' });
      setShowNewPostForm(false);
    } catch (error: any) {
      alert(error.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikePost = async (postId: number) => {
    if (!user) return;
    try {
      const response = await api.likeForumPost(postId);
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: response.likes } : p));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleAddReply = async (postId: number) => {
    if (!user || !replyContent[postId]?.trim()) return;
    try {
      const reply = await api.createForumReply(postId, { content: replyContent[postId] });
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, replyCount: p.replyCount + 1, replies: [...(p.replies || []), reply] };
        }
        return p;
      }));
      setReplyContent({ ...replyContent, [postId]: '' });
    } catch (error: any) {
      alert(error.message || 'Failed to add reply');
    }
  };

  const toggleReplies = async (postId: number) => {
    const isShowing = showReplies[postId];
    if (!isShowing) {
      try {
        const replies = await api.getForumReplies(postId);
        setPosts(posts.map(p => p.id === postId ? { ...p, replies } : p));
      } catch (error) {
        console.error('Failed to fetch replies:', error);
      }
    }
    setShowReplies({ ...showReplies, [postId]: !isShowing });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between gap-4 items-end">
        <div>
          <h1 className="text-4xl font-black text-navy">Discussion Forum</h1>
          <p className="text-slate-500 mt-2">Ask questions and share knowledge with fellow students.</p>
        </div>
        <button
          onClick={() => setShowNewPostForm(!showNewPostForm)}
          className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span> New Post
        </button>
      </div>

      {showNewPostForm && (
        <form onSubmit={handleCreatePost} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-navy">Create New Post</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <select
              className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary/20 outline-none"
              value={newPost.subject}
              onChange={(e) => setNewPost({ ...newPost, subject: e.target.value })}
              required
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>{subject.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="What's your question or topic?"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              rows={4}
              placeholder="Provide details about your question..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              required
            ></textarea>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowNewPostForm(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition disabled:opacity-50">{submitting ? 'Posting...' : 'Post'}</button>
          </div>
        </form>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => setSelectedSubject(subject.name)}
            className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition ${selectedSubject === subject.name ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {subject.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="size-10 rounded-full bg-gradient-to-tr from-orange-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {post.author?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-navy mb-1">{post.title}</h3>
                    <p className="text-sm text-slate-500">by {post.author?.name || 'Anonymous'} • {format(new Date(post.createdAt), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-4">{post.content}</p>
                <div className="flex items-center gap-6 text-sm">
                  <button onClick={() => handleLikePost(post.id)} className="flex items-center gap-1 text-slate-500 hover:text-accent transition">
                    <span className="material-symbols-outlined text-[20px]">thumb_up</span>
                    <span>{post.likes || 0}</span>
                  </button>
                  <button onClick={() => toggleReplies(post.id)} className="flex items-center gap-1 text-slate-500 hover:text-primary transition">
                    <span className="material-symbols-outlined text-[20px]">comment</span>
                    <span>{post.replyCount || 0} Replies</span>
                  </button>
                </div>
              </div>

              {showReplies[post.id] && (
                <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-4">
                  {post.replies && post.replies.length > 0 ? (
                    post.replies.map((reply: any, idx: number) => (
                      <div key={idx} className="flex gap-3">
                        <div className="size-8 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                          {reply.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900">{reply.user?.name || 'Anonymous'}</p>
                          <p className="text-sm text-slate-600 mt-1">{reply.content}</p>
                          <p className="text-xs text-slate-400 mt-1">{format(new Date(reply.createdAt), 'MMM dd, yyyy')}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-4">No replies yet. Be the first to reply!</p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                      placeholder="Write a reply..."
                      value={replyContent[post.id] || ''}
                      onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })}
                    />
                    <button onClick={() => handleAddReply(post.id)} className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition text-sm">Reply</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <span className="material-symbols-outlined text-6xl mb-4 opacity-50">forum</span>
          <p className="text-lg font-medium">No posts yet in this subject</p>
          <button onClick={() => setShowNewPostForm(true)} className="mt-4 text-primary font-bold hover:underline">Create the first post</button>
        </div>
      )}
    </div>
  );
};

export const Profile: React.FC = () => {
  const { user, logout, updateUserData } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
    email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const updated = await api.updateUser(user.id, formData);
      updateUserData(updated);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-black text-slate-900">Profile Settings</h1>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row items-center gap-6">
          <div className="size-24 rounded-full bg-gradient-to-tr from-orange-400 to-purple-500 shadow-inner flex items-center justify-center text-white text-3xl font-bold">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900">{user.full_name}</h2>
            <p className="text-slate-500">{user.username}</p>
            <p className="text-xs text-slate-400 mt-1">
              Role: <span className="font-medium">{user.role}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <h3 className="font-bold text-lg">Personal Information</h3>

          {message.text && (
            <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
              {message.text}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
                required
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
                required
                disabled={saving}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
                required
                disabled={saving}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <div className="p-6 border-t border-slate-200">
          <h3 className="font-bold text-lg mb-4">Security</h3>
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600">Update your password to keep your account secure.</p>
            <button className="px-4 py-2 border border-secondary text-secondary font-bold rounded-lg text-sm hover:bg-green-50 transition">
              Change Password
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-red-50/50">
          <h3 className="font-bold text-lg text-red-600 mb-4">Account Actions</h3>
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600">Logging out will end your current session.</p>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-100 text-red-600 font-bold rounded-lg text-sm hover:bg-red-200 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

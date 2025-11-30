import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export const PublicQuestionsPage: React.FC = () => {
    const [questions, setQuestions] = useState<any[]>([]);
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
    const [selectedSubject, setSelectedSubject] = useState<string | null>('Mathematics');
    const [loading, setLoading] = useState(true);
    const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!selectedSubject) return;
            setLoading(true);
            try {
                console.log('Fetching public questions for subject:', selectedSubject);
                const data = await api.getAllPublicQuestions({ subject: selectedSubject });
                console.log('API returned questions:', data);

                // Filter to ensure only questions for the selected subject are shown
                const filtered = data.filter((q: any) => q.subject === selectedSubject);
                setQuestions(filtered);
                console.log(`Showing ${filtered.length} questions for subject "${selectedSubject}"`);
            } catch (error) {
                console.error('Failed to fetch public questions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [selectedSubject]);

    const toggleSolution = (questionId: number) => {
        const newExpanded = new Set(expandedQuestions);
        if (newExpanded.has(questionId)) {
            newExpanded.delete(questionId);
        } else {
            newExpanded.add(questionId);
        }
        setExpandedQuestions(newExpanded);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Practice Questions</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
                    Browse free practice questions from our database. Study at your own pace and test your knowledge!
                </p>
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 max-w-2xl mx-auto mb-6">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">info</span>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-900 mb-2">Want More Features?</h3>
                            <p className="text-sm text-slate-700">
                                Sign up to access <strong>live practice tests</strong> with real-time feedback,
                                timer, instant scoring, and personalized performance tracking!
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    <Link
                        to="/signup"
                        className="inline-flex h-12 px-8 items-center justify-center rounded-lg bg-primary text-white text-base font-bold hover:bg-primary/90 transition shadow-sm shadow-primary/20"
                    >
                        Start Live Practice
                    </Link>
                    <Link
                        to="/login"
                        className="inline-flex h-12 px-6 items-center justify-center rounded-lg bg-slate-100 text-slate-900 text-base font-medium hover:bg-slate-200 transition"
                    >
                        Already have an account?
                    </Link>
                </div>
            </div>

            {/* Subject Filter */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
                {subjects.map((subject) => (
                    <button
                        key={subject.id}
                        onClick={() => setSelectedSubject(subject.name)}
                        className={`px-6 py-3 rounded-lg font-bold text-sm whitespace-nowrap transition ${selectedSubject === subject.name
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {subject.name}
                    </button>
                ))}
            </div>

            {/* Stats */}
            {!loading && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Available Questions</p>
                            <p className="text-3xl font-bold text-slate-900">{questions.length}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500 font-medium">Subject</p>
                            <p className="text-xl font-bold text-primary">{selectedSubject}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Questions */}
            {loading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : questions.length > 0 ? (
                <div className="space-y-6">
                    {questions.map((question, index) => (
                        <div
                            key={question.id}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-lg text-slate-900 font-medium mb-4 whitespace-pre-wrap">{question.question}</p>

                                        {/* Solution Toggle */}
                                        {question.solution && (
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => toggleSolution(question.id)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-lg font-medium hover:bg-secondary/20 transition"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        {expandedQuestions.has(question.id) ? 'visibility_off' : 'visibility'}
                                                    </span>
                                                    {expandedQuestions.has(question.id) ? 'Hide Solution' : 'Show Solution'}
                                                </button>

                                                {expandedQuestions.has(question.id) && (
                                                    <div className="mt-4 p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                                                        <div className="flex items-start gap-2 mb-2">
                                                            <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                                                            <h4 className="font-bold text-secondary">Solution:</h4>
                                                        </div>
                                                        <p className="text-slate-700 whitespace-pre-wrap">{question.solution}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Metadata */}
                                        <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[18px]">category</span>
                                                <span>{question.subject}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                                <span>{new Date(question.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Bottom CTA */}
                    <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-8 text-center text-white">
                        <h3 className="text-2xl font-bold mb-2">Ready for Live Practice?</h3>
                        <p className="mb-6 opacity-90">
                            Get instant feedback, track your progress, and master every subject with our interactive practice tests!
                        </p>
                        <Link
                            to="/signup"
                            className="inline-flex h-12 px-8 items-center justify-center rounded-lg bg-white text-primary text-base font-bold hover:bg-slate-100 transition shadow-lg"
                        >
                            Sign Up Now - It's Free!
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 text-slate-400">
                    <span className="material-symbols-outlined text-6xl mb-4 opacity-50">quiz</span>
                    <p className="text-lg font-medium">No questions available in this subject yet</p>
                    <Link
                        to="/signup"
                        className="mt-4 inline-block text-primary font-bold hover:underline"
                    >
                        Sign up to get notified when questions are added
                    </Link>
                </div>
            )}
        </div>
    );
};

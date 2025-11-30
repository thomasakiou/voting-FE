import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { format } from 'date-fns';

export const PublicForumPage: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    // Hardcoded subjects for forum - only these will be available
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

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Discussion Forum</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Browse discussions from our community. Sign up to join the conversation!
                </p>
                <div className="mt-6">
                    <Link
                        to="/signup"
                        className="inline-flex h-12 px-8 items-center justify-center rounded-lg bg-primary text-white text-base font-bold hover:bg-primary/90 transition shadow-sm shadow-primary/20"
                    >
                        Join the Discussion
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

            {/* Posts */}
            {loading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : posts.length > 0 ? (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="size-12 rounded-full bg-gradient-to-tr from-orange-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                        {post.author?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-navy mb-1">{post.title}</h3>
                                        <p className="text-sm text-slate-500">
                                            by {post.author?.name || 'Anonymous'} • {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-slate-700 mb-4">{post.content}</p>
                                <div className="flex items-center gap-6 text-sm text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[20px]">thumb_up</span>
                                        <span>{post.likes || 0} Likes</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[20px]">comment</span>
                                        <span>{post.replyCount || 0} Replies</span>
                                    </div>
                                </div>
                            </div>

                            {/* Login prompt for interaction */}
                            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
                                <p className="text-sm text-slate-600">
                                    <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link> or{' '}
                                    <Link to="/signup" className="text-primary font-bold hover:underline">sign up</Link> to reply to this discussion
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-slate-400">
                    <span className="material-symbols-outlined text-6xl mb-4 opacity-50">forum</span>
                    <p className="text-lg font-medium">No posts yet in this subject</p>
                    <Link
                        to="/signup"
                        className="mt-4 inline-block text-primary font-bold hover:underline"
                    >
                        Be the first to start a discussion
                    </Link>
                </div>
            )}
        </div>
    );
};

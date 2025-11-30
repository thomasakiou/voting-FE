import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { format } from 'date-fns';

export const PublicNewsPage: React.FC = () => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                // Fetch all news and sort by date (most recent first)
                const data = await api.getNews();
                // Sort by date descending (most recent first)
                const sorted = data.sort((a: any, b: any) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setNews(sorted);
            } catch (error) {
                console.error('Failed to fetch news:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    // Calculate pagination
    const totalPages = Math.ceil(news.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNews = news.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Latest Exam Updates</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Stay informed with the latest news, updates, and announcements about WAEC, NECO, JAMB, and other examinations.
                </p>
            </div>

            {/* News List */}
            {loading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : currentNews.length > 0 ? (
                <>
                    <div className="space-y-6">
                        {currentNews.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition"
                            >
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className="size-12 rounded-full bg-danger/10 flex items-center justify-center text-danger shrink-0">
                                            <span className="material-symbols-outlined text-2xl">newspaper</span>
                                        </div>

                                        <div className="flex-1">
                                            {/* Title */}
                                            <h2 className="text-2xl font-bold text-navy mb-2">{item.title}</h2>

                                            {/* Date */}
                                            <p className="text-sm text-slate-500 mb-4">
                                                <span className="material-symbols-outlined text-[16px] align-middle mr-1">calendar_today</span>
                                                {format(new Date(item.date), 'MMMM dd, yyyy')}
                                            </p>

                                            {/* Content */}
                                            <p className="text-slate-700 mb-4 whitespace-pre-wrap">{item.content}</p>

                                            {/* Source Link */}
                                            {item.url && (
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                                                >
                                                    <span>Read more</span>
                                                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center items-center gap-2">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Previous
                            </button>

                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`size-10 rounded-lg font-medium transition ${currentPage === page
                                            ? 'bg-primary text-white'
                                            : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="mt-6 text-center text-sm text-slate-500">
                        Showing {startIndex + 1} - {Math.min(endIndex, news.length)} of {news.length} news articles
                    </div>
                </>
            ) : (
                <div className="text-center py-16 text-slate-400">
                    <span className="material-symbols-outlined text-6xl mb-4 opacity-50">newspaper</span>
                    <p className="text-lg font-medium">No news available at the moment</p>
                    <p className="text-sm mt-2">Check back later for updates</p>
                </div>
            )}

            {/* CTA */}
            <div className="mt-12 bg-gradient-to-r from-primary to-accent rounded-xl p-8 text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Stay Updated!</h3>
                <p className="mb-6 opacity-90">
                    Sign up to receive notifications about important exam updates and deadlines.
                </p>
                <Link
                    to="/signup"
                    className="inline-flex h-12 px-8 items-center justify-center rounded-lg bg-white text-primary text-base font-bold hover:bg-slate-100 transition shadow-lg"
                >
                    Create Free Account
                </Link>
            </div>
        </div>
    );
};

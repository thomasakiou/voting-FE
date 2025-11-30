import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Video {
    id: number;
    title: string;
    subject: string;
    description: string;
    duration: string;
    youtubeId: string;
    price: string;
    thumbnail?: string;
}

export const VideoPage: React.FC = () => {
    const [unlockedVideos, setUnlockedVideos] = useState<number[]>([]);

    const videos: Video[] = [
        {
            id: 1,
            title: 'Algebra Basics: Solving 2-Step Equations',
            subject: 'Mathematics',
            description: 'Learn the fundamental steps to solve two-step algebraic equations. Perfect for beginners.',
            duration: '10:25',
            youtubeId: 'LwCRRUa8yTU', // Math Antics
            price: '₦500'
        },
        {
            id: 2,
            title: 'Introduction to Cells: The Grand Cell Tour',
            subject: 'Biology',
            description: 'Explore the fascinating world of cells, their structures, and functions in this comprehensive guide.',
            duration: '15:30',
            youtubeId: '8IlzKri08kk', // Amoeba Sisters
            price: '₦500'
        },
        {
            id: 3,
            title: 'The Periodic Table: Crash Course Chemistry',
            subject: 'Chemistry',
            description: 'Understand the organization of the periodic table and the properties of elements.',
            duration: '11:20',
            youtubeId: '0RRVV4Diomg', // Crash Course
            price: '₦500'
        },
        {
            id: 4,
            title: 'Newton\'s Laws of Motion',
            subject: 'Physics',
            description: 'A clear explanation of Newton\'s three laws of motion with real-world examples.',
            duration: '12:45',
            youtubeId: 'kKKM8Y-u7ds', // Crash Course Physics
            price: '₦500'
        },
        {
            id: 5,
            title: 'Essay Writing Guide',
            subject: 'English',
            description: 'Master the art of writing compelling essays for your exams. Structure, flow, and tips.',
            duration: '14:10',
            youtubeId: 'U_U88Jv6bFk', // Generic placeholder
            price: '₦500'
        },
        {
            id: 6,
            title: 'Demand and Supply Explained',
            subject: 'Economics',
            description: 'Understand the core concepts of market equilibrium, demand curves, and supply factors.',
            duration: '09:50',
            youtubeId: 'LwLh6ax0zTE', // Generic placeholder
            price: '₦500'
        }
    ];

    const handlePay = (id: number) => {
        setUnlockedVideos(prev => [...prev, id]);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Video Lessons</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Master difficult topics with our expert-led video tutorials. Unlock high-quality lessons to boost your exam preparation.
                </p>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => {
                    const isUnlocked = unlockedVideos.includes(video.id);

                    return (
                        <div key={video.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition flex flex-col">
                            {/* Video Player / Thumbnail Area */}
                            <div className="relative aspect-video bg-slate-900">
                                {isUnlocked ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0"
                                    ></iframe>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm p-6 text-center">
                                        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg)` }}></div>
                                        <div className="relative z-10 flex flex-col items-center">
                                            <span className="material-symbols-outlined text-5xl text-white mb-3">lock</span>
                                            <h3 className="text-white font-bold text-lg mb-4 drop-shadow-md">{video.title}</h3>
                                            <button
                                                onClick={() => handlePay(video.id)}
                                                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg transition transform active:scale-95 flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined">play_arrow</span>
                                                Play
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                                        {video.subject}
                                    </span>
                                    <span className="text-sm text-slate-500 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base">schedule</span>
                                        {video.duration}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{video.title}</h3>
                                <p className="text-slate-600 text-sm mb-4 flex-1">{video.description}</p>


                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CTA */}
            <div className="mt-16 text-center bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Need more personalized help?</h3>
                <p className="text-slate-600 mb-6">Join our classroom for live interactive sessions with expert tutors.</p>
                <Link
                    to="/signup"
                    className="inline-flex h-12 px-8 items-center justify-center rounded-lg border-2 border-primary text-primary text-base font-bold hover:bg-primary hover:text-white transition"
                >
                    Join Classroom
                </Link>
            </div>
        </div>
    );
};

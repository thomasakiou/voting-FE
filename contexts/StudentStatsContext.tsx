import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth-context';
import api from '../lib/api';

interface StudentStats {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    averageScore: number;
    totalTimeSpent: number;
    subjectPerformance: { subject: string; score: number }[];
    recentTests: any[];
    leaderboard: any[];
}

interface StudentStatsContextType {
    stats: StudentStats;
    isLoading: boolean;
    refreshStats: () => void;
}

const StudentStatsContext = createContext<StudentStatsContextType | undefined>(undefined);

export const StudentStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [stats, setStats] = useState<StudentStats>({
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        subjectPerformance: [],
        recentTests: [],
        leaderboard: [],
    });
    const [isLoading, setIsLoading] = useState(false);

    const fetchStats = async () => {
        // Only fetch if user is authenticated, is a student, and has an ID
        if (!isAuthenticated || user?.role !== 'student' || !user?.id) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            // Fetch metadata (Subjects & ExamTypes) to resolve names if missing
            const [subjects, examTypes, leaderboardData] = await Promise.all([
                api.getSubjects().catch(() => []),
                api.getExamTypes().catch(() => []),
                api.getLeaderboard().catch(() => [])
            ]);

            const subjectMap = new Map(subjects.map((s: any) => [s.id, s.name]));
            const examTypeMap = new Map(examTypes.map((e: any) => [e.id, e.name]));

            // Fetch real attempts from API
            let apiAttempts: any[] = [];
            try {
                apiAttempts = await api.getUserAttempts(user.id);
            } catch (err) {
                console.warn('Failed to fetch API attempts:', err);
            }

            // Fetch local practice attempts (fallback)
            const localAttempts = JSON.parse(localStorage.getItem('practice_attempts') || '[]');

            // Merge them
            const rawAttempts = [...apiAttempts, ...localAttempts];

            // Enrich attempts with resolved names
            const attempts = rawAttempts.map((attempt: any) => {
                // If test object or title is missing, try to resolve it
                if (!attempt.test?.title) {
                    const subjectName = attempt.subject_name || subjectMap.get(attempt.subject_id) || 'Unknown Subject';
                    const examTypeName = examTypeMap.get(attempt.exam_type_id) || 'Practice';

                    // Create a synthetic test object if it doesn't exist
                    return {
                        ...attempt,
                        subject_name: subjectName,
                        test: {
                            ...attempt.test,
                            title: `${examTypeName}, ${subjectName}`,
                            subject: subjectName
                        }
                    };
                }
                return attempt;
            });

            // Sort by date descending (newest first)
            attempts.sort((a: any, b: any) => {
                const dateA = new Date(a.end_time || a.start_time).getTime();
                const dateB = new Date(b.end_time || b.start_time).getTime();
                return dateB - dateA;
            });

            // if (attempts.length > 0) {
            //     console.log('🔍 First attempt structure:', JSON.stringify(attempts[0], null, 2));
            // }

            // console.log('📊 Stats Context: Loaded attempts', { api: apiAttempts.length, local: localAttempts.length, total: attempts.length });

            // Calculate statistics
            const totalTests = attempts.length;
            const passedTests = attempts.filter((a: any) => Boolean(a.passed)).length;
            const failedTests = totalTests - passedTests;

            const averageScore = attempts.length > 0
                ? Math.round(attempts.reduce((sum: number, a: any) => sum + (Number(a.percentage) || 0), 0) / attempts.length)
                : 0;
            const totalTimeSpent = attempts.reduce((sum: number, a: any) => sum + (Number(a.time_taken) || 0), 0);

            // Group by subject
            const statsSubjectMap = new Map<string, { total: number; count: number }>();
            attempts.forEach((a: any) => {
                // Handle both real tests (with test object) and practice tests (with direct subject_name)
                const subject = a.test?.subject || a.subject_name || 'Practice';
                const current = statsSubjectMap.get(subject) || { total: 0, count: 0 };
                statsSubjectMap.set(subject, {
                    total: current.total + (Number(a.percentage) || 0),
                    count: current.count + 1,
                });
            });

            const subjectPerformance = Array.from(statsSubjectMap.entries()).map(([subject, data]) => ({
                subject,
                score: Math.round(data.total / data.count),
            }));

            const newStats = {
                totalTests,
                passedTests,
                failedTests,
                averageScore,
                totalTimeSpent,
                subjectPerformance,
                recentTests: attempts.slice(0, 10), // Keep last 10
                leaderboard: leaderboardData,
            };

            setStats(newStats);
        } catch (error: any) {
            console.error('Failed to fetch student stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [user?.id, isAuthenticated]);

    return (
        <StudentStatsContext.Provider value={{ stats, isLoading, refreshStats: fetchStats }}>
            {children}
        </StudentStatsContext.Provider>
    );
};

export const useStudentStats = () => {
    const context = useContext(StudentStatsContext);
    if (context === undefined) {
        throw new Error('useStudentStats must be used within a StudentStatsProvider');
    }
    return context;
};

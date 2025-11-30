import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const ExamsPage: React.FC = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash]);
    const exams = [
        {
            name: 'WAEC',
            fullName: 'West African Examinations Council',
            icon: '🎓',
            logo: '/images/waec.png',
            color: 'from-blue-500 to-blue-600',
            description: 'The West African Examinations Council (WAEC) is an examination board that conducts the West African Senior School Certificate Examination (WASSCE) for final year secondary school students.',
            facts: [
                'Established in 1952',
                'Covers 5 West African countries',
                'Over 3 million candidates annually',
                'Results valid for university admission'
            ],
            examStructure: [
                { title: 'Duration', value: '2-3 weeks' },
                { title: 'Subjects', value: 'Minimum 7, Maximum 9' },
                { title: 'Compulsory Subjects', value: 'English, Mathematics, and a Science subject' },
                { title: 'Grading', value: 'A1 to F9 (A1 being the highest)' }
            ],
            fees: [
                { service: 'Registration Fee', price: '₦18,500' },
                { service: 'Result Checker PIN', price: '₦2,500' },
                { service: 'Certificate Collection', price: '₦2,000' },
                { service: 'Statement of Result', price: '₦5,000' }
            ],
            importantDates: [
                { event: 'Registration Period', date: 'November - February' },
                { event: 'Examination Period', date: 'May - June' },
                { event: 'Results Release', date: '45 days after exam' }
            ]
        },
        {
            name: 'NECO',
            fullName: 'National Examinations Council',
            icon: '📚',
            logo: '/images/neco.png',
            color: 'from-green-500 to-green-600',
            description: 'The National Examinations Council (NECO) is a Nigerian examination body that conducts the Senior School Certificate Examination (SSCE) and the General Certificate Examination (GCE).',
            facts: [
                'Established in 1999',
                'Conducts both Internal and External exams',
                'Results accepted by all universities',
                'Offers GCE for private candidates'
            ],
            examStructure: [
                { title: 'Duration', value: '2-3 weeks' },
                { title: 'Subjects', value: 'Minimum 7, Maximum 9' },
                { title: 'Compulsory Subjects', value: 'English Language and Mathematics' },
                { title: 'Grading', value: 'A1 to F9 (A1 being the highest)' }
            ],
            fees: [
                { service: 'SSCE Internal Registration', price: '₦14,850' },
                { service: 'SSCE External (GCE)', price: '₦16,500' },
                { service: 'Result Checker Card', price: '₦1,000' },
                { service: 'Certificate Collection', price: '₦1,500' }
            ],
            importantDates: [
                { event: 'SSCE Registration', date: 'January - March' },
                { event: 'SSCE Examination', date: 'June - July' },
                { event: 'GCE Registration', date: 'August - September' },
                { event: 'GCE Examination', date: 'November - December' }
            ]
        },
        {
            name: 'JAMB',
            fullName: 'Joint Admissions and Matriculation Board',
            icon: '🎯',
            logo: '/images/jamb.png',
            color: 'from-purple-500 to-purple-600',
            description: 'The Joint Admissions and Matriculation Board (JAMB) is a Nigerian entrance examination board for tertiary-level institutions. It conducts the Unified Tertiary Matriculation Examination (UTME).',
            facts: [
                'Established in 1978',
                'Mandatory for university admission',
                'Computer-based examination',
                'Over 1.8 million candidates annually'
            ],
            examStructure: [
                { title: 'Duration', value: '2 hours' },
                { title: 'Subjects', value: '4 subjects' },
                { title: 'Question Format', value: '180 questions (45 per subject)' },
                { title: 'Scoring', value: '400 maximum score' }
            ],
            fees: [
                { service: 'UTME Registration', price: '₦4,700' },
                { service: 'Direct Entry Registration', price: '₦4,700' },
                { service: 'Result Reprint', price: '₦1,000' },
                { service: 'Change of Course/Institution', price: '₦2,500' }
            ],
            importantDates: [
                { event: 'Registration Period', date: 'January - March' },
                { event: 'Mock Examination', date: 'April' },
                { event: 'Main Examination', date: 'May - June' },
                { event: 'Results Release', date: 'Within 48 hours' }
            ]
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Nigerian Examination Guide</h1>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                    Everything you need to know about WAEC, NECO, and JAMB examinations - from registration to results.
                </p>
            </div>

            {/* Exams */}
            <div className="space-y-16">
                {exams.map((exam, index) => (
                    <div key={exam.name} id={exam.name.toLowerCase()}>
                        {/* Exam Header */}
                        <div className={`bg-gradient-to-r ${exam.color} rounded-2xl p-8 text-white mb-8`}>
                            <div className="flex items-center gap-6 mb-4">
                                {exam.logo ? (
                                    <div className="size-24 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg shrink-0">
                                        <img src={exam.logo} alt={`${exam.name} Logo`} className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <span className="text-6xl">{exam.icon}</span>
                                )}
                                <div>
                                    <h2 className="text-4xl font-black">{exam.name}</h2>
                                    <p className="text-xl opacity-90">{exam.fullName}</p>
                                </div>
                            </div>
                            <p className="text-lg opacity-95 leading-relaxed">{exam.description}</p>
                        </div>

                        {/* Quick Facts */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
                            <h3 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">lightbulb</span>
                                Quick Facts
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {exam.facts.map((fact, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
                                        <span className="text-slate-700">{fact}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Exam Structure */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
                            <h3 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">school</span>
                                Exam Structure
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {exam.examStructure.map((item, idx) => (
                                    <div key={idx} className="border-l-4 border-primary pl-4">
                                        <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                                        <p className="text-slate-600">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fees */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
                            <h3 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">payments</span>
                                Fees & Charges
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="text-left py-3 px-4 font-bold text-slate-900">Service</th>
                                            <th className="text-right py-3 px-4 font-bold text-slate-900">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exam.fees.map((fee, idx) => (
                                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="py-3 px-4 text-slate-700">{fee.service}</td>
                                                <td className="py-3 px-4 text-right font-bold text-primary">{fee.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Important Dates */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">calendar_month</span>
                                Important Dates
                            </h3>
                            <div className="space-y-3">
                                {exam.importantDates.map((date, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <span className="font-medium text-slate-900">{date.event}</span>
                                        <span className="text-primary font-bold">{date.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA Section */}
            <div className="mt-16 bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Start Preparing?</h2>
                <p className="text-lg md:text-xl opacity-95 mb-8 max-w-2xl mx-auto">
                    Join thousands of students who are using our platform to ace their WAEC, NECO, and JAMB examinations.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link
                        to="/signup"
                        className="inline-flex h-14 px-8 items-center justify-center rounded-lg bg-white text-primary text-lg font-bold hover:bg-slate-100 transition shadow-lg"
                    >
                        Create Free Account
                    </Link>
                    <Link
                        to="/questions"
                        className="inline-flex h-14 px-8 items-center justify-center rounded-lg border-2 border-white text-white text-lg font-bold hover:bg-white/10 transition"
                    >
                        Browse Practice Questions
                    </Link>
                </div>
            </div>

            {/* Quick Links */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
                <Link
                    to="/news"
                    className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition text-center"
                >
                    <span className="material-symbols-outlined text-4xl text-danger mb-3">newspaper</span>
                    <h3 className="font-bold text-slate-900 mb-2">Latest Updates</h3>
                    <p className="text-sm text-slate-600">Stay informed about exam news and changes</p>
                </Link>
                <Link
                    to="/forum"
                    className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition text-center"
                >
                    <span className="material-symbols-outlined text-4xl text-accent mb-3">forum</span>
                    <h3 className="font-bold text-slate-900 mb-2">Discussion Forum</h3>
                    <p className="text-sm text-slate-600">Connect with other students preparing for exams</p>
                </Link>
                <Link
                    to="/questions"
                    className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition text-center"
                >
                    <span className="material-symbols-outlined text-4xl text-secondary mb-3">quiz</span>
                    <h3 className="font-bold text-slate-900 mb-2">Practice Questions</h3>
                    <p className="text-sm text-slate-600">Access thousands of past questions</p>
                </Link>
            </div>
        </div>
    );
};

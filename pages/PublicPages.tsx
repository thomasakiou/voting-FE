import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import type { NewsResponse } from '../lib/api-types';
import { format } from 'date-fns';

export const LandingPage: React.FC = () => {
  const [news, setNews] = useState<NewsResponse[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await api.getNews(0, 3); // Get latest 3 news items
        setNews(newsData);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="px-6 py-20 md:py-32 text-center bg-white">
        <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
            Ace Your Exams with <span className="text-primary">Confidence</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            MyExamPadi provides all the tools you need to succeed in your WAEC, NECO, and JAMB exams. From practice tests to expert-led lessons, we're with you every step of the way.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link to="/signup" className="h-12 px-8 flex items-center justify-center rounded-lg bg-primary text-white text-base font-bold hover:bg-primary/90 transition">Start Studying</Link>
            <Link to="/login" className="h-12 px-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-900 text-base font-bold hover:bg-slate-200 transition">Practice Tests</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6 bg-background-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">About MyExamPadi</h2>
            <p className="text-slate-600 mt-2">Everything you need to prepare and pass your exams in one place.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'description', color: 'text-secondary', title: 'Unlimited Practice Tests', desc: 'Access thousands of past questions and mock exams.', link: '/questions' },
              { icon: 'play_circle', color: 'text-primary', title: 'Video Lessons', desc: 'Learn from the best with comprehensive video tutorials.', link: '/videos' },
              { icon: 'forum', color: 'text-accent', title: 'Discussion Forums', desc: 'Connect with fellow students and share insights.', link: '/forum' },
              { icon: 'newspaper', color: 'text-danger', title: 'Latest Exam Updates', desc: 'Stay informed on registration and schedules.', link: '/news' },
            ].map((feature, idx) => (
              <Link
                key={idx}
                to={feature.link}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition hover:-translate-y-1 block"
              >
                <span className={`material-symbols-outlined text-4xl mb-4 ${feature.color}`}>{feature.icon}</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Categories */}
      <section id="exams" className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Prepare for Your Exams</h2>
            <p className="text-slate-600 mt-2">Get comprehensive information about WAEC, NECO, and JAMB examinations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['WAEC', 'NECO', 'JAMB'].map((exam) => (
              <Link
                key={exam}
                to={`/exams#${exam.toLowerCase()}`}
                className="group relative p-6 rounded-xl border border-slate-200 hover:shadow-xl transition block overflow-hidden"
              >
                {/* Background Logo/Watermark */}
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity select-none pointer-events-none">
                  <span className="text-9xl font-black text-slate-900 tracking-tighter">
                    {exam}
                  </span>
                </div>

                <div className="relative z-10">
                  <div className="h-40 bg-white rounded-lg mb-4 flex items-center justify-center shadow-sm border border-slate-100 p-4">
                    <img
                      src={`/images/${exam.toLowerCase()}.png`}
                      alt={`${exam} Logo`}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{exam}</h3>
                  <p className="text-sm text-slate-600 mt-2 mb-4">Learn about fees, dates, structure, and requirements for {exam}.</p>
                  <span className="text-primary font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section id="news" className="py-16 px-6 bg-background-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Latest Exam News</h2>
            <p className="text-slate-600 mt-2">Stay updated with the latest exam announcements and updates</p>
          </div>

          {loadingNews ? (
            <div className="flex justify-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    <span>{format(new Date(item.date), 'MMM dd, yyyy')}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">{item.content}</p>
                  <span className="text-primary font-bold text-sm inline-flex items-center gap-1">
                    Read More <span className="material-symbols-outlined text-sm">arrow_outward</span>
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <span className="material-symbols-outlined text-5xl mb-4 opacity-50">newspaper</span>
              <p>No news available at the moment</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    // Construct mailto link
    const mailtoLink = `mailto:prothomsolutions@gmail.com?subject=${encodeURIComponent(subject || 'New Message from MyExamPadi Contact Form')}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    window.location.href = mailtoLink;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <p className="text-primary font-bold mb-2">Contact Us</p>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900">Get in Touch</h1>
        <p className="text-slate-600 mt-4 max-w-2xl mx-auto">We're here to help and answer any questions you might have.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Contact Information</h3>
            <p className="text-sm text-slate-600">Fill up the form and our team will get back to you within 24 hours.</p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Email</p>
                <p className="font-semibold text-slate-900">prothomsolutions@gmail.com</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Phone</p>
                <p className="font-semibold text-slate-900">+234 705 930 8626</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Address</p>
                <p className="font-semibold text-slate-900">Abuja, Nigeria</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="How can we help?"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Type your message here..."
                required
              ></textarea>
            </div>
            <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-500">Last Updated: October 26, 2023</p>
      </div>

      <div className="prose prose-slate max-w-none">
        <p>Welcome to MyExamPadi. We are committed to protecting your privacy and ensuring that your personal data is handled in a safe and responsible manner.</p>

        <h3>Information We Collect</h3>
        <p>We collect information to provide and improve our services. The types of information we collect include:</p>
        <ul>
          <li><strong>Personal data:</strong> Name, email address, school details.</li>
          <li><strong>Usage data:</strong> Test scores, progress, time spent.</li>
          <li><strong>Technical data:</strong> IP address, browser type.</li>
        </ul>

        <h3>How We Use Your Information</h3>
        <ul>
          <li>Personalize learning experience.</li>
          <li>Track academic progress.</li>
          <li>Communication regarding account and updates.</li>
        </ul>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 not-prose my-8">
          <h4 className="font-bold text-slate-900 mb-2">Contact Us</h4>
          <p className="text-slate-600 text-sm mb-4">If you have questions about this policy, please contact us.</p>
          <a href="mailto:privacy@myexampadi.com" className="text-primary font-medium hover:underline">privacy@myexampadi.com</a>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Terms and Conditions</h1>
        <p className="text-slate-500">Last Updated: October 26, 2023</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8">
        <section>
          <h3>1. Introduction</h3>
          <p>These Terms govern your use of MyExamPadi. By accessing our platform, you agree to these terms.</p>
        </section>

        <section>
          <h3>2. User Accounts</h3>
          <p>You are responsible for safeguarding your password and for all activities that occur under your account.</p>
        </section>

        <section>
          <h3>3. Use of Services</h3>
          <p>Our services are for personal, educational use only. Content must not be reproduced without permission.</p>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm font-medium">
            Note: MyExamPadi is not affiliated with WAEC, NECO, or JAMB.
          </div>
        </section>
      </div>
    </div>
  );
};

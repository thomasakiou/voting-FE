import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../auth-context';

// --- Shared Components ---

const Logo = () => (
  <div className="flex items-center gap-2 text-primary">
    <svg className="size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
    </svg>
    <span className="text-xl font-black tracking-tight text-slate-900">MyExamPadi</span>
  </div>
);

// --- Public Layout (Home, Contact, Legal) ---

export const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/"><Logo /></Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition">Features</a>
            <a href="#exams" className="text-sm font-medium hover:text-primary transition">Exams</a>
            <a href="#news" className="text-sm font-medium hover:text-primary transition">News</a>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:flex h-10 px-4 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold hover:bg-slate-200 transition">Log In</Link>
            <Link to="/signup" className="h-10 px-4 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition shadow-sm shadow-primary/20">Sign Up</Link>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© 2024 MyExamPadi. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-slate-500">
            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Student Layout (Dashboard, Tests, etc.) ---

export const StudentLayout: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const isActive = (path: string) => location.pathname.startsWith(path);

  // Helper function to capitalize first letter of each word
  const capitalizeWords = (str: string) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getUserName = () => {
    if (user?.full_name) {
      // Get only the first name (first word before space)
      const firstName = user.full_name.split(' ')[0];
      return capitalizeWords(firstName);
    }
    return 'Student';
  };

  return (
    <div className="flex min-h-screen bg-background-light">
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col bg-white border-r border-slate-200 z-30">
        <div className="p-4 border-b border-slate-200">
          <Link to="/student/dashboard">
            <Logo />
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link to="/student/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive('/student/dashboard') ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </Link>
          <Link to="/student/tests" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive('/student/tests') ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
            <span className="material-symbols-outlined">quiz</span>
            Tests
          </Link>
          <Link to="/student/classroom" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive('/student/classroom') ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
            <span className="material-symbols-outlined">school</span>
            Classroom
          </Link>
          <Link to="/student/forum" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive('/student/forum') ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
            <span className="material-symbols-outlined">forum</span>
            Forum
          </Link>
          <Link to="/student/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive('/student/profile') ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
            <span className="material-symbols-outlined">person</span>
            Profile
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
          <div className="text-lg font-bold text-slate-900">
            {location.pathname === '/student/dashboard' ? `Hello, ${getUserName()}!` : 'MyExamPadi'}
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
              <input type="text" placeholder="Search..." className="h-10 pl-10 pr-4 rounded-lg bg-slate-100 border-none text-sm focus:ring-2 focus:ring-primary/50 w-64" />
            </div>
            <button className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Link to="/student/profile" className="size-10 rounded-full bg-slate-200 overflow-hidden border border-slate-200">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKOcH2LFiD23TNdzW957OZrXJD8A6ahZHHHk5CoKOPCojRyLnGmcCUJY8h_GrVudc4jXvzfUOROWDJfMG1end3dfi6oTZWuLW9dWI86If5YifHkYwvXLwZkbFmFauL8SoMcRiAEqwbC05ulzw2jKooVdaFg5D-1mqHI8bYjqrxFqP9Cw3AM0DpbsvzbWWtOIbY3xIWA6wssgC9Ag7IetSROXB0ayrzqFOEdmGQKkaLg8O6dgZC5M9mURN8itRJmEQTiTKESp6QA-E" alt="Profile" className="w-full h-full object-cover" />
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// --- Admin Layout ---

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen bg-background-light font-admin">
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30 bg-white border-r border-slate-200">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-center bg-cover rounded-full" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_XtguEdkrvZrGIaz-F6GMEd0KEOpiw41wXg6gN_Llp7a3EzV3hSnNizTaHhN43p2qarY798z6SQYjYnTjPS44qOsMDXhlWSZtuCZf5ZRd02MHJdb--S1eoiNDybXYOTRbOXlGeB9R0M0amgvOg4LUrET35UVvJpVVXRb1sUKx9CTJHOg2aYKE5tCx6M906qr9-fsV7xjCaOSiGQybnsZ3-6T3KQVQU3xSSf8omnS5l7Ww7-2Ylf7BauXD7GeD-yjdt98CMIfGZno")' }}></div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">Admin Name</h1>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
            { path: '/admin/users', icon: 'group', label: 'Users' },
            { path: '/admin/public-questions', icon: 'public', label: 'Public Questions' },
            { path: '/admin/exams', icon: 'auto_stories', label: 'Exam Types' },
            { path: '/admin/questions', icon: 'help_center', label: 'Questions' },
            { path: '/admin/news', icon: 'newspaper', label: 'News' },
          ].map((item) => (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive(item.path) ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span className={`material-symbols-outlined ${isActive(item.path) ? 'fill' : ''}`}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <Link to="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 mb-1">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

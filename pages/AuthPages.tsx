import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth-context';

const AuthSplitLayout: React.FC<{ children: React.ReactNode; image: string; title: string; subtitle: string }> = ({ children, image, title, subtitle }) => (
  <div className="flex min-h-screen w-full bg-white">
    <div className="hidden lg:flex w-1/2 relative bg-primary items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-primary/90 z-10" />
      <img src={image} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="relative z-20 p-12 text-white max-w-lg">
        <div className="flex items-center gap-3 mb-8">
          <svg className="size-10 text-accent" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
          </svg>
          <h1 className="text-3xl font-bold">MyExamPadi</h1>
        </div>
        <h2 className="text-5xl font-bold leading-tight tracking-tight mb-6">{title}</h2>
        <p className="text-lg text-blue-100">{subtitle}</p>
      </div>
    </div>
    <div className="flex-1 flex flex-col justify-center items-center p-8 bg-background-light">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 transition font-medium">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Home
        </Link>
        {children}
      </div>
    </div>
  </div>
);

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = React.useState({ username: '', password: '' });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      // Get user from localStorage to determine role
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        navigate(user.role?.toLowerCase() === 'admin' ? '/admin/dashboard' : '/student/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      image="https://lh3.googleusercontent.com/aida-public/AB6AXuCgNwqcs22_-JyWbs311fk0J68AwVy6ECHAB0iMr0GrDlaIoGd-OghC18x6SgsNPiLaaaXEuGO4_UsMSNBzYGWqXPGBk_Rc7XSNW5Zyln70N7x2AO98KRIsEL0zhmcCgIBIy1a60vWfTtub5Jno0Ge6zYkhNHEqGnUNX8ECkh9-HQZ0I-AY98prTkSMJaKzJUQKTYw8mbziZjCmhaICBlKOeQ7hbm67ULlRTnErCg70lZww9f81qq_dluH1Gi0Om_T9EUCGlWEFK8U"
      title="Your Path to Academic Excellence Starts Here."
      subtitle="Ace your WAEC, NECO, and JAMB with our tailored practice tests and resources."
    >
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-black text-slate-900 mb-2">Welcome Back!</h3>
        <p className="text-slate-500">Log in to continue your path to excellence.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Username or Email</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
            placeholder="Enter username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot Password?</a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none pr-10"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3.5 bg-secondary text-white font-bold rounded-lg hover:bg-green-600 transition shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-600">
        Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign Up</Link>
      </p>
    </AuthSplitLayout>
  );
};

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = React.useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      // After successful registration and auto-login, navigate based on role
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        navigate(user.role?.toLowerCase() === 'admin' ? '/admin/dashboard' : '/student/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      image="https://lh3.googleusercontent.com/aida-public/AB6AXuAD-7iTUZkB7VcZ-8PM2_33AEuqjO9tjN23wpCJ7GzcfpgC9rw8CAyOmBNm996-HIM8Rdo5nrypq2o5Vt0y5z3alfLG28x2M7UQYdqeHKsYY1QvpDjst8ERUrQ_gvadtwl70liuJrYM7YOTm4cBP_Wq1k2pqxFNKUW-MSPubL9KZe1bFoD-0SeFQDa6Z3Vhw40NdhhjJQevwUgs-AM8KP_O8yoTUWVIsePlWYR9p0uAIb8zgCwmSydnC9bt-eUDx3BnhQAmQVZso6A"
      title="Join the Community of Scholars."
      subtitle="Gain access to thousands of practice questions and expert led tutorials."
    >
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-black text-slate-900 mb-2">Create Account</h3>
        <p className="text-slate-500">Get started with practice tests today.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
            placeholder="Enter full name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
            placeholder="Choose username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
              placeholder="Create password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters.</p>
        </div>
        <button
          type="submit"
          className="w-full py-3.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">OR</span></div>
      </div>

      <button className="w-full py-3 border border-slate-300 rounded-lg flex items-center justify-center gap-3 hover:bg-slate-50 transition font-medium text-slate-700">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG8JjmLEjw7cMsGqAhXt3dzB9UgOlomO0to8rEcTM9foX6lDw1Qp5iRXDucOSztsTOxbid33jDBlA6IFh9MAgdeLY42ME0kRQd_Ja74vvbwsI3VfJr_2hC6CI5hCxy3LSnzfujSck4J3pu_b2ScEupgjfAJ7avmFE7XGDheQ26xajV8Np0rXM7bR5p0KAG72PFEFhkKg36oUqBzAjVC9JmPzfkXLz3tB_ACVW5XIwtNMYsBnqZ9z2_06pqvrXieBxan1AryKjCDW0" alt="Google" className="w-5 h-5" />
        Sign up with Google
      </button>

      <p className="mt-8 text-center text-sm text-slate-600">
        Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
      </p>
    </AuthSplitLayout>
  );
};

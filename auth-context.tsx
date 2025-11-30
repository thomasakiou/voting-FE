import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from './lib/api';
import type { UserResponse, UserLogin, UserCreate, LoginResponse } from './lib/api-types';

interface AuthContextType {
    user: UserResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: UserLogin) => Promise<void>;
    register: (data: UserCreate) => Promise<void>;
    logout: () => void;
    updateUserData: (user: UserResponse) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('access_token');

        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('access_token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: UserLogin) => {
        setIsLoading(true);
        try {
            const response: LoginResponse = await api.login(credentials);

            // Store token and user data
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setUser(response.user);
        } catch (error: any) {
            console.error('Login failed:', error);
            throw new Error(error.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: UserCreate) => {
        setIsLoading(true);
        try {
            const newUser = await api.register(data);
            await login({ username: data.username, password: data.password });
        } catch (error: any) {
            console.error('Registration failed:', error);
            setIsLoading(false);
            throw new Error(error.response?.data?.detail || 'Registration failed. Please try again.');
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        window.location.replace('/');
    };

    const updateUserData = (updatedUser: UserResponse) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUserData,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Protected Route Component
interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('ProtectedRoute check:', { isAuthenticated, isLoading, userRole: user?.role, requiredRole });
    }, [isAuthenticated, isLoading, user, requiredRole]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    const token = localStorage.getItem('access_token');

    if (!isAuthenticated || !token) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && user?.role?.toLowerCase() !== requiredRole.toLowerCase()) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Access Denied</h2>
                    <p className="text-center text-slate-600 mb-6">You do not have permission to view this page.</p>

                    <div className="bg-slate-100 p-4 rounded-lg text-sm font-mono text-slate-700 mb-6 overflow-auto">
                        <p><strong>Required Role:</strong> {requiredRole}</p>
                        <p><strong>Your Role:</strong> {user?.role || 'undefined'}</p>
                        <p><strong>User ID:</strong> {user?.id}</p>
                        <p><strong>Username:</strong> {user?.username}</p>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition"
                        >
                            Go Home
                        </button>
                        <button
                            onClick={() => {
                                const role = user?.role?.toLowerCase();
                                if (role === 'admin') navigate('/admin/dashboard');
                                else if (role === 'student') navigate('/student/dashboard');
                                else navigate('/');
                            }}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition"
                        >
                            Go to My Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

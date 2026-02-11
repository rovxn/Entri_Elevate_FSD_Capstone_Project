import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2, ArrowRight } from 'lucide-react';
import { login } from '../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card bg-white border border-border/80 shadow-lg rounded-xl overflow-hidden p-6 md:p-8">
                <div className="auth-header mb-8">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
                        <LogIn className="text-white" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-text-main mb-2">Welcome Back</h2>
                    <p className="text-text-muted text-sm">Sign in to access your dashboard</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text-main">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                            <input
                                type="email"
                                className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2.5 pl-10 text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-text-muted/50 text-sm"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text-main">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                            <input
                                type="password"
                                className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2.5 pl-10 text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-text-muted/50 text-sm"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full h-10 mt-2 text-sm font-semibold rounded-lg hover:translate-y-0 shadow-sm"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : (
                            <>
                                Sign In
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-border/50 text-center">
                    <p className="text-sm text-text-muted">
                        New here?{' '}
                        <Link to="/signup" className="text-primary font-semibold hover:underline">Create account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

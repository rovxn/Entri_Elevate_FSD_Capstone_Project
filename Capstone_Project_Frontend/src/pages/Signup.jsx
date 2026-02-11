import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Loader2, ArrowRight, ChevronDown } from 'lucide-react';
import { signup } from '../services/authService';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'viewer'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signup(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card bg-white border border-border/80 shadow-lg rounded-xl overflow-hidden p-6 md:p-8">
                <div className="auth-header mb-8">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
                        <UserPlus className="text-white" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-text-main mb-2">Create Account</h2>
                    <p className="text-text-muted text-sm">Join cricTracker to mitigate matches</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text-main">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                            <input
                                type="text"
                                className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2.5 pl-10 text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-text-muted/50 text-sm"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text-main">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                            <input
                                type="email"
                                className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2.5 pl-10 text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-text-muted/50 text-sm"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text-main">Access Level</label>
                        <div className="relative">
                            <select
                                className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2.5 text-text-main focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer text-sm"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="viewer">Viewer (Read Only)</option>
                                <option value="scorer">Scorer (Can Update Scores)</option>
                                <option value="admin">Admin (Full Access)</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDown size={14} className="text-text-muted" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full h-10 mt-2 text-sm font-semibold rounded-lg hover:translate-y-0 shadow-sm"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : (
                            <>
                                Create Account
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-border/50 text-center">
                    <p className="text-sm text-text-muted">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

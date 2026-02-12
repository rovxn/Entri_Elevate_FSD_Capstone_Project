import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Trophy, LogOut, User, LayoutDashboard, Menu, X, Settings, BarChart2 } from 'lucide-react';
import { isAuthenticated, logout, getUserRole } from '../services/authService';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = getUserRole();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 group ${isActive(to)
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-text-muted hover:text-text-main hover:bg-black/5'
                }`}
        >
            <Icon size={18} className={`transition-transform duration-200 ${isActive(to) ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );

    return (
        <nav className="nav-wrapper glass border-b border-border/50 sticky top-0 z-50">
            <div className="container h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group shrink-0 z-50">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105 group-hover:rotate-3">
                        <Trophy className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-black tracking-tight text-text-main hidden sm:block">CricTracker</span>
                    <span className="text-xl font-black tracking-tight text-text-main sm:hidden">CT</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-text-main hover:bg-bg-secondary rounded-lg transition-colors z-50"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2">
                    {isAuthenticated() ? (
                        <>
                            <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                            <NavLink to="/players" icon={User} label="Players" />
                            <NavLink to="/analytics" icon={BarChart2} label="Analytics" />
                            {role === 'admin' && (
                                <NavLink to="/admin" icon={Settings} label="Admin" />
                            )}
                            <div className="w-px h-6 bg-border mx-2"></div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-ghost text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:text-error hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-semibold text-text-muted hover:text-primary transition-colors">Login</Link>
                            <Link to="/signup" className="btn btn-primary px-6 shadow-md shadow-primary/25">Get Started</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Navigation Overlay */}
                <div
                    className={`fixed inset-0 bg-bg-main/95 backdrop-blur-xl z-40 transition-all duration-300 md:hidden flex flex-col pt-24 px-6 gap-2 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                        }`}
                >
                    {isAuthenticated() ? (
                        <nav className="flex flex-col gap-2">
                            <Link
                                to="/dashboard"
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive('/dashboard') ? 'bg-white shadow-md border border-border/50' : 'hover:bg-white/50'}`}
                            >
                                <div className={`p-2.5 rounded-lg ${isActive('/dashboard') ? 'bg-primary text-white' : 'bg-bg-secondary text-text-muted'}`}>
                                    <LayoutDashboard size={24} />
                                </div>
                                <span className="text-lg font-bold text-text-main">Dashboard</span>
                            </Link>

                            <Link
                                to="/players"
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive('/players') ? 'bg-white shadow-md border border-border/50' : 'hover:bg-white/50'}`}
                            >
                                <div className={`p-2.5 rounded-lg ${isActive('/players') ? 'bg-primary text-white' : 'bg-bg-secondary text-text-muted'}`}>
                                    <User size={24} />
                                </div>
                                <span className="text-lg font-bold text-text-main">Players</span>
                            </Link>

                            <Link
                                to="/analytics"
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive('/analytics') ? 'bg-white shadow-md border border-border/50' : 'hover:bg-white/50'}`}
                            >
                                <div className={`p-2.5 rounded-lg ${isActive('/analytics') ? 'bg-primary text-white' : 'bg-bg-secondary text-text-muted'}`}>
                                    <BarChart2 size={24} />
                                </div>
                                <span className="text-lg font-bold text-text-main">Analytics</span>
                            </Link>

                            {role === 'admin' && (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive('/admin') ? 'bg-white shadow-md border border-border/50' : 'hover:bg-white/50'}`}
                                >
                                    <div className={`p-2.5 rounded-lg ${isActive('/admin') ? 'bg-primary text-white' : 'bg-bg-secondary text-text-muted'}`}>
                                        <Settings size={24} />
                                    </div>
                                    <span className="text-lg font-bold text-text-main">Admin</span>
                                </Link>
                            )}

                            <div className="mt-8 pt-8 border-t border-border">
                                <button
                                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                    className="w-full btn btn-outline py-3 text-error border-error/20 hover:bg-error/5 hover:border-error flex items-center justify-center gap-2 font-bold"
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </div>
                        </nav>
                    ) : (
                        <div className="flex flex-col gap-4 mt-8">
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="btn btn-outline w-full py-4 text-center justify-center text-lg font-bold"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                onClick={() => setIsMenuOpen(false)}
                                className="btn btn-primary w-full py-4 text-center justify-center text-lg font-bold shadow-lg shadow-primary/20"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

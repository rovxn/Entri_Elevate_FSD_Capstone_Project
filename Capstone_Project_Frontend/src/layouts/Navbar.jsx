import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, LogOut, User, LayoutDashboard } from 'lucide-react';
import { isAuthenticated, logout, getUserRole } from '../services/authService';

const Navbar = () => {
    const navigate = useNavigate();
    const role = getUserRole();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="nav-wrapper">
            <div className="container h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-black dark:bg-white rounded flex items-center justify-center transition-all">
                        <Trophy className="text-white dark:text-black" size={18} />
                    </div>
                    <span className="text-lg font-bold tracking-tight uppercase">CricTracker</span>
                </Link>

                <div className="flex items-center gap-8">
                    {isAuthenticated() ? (
                        <>
                            <Link to="/dashboard" className="text-sm font-semibold text-text-muted hover:text-text-main transition-colors flex items-center gap-2">
                                <LayoutDashboard size={16} />
                                Dashboard
                            </Link>
                            {role === 'admin' && (
                                <Link to="/admin" className="text-sm font-semibold text-text-muted hover:text-text-main transition-colors">Admin</Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline py-1.5 px-4 text-xs font-bold uppercase tracking-wider"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-semibold text-text-muted hover:text-text-main transition-colors">Login</Link>
                            <Link to="/signup" className="btn btn-primary py-1.5 px-5 text-xs font-bold uppercase tracking-wider">Join</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

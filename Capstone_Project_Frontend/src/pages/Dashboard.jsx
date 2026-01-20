import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { getCurrentUser } from '../services/authService';
import { Trophy, Users, Activity, Plus, Settings, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getCurrentUser();
            setUser(userData);
        };
        fetchUser();
    }, []);

    const stats = [
        { label: 'Matches', value: '24', icon: Trophy },
        { label: 'Teams', value: '12', icon: Users },
        { label: 'Active', value: '02', icon: Activity },
    ];

    if (!user) return (
        <div className="h-screen flex items-center justify-center bg-bg-main animate-pulse">
            <div className="w-12 h-12 rounded-full border-2 border-border border-t-primary animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />

            <main className="container py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-12 border-b border-border">
                    <header>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-2 block">Overview</span>
                        <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
                        <p className="text-text-muted mt-2">Welcome back, {user.name.split(' ')[0]}. Here is what's happening.</p>
                    </header>

                    <div className="flex gap-3">
                        {user.role === 'admin' && (
                            <button className="btn btn-primary px-6 h-11">
                                <Plus size={16} />
                                New Match
                            </button>
                        )}
                        <button className="btn btn-outline h-11">
                            <Settings size={16} />
                            Settings
                        </button>
                    </div>
                </div>

                <div className="stat-grid">
                    {stats.map((stat, i) => (
                        <div key={i} className="card stat-card">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{stat.label}</span>
                                <stat.icon size={14} className="text-text-muted" />
                            </div>
                            <h3 className="stat-value">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold uppercase tracking-tight">Live Matches</h2>
                            <span className="badge badge-live">Live Now</span>
                        </div>

                        <div className="space-y-4">
                            <div className="card p-6 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer group">
                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-border-soft rounded-full mb-2 mx-auto"></div>
                                        <p className="text-xs font-bold uppercase">IND</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-text-muted uppercase">VS</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-border-soft rounded-full mb-2 mx-auto"></div>
                                        <p className="text-xs font-bold uppercase">AUS</p>
                                    </div>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-2xl font-black tabular-nums">184/3</p>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">(24.5 Overs)</p>
                                </div>
                                <div className="hidden md:block">
                                    <ChevronRight size={20} className="text-border group-hover:text-text-main transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold uppercase tracking-tight">Team Rankings</h2>
                        <div className="card space-y-4">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="flex items-center justify-between py-2 border-b border-border-soft last:border-0">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-text-muted w-4">0{n}</span>
                                        <div className="w-6 h-6 bg-border-soft rounded"></div>
                                        <span className="text-sm font-semibold">Team Name</span>
                                    </div>
                                    <span className="text-xs font-bold tabular-nums">1240 pts</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

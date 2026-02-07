import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { getCurrentUser } from '../services/authService';
import { getMatches, createMatch } from '../services/matchService';
import { Trophy, Users, Activity, Plus, Settings, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [matches, setMatches] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newMatch, setNewMatch] = useState({ matchName: '', teamA: '', teamB: '', venue: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const userData = await getCurrentUser();
            setUser(userData);
            try {
                const matchesData = await getMatches();
                setMatches(matchesData);
            } catch (error) {
                console.error("Failed to fetch matches", error);
            }
        };
        fetchData();
    }, []);

    const handleCreateMatch = async (e) => {
        e.preventDefault();
        try {
            const matchData = {
                matchName: newMatch.matchName,
                teams: [newMatch.teamA, newMatch.teamB],
                venue: newMatch.venue,
                status: 'upcoming'
            };
            await createMatch(matchData);
            setShowCreateModal(false);
            setNewMatch({ matchName: '', teamA: '', teamB: '', venue: '' });
            // Refresh matches
            const updatedMatches = await getMatches();
            setMatches(updatedMatches);
        } catch (error) {
            console.error("Failed to create match", error);
            alert("Failed to create match");
        }
    };

    const stats = [
        { label: 'Matches', value: matches.length.toString(), icon: Trophy },
        { label: 'Teams', value: '12', icon: Users }, // Placeholder for now
        { label: 'Active', value: matches.filter(m => m.status === 'live').length.toString(), icon: Activity },
    ];

    if (!user) return (
        <div className="h-screen flex items-center justify-center bg-bg-main animate-pulse">
            <div className="w-12 h-12 rounded-full border-2 border-border border-t-primary animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg-main relative">
            <Navbar />

            {/* Create Match Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-bg-card border border-border p-6 rounded-lg w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Create New Match</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-text-muted hover:text-text-main">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateMatch} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1">Match Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-bg-main border border-border rounded px-3 py-2 text-text-main focus:outline-none focus:border-primary"
                                    value={newMatch.matchName}
                                    onChange={(e) => setNewMatch({ ...newMatch, matchName: e.target.value })}
                                    placeholder="e.g. Final Match"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1">Team A</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-bg-main border border-border rounded px-3 py-2 text-text-main focus:outline-none focus:border-primary"
                                        value={newMatch.teamA}
                                        onChange={(e) => setNewMatch({ ...newMatch, teamA: e.target.value })}
                                        placeholder="Team Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1">Team B</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-bg-main border border-border rounded px-3 py-2 text-text-main focus:outline-none focus:border-primary"
                                        value={newMatch.teamB}
                                        onChange={(e) => setNewMatch({ ...newMatch, teamB: e.target.value })}
                                        placeholder="Team Name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1">Venue</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-bg-main border border-border rounded px-3 py-2 text-text-main focus:outline-none focus:border-primary"
                                    value={newMatch.venue}
                                    onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
                                    placeholder="Stadium / Ground"
                                />
                            </div>
                            <button type="submit" className="w-full btn btn-primary py-2 mt-4">Create Match</button>
                        </form>
                    </div>
                </div>
            )}

            <main className="container py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-12 border-b border-border">
                    <header>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-2 block">Overview</span>
                        <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
                        <p className="text-text-muted mt-2">Welcome back, {user.name.split(' ')[0]}. Here is what's happening.</p>
                    </header>

                    <div className="flex gap-3">
                        {user.role === 'admin' && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn btn-primary px-6 h-11 flex items-center gap-2"
                            >
                                <Plus size={16} />
                                New Match
                            </button>
                        )}
                        <button className="btn btn-outline h-11 flex items-center gap-2">
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
                            <h2 className="text-xl font-bold uppercase tracking-tight">Active Matches</h2>
                            {/* <span className="badge badge-live">Live Now</span> */}
                        </div>

                        <div className="space-y-4">
                            {matches.length === 0 ? (
                                <div className="text-text-muted text-center py-8 bg-bg-card rounded-lg border border-border border-dashed">
                                    No matches found.
                                </div>
                            ) : (
                                matches.map((match) => (
                                    <div
                                        key={match._id}
                                        onClick={() => navigate(`/matches/${match._id}`)}
                                        className="card p-6 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer group hover:border-primary/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-8 w-full md:w-auto justify-center">
                                            <div className="text-center w-20">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full mb-2 mx-auto flex items-center justify-center text-white text-xs font-bold">
                                                    {match.teams[0]?.substring(0, 1)}
                                                </div>
                                                <p className="text-xs font-bold uppercase truncate">{match.teams[0]}</p>
                                            </div>
                                            <div className="text-center">
                                                {match.status === 'live' ? (
                                                    <span className="badge badge-live mb-1">LIVE</span>
                                                ) : (
                                                    <p className="text-[10px] font-bold text-text-muted uppercase mb-1">VS</p>
                                                )}
                                            </div>
                                            <div className="text-center w-20">
                                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full mb-2 mx-auto flex items-center justify-center text-white text-xs font-bold">
                                                    {match.teams[1]?.substring(0, 1)}
                                                </div>
                                                <p className="text-xs font-bold uppercase truncate">{match.teams[1]}</p>
                                            </div>
                                        </div>
                                        <div className="text-center md:text-right">
                                            <p className="text-2xl font-black tabular-nums">
                                                {match.score?.runs}/{match.score?.wickets}
                                            </p>
                                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                                ({match.score?.overs} Overs)
                                            </p>
                                            <p className="text-[10px] text-primary mt-1 font-bold">
                                                {match.status.toUpperCase()}
                                            </p>
                                        </div>
                                        <div className="hidden md:block">
                                            <ChevronRight size={20} className="text-border group-hover:text-text-main transition-colors" />
                                        </div>
                                    </div>
                                ))
                            )}
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

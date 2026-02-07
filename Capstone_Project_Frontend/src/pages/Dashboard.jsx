import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { getCurrentUser } from '../services/authService';
import { getMatches, createMatch } from '../services/matchService';
import { Trophy, Users, Activity, Plus, Settings, ChevronRight, X, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [matches, setMatches] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newMatch, setNewMatch] = useState({ matchName: '', teamA: '', teamB: '', venue: '' });
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
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
        { label: 'Live Now', value: matches.filter(m => m.status === 'live').length.toString(), icon: Activity },
    ];

    const filteredMatches = matches.filter(match => {
        const matchesStatus = statusFilter === 'all' || match.status === statusFilter;
        const matchesSearch = match.matchName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            match.teams[0]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            match.teams[1]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            match.venue?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

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

                        {/* Search and Filter Toolbar */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-bg-card/50 p-4 rounded-xl border border-border/50 backdrop-blur-sm">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search teams or venues..."
                                    className="w-full pl-10 pr-4 py-2 bg-bg-main border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex bg-bg-main border border-border p-1 rounded-lg w-full md:w-auto overflow-x-auto">
                                {['all', 'live', 'upcoming', 'completed'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setStatusFilter(filter)}
                                        className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-[10px] md:text-xs font-bold uppercase transition-all duration-200 ${statusFilter === filter
                                            ? 'bg-primary text-text-inverse shadow-sm scale-105'
                                            : 'text-text-muted hover:text-text-main hover:bg-bg-secondary'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredMatches.length === 0 ? (
                                <div className="text-text-muted text-center py-12 bg-bg-card rounded-xl border border-border border-dashed flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center border border-border">
                                        <Search size={20} className="text-text-muted opacity-50" />
                                    </div>
                                    <p>No matches found matching your filters.</p>
                                    <button
                                        onClick={() => { setStatusFilter('all'); setSearchQuery('') }}
                                        className="text-primary text-sm font-bold hover:underline"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            ) : (
                                filteredMatches.map((match) => (
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
            </main >
        </div >
    );
};

export default Dashboard;

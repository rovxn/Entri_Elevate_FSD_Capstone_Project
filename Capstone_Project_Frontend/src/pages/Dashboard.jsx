import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { getTeamLogoUrl } from '../utils/imageUtils';
import { getCurrentUser } from '../services/authService';
import { getMatches, createMatch } from '../services/matchService';
import { getTeams } from '../services/teamService';
import { Trophy, Users, Activity, Plus, Settings, ChevronRight, X, Search, Filter, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [matches, setMatches] = useState([]);
    const [teamsCount, setTeamsCount] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newMatch, setNewMatch] = useState({ matchName: '', teamA: '', teamB: '', venue: '' });
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const userData = await getCurrentUser();
            if (!userData) {
                navigate('/login');
                return;
            }
            setUser(userData);
            try {
                const [matchesData, teamsData] = await Promise.all([
                    getMatches(),
                    getTeams()
                ]);
                setMatches(matchesData);
                setTeamsCount(teamsData.length);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        fetchData();
    }, [navigate]);

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
            const updatedMatches = await getMatches();
            setMatches(updatedMatches);
        } catch (error) {
            console.error("Failed to create match", error);
            alert("Failed to create match");
        }
    };

    const stats = [
        { label: 'Total Matches', value: matches.length.toString(), icon: Trophy },
        { label: 'Active Teams', value: teamsCount.toString(), icon: Users },
        { label: 'Live Now', value: matches.filter(m => m.status === 'live').length.toString(), icon: Activity },
    ];

    const filteredMatches = matches.filter(match => {
        const matchesStatus = statusFilter === 'all' || match.status === statusFilter;
        const teamA = match.teams && match.teams[0] ? match.teams[0].toLowerCase() : '';
        const teamB = match.teams && match.teams[1] ? match.teams[1].toLowerCase() : '';
        const venue = match.venue ? match.venue.toLowerCase() : '';
        const name = match.matchName ? match.matchName.toLowerCase() : '';

        const searchLower = searchQuery.toLowerCase();

        const matchesSearch = name.includes(searchLower) ||
            teamA.includes(searchLower) ||
            teamB.includes(searchLower) ||
            venue.includes(searchLower);

        return matchesStatus && matchesSearch;
    });

    if (!user) return (
        <div className="h-screen flex items-center justify-center bg-bg-main">
            <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg-main pb-12">
            <Navbar />

            {/* Create Match Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
                    <div className="bg-white border border-border p-6 rounded-2xl w-full max-w-lg shadow-2xl max-h-90vh overflow-y-auto animate-slide-up">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-text-main">Create Match</h2>
                                <p className="text-text-muted text-sm mt-1">Schedule a new match</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-text-muted hover:text-text-main p-1 rounded hover:bg-bg-main transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateMatch} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-text-muted mb-1.5">Match Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-bg-secondary p-2.5 text-sm font-medium border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                    value={newMatch.matchName}
                                    onChange={(e) => setNewMatch({ ...newMatch, matchName: e.target.value })}
                                    placeholder="e.g. T20 Final 2024"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-text-muted mb-1.5">Team A</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-bg-secondary p-2.5 text-sm font-medium border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                        value={newMatch.teamA}
                                        onChange={(e) => setNewMatch({ ...newMatch, teamA: e.target.value })}
                                        placeholder="Home Team"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-text-muted mb-1.5">Team B</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-bg-secondary p-2.5 text-sm font-medium border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                        value={newMatch.teamB}
                                        onChange={(e) => setNewMatch({ ...newMatch, teamB: e.target.value })}
                                        placeholder="Away Team"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-text-muted mb-1.5">Venue</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-9 bg-bg-secondary p-2.5 text-sm font-medium border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                        value={newMatch.venue}
                                        onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
                                        placeholder="Stadium Name"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full btn btn-primary py-3 mt-2 text-sm font-semibold shadow-sm hover:translate-y-0">
                                Create Match
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <main className="container pt-8 md:pt-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <header>
                        <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">Dashboard</h1>
                        <p className="text-text-muted text-base">
                            Overview for <span className="text-text-main font-medium">{user.name}</span>
                        </p>
                    </header>

                    <div className="flex items-center gap-3">
                        {user.role === 'admin' && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn btn-primary h-10 px-4 rounded-lg shadow-sm"
                            >
                                <Plus size={18} strokeWidth={2.5} />
                                <span className="hidden sm:inline font-medium">New Match</span>
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/settings')}
                            className="btn btn-outline h-10 px-3 bg-white hover:bg-bg-secondary border-border text-text-muted hover:text-text-main rounded-lg"
                        >
                            <Settings size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="card p-5 flex items-center justify-between bg-white shadow-sm border border-border hover:border-border-soft transition-colors text-text-main">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold tabular-nums">{stat.value}</h3>
                            </div>
                            <div className="p-2 rounded-lg bg-bg-secondary text-text-main">
                                <stat.icon size={20} strokeWidth={2} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold tracking-tight text-text-main flex items-center gap-2">
                            Matches
                            <span className="text-xs font-medium text-text-muted bg-bg-secondary px-2 py-0.5 rounded-full border border-border">{filteredMatches.length}</span>
                        </h2>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative flex-grow md:flex-grow-0 md:w-64 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search matches..."
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex bg-white p-1 rounded-lg border border-border shadow-sm">
                                {['all', 'live', 'upcoming', 'completed'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setStatusFilter(filter)}
                                        className={`flex-1 px-3 py-1.5 rounded-md text-xs font-semibold uppercase transition-all duration-200 ${statusFilter === filter
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-text-muted hover:bg-bg-secondary hover:text-text-main'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredMatches.length === 0 ? (
                            <div className="col-span-full py-16 text-center text-text-muted border border-dashed border-border rounded-xl bg-bg-secondary/50 flex flex-col items-center justify-center gap-3">
                                <Search size={24} className="opacity-20" />
                                <p className="text-sm font-medium">No matches found</p>
                                <button
                                    onClick={() => { setStatusFilter('all'); setSearchQuery('') }}
                                    className="text-xs font-semibold text-primary hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            filteredMatches.map((match) => (
                                <div
                                    key={match._id}
                                    onClick={() => navigate(`/matches/${match._id}`)}
                                    className="card group cursor-pointer bg-white border border-border hover:border-primary/50 transition-colors"
                                >
                                    <div className="p-4 border-b border-border/40 flex justify-between items-center bg-bg-secondary/30">
                                        <div className={`badge ${match.status === 'live' ? 'badge-live' : 'bg-bg-secondary text-text-muted border border-border text-[10px]'}`}>
                                            {match.status}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-text-muted tracking-wider">
                                            <MapPin size={10} />
                                            <span className="truncate max-w-[120px]">{match.venue}</span>
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col gap-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center p-1 shadow-sm">
                                                    <img src={getTeamLogoUrl(match.teams[0])} alt={match.teams[0]} className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-bold text-text-main leading-tight">{match.teams[0]}</span>
                                                    <span className="text-[10px] font-medium text-text-muted uppercase tracking-wide">Home</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-lg font-bold tabular-nums text-text-main">
                                                    {match.scores?.team1?.runs || '0'}/{match.scores?.team1?.wickets || '0'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-px bg-border/50 w-full"></div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center p-1 opacity-75">
                                                    <img src={getTeamLogoUrl(match.teams[1])} alt={match.teams[1]} className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-bold text-text-muted leading-tight">{match.teams[1]}</span>
                                                    <span className="text-[10px] font-medium text-text-muted uppercase tracking-wide">Away</span>
                                                </div>
                                            </div>
                                            <div className="text-right text-xs font-semibold tabular-nums text-text-muted">
                                                <span className="block text-lg font-bold tabular-nums text-text-main">
                                                    {match.scores?.team2?.runs || '0'}/{match.scores?.team2?.wickets || '0'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-4 py-3 bg-bg-secondary/20 border-t border-border group-hover:bg-bg-secondary transition-colors">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-2 group-hover:text-primary transition-colors">
                                            View Details <ChevronRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main >
        </div >
    );
};

export default Dashboard;


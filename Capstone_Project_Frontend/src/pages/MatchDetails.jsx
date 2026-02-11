import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import { updateMatchScore, getMatchById } from '../services/matchService';
import { getTeamLogoUrl } from '../utils/imageUtils';
import { getCurrentUser } from '../services/authService';
import { ArrowLeft, ArrowUpRight, Trophy, MapPin, Hash, Save, Settings, Calendar, Clock, Share2 } from 'lucide-react';

const MatchDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Edit State
    const [scoreUpdate, setScoreUpdate] = useState({
        runs: 0,
        wickets: 0,
        overs: 0,
        status: 'upcoming'
    });

    const fetchMatch = async (matchId) => {
        try {
            const data = await getMatchById(matchId);
            if (data) {
                setMatch(data);
                setScoreUpdate({
                    runs: data.score?.runs || 0,
                    wickets: data.score?.wickets || 0,
                    overs: data.score?.overs || 0,
                    status: data.status || 'upcoming'
                });
            }
        } catch (error) {
            console.error("Error fetching match", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            const userData = await getCurrentUser();
            setUser(userData);
            await fetchMatch(id);
        };
        init();
    }, [id]);

    const handleUpdateScore = async (e) => {
        e.preventDefault();
        try {
            await updateMatchScore(id, {
                score: {
                    runs: parseInt(scoreUpdate.runs),
                    wickets: parseInt(scoreUpdate.wickets),
                    overs: parseFloat(scoreUpdate.overs)
                },
                status: scoreUpdate.status
            });
            await fetchMatch(id); // Refresh
            alert("Score updated!");
        } catch (error) {
            console.error("Update failed", error);
            alert("Update failed");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    if (!match) return (
        <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center text-text-muted gap-4">
            <Trophy size={48} className="opacity-20" />
            <p className="text-lg font-medium">Match not found.</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-outline">Go Home</button>
        </div>
    );

    const isAdminOrScorer = user && (user.role === 'admin' || user.role === 'scorer');

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />

            <main className="container py-8 max-w-5xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-text-muted hover:text-text-main mb-8 transition-colors text-sm font-bold uppercase tracking-wider group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </button>

                {/* Match Header Card - Redesigned for Impact */}
                <div className="card mb-8 overflow-hidden border-0 shadow-2xl relative bg-white">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900"></div>

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                    <div className="absolute top-6 right-6 z-10">
                        <span className={`badge ${match.status === 'live' ? 'badge-live px-3 py-1 text-xs shadow-lg' : 'bg-bg-main border border-border text-text-muted'}`}>
                            {match.status.toUpperCase()}
                        </span>
                    </div>

                    <div className="p-8 md:p-12 relative flex flex-col items-center">
                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-8 text-center border px-4 py-1.5 rounded-full border-border bg-bg-main/50 backdrop-blur-sm">
                            {match.matchName || "Match Details"} • {match.venue}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-12 w-full max-w-4xl">
                            {/* Team A */}
                            <div className="flex flex-col items-center justify-center gap-6 group">
                                <div className="relative">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border-2 border-border p-4 shadow-xl group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                                        <img src={getTeamLogoUrl(match.teams[0])} alt={match.teams[0]} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="absolute -bottom-2 right-0 bg-primary text-white w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold shadow-lg border-2 border-white">A</div>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-center">{match.teams[0]}</h2>
                            </div>

                            {/* Score Center */}
                            <div className="flex flex-col items-center justify-center gap-4 py-6 md:py-0 border-y md:border-y-0 md:border-x border-border/50 bg-bg-main/30 md:bg-transparent rounded-2xl md:min-h-[160px]">
                                <div className="flex flex-col items-center">
                                    <span className="text-6xl md:text-7xl font-black tabular-nums tracking-tighter leading-none mb-2 text-primary drop-shadow-sm">
                                        {match.score.runs}/{match.score.wickets}
                                    </span>
                                    <span className="text-sm font-bold uppercase tracking-widest text-text-muted bg-white px-3 py-1 rounded-full border border-border shadow-sm">
                                        Current Score
                                    </span>
                                </div>
                                <div className="text-lg font-bold text-text-muted flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                                    {match.score.overs} OVERS
                                    <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                                </div>
                            </div>

                            {/* Team B */}
                            <div className="flex flex-col items-center justify-center gap-6 group">
                                <div className="relative">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border-2 border-border p-4 shadow-xl group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                                        <img src={getTeamLogoUrl(match.teams[1])} alt={match.teams[1]} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="absolute -bottom-2 right-0 bg-text-muted text-white w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold shadow-lg border-2 border-white">B</div>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-center">{match.teams[1]}</h2>
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="mt-12 flex gap-4">
                            <button className="btn btn-outline rounded-full px-6 py-2 text-xs uppercase tracking-widest">
                                <Share2 size={14} /> Share Match
                            </button>
                        </div>
                    </div>
                </div>

                {/* Score Update Panel (Admin/Scorer Only) */}
                {isAdminOrScorer && (
                    <div className="card p-6 md:p-8 border border-primary/10 shadow-lg bg-white overflow-visible">
                        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border">
                            <div className="p-3 bg-primary rounded-xl text-white shadow-lg shadow-primary/20 rotate-3">
                                <Settings size={24} />
                            </div>
                            <div>
                                <h3 className="font-black uppercase tracking-wide text-xl">Scorer Console</h3>
                                <p className="text-sm text-text-muted font-medium">Update statistics in real-time</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateScore}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="form-group space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Runs Scored</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full bg-bg-main border border-border rounded-xl px-4 py-4 font-mono text-2xl font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                            value={scoreUpdate.runs}
                                            onChange={(e) => setScoreUpdate({ ...scoreUpdate, runs: e.target.value })}
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-xs opacity-50">R</span>
                                    </div>
                                </div>
                                <div className="form-group space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Wickets Down</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            max="10"
                                            className="w-full bg-bg-main border border-border rounded-xl px-4 py-4 font-mono text-2xl font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                            value={scoreUpdate.wickets}
                                            onChange={(e) => setScoreUpdate({ ...scoreUpdate, wickets: e.target.value })}
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-xs opacity-50">W</span>
                                    </div>
                                </div>
                                <div className="form-group space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Overs Bowled</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.1"
                                            className="w-full bg-bg-main border border-border rounded-xl px-4 py-4 font-mono text-2xl font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                            value={scoreUpdate.overs}
                                            onChange={(e) => setScoreUpdate({ ...scoreUpdate, overs: e.target.value })}
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-xs opacity-50">OV</span>
                                    </div>
                                </div>
                                <div className="form-group space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Match State</label>
                                    <div className="relative h-full">
                                        <select
                                            className="w-full h-[66px] bg-bg-main border border-border rounded-xl px-4 text-text-main focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all appearance-none cursor-pointer font-bold text-lg"
                                            value={scoreUpdate.status}
                                            onChange={(e) => setScoreUpdate({ ...scoreUpdate, status: e.target.value })}
                                        >
                                            <option value="upcoming">Upcoming</option>
                                            <option value="live">Live Now</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <ArrowUpRight size={20} className="text-text-muted rotate-45" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary w-full py-4 text-sm font-bold uppercase tracking-[0.1em] gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all rounded-xl">
                                <Save size={20} /> Update Match Score
                            </button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MatchDetails;

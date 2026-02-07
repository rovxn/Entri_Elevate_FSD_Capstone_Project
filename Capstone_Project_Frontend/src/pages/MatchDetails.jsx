import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import { getMatches, updateMatchScore } from '../services/matchService'; // Reusing getMatches for simple list filter or I should add getMatchById
import { getCurrentUser } from '../services/authService';
import { ArrowLeft, RefreshCw, Trophy, MapPin, Hash, Save } from 'lucide-react';
import API from '../services/api'; // Direct API import for specific ID fetch if needed

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
            // Since matchService only has getMatches (all), I'll make a direct call for specific ID since I saw GET /matches in backend but not GET /matches/:id
            // Wait, usually REST has GET /:id. I'll check routes/matches.js again.
            // Result from earlier check: 'routes/matches.js' ONLY had:
            // GET / (all), POST / (create), PUT /:id/score.
            // It MISSING GET /:id. 
            // I must fetch ALL and filter, OR add GET /:id to backend.
            // Adding GET /:id is cleaner. I will do that first? 
            // For now, to suffice functionality without continuous context switching, I'll fetch ALL and filter. 
            // This is inefficient but works for small scale.

            const matches = await getMatches();
            const foundMatch = matches.find(m => m._id === matchId);

            if (foundMatch) {
                setMatch(foundMatch);
                setScoreUpdate({
                    runs: foundMatch.score.runs,
                    wickets: foundMatch.score.wickets,
                    overs: foundMatch.score.overs,
                    status: foundMatch.status
                });
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching match", error);
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
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!match) return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center text-text-muted">
            Match not found.
        </div>
    );

    const isAdminOrScorer = user && (user.role === 'admin' || user.role === 'scorer');

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />

            <main className="container py-8 max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-text-muted hover:text-text-main mb-6 transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Dashboard
                </button>

                {/* Match Header Card */}
                <div className="card p-8 mb-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-600"></div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 text-center md:text-right">
                            <h2 className="text-2xl font-black uppercase text-text-main">{match.teams[0]}</h2>
                        </div>

                        <div className="flex flex-col items-center gap-2 px-8">
                            <div className="text-xs font-bold uppercase tracking-widest text-text-muted">
                                {match.venue}
                            </div>
                            <div className="text-4xl font-black tabular-nums tracking-tight my-2">
                                {match.score.runs}/{match.score.wickets}
                            </div>
                            <div className="badge badge-live">
                                {match.status.toUpperCase()}
                            </div>
                            <div className="text-xs font-mono text-text-muted mt-2">
                                {match.score.overs} OVERS
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-black uppercase text-text-main">{match.teams[1]}</h2>
                        </div>
                    </div>

                    <p className="mt-8 text-text-muted text-sm font-medium">
                        {match.matchName || "Match Details"}
                    </p>
                </div>

                {/* Score Update Panel (Admin Only) */}
                {isAdminOrScorer && (
                    <div className="card p-6 border-primary/20">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <Settings size={20} />
                            <h3 className="font-bold uppercase tracking-wide">Scorer Control Panel</h3>
                        </div>

                        <form onSubmit={handleUpdateScore} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-muted mb-1">Runs</label>
                                <input
                                    type="number"
                                    className="w-full bg-bg-main border border-border rounded px-3 py-2 font-mono focus:border-primary focus:outline-none"
                                    value={scoreUpdate.runs}
                                    onChange={(e) => setScoreUpdate({ ...scoreUpdate, runs: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-muted mb-1">Wickets</label>
                                <input
                                    type="number"
                                    max="10"
                                    className="w-full bg-bg-main border border-border rounded px-3 py-2 font-mono focus:border-primary focus:outline-none"
                                    value={scoreUpdate.wickets}
                                    onChange={(e) => setScoreUpdate({ ...scoreUpdate, wickets: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-muted mb-1">Overs</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="w-full bg-bg-main border border-border rounded px-3 py-2 font-mono focus:border-primary focus:outline-none"
                                    value={scoreUpdate.overs}
                                    onChange={(e) => setScoreUpdate({ ...scoreUpdate, overs: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-muted mb-1">Status</label>
                                <select
                                    className="w-full bg-bg-main border border-border rounded px-3 py-2 focus:border-primary focus:outline-none"
                                    value={scoreUpdate.status}
                                    onChange={(e) => setScoreUpdate({ ...scoreUpdate, status: e.target.value })}
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="live">Live</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div className="lg:col-span-4 mt-2">
                                <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2">
                                    <Save size={18} /> Update Live Score
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MatchDetails;

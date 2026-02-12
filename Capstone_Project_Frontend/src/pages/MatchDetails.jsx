import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import { updateMatchScore, getMatchById } from '../services/matchService';
import { getTeamLogoUrl } from '../utils/imageUtils';
import { getCurrentUser } from '../services/authService';
import { ArrowLeft, Clock, MapPin, Trophy, Save, Activity, CalendarDays, Share2, Shield } from 'lucide-react';

const MatchDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Edit State with Batting Team selection
    const [scoreUpdate, setScoreUpdate] = useState({
        runs: 0,
        wickets: 0,
        overs: 0,
        status: 'upcoming',
        battingTeam: '' // 'team1' or 'team2'
    });

    const fetchMatch = async (matchId) => {
        try {
            const data = await getMatchById(matchId);
            if (data) {
                setMatch(data);

                // Determine default batting team or from existing state
                const defaultBattingTeam = data.battingTeam === data.teams[1] ? 'team2' : 'team1';
                const currentScore = data.scores ? data.scores[defaultBattingTeam] : (data.score || {});

                setScoreUpdate({
                    runs: currentScore?.runs || 0,
                    wickets: currentScore?.wickets || 0,
                    overs: currentScore?.overs || 0,
                    status: data.status || 'upcoming',
                    battingTeam: defaultBattingTeam
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
            // Construct payload based on which team is batting
            // We need to preserve the OTHER team's score. But backend `findByIdAndUpdate` might overwrite `scores` if we send the whole object?
            // Wait, we don't have the full object here. We should send a specific update.
            // But our backend is generic.
            // Let's send the FULL scores object with the updated team's score.

            const currentScores = match.scores || {};
            const teamKey = scoreUpdate.battingTeam || (match.battingTeam === match.teams[1] ? 'team2' : 'team1');
            const otherTeamKey = teamKey === 'team1' ? 'team2' : 'team1';

            const updatedScores = {
                ...currentScores,
                [teamKey]: {
                    runs: parseInt(scoreUpdate.runs),
                    wickets: parseInt(scoreUpdate.wickets),
                    overs: parseFloat(scoreUpdate.overs),
                    extras: currentScores[teamKey]?.extras || 0
                },
                // Ensure the other team exists, or default it to zero stats
                [otherTeamKey]: currentScores[otherTeamKey] || { runs: 0, wickets: 0, overs: 0, extras: 0 }
            };

            await updateMatchScore(id, {
                scores: updatedScores,
                status: scoreUpdate.status,
                battingTeam: scoreUpdate.battingTeam === 'team1' ? match.teams[0] : match.teams[1]
            });
            await fetchMatch(id); // Refresh
        } catch (error) {
            console.error("Update failed", error);
            alert("Update failed");
        }
    };

    // Helper to switch the input values when dropdown changes
    const handleTeamChange = (teamKey) => {
        const currentScore = match.scores ? match.scores[teamKey] : { runs: 0, wickets: 0, overs: 0 };
        setScoreUpdate({
            ...scoreUpdate,
            battingTeam: teamKey,
            runs: currentScore.runs || 0,
            wickets: currentScore.wickets || 0,
            overs: currentScore.overs || 0
        });
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

    // Helper to get active score for display
    const team1Score = match.scores?.team1 || { runs: 0, wickets: 0, overs: 0 };
    const team2Score = match.scores?.team2 || { runs: 0, wickets: 0, overs: 0 };

    return (
        <div className="min-h-screen bg-bg-main pb-20">
            <Navbar />

            {/* Hero / Header Section */}
            <div className="relative bg-white border-b border-border/50 pb-16 pt-8 md:pt-12 px-4 shadow-sm overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <div className="container max-w-5xl mx-auto relative z-10">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-text-muted hover:text-text-main mb-8 transition-colors text-xs font-bold uppercase tracking-wider group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
                    </button>

                    <div className="flex flex-col items-center">
                        {/* Match Meta */}
                        <div className="flex items-center gap-3 text-sm text-text-muted font-medium mb-8 bg-bg-secondary/50 px-4 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
                            <span className="flex items-center gap-1.5">
                                <MapPin size={14} /> {match.venue}
                            </span>
                            <span className="w-1 h-1 bg-border rounded-full"></span>
                            <span className="flex items-center gap-1.5 uppercase tracking-wide text-xs">
                                {match.matchName}
                            </span>
                        </div>

                        {/* Scoreboard */}
                        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">

                            {/* Home Team */}
                            <div className="flex-1 flex flex-col items-center md:items-end gap-4 text-center md:text-right group">
                                <div className="relative">
                                    <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-2xl p-4 shadow-sm border border-border flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                        <img src={getTeamLogoUrl(match.teams[0])} alt={match.teams[0]} className="w-full h-full object-contain" />
                                    </div>
                                    {/* Removed overlapping badges as requested */}
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-3xl font-black text-text-main leading-tight mb-1">{match.teams[0]}</h2>
                                    <p className="text-sm text-text-muted font-medium">Home Team</p>
                                    <p className="md:hidden text-2xl font-black text-text-main mt-2">
                                        {team1Score.runs}/{team1Score.wickets} <span className="text-sm font-medium text-text-muted text-base">({team1Score.overs} ov)</span>
                                    </p>
                                </div>
                            </div>

                            {/* Versus / Live Score (Desktop) */}
                            <div className="hidden md:flex shrink-0 flex-col items-center relative">
                                <div className={`mb-4 px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-sm ${match.status === 'live'
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : match.status === 'completed'
                                        ? 'bg-primary text-white'
                                        : 'bg-bg-secondary text-text-muted border border-border'
                                    }`}>
                                    {match.status}
                                </div>

                                <div className="text-center flex items-center gap-8">
                                    <div className="flex flex-col items-end">
                                        <div className="text-5xl font-black tabular-nums tracking-tighter text-text-main leading-none">
                                            {team1Score.runs}/{team1Score.wickets}
                                        </div>
                                        <div className="text-sm font-bold text-text-muted mt-1">
                                            {team1Score.overs} Overs
                                        </div>
                                    </div>

                                    <div className="h-12 w-px bg-border/50"></div>

                                    <div className="flex flex-col items-start">
                                        <div className="text-5xl font-black tabular-nums tracking-tighter text-text-main leading-none">
                                            {team2Score.runs}/{team2Score.wickets}
                                        </div>
                                        <div className="text-sm font-bold text-text-muted mt-1">
                                            {team2Score.overs} Overs
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Away Team */}
                            <div className="flex-1 flex flex-col items-center md:items-start gap-4 text-center md:text-left group">
                                <div className="relative">
                                    <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-2xl p-4 shadow-sm border border-border flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                        <img src={getTeamLogoUrl(match.teams[1])} alt={match.teams[1]} className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-3xl font-black text-text-main leading-tight mb-1">{match.teams[1]}</h2>
                                    <p className="text-sm text-text-muted font-medium">Away Team</p>
                                    <p className="md:hidden text-2xl font-black text-text-main mt-2">
                                        {team2Score.runs}/{team2Score.wickets} <span className="text-sm font-medium text-text-muted text-base">({team2Score.overs} ov)</span>
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <main className="container max-w-5xl mx-auto -mt-8 relative z-20 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Stats / Info Column (Left) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Summary Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
                            <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                                <Shield size={20} className="text-primary" /> Match Summary
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 rounded-lg bg-bg-secondary text-center">
                                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Extras</p>
                                    <p className="text-2xl font-black text-text-main">
                                        {(team1Score.extras || 0) + (team2Score.extras || 0)}
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-bg-secondary text-center">
                                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Innings</p>
                                    <p className="text-2xl font-black text-text-main">
                                        {match.scores ? '2' : '1'}
                                    </p>
                                </div>
                            </div>

                            {/* Placeholder for Commentary or Timeline */}
                            <div className="mt-8 pt-8 border-t border-border">
                                <div className="flex flex-col items-center justify-center py-8 text-center text-text-muted space-y-3">
                                    <CalendarDays size={32} className="opacity-20" />
                                    <p className="text-sm">Detailed commentary and timeline features coming soon.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Admin Panel (Right) */}
                    <div className="space-y-6">
                        {/* Admin Controls */}
                        {isAdminOrScorer ? (
                            <div className="bg-white rounded-xl shadow-lg border border-primary/20 p-6 md:p-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-hover"></div>
                                <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                                    <Activity size={20} className="text-green-500 animate-bounce" /> Scorer Console
                                </h3>

                                <form onSubmit={handleUpdateScore} className="space-y-5">

                                    {/* Team Selector */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">Update Score For</label>
                                        <select
                                            className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none cursor-pointer"
                                            value={scoreUpdate.battingTeam}
                                            onChange={(e) => handleTeamChange(e.target.value)}
                                        >
                                            <option value="team1">{match.teams[0]} (Home)</option>
                                            <option value="team2">{match.teams[1]} (Away)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">Runs</label>
                                        <input
                                            type="number"
                                            className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                            value={scoreUpdate.runs}
                                            onChange={(e) => setScoreUpdate({ ...scoreUpdate, runs: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">Wickets</label>
                                            <input
                                                type="number"
                                                max="10"
                                                className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                                value={scoreUpdate.wickets}
                                                onChange={(e) => setScoreUpdate({ ...scoreUpdate, wickets: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">Overs</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                                value={scoreUpdate.overs}
                                                onChange={(e) => setScoreUpdate({ ...scoreUpdate, overs: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">Status</label>
                                        <select
                                            className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none cursor-pointer"
                                            value={scoreUpdate.status}
                                            onChange={(e) => setScoreUpdate({ ...scoreUpdate, status: e.target.value })}
                                        >
                                            <option value="upcoming">Upcoming</option>
                                            <option value="live">Live Now</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full btn btn-primary py-4 mt-2 text-sm font-bold uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} /> Update Score
                                    </button>
                                </form>
                            </div>
                        ) : (
                            // Viewer Sidebar content (same as before)
                            <div className="bg-white rounded-xl shadow-sm border border-border p-6 text-center">
                                <h3 className="text-base font-bold text-text-main mb-2">Share this Match</h3>
                                <p className="text-sm text-text-muted mb-4">Let your friends follow the live action.</p>
                                <button className="btn btn-outline w-full rounded-lg flex items-center justify-center gap-2">
                                    <Share2 size={16} /> Share Link
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MatchDetails;

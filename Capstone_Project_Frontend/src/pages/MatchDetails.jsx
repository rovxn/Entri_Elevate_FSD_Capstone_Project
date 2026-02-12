import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import { updateMatchScore, getMatchById } from '../services/matchService';
import { getTeamLogoUrl } from '../utils/imageUtils';
import { getCurrentUser } from '../services/authService';
import { ArrowLeft, Clock, MapPin, Trophy, Save, Activity, CalendarDays, Share2, Shield, Users, X } from 'lucide-react';

const MatchDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allPlayers, setAllPlayers] = useState([]);
    const [isSettingXI, setIsSettingXI] = useState(false);
    const [lastAction, setLastAction] = useState(null);

    // Edit State
    const [scoreUpdate, setScoreUpdate] = useState({
        runs: 0,
        wickets: 0,
        overs: 0,
        extras: 0,
        status: 'upcoming',
        battingTeam: '', // 'team1' or 'team2'
        result: ''
    });

    const fetchMatch = async (matchId) => {
        try {
            const data = await getMatchById(matchId);
            if (data) {
                setMatch(data);
                const defaultBattingTeam = data.battingTeam === data.teams[1] ? 'team2' : 'team1';
                const currentScore = data.scores ? data.scores[defaultBattingTeam] : { runs: 0, wickets: 0, overs: 0, extras: 0 };

                setScoreUpdate({
                    runs: currentScore?.runs || 0,
                    wickets: currentScore?.wickets || 0,
                    overs: currentScore?.overs || 0,
                    extras: currentScore?.extras || 0,
                    status: data.status || 'upcoming',
                    battingTeam: defaultBattingTeam,
                    result: data.result || ''
                });
            }
        } catch (error) {
            console.error("Error fetching match", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlayers = async () => {
        try {
            const playersData = await (await import('../services/playerService')).getPlayers();
            setAllPlayers(playersData);
        } catch (error) {
            console.error("Error fetching players", error);
        }
    };

    useEffect(() => {
        const init = async () => {
            const userData = await getCurrentUser();
            setUser(userData);
            await fetchMatch(id);
            if (userData?.role === 'admin' || userData?.role === 'scorer') {
                await fetchPlayers();
            }
        };
        init();
    }, [id]);

    const handleUpdateScore = async (overrideScore = null) => {
        try {
            const teamKey = scoreUpdate.battingTeam;
            const otherTeamKey = teamKey === 'team1' ? 'team2' : 'team1';
            const currentScores = match.scores || {};

            const targetScore = overrideScore || {
                runs: parseInt(scoreUpdate.runs),
                wickets: parseInt(scoreUpdate.wickets),
                overs: parseFloat(scoreUpdate.overs),
                extras: parseInt(scoreUpdate.extras || 0)
            };

            const updatedScores = {
                ...currentScores,
                [teamKey]: targetScore,
                [otherTeamKey]: currentScores[otherTeamKey] || { runs: 0, wickets: 0, overs: 0, extras: 0 }
            };

            const finalPayload = {
                scores: updatedScores,
                status: scoreUpdate.status,
                battingTeam: scoreUpdate.battingTeam === 'team1' ? match.teams[0] : match.teams[1],
                result: scoreUpdate.result
            };

            const updatedMatch = await updateMatchScore(id, finalPayload);
            if (updatedMatch) {
                setMatch(updatedMatch);
                // If it was a manual push from the button, sync the internal state
                if (!overrideScore) {
                    const defaultBattingTeam = updatedMatch.battingTeam === updatedMatch.teams[1] ? 'team2' : 'team1';
                    const currentScore = updatedMatch.scores[defaultBattingTeam];
                    setScoreUpdate(prev => ({
                        ...prev,
                        runs: currentScore.runs,
                        wickets: currentScore.wickets,
                        overs: currentScore.overs,
                        extras: currentScore.extras,
                        status: updatedMatch.status,
                        result: updatedMatch.result
                    }));
                }
            }

            setLastAction(overrideScore ? lastAction : "Update Saved!");
            setTimeout(() => setLastAction(null), 2000);
        } catch (error) {
            console.error("Update failed", error);
            alert("Update failed");
        }
    };

    const handleBallAction = async (type, value = 0) => {
        let newRuns = parseInt(scoreUpdate.runs);
        let newWickets = parseInt(scoreUpdate.wickets);
        let newOvers = parseFloat(scoreUpdate.overs);
        let newExtras = parseInt(scoreUpdate.extras || 0);
        let logMsg = "";

        if (type === 'runs') {
            newRuns += value;
            newOvers = incrementOver(newOvers);
            logMsg = value === 0 ? "Dot Ball" : `+${value} Runs`;
        } else if (type === 'wicket') {
            newWickets = Math.min(10, newWickets + 1);
            newOvers = incrementOver(newOvers);
            logMsg = "WICKET!";
        } else if (type === 'wide') {
            newRuns += 1;
            newExtras += 1;
            logMsg = "Wide (+1)";
        } else if (type === 'noball') {
            newRuns += 1;
            newExtras += 1;
            logMsg = "No Ball (+1)";
        } else if (type === 'dot' || type === 'over') {
            newOvers = incrementOver(newOvers);
            logMsg = type === 'over' ? "+1 Ball" : "Dot Ball";
        }

        const newScoreState = {
            runs: newRuns,
            wickets: newWickets,
            overs: newOvers,
            extras: newExtras
        };

        setScoreUpdate(prev => ({
            ...prev,
            ...newScoreState
        }));

        setLastAction(logMsg);

        // Auto-save for ball-by-ball actions
        await handleUpdateScore(newScoreState);
    };

    const incrementOver = (currentOver) => {
        const val = parseFloat(currentOver) || 0;
        let overs = Math.floor(val);
        let balls = Math.round((val - overs) * 10);

        balls += 1;
        if (balls >= 6) {
            overs += 1;
            balls = 0;
        }
        return parseFloat(`${overs}.${balls}`);
    };

    const handleTeamChange = (teamKey) => {
        const currentScore = match.scores ? match.scores[teamKey] : { runs: 0, wickets: 0, overs: 0, extras: 0 };
        setScoreUpdate(prev => ({
            ...prev,
            battingTeam: teamKey,
            runs: currentScore.runs || 0,
            wickets: currentScore.wickets || 0,
            overs: currentScore.overs || 0,
            extras: currentScore.extras || 0
        }));
    };

    const handleSaveXI = async (teamKey, playerIds) => {
        try {
            const updatedXI = {
                ...match.playingXI,
                [teamKey]: playerIds
            };
            await updateMatchScore(id, { playingXI: updatedXI });
            await fetchMatch(id);
            setIsSettingXI(false);
        } catch (error) {
            alert("Failed to update Playing XI");
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
    const team1Score = match.scores?.team1 || { runs: 0, wickets: 0, overs: 0, extras: 0 };
    const team2Score = match.scores?.team2 || { runs: 0, wickets: 0, overs: 0, extras: 0 };

    return (
        <div className="min-h-screen bg-bg-main pb-20">
            <Navbar />

            {/* Hero / Header Section */}
            <div className="relative bg-white border-b border-border/50 pb-16 pt-8 md:pt-12 px-4 shadow-sm overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="container max-w-5xl mx-auto relative z-10">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-text-muted hover:text-text-main mb-8 transition-colors text-xs font-bold uppercase tracking-wider group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
                    </button>

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-3 text-sm text-text-muted font-medium mb-8 bg-bg-secondary/50 px-4 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
                            <span className="flex items-center gap-1.5"><MapPin size={14} /> {match.venue}</span>
                            <span className="w-1 h-1 bg-border rounded-full"></span>
                            <span className="flex items-center gap-1.5 uppercase tracking-wide text-xs">{match.matchName}</span>
                            {match.status === 'paused' && (
                                <><span className="w-1 h-1 bg-border rounded-full"></span>
                                    <span className="text-orange-500 font-bold flex items-center gap-1"><Clock size={14} /> PAUSED</span></>
                            )}
                        </div>

                        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                            <div className="flex-1 flex flex-col items-center md:items-end gap-4 text-center md:text-right group">
                                <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-2xl p-4 shadow-sm border border-border flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                    <img src={getTeamLogoUrl(match.teams[0])} alt={match.teams[0]} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-3xl font-black text-text-main leading-tight mb-1">{match.teams[0]}</h2>
                                    <p className="text-sm text-text-muted font-medium">Home Team</p>
                                    <p className="md:hidden text-2xl font-black text-text-main mt-2">{team1Score.runs}/{team1Score.wickets} <span className="text-sm font-medium text-text-muted">({team1Score.overs?.toFixed(1)} ov)</span></p>
                                </div>
                            </div>

                            <div className="hidden md:flex shrink-0 flex-col items-center relative">
                                <div className={`mb-4 px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-sm ${match.status === 'live' ? 'bg-red-500 text-white animate-pulse' :
                                    match.status === 'completed' ? 'bg-primary text-white' :
                                        match.status === 'paused' ? 'bg-orange-500 text-white' :
                                            'bg-bg-secondary text-text-muted border border-border'
                                    }`}>
                                    {match.status}
                                </div>
                                <div className="text-center flex items-center gap-8">
                                    <div className="flex flex-col items-end">
                                        <div className="text-5xl font-black tabular-nums tracking-tighter text-text-main leading-none">{team1Score.runs}/{team1Score.wickets}</div>
                                        <div className="text-sm font-bold text-text-muted mt-1">{team1Score.overs?.toFixed(1)} Overs</div>
                                    </div>
                                    <div className="h-12 w-px bg-border/50"></div>
                                    <div className="flex flex-col items-start">
                                        <div className="text-5xl font-black tabular-nums tracking-tighter text-text-main leading-none">{team2Score.runs}/{team2Score.wickets}</div>
                                        <div className="text-sm font-bold text-text-muted mt-1">{team2Score.overs?.toFixed(1)} Overs</div>
                                    </div>
                                </div>
                                {match.result && (
                                    <div className="mt-6 text-sm font-black text-primary bg-primary/5 px-4 py-2 rounded-lg border border-primary/20">
                                        {match.result}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col items-center md:items-start gap-4 text-center md:text-left group">
                                <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-2xl p-4 shadow-sm border border-border flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                    <img src={getTeamLogoUrl(match.teams[1])} alt={match.teams[1]} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-3xl font-black text-text-main leading-tight mb-1">{match.teams[1]}</h2>
                                    <p className="text-sm text-text-muted font-medium">Away Team</p>
                                    <p className="md:hidden text-2xl font-black text-text-main mt-2">{team2Score.runs}/{team2Score.wickets} <span className="text-sm font-medium text-text-muted">({team2Score.overs} ov)</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container max-w-5xl mx-auto -mt-8 relative z-20 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Playing XI Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                                    <Users size={20} className="text-primary" /> Playing XI
                                </h3>
                                {isAdminOrScorer && (
                                    <button onClick={() => setIsSettingXI(!isSettingXI)} className="text-xs font-bold text-primary hover:underline">
                                        {isSettingXI ? 'Cancel' : 'Manage XI'}
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[0, 1].map(index => (
                                    <div key={index} className="space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-widest text-text-muted">{match.teams[index]}</p>
                                        <div className="space-y-2">
                                            {match.playingXI?.[`team${index + 1}`]?.length > 0 ? (
                                                allPlayers.filter(p => match.playingXI[`team${index + 1}`].includes(p._id)).map(p => (
                                                    <div key={p._id} className="flex items-center justify-between p-2.5 bg-bg-secondary rounded-lg border border-border/50 text-sm font-medium">
                                                        <span>{p.name}</span>
                                                        <span className="text-[10px] text-text-muted uppercase font-bold">{p.role}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-text-muted italic">No players selected.</p>
                                            )}
                                        </div>
                                        {isSettingXI && (
                                            <div className="pt-2">
                                                <select
                                                    multiple
                                                    className="w-full bg-bg-secondary border border-border rounded-lg p-2 text-sm h-32"
                                                    onChange={(e) => {
                                                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                                                        handleSaveXI(`team${index + 1}`, selected);
                                                    }}
                                                    value={match.playingXI?.[`team${index + 1}`] || []}
                                                >
                                                    {allPlayers.filter(p => p.team === match.teams[index]).map(p => (
                                                        <option key={p._id} value={p._id}>{p.name}</option>
                                                    ))}
                                                </select>
                                                <p className="text-[10px] text-text-muted mt-1 italic">Hold Ctrl/Cmd to select multiple</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
                            <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                                <Shield size={20} className="text-primary" /> Match Stats
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 rounded-lg bg-bg-secondary text-center">
                                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Extras Total</p>
                                    <p className="text-2xl font-black text-text-main">{(team1Score.extras || 0) + (team2Score.extras || 0)}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-bg-secondary text-center">
                                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Innings</p>
                                    <p className="text-2xl font-black text-text-main">{match.scores?.team2?.runs > 0 ? '2' : '1'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {isAdminOrScorer ? (
                            <div className="bg-white rounded-xl shadow-lg border border-primary/20 p-6 md:p-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-hover"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                                        <Activity size={20} className="text-green-500 animate-bounce" /> Scorer Console
                                    </h3>
                                    <AnimatePresence>
                                        {lastAction && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 shadow-sm"
                                            >
                                                {lastAction}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Batting Team</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[0, 1].map(i => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleTeamChange(`team${i + 1}`)}
                                                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${scoreUpdate.battingTeam === `team${i + 1}` ? 'bg-primary text-white border-primary' : 'bg-white text-text-muted border-border hover:border-primary'}`}
                                                >
                                                    {match.teams[i]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-2">
                                        {[0, 1, 2, 3, 4, 6].map(val => (
                                            <button key={val} onClick={() => handleBallAction('runs', val)} className="p-3 bg-bg-secondary hover:bg-primary/10 rounded-xl text-lg font-black border border-border group transition-all transform active:scale-95">
                                                {val}
                                            </button>
                                        ))}
                                        <button onClick={() => handleBallAction('wicket')} className="p-3 bg-red-50 text-red-600 border-red-100 rounded-xl text-lg font-black col-span-2 uppercase tracking-wide flex items-center justify-center gap-1 active:scale-95 transition-transform"><X size={16} /> Wkt</button>
                                    </div>

                                    <div className="grid grid-cols-4 gap-2">
                                        <button onClick={() => handleBallAction('dot')} className="p-3 bg-bg-secondary hover:bg-border rounded-xl text-xs font-bold uppercase active:scale-95 transition-transform">Dot</button>
                                        <button onClick={() => handleBallAction('over')} className="p-3 bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 rounded-xl text-xs font-black uppercase active:scale-95 transition-transform">+ Ball</button>
                                        <button onClick={() => handleBallAction('wide')} className="p-3 bg-yellow-50 text-yellow-700 border-yellow-100 rounded-xl text-xs font-bold uppercase active:scale-95 transition-transform">Wide</button>
                                        <button onClick={() => handleBallAction('noball')} className="p-3 bg-orange-50 text-orange-700 border-orange-100 rounded-xl text-xs font-bold uppercase active:scale-95 transition-transform">NB</button>
                                    </div>

                                    {/* Manual Entry Overrides */}
                                    <div className="pt-4 border-t border-border/50">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-3">Manual Overrides</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-text-muted uppercase">Runs</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-bg-secondary border border-border rounded-lg p-2 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                                                    value={scoreUpdate.runs}
                                                    onChange={e => setScoreUpdate({ ...scoreUpdate, runs: parseInt(e.target.value) || 0 })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-text-muted uppercase">Wkts</label>
                                                <input
                                                    type="number"
                                                    max="10"
                                                    className="w-full bg-bg-secondary border border-border rounded-lg p-2 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                                                    value={scoreUpdate.wickets}
                                                    onChange={e => setScoreUpdate({ ...scoreUpdate, wickets: parseInt(e.target.value) || 0 })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-text-muted uppercase">Overs</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    className="w-full bg-bg-secondary border border-border rounded-lg p-2 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                                                    value={scoreUpdate.overs}
                                                    onChange={e => setScoreUpdate({ ...scoreUpdate, overs: parseFloat(e.target.value) || 0 })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-text-muted mb-1">Status</label>
                                                <select className="w-full bg-bg-secondary border border-border rounded-lg p-2 text-xs font-bold" value={scoreUpdate.status} onChange={e => setScoreUpdate({ ...scoreUpdate, status: e.target.value })}>
                                                    <option value="upcoming">Upcoming</option>
                                                    <option value="live">Live</option>
                                                    <option value="paused">Paused</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-text-muted mb-1">Result</label>
                                                <input className="w-full bg-bg-secondary border border-border rounded-lg p-2 text-xs font-bold" placeholder="e.g. CSK won..." value={scoreUpdate.result} onChange={e => setScoreUpdate({ ...scoreUpdate, result: e.target.value })} />
                                            </div>
                                        </div>

                                        <button onClick={() => handleUpdateScore()} className="w-full btn btn-primary py-4 text-sm font-bold uppercase tracking-widest shadow-lg hover:shadow-xl rounded-lg flex items-center justify-center gap-2">
                                            <Save size={18} /> Push Updates
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
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

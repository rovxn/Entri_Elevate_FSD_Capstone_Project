import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '../services/playerService';
import { getUserAvatarUrl } from '../utils/imageUtils';
import { getCurrentUser } from '../services/authService';
import { Users, Plus, X, Search, Pencil, Filter, ChevronDown, Trash2 } from 'lucide-react';

const Players = () => {
    const [players, setPlayers] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPlayerId, setCurrentPlayerId] = useState(null);

    // Player Form State
    const [playerForm, setPlayerForm] = useState({
        name: '',
        role: 'Batsman',
        team: '',
        stats: {
            matchesPlayed: 0,
            runs: 0,
            wickets: 0,
            average: 0
        }
    });

    useEffect(() => {
        const init = async () => {
            const userData = await getCurrentUser();
            setUser(userData);
            try {
                const playersData = await getPlayers();
                setPlayers(playersData);
            } catch (error) {
                console.error("Failed to fetch players");
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const openCreateModal = () => {
        setIsEditing(false);
        setPlayerForm({
            name: '',
            role: 'Batsman',
            team: '',
            stats: { matchesPlayed: 0, runs: 0, wickets: 0, average: 0 }
        });
        setShowModal(true);
    };

    const openEditModal = (player) => {
        setIsEditing(true);
        setCurrentPlayerId(player._id);
        setPlayerForm({
            name: player.name,
            role: player.role,
            team: player.team,
            stats: player.stats || { matchesPlayed: 0, runs: 0, wickets: 0, average: 0 }
        });
        setShowModal(true);
    };

    const handleSavePlayer = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updatePlayer(currentPlayerId, playerForm);
            } else {
                await createPlayer(playerForm);
            }
            setShowModal(false);

            // Refresh
            const updated = await getPlayers();
            setPlayers(updated);
        } catch (error) {
            alert(isEditing ? "Failed to update player" : "Failed to create player");
        }
    };

    const handleDeletePlayer = async (id) => {
        if (!window.confirm("Are you sure you want to delete this player?")) return;
        try {
            await deletePlayer(id);
            setPlayers(players.filter(p => p._id !== id));
        } catch (error) {
            alert("Failed to delete player");
        }
    };

    const filteredPlayers = players.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.team.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg-main pb-12">
            <Navbar />

            {/* Create/Edit Player Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white border-t md:border border-border p-6 md:p-8 rounded-t-3xl md:rounded-2xl w-full md:max-w-lg shadow-2xl max-h-90vh overflow-y-auto animate-slide-up md:animate-none">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-text-main">{isEditing ? 'Edit Player' : 'Add New Player'}</h2>
                                <p className="text-text-muted text-sm mt-1">Manage player details and statistics</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-text-muted hover:text-text-main p-2 rounded-full hover:bg-bg-main transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSavePlayer} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Player Name</label>
                                <input
                                    required
                                    className="w-full bg-bg-main focus:bg-white transition-all p-3 font-medium rounded-xl"
                                    value={playerForm.name}
                                    placeholder="e.g. Virat Kohli"
                                    onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Role</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-bg-main focus:bg-white transition-all p-3 font-medium rounded-xl appearance-none cursor-pointer"
                                            value={playerForm.role}
                                            onChange={(e) => setPlayerForm({ ...playerForm, role: e.target.value })}
                                        >
                                            <option>Batsman</option>
                                            <option>Bowler</option>
                                            <option>All-Rounder</option>
                                            <option>Wicket Keeper</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Team</label>
                                    <input
                                        required
                                        className="w-full bg-bg-main focus:bg-white transition-all p-3 font-medium rounded-xl"
                                        value={playerForm.team}
                                        onChange={(e) => setPlayerForm({ ...playerForm, team: e.target.value })}
                                        placeholder="Team Name"
                                    />
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className="pt-6 border-t border-border/50">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-1 h-4 bg-primary rounded-full"></span>
                                    <h3 className="text-sm font-bold uppercase tracking-wide text-text-main">Performance Stats</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-bg-main/50 p-3 rounded-xl border border-border/50">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Matches</label>
                                        <input
                                            type="number"
                                            className="w-full bg-white focus:ring-2 ring-primary/20 transition-all p-2 font-mono font-bold text-lg rounded-lg border border-border"
                                            value={playerForm.stats.matchesPlayed}
                                            onChange={(e) => setPlayerForm({ ...playerForm, stats: { ...playerForm.stats, matchesPlayed: parseInt(e.target.value) || 0 } })}
                                        />
                                    </div>
                                    <div className="bg-bg-main/50 p-3 rounded-xl border border-border/50">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Runs</label>
                                        <input
                                            type="number"
                                            className="w-full bg-white focus:ring-2 ring-primary/20 transition-all p-2 font-mono font-bold text-lg rounded-lg border border-border"
                                            value={playerForm.stats.runs}
                                            onChange={(e) => setPlayerForm({ ...playerForm, stats: { ...playerForm.stats, runs: parseInt(e.target.value) || 0 } })}
                                        />
                                    </div>
                                    <div className="bg-bg-main/50 p-3 rounded-xl border border-border/50">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Wickets</label>
                                        <input
                                            type="number"
                                            className="w-full bg-white focus:ring-2 ring-primary/20 transition-all p-2 font-mono font-bold text-lg rounded-lg border border-border"
                                            value={playerForm.stats.wickets}
                                            onChange={(e) => setPlayerForm({ ...playerForm, stats: { ...playerForm.stats, wickets: parseInt(e.target.value) || 0 } })}
                                        />
                                    </div>
                                    <div className="bg-bg-main/50 p-3 rounded-xl border border-border/50">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Average</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full bg-white focus:ring-2 ring-primary/20 transition-all p-2 font-mono font-bold text-lg rounded-lg border border-border"
                                            value={playerForm.stats.average}
                                            onChange={(e) => setPlayerForm({ ...playerForm, stats: { ...playerForm.stats, average: parseFloat(e.target.value) || 0 } })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full btn btn-primary py-4 mt-4 text-base tracking-wide shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                                {isEditing ? 'Save Changes' : 'Add Player'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <main className="container pt-8 md:pt-12">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                    <header>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-1 bg-gradient-to-r from-accent to-primary rounded-full"></div>
                            <span className="text-sm font-bold uppercase tracking-widest text-accent">Roster</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-text-main mb-3">Players</h1>
                        <p className="text-text-muted text-lg max-w-xl leading-relaxed">
                            Manage team rosters, track player statistics, and analyze individual performance.
                        </p>
                    </header>

                    {user?.role === 'admin' && (
                        <button
                            onClick={openCreateModal}
                            className="btn btn-primary h-12 px-8 text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 rounded-xl flex items-center gap-2 transition-transform hover:-translate-y-1"
                        >
                            <Plus size={20} strokeWidth={2.5} />
                            Add Player
                        </button>
                    )}
                </div>

                {/* Filters / Search Bar */}
                <div className="mb-10 sticky top-20 z-30 bg-bg-main/95 backdrop-blur py-4 -my-4 px-1">
                    <div className="relative max-w-2xl w-full group mx-auto md:mx-0 shadow-sm hover:shadow-md transition-shadow rounded-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by player name or team..."
                            className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-3.5 text-base focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main bg-bg-main p-1 rounded-full"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPlayers.map((player) => (
                        <div key={player._id} className="card group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 bg-white flex flex-col relative overflow-visible border-border/60">
                            {/* Decorative Top Border */}
                            <div className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-300 ${player.role === 'Batsman' ? 'bg-blue-500 group-hover:bg-blue-600' : 'bg-green-500 group-hover:bg-green-600'}`}></div>

                            {/* Admin Actions */}
                            {user?.role === 'admin' && (
                                <div className="absolute top-4 right-4 flex gap-2 z-10">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openEditModal(player); }}
                                        className="p-2 rounded-lg bg-white/90 backdrop-blur-sm text-text-muted hover:bg-primary hover:text-white border border-border/50 shadow-sm transition-all hover:scale-105"
                                        title="Edit Player"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeletePlayer(player._id); }}
                                        className="p-2 rounded-lg bg-white/90 backdrop-blur-sm text-text-muted hover:bg-red-500 hover:text-white border border-border/50 shadow-sm transition-all hover:scale-105"
                                        title="Delete Player"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}

                            <div className="p-6 pb-0 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 relative group-hover:scale-110 transition-transform duration-300">
                                    <img
                                        src={getUserAvatarUrl(player.name)}
                                        alt={player.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                </div>
                                <h3 className="font-bold text-xl text-text-main group-hover:text-primary transition-colors line-clamp-1 w-full">{player.name}</h3>
                                <div className="mt-2 flex flex-wrap justify-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-bg-main px-3 py-1 rounded-full border border-border">{player.team}</span>
                                    <span className={`badge text-[10px] uppercase tracking-wider ${player.role === 'Batsman' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                        {player.role}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-border grid grid-cols-3 divide-x divide-border bg-bg-main/30">
                                <div className="p-3 text-center group-hover:bg-bg-main transition-colors">
                                    <div className="text-[10px] font-bold uppercase text-text-muted tracking-wide mb-1">Mat</div>
                                    <div className="font-mono font-bold text-lg text-text-main">{player.stats.matchesPlayed}</div>
                                </div>
                                <div className="p-3 text-center group-hover:bg-bg-main transition-colors">
                                    <div className="text-[10px] font-bold uppercase text-text-muted tracking-wide mb-1">Runs</div>
                                    <div className="font-mono font-bold text-lg text-text-main">{player.stats.runs}</div>
                                </div>
                                <div className="p-3 text-center group-hover:bg-bg-main transition-colors">
                                    <div className="text-[10px] font-bold uppercase text-text-muted tracking-wide mb-1">Wkts</div>
                                    <div className="font-mono font-bold text-lg text-text-main">{player.stats.wickets}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPlayers.length === 0 && (
                    <div className="py-24 text-center text-text-muted border-2 border-dashed border-border rounded-3xl bg-bg-main/30 flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Users size={32} className="opacity-40" />
                        </div>
                        <div>
                            <p className="font-bold text-lg text-text-main">No players found</p>
                            <p className="text-sm max-w-xs mx-auto mt-1">Try adjusting your search query or add a new player to the roster.</p>
                        </div>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="btn btn-outline text-xs font-bold uppercase tracking-wider mt-2"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Players;

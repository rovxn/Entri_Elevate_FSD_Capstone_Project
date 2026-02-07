import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { getPlayers, createPlayer } from '../services/playerService'; // Need to create this
import { getCurrentUser } from '../services/authService';
import { Users, Plus, X, Search, Filter } from 'lucide-react';

const Players = () => {
    const [players, setPlayers] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // New Player Form
    const [newPlayer, setNewPlayer] = useState({
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

    const handleCreatePlayer = async (e) => {
        e.preventDefault();
        try {
            await createPlayer(newPlayer);
            setShowModal(false);
            setNewPlayer({
                name: '',
                role: 'Batsman',
                team: '',
                stats: { matchesPlayed: 0, runs: 0, wickets: 0, average: 0 }
            });
            // Refresh
            const updated = await getPlayers();
            setPlayers(updated);
        } catch (error) {
            alert("Failed to create player");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />

            {/* Create Player Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-bg-card border border-border p-6 rounded-lg w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Add New Player</h2>
                            <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-main">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreatePlayer} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1">Player Name</label>
                                <input
                                    required
                                    className="w-full bg-bg-main border border-border rounded px-3 py-2 focus:border-primary focus:outline-none"
                                    value={newPlayer.name}
                                    onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1">Role</label>
                                    <select
                                        className="w-full bg-bg-main border border-border rounded px-3 py-2 focus:border-primary focus:outline-none"
                                        value={newPlayer.role}
                                        onChange={(e) => setNewPlayer({ ...newPlayer, role: e.target.value })}
                                    >
                                        <option>Batsman</option>
                                        <option>Bowler</option>
                                        <option>All-Rounder</option>
                                        <option>Wicket Keeper</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1">Team</label>
                                    <input
                                        required
                                        className="w-full bg-bg-main border border-border rounded px-3 py-2 focus:border-primary focus:outline-none"
                                        value={newPlayer.team}
                                        onChange={(e) => setNewPlayer({ ...newPlayer, team: e.target.value })}
                                        placeholder="Team Name"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full btn btn-primary py-2 mt-4">Add Player</button>
                        </form>
                    </div>
                </div>
            )}

            <main className="container py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Players</h1>
                        <p className="text-text-muted">Manage and view all registered players.</p>
                    </div>

                    {user?.role === 'admin' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn btn-primary flex items-center gap-2 h-10 px-5"
                        >
                            <Plus size={16} /> Add Player
                        </button>
                    )}
                </div>

                {/* Filters / Search Bar placeholder */}
                <div className="mb-8 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                        <input
                            type="text"
                            placeholder="Search players..."
                            className="w-full bg-bg-card border border-border rounded pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {players.map((player) => (
                        <div key={player._id} className="card p-5 hover:border-primary/50 transition-colors group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-border-soft rounded-full flex items-center justify-center text-lg font-bold">
                                        {player.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{player.name}</h3>
                                        <p className="text-xs font-bold uppercase text-text-muted">{player.team}</p>
                                    </div>
                                </div>
                                <span className="badge bg-border-soft text-text-main text-[10px]">{player.role}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 border-t border-border pt-4">
                                <div className="text-center">
                                    <p className="text-[10px] font-bold uppercase text-text-muted mb-1">Matches</p>
                                    <p className="font-mono font-bold">{player.stats.matchesPlayed}</p>
                                </div>
                                <div className="text-center border-l border-border">
                                    <p className="text-[10px] font-bold uppercase text-text-muted mb-1">Runs</p>
                                    <p className="font-mono font-bold">{player.stats.runs}</p>
                                </div>
                                <div className="text-center border-l border-border">
                                    <p className="text-[10px] font-bold uppercase text-text-muted mb-1">Wickets</p>
                                    <p className="font-mono font-bold">{player.stats.wickets}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {players.length === 0 && (
                        <div className="col-span-full py-12 text-center text-text-muted border border-dashed border-border rounded-lg">
                            No players found.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Players;

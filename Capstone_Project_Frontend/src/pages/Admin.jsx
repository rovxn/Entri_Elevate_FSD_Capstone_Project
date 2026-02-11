import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import API from '../services/api';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../services/teamService';
import { User, Shield, Search, Check, X, Users, MapPin, Trophy, Pencil, Trash2, Plus, LayoutGrid, List, ChevronDown } from 'lucide-react';
import { getUserAvatarUrl } from '../utils/imageUtils';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);

    // Users State
    const [users, setUsers] = useState([]);
    const [userSearch, setUserSearch] = useState('');

    // Teams State
    const [teams, setTeams] = useState([]);
    const [teamSearch, setTeamSearch] = useState('');
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [isEditingTeam, setIsEditingTeam] = useState(false);
    const [currentTeamId, setCurrentTeamId] = useState(null);
    const [teamForm, setTeamForm] = useState({
        name: '',
        shortName: '',
        city: '',
        homeGround: '',
        logo: '',
        captain: '',
        coach: ''
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [usersRes, teamsData] = await Promise.all([
                API.get('/auth/users'),
                getTeams()
            ]);
            setUsers(usersRes.data);
            setTeams(teamsData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    // User Actions
    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await API.put(`/auth/users/${userId}`, { role: newRole });
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            alert("Failed to update role");
        }
    };

    // Team Actions
    const handleSaveTeam = async (e) => {
        e.preventDefault();
        try {
            if (isEditingTeam) {
                await updateTeam(currentTeamId, teamForm);
            } else {
                await createTeam(teamForm);
            }
            setShowTeamModal(false);
            const updatedTeams = await getTeams();
            setTeams(updatedTeams);
        } catch (error) {
            alert(isEditingTeam ? "Failed to update team" : "Failed to create team");
        }
    };

    const handleDeleteTeam = async (id) => {
        if (!window.confirm("Are you sure you want to delete this team?")) return;
        try {
            await deleteTeam(id);
            setTeams(teams.filter(t => t._id !== id));
        } catch (error) {
            alert("Failed to delete team");
        }
    };

    const openTeamModal = (team = null) => {
        if (team) {
            setIsEditingTeam(true);
            setCurrentTeamId(team._id);
            setTeamForm({
                name: team.name,
                shortName: team.shortName,
                city: team.city || '',
                homeGround: team.homeGround || '',
                logo: team.logo || '',
                captain: team.captain || '',
                coach: team.coach || ''
            });
        } else {
            setIsEditingTeam(false);
            setTeamForm({
                name: '',
                shortName: '',
                city: '',
                homeGround: '',
                logo: '',
                captain: '',
                coach: ''
            });
        }
        setShowTeamModal(true);
    };

    // Filtering
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    const filteredTeams = teams.filter(t =>
        t.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
        t.shortName.toLowerCase().includes(teamSearch.toLowerCase())
    );

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-bg-main">
            <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg-main pb-12">
            <Navbar />

            {/* Team Modal */}
            {showTeamModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl max-h-90vh overflow-y-auto animate-slide-up">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-text-main">{isEditingTeam ? 'Edit Team' : 'Add New Team'}</h2>
                                <p className="text-sm text-text-muted mt-1">Manage team details</p>
                            </div>
                            <button onClick={() => setShowTeamModal(false)} className="p-1 hover:bg-bg-secondary rounded text-text-muted hover:text-text-main transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSaveTeam} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-text-muted mb-1.5">Team Name</label>
                                    <input className="w-full bg-bg-secondary border border-border p-2.5 rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary transition-all" required value={teamForm.name} onChange={e => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="e.g. Chennai Super Kings" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-text-muted mb-1.5">Short Name</label>
                                    <input className="w-full bg-bg-secondary border border-border p-2.5 rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary transition-all" required placeholder="e.g. CSK" value={teamForm.shortName} onChange={e => setTeamForm({ ...teamForm, shortName: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-text-muted mb-1.5">City</label>
                                    <input className="w-full bg-bg-secondary border border-border p-2.5 rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary transition-all" value={teamForm.city} onChange={e => setTeamForm({ ...teamForm, city: e.target.value })} placeholder="City" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-text-muted mb-1.5">Home Ground</label>
                                    <input className="w-full bg-bg-secondary border border-border p-2.5 rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary transition-all" value={teamForm.homeGround} onChange={e => setTeamForm({ ...teamForm, homeGround: e.target.value })} placeholder="Stadium Name" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-text-muted mb-1.5">Captain</label>
                                    <input className="w-full bg-bg-secondary border border-border p-2.5 rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary transition-all" value={teamForm.captain} onChange={e => setTeamForm({ ...teamForm, captain: e.target.value })} placeholder="Name" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-text-muted mb-1.5">Coach</label>
                                    <input className="w-full bg-bg-secondary border border-border p-2.5 rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary transition-all" value={teamForm.coach} onChange={e => setTeamForm({ ...teamForm, coach: e.target.value })} placeholder="Name" />
                                </div>
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full btn btn-primary py-2.5 text-sm font-semibold shadow-sm hover:translate-y-0">
                                    {isEditingTeam ? 'Update Team' : 'Create Team'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <main className="container pt-8 md:pt-12 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <header>
                        <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">Admin Panel</h1>
                        <p className="text-text-muted text-base">
                            Manage users, teams, and system configurations.
                        </p>
                    </header>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-bg-secondary border border-border rounded-lg mb-8 w-full md:w-fit overflow-x-auto no-scrollbar shadow-sm">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`md:flex-none px-4 py-2 rounded-md text-sm font-semibold uppercase transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'users' ? 'bg-white text-primary shadow-sm ring-1 ring-border' : 'text-text-muted hover:text-text-main hover:bg-white/50'}`}
                    >
                        <Users size={16} />
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('teams')}
                        className={`md:flex-none px-4 py-2 rounded-md text-sm font-semibold uppercase transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'teams' ? 'bg-white text-primary shadow-sm ring-1 ring-border' : 'text-text-muted hover:text-text-main hover:bg-white/50'}`}
                    >
                        <Shield size={16} />
                        Teams
                    </button>
                </div>

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-6 animate-slide-up">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <h2 className="text-lg font-bold tracking-tight text-text-main flex items-center gap-2">
                                User Management
                                <span className="bg-bg-secondary text-xs font-medium px-2 py-0.5 rounded-full border border-border text-text-muted">{filteredUsers.length}</span>
                            </h2>
                            <div className="relative w-full md:w-64 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="w-full bg-white border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="bg-white shadow-sm border border-border rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead className="bg-bg-secondary border-b border-border">
                                        <tr>
                                            <th className="p-4 text-xs font-semibold uppercase text-text-muted tracking-wide">User</th>
                                            <th className="p-4 text-xs font-semibold uppercase text-text-muted tracking-wide">Role</th>
                                            <th className="p-4 text-xs font-semibold uppercase text-text-muted tracking-wide text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {filteredUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-bg-secondary/30 transition-colors group">
                                                <td className="p-4 flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-border/20 flex items-center justify-center border border-border/50 overflow-hidden">
                                                        <img
                                                            src={getUserAvatarUrl(user.name)}
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-text-main group-hover:text-primary transition-colors">{user.name}</p>
                                                        <p className="text-xs text-text-muted">{user.email}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide border ${user.role === 'admin' ? 'bg-primary/5 text-primary border-primary/20' : 'bg-bg-secondary text-text-muted border-border'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="relative inline-block">
                                                        <select
                                                            className="text-xs font-semibold border border-border rounded-lg pl-3 pr-8 py-1.5 bg-white hover:border-text-muted focus:outline-none cursor-pointer appearance-none transition-colors"
                                                            value={user.role}
                                                            onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                                                        >
                                                            <option value="viewer">Viewer</option>
                                                            <option value="scorer">Scorer</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                                            <ChevronDown size={12} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Teams Tab */}
                {activeTab === 'teams' && (
                    <div className="space-y-6 animate-slide-up">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <h2 className="text-lg font-bold tracking-tight text-text-main flex items-center gap-2">
                                Team Management
                                <span className="bg-bg-secondary text-xs font-medium px-2 py-0.5 rounded-full border border-border text-text-muted">{filteredTeams.length}</span>
                            </h2>
                            <div className="flex gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64 group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search teams..."
                                        className="w-full bg-white border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
                                        value={teamSearch}
                                        onChange={(e) => setTeamSearch(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={() => openTeamModal()}
                                    className="btn btn-primary px-4 rounded-lg shadow-sm whitespace-nowrap"
                                >
                                    <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline font-medium">Add Team</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {filteredTeams.map((team) => (
                                <div key={team._id} className="card p-5 bg-white flex justify-between items-start group border-border hover:border-primary/50 transition-colors">
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-border shadow-sm text-lg font-bold text-text-muted group-hover:text-primary transition-colors shrink-0">
                                            {team.shortName.slice(0, 2)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base text-text-main mb-0.5">{team.name}</h3>
                                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">{team.shortName} • {team.city}</p>
                                            <div className="text-xs text-text-muted space-y-1 font-medium">
                                                <div className="flex items-center gap-1.5"><Trophy size={12} className="opacity-70" /> {team.homeGround || 'No Home Ground'}</div>
                                                <div className="flex items-center gap-1.5"><User size={12} className="opacity-70" /> Cap: <span className="text-text-main">{team.captain || 'N/A'}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openTeamModal(team)}
                                            className="p-1.5 text-text-muted hover:text-text-main hover:bg-bg-secondary rounded border border-transparent hover:border-border transition-all"
                                            title="Edit"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTeam(team._id)}
                                            className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredTeams.length === 0 && (
                                <div className="col-span-full py-16 text-center text-text-muted border border-dashed border-border rounded-xl bg-bg-secondary/50 flex flex-col items-center justify-center gap-3">
                                    <Shield size={24} className="opacity-20" />
                                    <div>
                                        <p className="font-medium text-text-main">No teams found</p>
                                        <p className="text-sm">Create a new team to get started.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Admin;


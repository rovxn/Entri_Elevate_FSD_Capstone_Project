import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { getCurrentUser } from '../services/authService';
import { User, Mail, Shield, Save, Loader2 } from 'lucide-react';
import { getUserAvatarUrl } from '../utils/imageUtils';

const Settings = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-bg-main">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    return (
        <div className="min-h-screen bg-bg-main pb-12">
            <Navbar />
            <main className="container pt-8 md:pt-12 max-w-2xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-text-main mb-2">Account Settings</h1>
                    <p className="text-text-muted text-sm">Manage your profile and preferences.</p>
                </header>

                <div className="card bg-white border border-border overflow-hidden">
                    <div className="p-6 md:p-8 flex items-center gap-6 border-b border-border/50 bg-bg-secondary/30">
                        <div className="w-20 h-20 rounded-full border border-border shadow-sm overflow-hidden flex-shrink-0">
                            <img
                                src={getUserAvatarUrl(user?.name)}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-text-main">{user?.name}</h2>
                            <p className="text-sm text-text-muted mb-3">{user?.email}</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-white uppercase tracking-wide">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-text-muted">Display Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                <input
                                    type="text"
                                    value={user?.name || ''}
                                    readOnly
                                    className="w-full bg-bg-secondary/50 border border-border rounded-lg px-3 py-2.5 pl-10 text-text-muted cursor-not-allowed text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-text-muted">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    readOnly
                                    className="w-full bg-bg-secondary/50 border border-border rounded-lg px-3 py-2.5 pl-10 text-text-muted cursor-not-allowed text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase text-text-muted">Role</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                <input
                                    type="text"
                                    value={user?.role || ''}
                                    readOnly
                                    className="w-full bg-bg-secondary/50 border border-border rounded-lg px-3 py-2.5 pl-10 text-text-muted cursor-not-allowed text-sm font-medium capitalize"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border/50">
                            <button disabled className="btn btn-primary w-full opacity-50 cursor-not-allowed justify-center text-sm">
                                <Save size={16} />
                                Save Changes (Read Only)
                            </button>
                            <p className="text-xs text-center text-text-muted mt-3">
                                Contact an administrator to update your profile details.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;

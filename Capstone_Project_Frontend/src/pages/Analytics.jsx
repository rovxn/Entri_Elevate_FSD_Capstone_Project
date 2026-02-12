import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { getTopScorers, getTopWicketTakers, getPlatformOverview } from '../services/analyticsService';
import { Trophy, Activity, Users, BarChart2, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [scorers, setScorers] = useState([]);
    const [wicketTakers, setWicketTakers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [overviewData, scorersData, wicketsData] = await Promise.all([
                    getPlatformOverview(),
                    getTopScorers(),
                    getTopWicketTakers()
                ]);
                setStats(overviewData.data);
                setScorers(scorersData.data);
                setWicketTakers(wicketsData.data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-bg-main">
            <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    const barData = {
        labels: scorers.slice(0, 5).map(s => s.name),
        datasets: [
            {
                label: 'Runs Scored',
                data: scorers.slice(0, 5).map(s => s.stats.runs),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 8,
            },
        ],
    };

    const doughnutData = {
        labels: ['Batsmen', 'Bowlers', 'All-Rounders', 'WK'],
        datasets: [
            {
                data: [40, 30, 20, 10], // Mock data as backend doesn't provide role split yet
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#6366f1',
                ],
                hoverOffset: 4,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-bg-main pb-12">
            <Navbar />
            <main className="container pt-8 md:pt-12">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">Platform Analytics</h1>
                    <p className="text-text-muted text-base">Key insights and performance metrics across the system.</p>
                </header>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <StatCard label="Total Matches" value={stats?.totalMatches} icon={Trophy} />
                    <StatCard label="Live Matches" value={stats?.liveMatches} icon={Activity} color="text-red-500" />
                    <StatCard label="Total Teams" value={stats?.totalTeams} icon={Users} />
                    <StatCard label="Total Players" value={stats?.totalPlayers} icon={BarChart2} />
                </div>

                {/* Visual Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border shadow-sm"
                    >
                        <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary" /> Scoring Leaders (Top 5)
                        </h3>
                        <div className="h-[300px]">
                            <Bar data={barData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-border shadow-sm"
                    >
                        <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                            <PieIcon size={20} className="text-secondary" /> Player Roles
                        </h3>
                        <div className="h-[300px] flex items-center justify-center">
                            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Run Scorers Table */}
                    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-border bg-bg-secondary/30 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                                <TrendingUp size={20} className="text-primary" /> Detailed Rankings
                            </h2>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-bg-secondary text-text-muted uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-3">Player</th>
                                        <th className="px-6 py-3">Team</th>
                                        <th className="px-6 py-3 text-right">Runs</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {scorers.map((player, index) => (
                                        <tr key={player._id} className="hover:bg-bg-secondary/20 transition-colors">
                                            <td className="px-6 py-4 font-medium text-text-main">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-bg-secondary flex items-center justify-center text-xs font-bold text-text-muted">
                                                        {index + 1}
                                                    </span>
                                                    {player.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-text-muted">{player.team}</td>
                                            <td className="px-6 py-4 text-right font-bold text-primary">{player.stats.runs}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Wicket Takers Table */}
                    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-border bg-bg-secondary/30 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                                <Activity size={20} className="text-secondary" /> Top Wicket Takers
                            </h2>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-bg-secondary text-text-muted uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-3">Player</th>
                                        <th className="px-6 py-3">Team</th>
                                        <th className="px-6 py-3 text-right">Wickets</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {wicketTakers.map((player, index) => (
                                        <tr key={player._id} className="hover:bg-bg-secondary/20 transition-colors">
                                            <td className="px-6 py-4 font-medium text-text-main">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-bg-secondary flex items-center justify-center text-xs font-bold text-text-muted">
                                                        {index + 1}
                                                    </span>
                                                    {player.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-text-muted">{player.team}</td>
                                            <td className="px-6 py-4 text-right font-bold text-secondary">{player.stats.wickets}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="card p-5 flex items-center justify-between bg-white shadow-sm border border-border hover:border-border-soft transition-colors text-text-main">
        <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">{label}</p>
            <h3 className={`text-2xl font-bold tabular-nums ${color}`}>{value || 0}</h3>
        </div>
        <div className="p-2 rounded-lg bg-bg-secondary text-text-main">
            <Icon size={20} strokeWidth={2} />
        </div>
    </div>
);

export default Analytics;

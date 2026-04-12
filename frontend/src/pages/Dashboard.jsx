import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
    Heart, Target, Award, ArrowRight, 
    Sparkles, TrendingUp, Calendar, Users, Zap, MapPin, CheckCircle
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalDonations: 0,
        completedMissions: 0,
        impactScore: 0
    });
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState(() => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        return Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
            return { name: monthNames[d.getMonth()], impact: 0 };
        });
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [donationsRes, eventsRes, recRes] = await Promise.all([
                    API.get('/api/donations/my-donations'),
                    API.get('/api/events/my-bookings'),
                    API.get('/api/events/recommendations')
                ]);

                const donations = donationsRes.data.data;
                const total = donations.reduce((acc, d) => acc + (d.amount || 0), 0);
                const completed = eventsRes.data.data.filter(b => b.participationStatus === 'completed').length;

                // Build real monthly chart data from donations
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const now = new Date();
                const monthlyMap = {};
                // Seed last 6 months with 0
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const key = `${d.getFullYear()}-${d.getMonth()}`;
                    monthlyMap[key] = { name: monthNames[d.getMonth()], impact: 0 };
                }
                donations.forEach(d => {
                    const date = new Date(d.createdAt);
                    const key = `${date.getFullYear()}-${date.getMonth()}`;
                    if (monthlyMap[key]) monthlyMap[key].impact += d.amount || 0;
                });
                const realChartData = Object.values(monthlyMap);

                setStats({
                    totalDonations: total,
                    completedMissions: completed,
                    impactScore: (total / 100) + (completed * 50)
                });
                setChartData(realChartData);
                setRecommendations(recRes.data.data.slice(0, 3));
            } catch (err) {
                console.error("Dashboard data fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);




    return (
        <div className="app-layout">
            <Sidebar />
            
            <main className="main-content-v2">
                <header className="welcome-section-v2 animate-up">
                    <div className="welcome-text">
                        <span>Welcome Back,</span>
                        <h1>{user?.fullName} <Sparkles className="text-primary" size={24} /></h1>
                        <p>Your contributions have directly impacted 12+ lives this month.</p>
                    </div>
                </header>

                <div className="stats-row-v2">
                    <div className="stat-card-v2 animate-up" style={{ animationDelay: '0.1s' }}>
                        <div className="card-decoration"></div>
                        <div className="stat-content">
                            <div className="stat-icon-v2">
                                <Heart size={24} />
                            </div>
                            <label>Total Donations</label>
                            <h2>₹{stats.totalDonations.toLocaleString()}</h2>
                        </div>
                    </div>

                    <div className="stat-card-v2 animate-up" style={{ animationDelay: '0.2s' }}>
                        <div className="card-decoration"></div>
                        <div className="stat-content">
                            <div className="stat-icon-v2" style={{ background: '#fff7ed', color: '#ea580c' }}>
                                <Target size={24} />
                            </div>
                            <label>Missions Completed</label>
                            <h2>{stats.completedMissions}</h2>
                        </div>
                    </div>

                    <div className="stat-card-v2 animate-up" style={{ animationDelay: '0.3s' }}>
                        <div className="card-decoration"></div>
                        <div className="stat-content">
                            <div className="stat-icon-v2" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                                <Award size={24} />
                            </div>
                            <label>Impact Score</label>
                            <h2>{Math.round(stats.impactScore)}</h2>
                        </div>
                    </div>
                </div>

                <div className="dashboard-main-grid-v2">
                    <div className="chart-container-v2 animate-up" style={{ animationDelay: '0.4s' }}>
                        <div className="container-header">
                            <h3>Impact Growth</h3>
                            <div className="trending">
                                <TrendingUp size={16} /> 12% vs last month
                            </div>
                        </div>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                    <YAxis hide={true} />
                                    <Tooltip />
                                    <Area 
                                        type="monotone" 
                                        dataKey="impact" 
                                        stroke="#2ecc71" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorImpact)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="quick-actions-v2 animate-up" style={{ animationDelay: '0.5s' }}>
                        <div className="container-header" style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Zap size={18} fill="#ca8a04" color="#ca8a04" /> Recommended for You
                            </h3>
                        </div>
                        <div className="action-list-v2">
                            {recommendations.length > 0 ? (
                                recommendations.map(event => (
                                    <div key={event._id} className="action-item-v2" style={{ padding: '1rem' }}>
                                        <div className="action-info">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <strong>{event.title}</strong>
                                                <span className="badge-ai" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>{event.matchPercentage}% MATCH</span>
                                            </div>
                                            <span style={{ fontSize: '0.75rem' }}>{event.ngoName} • {event.location}</span>
                                        </div>
                                        <button className="btn-glass" style={{ padding: '6px' }}>
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1rem', textAlign: 'center' }}>
                                    No matches found. Update your skills!
                                </p>
                            )}
                            <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '1rem', paddingTop: '1rem' }}>
                                <button className="btn-glass" style={{ width: '100%', justifyContent: 'center', gap: '8px' }} onClick={() => window.location.href='/recommendations'}>
                                    View All Recommendations <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

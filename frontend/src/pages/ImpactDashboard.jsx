import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { 
    Heart, Award, Users, TrendingUp, 
    Calendar, MapPin, Loader, Star,
    CheckCircle2, Target, ShieldCheck, Sparkles
} from 'lucide-react';

const ImpactDashboard = () => {
    const [stats, setStats] = useState({
        totalDonated: 0,
        eventsAttended: 0,
        orgsImpacted: 0,
        volunteerHours: 0
    });
    const [recentImpact, setRecentImpact] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImpactData = async () => {
            try {
                const [donationsRes, eventsRes] = await Promise.all([
                    API.get('/api/donations/my-donations'),
                    API.get('/api/events/my-bookings')
                ]);

                const donations = donationsRes.data?.data || [];
                const events = eventsRes.data?.data || [];

                const totalMoney = donations
                    .filter(d => d.donationType === 'money' && d.status === 'completed')
                    .reduce((sum, d) => sum + d.amount, 0);

                const attendedEvents = events.filter(e => e.participationStatus === 'attended');
                
                const impactedOrgs = new Set([
                    ...donations.map(d => d.organizationId?._id),
                    ...events.map(e => e.eventId?.ngoId?._id)
                ]);

                setStats({
                    totalDonated: totalMoney,
                    eventsAttended: attendedEvents.length,
                    orgsImpacted: impactedOrgs.size - (impactedOrgs.has(undefined) ? 1 : 0),
                    volunteerHours: attendedEvents.length * 4 
                });

                const combined = [
                    ...donations.map(d => ({ ...d, type: 'donation', date: new Date(d.createdAt) })),
                    ...events.map(e => ({ ...e, type: 'event', date: new Date(e.createdAt) }))
                ].sort((a, b) => b.date - a.date).slice(0, 5);

                setRecentImpact(combined);
            } catch (err) {
                console.error("Impact data fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchImpactData();
    }, []);

    if (loading) {
        return (
            <div className="loading-screen">
                <Loader className="spin" size={48} color="var(--primary)" />
                <p>Calculating your positive impact...</p>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar />
            
            <main className="main-content-v2">
                <header className="welcome-section-v2 animate-up">
                    <div className="welcome-text">
                        <div className="badge-ai" style={{ width: 'fit-content' }}>
                            <Sparkles size={14} /> SOCIAL CITIZEN
                        </div>
                        <h1>Your Social <span className="text-highlight">Footprint</span></h1>
                        <p>Track your contributions and the lives you've helped transform.</p>
                    </div>
                </header>

                <div className="stats-grid-v2">
                    <div className="stat-card-v2 animate-fade">
                        <div className="card-decoration"></div>
                        <div className="stat-content">
                            <div className="stat-icon-v2" style={{ background: '#f0fdf4', color: '#16a34a' }}><Heart size={24} /></div>
                            <h2>₹{stats.totalDonated}</h2>
                            <label>Funds Contributed</label>
                        </div>
                    </div>
                    <div className="stat-card-v2 animate-fade" style={{ animationDelay: '0.1s' }}>
                        <div className="card-decoration"></div>
                        <div className="stat-content">
                            <div className="stat-icon-v2" style={{ background: '#fff7ed', color: '#ea580c' }}><Award size={24} /></div>
                            <h2>{stats.eventsAttended}</h2>
                            <label>Events Accomplished</label>
                        </div>
                    </div>
                    <div className="stat-card-v2 animate-fade" style={{ animationDelay: '0.2s' }}>
                        <div className="card-decoration"></div>
                        <div className="stat-content">
                            <div className="stat-icon-v2" style={{ background: '#eff6ff', color: '#2563eb' }}><Users size={24} /></div>
                            <h2>{stats.orgsImpacted}</h2>
                            <label>NGOs Supported</label>
                        </div>
                    </div>
                    <div className="stat-card-v2 animate-fade" style={{ animationDelay: '0.3s' }}>
                        <div className="card-decoration"></div>
                        <div className="stat-content">
                            <div className="stat-icon-v2" style={{ background: '#faf5ff', color: '#9333ea' }}><TrendingUp size={24} /></div>
                            <h2>{stats.volunteerHours}h</h2>
                            <label>Service Hours contributed</label>
                        </div>
                    </div>
                </div>

                <div className="dashboard-main-grid-v2">
                    <div className="donation-form-column animate-fade">
                        <section className="chart-container-v2" style={{ padding: '1.5rem' }}>
                            <div className="container-header">
                                <h3><Calendar size={20} /> Impact Timeline</h3>
                            </div>
                            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {recentImpact.length > 0 ? (
                                    recentImpact.map((item, idx) => (
                                        <div key={idx} className="action-item-v2" style={{ position: 'relative' }}>
                                            <div style={{ position: 'absolute', left: '19px', top: '40px', bottom: '-20px', width: '2px', background: '#e2e8f0', zIndex: 0, display: idx === recentImpact.length - 1 ? 'none' : 'block' }}></div>
                                            <div className="action-icon" style={{ zIndex: 1, background: item.type === 'donation' ? '#16a34a' : '#2ecc71', color: 'white' }}>
                                                {item.type === 'donation' ? <Heart size={16} /> : <Award size={16} />}
                                            </div>
                                            <div className="action-info">
                                                <strong>{item.type === 'donation' ? 'Generous Donation' : 'Active Volunteering'}</strong>
                                                <span style={{ fontSize: '0.8rem' }}>
                                                    {item.type === 'donation' 
                                                        ? `Contributed to ${item.organizationId?.name}`
                                                        : `Participated in ${item.eventId?.title}`
                                                    }
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.date.toLocaleDateString()}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ textAlign: 'center', opacity: 0.5, padding: '2rem' }}>No impact data found. Start making history!</p>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="donation-stats-column animate-fade">
                        <section className="chart-container-v2" style={{ padding: '1.5rem' }}>
                            <div className="container-header">
                                <h3><Target size={20} /> Achieved Badges</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                <div className="stat-card-v2" style={{ border: stats.totalDonated > 0 ? '1px solid var(--primary)' : '1px solid transparent', opacity: stats.totalDonated > 0 ? 1 : 0.4 }}>
                                    <div className="stat-icon-v2" style={{ background: '#fef2f2', color: '#ef4444' }}><Heart size={24} fill={stats.totalDonated > 0 ? "#ef4444" : "none"} /></div>
                                    <div style={{ marginLeft: '12px' }}>
                                        <strong style={{ display: 'block' }}>Kind Heart</strong>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Earned for first donation</span>
                                    </div>
                                </div>
                                <div className="stat-card-v2" style={{ border: stats.eventsAttended >= 1 ? '1px solid var(--primary)' : '1px solid transparent', opacity: stats.eventsAttended >= 1 ? 1 : 0.4 }}>
                                    <div className="stat-icon-v2" style={{ background: '#f0fdf4', color: '#16a34a' }}><Award size={24} /></div>
                                    <div style={{ marginLeft: '12px' }}>
                                        <strong style={{ display: 'block' }}>Active Volunteer</strong>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Participated in 1+ event</span>
                                    </div>
                                </div>
                                <div className="stat-card-v2" style={{ border: stats.orgsImpacted >= 3 ? '1px solid var(--primary)' : '1px solid transparent', opacity: stats.orgsImpacted >= 3 ? 1 : 0.4 }}>
                                    <div className="stat-icon-v2" style={{ background: '#fefce8', color: '#ca8a04' }}><Star size={24} /></div>
                                    <div style={{ marginLeft: '12px' }}>
                                        <strong style={{ display: 'block' }}>Community Pillar</strong>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Helped 3+ organizations</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ImpactDashboard;

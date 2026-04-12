import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { 
    Star, MapPin, Calendar, Users, 
    Zap, Loader, Info, CheckCircle,
    ArrowRight, Heart, Sparkles
} from 'lucide-react';

const VolunteerRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingLoading, setBookingLoading] = useState(null);
    const [userBookings, setUserBookings] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const [recRes, bookingsRes] = await Promise.all([
                    API.get('/api/events/recommendations'),
                    API.get('/api/events/my-bookings')
                ]);
                setRecommendations(recRes.data.data);
                setUserProfile(recRes.data.userProfile);
                setUserBookings((bookingsRes.data?.data || []).map(b => b.event?._id).filter(id => id));
            } catch (err) {
                console.error("Failed to fetch recommendations", err);
                setError('Failed to load personalized recommendations.');
            } finally {
                setLoading(false);
            }
        };

        const handleBook = async (eventId) => {
            setBookingLoading(eventId);
            setMessage({ type: '', text: '' });
            try {
                await API.post(`/api/events/${eventId}/book`);
                setMessage({ type: 'success', text: 'Successfully registered for mission!' });
                setUserBookings([...userBookings, eventId]);
            } catch (err) {
                setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to register.' });
            } finally {
                setBookingLoading(null);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="loading-screen">
                <Loader className="spin" size={48} color="var(--primary)" />
                <p>Analyzing opportunities for you...</p>
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
                            <Zap size={14} fill="currentColor" /> AI MATCH ENGINE
                        </div>
                        <h1>Missions for You</h1>
                        <p>We've analyzed your skills and location to find the perfect matches.</p>
                    </div>
                </header>

                {message.text && (
                    <div className="animate-fade" style={{ margin: '0 2rem 2rem', padding: '15px', borderRadius: '12px', background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', color: message.type === 'success' ? '#16a34a' : '#dc2626', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
                        <CheckCircle size={20} />
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="dashboard-main-grid-v2">
                    <section className="chart-container-v2 animate-fade">
                        <div className="container-header">
                            <h3>Curated Opportunities</h3>
                        </div>
                        <div className="activity-list">
                            {recommendations.length > 0 ? (
                                recommendations.map(event => (
                                    <div key={event._id} className="action-item-v2" style={{ padding: '1.5rem', alignItems: 'flex-start' }}>
                                        <div className="match-score-circle" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                                            <svg viewBox="0 0 36 36" className="circular-chart" style={{ width: '100%', height: '100%' }}>
                                                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                <path className="circle" strokeDasharray={`${event.matchPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                <text x="18" y="20.35" className="percentage" style={{ fontSize: '9px' }}>{event.matchPercentage}%</text>
                                            </svg>
                                        </div>
                                        <div className="action-info" style={{ marginLeft: '1.5rem', flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <strong style={{ fontSize: '1.1rem' }}>{event.title}</strong>
                                                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{event.ngoName}</span>
                                                </div>
                                                {userBookings.includes(event._id) ? (
                                                    <div className="btn-glass" style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        <CheckCircle size={14} /> Registered
                                                    </div>
                                                ) : (
                                                    <button 
                                                        className="btn-glass" 
                                                        style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'var(--primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                        onClick={() => handleBook(event._id)}
                                                        disabled={bookingLoading === event._id}
                                                    >
                                                        {bookingLoading === event._id ? <Loader className="spin" size={14} /> : <>Apply Now <ArrowRight size={14} /></>}
                                                    </button>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> {event.location}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(event.date).toLocaleDateString()}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                                                {event.requiredSkills.map(skill => (
                                                    <span key={skill} className="trending" style={{ 
                                                        background: event.matchedSkills.includes(skill) ? 'var(--primary-light)' : '#f1f5f9',
                                                        color: event.matchedSkills.includes(skill) ? 'var(--primary)' : '#64748b',
                                                        fontSize: '0.75rem'
                                                    }}>
                                                        {event.matchedSkills.includes(skill) && <CheckCircle size={10} style={{ marginRight: '4px' }} />}
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-matches" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                                    <Heart size={48} color="#dfe6e9" style={{ marginBottom: '1rem' }} />
                                    <h3>No perfect matches yet</h3>
                                    <p>Try adding more skills to your profile to see more recommendations!</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="quick-actions-v2">
                        <h3>Your Profile AI</h3>
                        <div className="stat-card-v2" style={{ padding: '1.5rem', border: 'none', background: 'var(--bg-main)' }}>
                            <div className="stat-content">
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.6 }}>REGISTERED SKILLS</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                    {(userProfile?.skills || []).map(s => (
                                        <span key={s} className="trending" style={{ background: 'white', border: '1px solid #e2e8f0' }}>{s}</span>
                                    ))}
                                </div>
                                <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <Sparkles size={14} className="text-primary" /> Increase your match score by completing more missions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default VolunteerRecommendations;

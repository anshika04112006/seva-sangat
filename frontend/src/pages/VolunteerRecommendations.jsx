import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { 
    Star, MapPin, Calendar, Users, 
    Zap, Loader, Info, CheckCircle,
    ArrowRight, Heart
} from 'lucide-react';
import '../assets/styles/index.css';

const VolunteerRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const { data } = await API.get('/api/events/recommendations');
                setRecommendations(data.data);
                setUserProfile(data.userProfile);
            } catch (err) {
                console.error("Failed to fetch recommendations", err);
                setError('Failed to load personalized recommendations.');
            } finally {
                setLoading(false);
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
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            
            <main className="recommendation-container">
                <header className="recommendation-header">
                    <div className="badge-ai">
                        <Zap size={14} fill="currentColor" /> AI Powered
                    </div>
                    <h1>Recommended for You</h1>
                    <p>Matches based on your skills and location preference</p>

                    {userProfile && (
                        <div className="user-profile-summary">
                            <div className="summary-item">
                                <span className="label">Your Skills:</span>
                                <div className="summary-tags">
                                    {(userProfile.skills || []).map(s => <span key={s} className="summary-tag">{s}</span>)}
                                </div>
                            </div>
                            <div className="summary-item">
                                <span className="label">Location:</span>
                                <span className="summary-val">{userProfile.location}</span>
                            </div>
                        </div>
                    )}
                </header>

                {error && (
                    <div className="alert alert-error">{error}</div>
                )}

                <div className="recommendation-grid">
                    {recommendations.length > 0 ? (
                        recommendations.map(event => (
                            <div key={event._id} className="match-card">
                                <div className="match-score-circle">
                                    <svg viewBox="0 0 36 36" className="circular-chart">
                                        <path className="circle-bg"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path className="circle"
                                            strokeDasharray={`${event.matchPercentage}, 100`}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <text x="18" y="20.35" className="percentage">{event.matchPercentage}%</text>
                                    </svg>
                                    <span className="score-label">Match</span>
                                </div>

                                <div className="match-content">
                                    <div className="match-header">
                                        <h3>{event.title}</h3>
                                        <span className="ngo-badge">{event.ngoName}</span>
                                    </div>

                                    <div className="match-details">
                                        <div className="detail-row">
                                            <MapPin size={14} />
                                            <span>{event.location}</span>
                                        </div>
                                        <div className="detail-row">
                                            <Calendar size={14} />
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="match-skills">
                                        <p>Required Skills:</p>
                                        <div className="skill-tags">
                                            {event.requiredSkills.map(skill => (
                                                <span 
                                                    key={skill} 
                                                    className={`skill-tag ${event.matchedSkills.includes(skill) ? 'matched' : ''}`}
                                                >
                                                    {event.matchedSkills.includes(skill) && <CheckCircle size={10} />}
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="match-footer">
                                        <button className="apply-btn">
                                            Apply Now <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-matches">
                            <Heart size={48} color="#dfe6e9" />
                            <h3>No perfect matches yet</h3>
                            <p>Try adding more skills to your profile to see more recommendations!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default VolunteerRecommendations;

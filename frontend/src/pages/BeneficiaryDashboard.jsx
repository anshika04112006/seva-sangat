import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { 
    LayoutDashboard, Map, BookOpen, 
    Heart, Shield, ChevronRight, 
    ArrowUpRight, Info, Zap,
    HelpCircle, MessageCircle, Sparkles, Clock, Star
} from 'lucide-react';
import API from '../services/api';

const BeneficiaryDashboard = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Mocking data for now as backend routes are pending
                setMatches([
                    { id: 1, name: "Health Care Camp", category: "Healthcare", dist: "1.2km", icon: <Heart size={20} /> },
                    { id: 2, name: "Vocational Skills Center", category: "Training", dist: "2.5km", icon: <BookOpen size={20} /> }
                ]);
                setCourses([
                    { id: 1, title: "Basic Digital Literacy", progress: 65 },
                    { id: 2, title: "Financial Management", progress: 20 }
                ]);
            } catch (err) {
                console.error("Dashboard load failed", err);
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
                        <div className="badge-ai" style={{ width: 'fit-content' }}>
                            <Sparkles size={14} /> AI POWERED SUPPORT
                        </div>
                        <h1>Namaste! <span className="text-highlight">👋</span></h1>
                        <p>Here are your personalized AI-recommended supports and learning progress.</p>
                    </div>
                </header>

                <div className="stats-grid-v2">
                    <div className="stat-card-v2 animate-fade">
                        <div className="card-decoration"></div>
                        <div className="stat-content">
                            <div className="stat-icon-v2" style={{ background: '#fefce8', color: '#ca8a04' }}><Zap size={24} fill="#ca8a04" /></div>
                            <h2>240</h2>
                            <label>Impact Points Earned</label>
                        </div>
                    </div>
                    <div className="stat-card-v2 animate-fade" style={{ animationDelay: '0.1s' }}>
                        <div className="card-decoration"></div>
                        <div className="stat-content">
                            <div className="stat-icon-v2" style={{ background: '#f0fdf4', color: '#16a34a' }}><Star size={24} /></div>
                            <h2>Level 4</h2>
                            <label>Community Citizen</label>
                        </div>
                    </div>
                    <div className="stat-card-v2 animate-fade" style={{ animationDelay: '0.2s' }}>
                        <div className="card-decoration"></div>
                        <div className="stat-content">
                            <div className="stat-icon-v2" style={{ background: '#eff6ff', color: '#2563eb' }}><Shield size={24} /></div>
                            <h2>Verified</h2>
                            <label>Profile Status</label>
                        </div>
                    </div>
                </div>

                <div className="dashboard-main-grid-v2">
                    <div className="donation-form-column animate-fade">
                        <section className="chart-container-v2" style={{ padding: '1.5rem' }}>
                            <div className="container-header">
                                <h3>Matched Sewa Services</h3>
                                <button className="btn-glass" style={{ fontSize: '0.8rem' }}>AI Recommendations</button>
                            </div>
                            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {matches.map(service => (
                                    <div key={service.id} className="action-item-v2" style={{ padding: '1.2rem' }}>
                                        <div className="action-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                                            {service.icon}
                                        </div>
                                        <div className="action-info">
                                            <strong>{service.name}</strong>
                                            <span style={{ fontSize: '0.85rem' }}>{service.category} • {service.dist} away</span>
                                        </div>
                                        <button className="btn-glass" style={{ padding: '8px 15px', border: '1px solid #e2e8f0' }}>Get Help</button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="chart-container-v2" style={{ padding: '1.5rem', marginTop: '2rem' }}>
                            <div className="container-header">
                                <h3>Quick Actions</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
                                {[
                                    { icon: <HelpCircle size={20} />, label: 'Scheme Info', bg: '#fef2f2', c: '#ef4444' },
                                    { icon: <Map size={20} />, label: 'Centres', bg: '#f1f5f9', c: '#475569' },
                                    { icon: <MessageCircle size={20} />, label: 'AI Help', bg: '#f0fdf4', c: '#16a34a' },
                                    { icon: <Shield size={20} />, label: 'SOS Hub', bg: 'var(--primary-light)', c: 'var(--primary)' }
                                ].map((act, i) => (
                                    <div key={i} className="stat-card-v2" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div className="stat-icon-v2" style={{ background: act.bg, color: act.c, margin: '0 0 10px 0' }}>{act.icon}</div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{act.label}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="donation-stats-column animate-fade">
                        <section className="chart-container-v2" style={{ padding: '1.5rem' }}>
                            <div className="container-header">
                                <h3>Learning Hub</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                                {courses.map(course => (
                                    <div key={course.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                                            <strong style={{ opacity: 0.8 }}>{course.title}</strong>
                                            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{course.progress}%</span>
                                        </div>
                                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div style={{ width: `${course.progress}%`, height: '100%', background: 'var(--primary)', borderRadius: '10px' }}></div>
                                        </div>
                                    </div>
                                ))}
                                <button className="stat-card-v2" style={{ marginTop: '1rem', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', padding: '1rem', justifyContent: 'center' }}>
                                    Resume Training
                                </button>
                            </div>
                        </section>

                        <div className="stat-card-v2" style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #16a34a 0%, #2ecc71 100%)', color: 'white' }}>
                            <div className="stat-content">
                                <Shield size={32} />
                                <h4 style={{ margin: '15px 0 5px' }}>Safety Hub</h4>
                                <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>Access nearest help centers and SOS assistance centers.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BeneficiaryDashboard;

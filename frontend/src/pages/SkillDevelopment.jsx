import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { BookOpen, Star, Clock, Trophy, CheckCircle, PlayCircle, Download, Sparkles } from 'lucide-react';
import API from '../services/api';

const SkillDevelopment = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setCourses([
            { id: 1, title: 'Basics of Healthcare Assistance', provider: 'Sewa Health Academy', duration: '4 Weeks', level: 'Beginner', rating: 4.8, progress: 75, img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400' },
            { id: 2, title: 'Digital Literacy for Women', provider: 'Sewa Digital Hub', duration: '2 Weeks', level: 'Elementary', rating: 4.9, progress: 30, img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=400' },
            { id: 3, title: 'Legal Awareness & Rights', provider: 'Nyay Sahayat', duration: '3 Weeks', level: 'Intermediate', rating: 4.7, progress: 0, img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400' }
        ]);
        setLoading(false);
    }, []);

    return (
        <div className="app-layout">
            <Sidebar />
            
            <main className="main-content-v2">
                <header className="welcome-section-v2 animate-up">
                    <div className="welcome-text">
                        <span>Career Growth</span>
                        <h1>Sewa Skill Hub</h1>
                        <p>Upskill yourself with AI-recommended vocational and professional courses.</p>
                    </div>
                </header>

                <div className="dashboard-main-grid-v2">
                    <section className="chart-container-v2 animate-fade">
                        <div className="container-header">
                            <h3>Active Learning Paths</h3>
                        </div>
                        <div className="activity-list">
                            {courses.map(course => (
                                <div key={course.id} className="action-item-v2" style={{ padding: '0', overflow: 'hidden', display: 'flex' }}>
                                    <img src={course.img} alt={course.title} style={{ width: '180px', objectFit: 'cover' }} />
                                    <div style={{ padding: '1.5rem', flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span className="trending" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.7rem' }}>{course.level}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}><Star size={12} color="#f1c40f" fill="#f1c40f" /> {course.rating}</div>
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{course.title}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>by {course.provider}</p>
                                        
                                        <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {course.duration}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Trophy size={14} /> Certificate</span>
                                        </div>

                                        {course.progress > 0 && (
                                            <div style={{ marginBottom: '1.2rem' }}>
                                                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${course.progress}%`, height: '100%', background: 'var(--primary)', borderRadius: '10px' }}></div>
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{course.progress}% Completed</span>
                                            </div>
                                        )}

                                        <button className="btn-glass" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                            {course.progress > 0 ? 'Resume Course' : 'Start Journey'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <aside className="quick-actions-v2">
                        <h3>Honors & Insights</h3>
                        <div className="stat-card-v2" style={{ padding: '1.5rem' }}>
                            <div className="stat-content">
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.6 }}>EARNED CERTIFICATES</label>
                                <div className="activity-list" style={{ marginTop: '1rem' }}>
                                    <div className="action-item-v2" style={{ padding: '10px' }}>
                                        <div className="action-icon" style={{ background: '#fef3c7' }}><Trophy size={16} color="#d97706" /></div>
                                        <div className="action-info">
                                            <strong style={{ fontSize: '0.85rem' }}>Social Work Basics</strong>
                                            <span>April 2026</span>
                                        </div>
                                        <Download size={16} className="text-primary" style={{ cursor: 'pointer' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card-v2" style={{ marginTop: '1.5rem', background: 'var(--primary)', color: 'white' }}>
                            <div className="card-decoration"></div>
                            <div className="stat-content">
                                <label style={{ color: 'rgba(255,255,255,0.7)' }}>AI RECOMMENDATION</label>
                                <p style={{ fontSize: '0.9rem', marginTop: '1rem', lineHeight: '1.5' }}>
                                    Based on your recent donations, "Financial Management" would help you understand organizational impact better.
                                </p>
                                <button style={{ width: '100%', marginTop: '1.5rem', padding: '10px', borderRadius: '10px', border: 'none', background: 'white', color: 'var(--primary)', fontWeight: 700 }}>
                                    View Path
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default SkillDevelopment;

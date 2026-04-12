import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { MessageSquare, Send, AlertCircle, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

const SubmitComplaint = () => {
    const [formData, setFormData] = useState({
        subject: '',
        description: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/api/complaints', formData);
            setStatus({ type: 'success', message: 'Your complaint has been submitted. Our team will review it shortly.' });
            setFormData({ subject: '', description: '' });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to submit complaint' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            
            <main className="main-content-v2">
                <header className="welcome-section-v2 animate-up">
                    <div className="welcome-text">
                        <div className="badge-ai" style={{ width: 'fit-content' }}>
                            <Sparkles size={14} /> SUPPORT CENTER
                        </div>
                        <h1>How can we <span className="text-highlight">help</span>?</h1>
                        <p>Report an issue, share feedback, or voice a concern. We're here to listen.</p>
                    </div>
                </header>

                <div className="dashboard-main-grid-v2">
                    <div className="donation-form-column animate-fade">
                        <section className="chart-container-v2" style={{ padding: '2.5rem' }}>
                            {status.message && (
                                <div className="animate-fade" style={{ marginBottom: '2rem', padding: '15px', borderRadius: '12px', background: status.type === 'success' ? '#f0fdf4' : '#fef2f2', color: status.type === 'success' ? '#16a34a' : '#dc2626', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
                                    {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                    <span>{status.message}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Subject</label>
                                    <input 
                                        type="text" 
                                        placeholder="What is this regarding?"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Description</label>
                                    <textarea 
                                        rows="6" 
                                        placeholder="Please provide as much detail as possible..."
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', resize: 'vertical' }}
                                    ></textarea>
                                </div>

                                <button type="submit" className="stat-card-v2" style={{ width: '100%', padding: '1.2rem', justifyContent: 'center', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }} disabled={loading}>
                                    {loading ? 'Submitting...' : (
                                        <>Submit Ticket <Send size={18} /></>
                                    )}
                                </button>
                            </form>
                        </section>
                    </div>

                    <div className="donation-stats-column animate-fade">
                        <section className="chart-container-v2" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Resolution Process</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { title: 'Admin Review', desc: 'Our team typically reviews tickets within 24 hours.' },
                                    { title: 'Investigation', desc: 'We coordinate with relevant partners if necessary.' },
                                    { title: 'Resolution', desc: 'Outcome updated directly on your dashboard.' }
                                ].map((step, i) => (
                                    <div key={i} className="action-item-v2" style={{ padding: '10px 0' }}>
                                        <div className="action-icon" style={{ borderRadius: '50%' }}>{i + 1}</div>
                                        <div className="action-info">
                                            <strong>{step.title}</strong>
                                            <span style={{ fontSize: '0.8rem' }}>{step.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        
                        <div className="stat-card-v2" style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #16a34a 0%, #2ecc71 100%)', color: 'white' }}>
                            <MessageSquare size={32} />
                            <h4 style={{ margin: '15px 0 5px' }}>Direct Support</h4>
                            <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>Your feedback helps us build a more efficient humanitarian platform for everyone.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SubmitComplaint;

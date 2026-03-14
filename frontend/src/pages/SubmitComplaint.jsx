import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { MessageSquare, Send, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import '../assets/styles/index.css';

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
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            <div className="complaint-page-container">
                <header className="complaint-header">
                    <div className="icon-badge"><MessageSquare size={32} color="#fff" /></div>
                    <h1>How can we help?</h1>
                    <p>Report an issue, share feedback, or voice a concern. We're here to listen.</p>
                </header>

                <div className="complaint-form-card">
                    {status.message && (
                        <div className={`complaint-alert ${status.type}`}>
                            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-field-group">
                            <label>Subject</label>
                            <input 
                                type="text" 
                                placeholder="What is this regarding?"
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            />
                        </div>

                        <div className="input-field-group">
                            <label>Description</label>
                            <textarea 
                                rows="6" 
                                placeholder="Please provide as much detail as possible..."
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            ></textarea>
                        </div>

                        <button className="btn-complaint-submit" disabled={loading}>
                            {loading ? 'Submitting...' : (
                                <>Submit Feedback <Send size={18} /></>
                            )}
                        </button>
                    </form>
                </div>

                <aside className="complaint-sidebar-info">
                    <div className="info-box">
                        <h3>What happens next?</h3>
                        <ul>
                            <li><ChevronRight size={14} /> Admin reviews your report</li>
                            <li><ChevronRight size={14} /> Internal investigation (if needed)</li>
                            <li><ChevronRight size={14} /> Resolution update on your dashboard</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default SubmitComplaint;

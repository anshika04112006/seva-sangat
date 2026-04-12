import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import DonationTracker from '../components/DonationTracker';
import { 
    Heart, DollarSign, Package, Coffee, 
    History, Send, Loader, CheckCircle2,
    AlertCircle, Building, Gift, Sparkles,
    LayoutGrid, List, X, Book, Activity, ArrowRight
} from 'lucide-react';

const DonationPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const preselectedOrgId = queryParams.get('orgId');

    const [organizations, setOrganizations] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    
    const [formData, setFormData] = useState({
        organizationId: preselectedOrgId || '',
        donationType: 'money',
        amount: '',
        itemDescription: '',
        quantity: ''
    });

    const [message, setMessage] = useState({ type: '', text: '' });

    const impactCards = [
        { amount: 500, label: 'Meal Pack', icon: <Coffee />, desc: 'Provides nutritious meals for 5 children for a day.' },
        { amount: 1500, label: 'Education Kit', icon: <Sparkles />, desc: 'Covers books and stationery for one student.' },
        { amount: 3000, label: 'Health Checkup', icon: <Heart />, desc: 'Funds a comprehensive medical camp for seniors.' },
        { amount: 5000, label: 'Sponsor a Month', icon: <Gift />, desc: 'Supports the complete living expenses of one orphan.' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orgsRes, historyRes] = await Promise.all([
                    API.get('/api/orgs'),
                    API.get('/api/donations/my-donations')
                ]);
                setOrganizations(orgsRes.data?.data || []);
                setHistory(historyRes.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleQuickAmount = (amount) => {
        setFormData({ ...formData, donationType: 'money', amount: amount.toString() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            await API.post('/api/donations', formData);
            setShowSuccessModal(true);
            
            const historyRes = await API.get('/api/donations/my-donations');
            setHistory(historyRes.data.data);
            
            setFormData({
                organizationId: preselectedOrgId || '',
                donationType: 'money',
                amount: '',
                itemDescription: '',
                quantity: ''
            });
        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.message || 'Something went wrong. Please try again.' 
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <Loader className="spin" size={48} color="var(--primary)" />
                <p>Preparing donation center...</p>
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
                            <Sparkles size={14} /> IMPACT CENTER
                        </div>
                        <h1>Every Contribution <span className="text-highlight">Matters</span></h1>
                        <p>Choose your impact and help us build a more compassionate world.</p>
                    </div>
                </header>

                <div className="dashboard-main-grid-v2">
                    <div className="donation-form-column animate-fade">
                        <section className="chart-container-v2" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="container-header">
                                <h3>Select Your Impact</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                {impactCards.map((card, index) => (
                                    <div 
                                        key={index} 
                                        className={`stat-card-v2 impact-card ${formData.amount === card.amount.toString() ? 'selected' : ''}`}
                                        onClick={() => handleQuickAmount(card.amount)}
                                        style={{ 
                                            padding: '1.2rem', 
                                            cursor: 'pointer',
                                            border: formData.amount === card.amount.toString() ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                                            transform: formData.amount === card.amount.toString() ? 'translateY(-5px)' : 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div className="stat-icon-v2" style={{ width: '40px', height: '40px', marginBottom: '10px' }}>{card.icon}</div>
                                        <strong style={{ fontSize: '1.1rem', display: 'block' }}>₹{card.amount}</strong>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{card.label}</span>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>{card.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="chart-container-v2" style={{ padding: '2rem' }}>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Select Organization</label>
                                        <select 
                                            name="organizationId" 
                                            value={formData.organizationId}
                                            onChange={handleChange}
                                            required
                                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                                        >
                                            <option value="">Choose an NGO / Orphanage</option>
                                            {organizations.map(org => (
                                                <option key={org._id} value={org._id}>{org.name} ({org.category})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Donation Type</label>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            {['money', 'food', 'clothes', 'books', 'medical'].map(type => (
                                                <button 
                                                    key={type}
                                                    type="button" 
                                                    className={`btn-glass ${formData.donationType === type ? 'active' : ''}`}
                                                    onClick={() => setFormData({...formData, donationType: type})}
                                                    style={{ 
                                                        padding: '8px 16px', 
                                                        background: formData.donationType === type ? 'var(--primary)' : 'white',
                                                        color: formData.donationType === type ? 'white' : 'var(--text-main)'
                                                    }}
                                                >
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {formData.donationType === 'money' ? (
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Amount (₹)</label>
                                            <input 
                                                type="number" 
                                                name="amount"
                                                placeholder="Enter amount"
                                                value={formData.amount}
                                                onChange={handleChange}
                                                required
                                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Description</label>
                                                <input 
                                                    type="text" 
                                                    name="itemDescription"
                                                    placeholder="What are you donating?"
                                                    value={formData.itemDescription}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Quantity</label>
                                                <input 
                                                    type="text" 
                                                    name="quantity"
                                                    placeholder="e.g. 10 kg"
                                                    value={formData.quantity}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                {message.text && (
                                    <div style={{ marginTop: '1.5rem', padding: '12px', borderRadius: '10px', background: message.type === 'error' ? '#fef2f2' : '#f0fdf4', color: message.type === 'error' ? '#dc2626' : '#16a34a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <AlertCircle size={18} /> {message.text}
                                    </div>
                                )}

                                <button type="submit" className="stat-card-v2" style={{ width: '100%', marginTop: '2rem', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', padding: '1.2rem', justifyContent: 'center' }} disabled={submitting}>
                                    {submitting ? <Loader className="spin" size={24} /> : <><Heart size={20} fill="white" /> Complete Donation</>}
                                </button>
                            </form>
                        </section>
                    </div>

                    <div className="donation-stats-column animate-fade">
                        <section className="chart-container-v2" style={{ padding: '1.5rem' }}>
                            <div className="container-header">
                                <h3><History size={18} /> Recent Activity</h3>
                            </div>
                            <div className="activity-list" style={{ marginTop: '1rem' }}>
                                {history.length > 0 ? (
                                    history.map(item => (
                                        <div key={item._id} className="action-item-v2" style={{ padding: '12px', flexDirection: 'column', alignItems: 'stretch' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                                                <div className="action-icon">
                                                    {item.donationType === 'money' ? <DollarSign size={16} /> : <Package size={16} />}
                                                </div>
                                                <div className="action-info" style={{ flex: 1 }}>
                                                    <strong>{item.organizationId?.name}</strong>
                                                    <span>{item.donationType === 'money' ? `₹${item.amount}` : item.itemDescription}</span>
                                                </div>
                                                <button 
                                                    className="btn-glass" 
                                                    style={{ padding: '5px 10px', fontSize: '0.7rem', background: selectedDonation === item._id ? 'var(--primary)' : 'white', color: selectedDonation === item._id ? 'white' : 'var(--primary)' }}
                                                    onClick={() => setSelectedDonation(selectedDonation === item._id ? null : item._id)}
                                                >
                                                    {selectedDonation === item._id ? 'Close' : 'Track'}
                                                </button>
                                            </div>
                                            
                                            {selectedDonation === item._id && (
                                                <div className="animate-up" style={{ marginTop: '15px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                    <DonationTracker status={item.status} history={item.trackingHistory} />
                                                </div>
                                            )}
                                            
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No donations yet.</p>
                                )}
                            </div>
                        </section>

                        <div className="stat-card-v2" style={{ marginTop: '1.5rem', background: 'var(--bg-card)' }}>
                            <div className="card-decoration"></div>
                            <div className="stat-content">
                                <div className="stat-icon-v2" style={{ background: '#fef2f2', color: '#ef4444' }}><Heart size={24} fill="#ef4444" /></div>
                                <h2>{history.length}</h2>
                                <label>Lives Impacted by You</label>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {showSuccessModal && (
                <div className="success-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
                    <div className="stat-card-v2 animate-up" style={{ width: '400px', padding: '3rem', textAlign: 'center' }}>
                        <CheckCircle2 size={64} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                        <h2>Impact Recorded!</h2>
                        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>Thank you for your generosity. A certificate has been added to your honors.</p>
                        <button className="btn-glass" style={{ width: '100%', padding: '1rem' }} onClick={() => setShowSuccessModal(false)}>You're Welcome!</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationPage;

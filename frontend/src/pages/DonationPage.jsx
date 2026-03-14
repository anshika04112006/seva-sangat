import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { 
    Heart, DollarSign, Package, Coffee, 
    History, Send, Loader, CheckCircle2,
    AlertCircle, ChevronRight, Building
} from 'lucide-react';
import '../assets/styles/index.css';

const DonationPage = () => {
    const [organizations, setOrganizations] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        organizationId: '',
        donationType: 'money',
        amount: '',
        itemDescription: '',
        quantity: ''
    });

    const [message, setMessage] = useState({ type: '', text: '' });

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

    const handleTypeChange = (donationType) => {
        setFormData({ ...formData, donationType });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const { data } = await API.post('/api/donations', formData);
            setMessage({ type: 'success', text: data.message });
            
            // Refresh history
            const historyRes = await API.get('/api/donations/my-donations');
            setHistory(historyRes.data.data);
            
            // Reset form partly
            setFormData({
                ...formData,
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
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
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
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            
            <main className="donation-container">
                <header className="donation-header-main">
                    <div className="icon-badge">
                        <Heart size={32} color="var(--primary)" fill="var(--primary)" />
                    </div>
                    <h1>Make a Difference</h1>
                    <p>Your small contribution can bring a huge change in someone's life.</p>
                </header>

                <div className="donation-grid-layout">
                    {/* Donation Form Section */}
                    <section className="donation-card form-section">
                        <h2>Donation Form</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label><Building size={16} /> Select Organization</label>
                                <select 
                                    name="organizationId" 
                                    value={formData.organizationId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Choose an NGO / Orphanage</option>
                                    {organizations.map(org => (
                                        <option key={org._id} value={org._id}>
                                            {org.name} ({org.category})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="donation-type-selector">
                                <label>Donation Type</label>
                                <div className="type-buttons">
                                    <button 
                                        type="button"
                                        className={formData.donationType === 'money' ? 'active' : ''}
                                        onClick={() => handleTypeChange('money')}
                                    >
                                        <DollarSign size={18} /> Money
                                    </button>
                                    <button 
                                        type="button"
                                        className={formData.donationType === 'food' ? 'active' : ''}
                                        onClick={() => handleTypeChange('food')}
                                    >
                                        <Coffee size={18} /> Food
                                    </button>
                                    <button 
                                        type="button"
                                        className={formData.donationType === 'clothes' ? 'active' : ''}
                                        onClick={() => handleTypeChange('clothes')}
                                    >
                                        <Package size={18} /> Clothes
                                    </button>
                                </div>
                            </div>

                            {formData.donationType === 'money' ? (
                                <div className="form-group amount-group">
                                    <label>Amount (₹)</label>
                                    <input 
                                        type="number" 
                                        name="amount"
                                        placeholder="Enter amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="item-details-grid">
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input 
                                            type="text" 
                                            name="itemDescription"
                                            placeholder={formData.donationType === 'food' ? "e.g. Rice, Bread" : "e.g. Blankets, T-shirts"}
                                            value={formData.itemDescription}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Quantity</label>
                                        <input 
                                            type="text" 
                                            name="quantity"
                                            placeholder="e.g. 5kg, 3 units"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {message.text && (
                                <div className={`donation-form-alert ${message.type}`}>
                                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    <span>{message.text}</span>
                                </div>
                            )}

                            <button type="submit" className="btn-donate-submit" disabled={submitting}>
                                {submitting ? <Loader className="spin" size={20} /> : <><Send size={18} /> Submit Donation</>}
                            </button>
                        </form>
                    </section>

                    {/* History Section */}
                    <section className="history-section">
                        <div className="section-header">
                            <h2><History size={20} /> Recent History</h2>
                        </div>
                        
                        <div className="history-list">
                            {history.length > 0 ? (
                                history.map(item => (
                                    <div key={item._id} className="history-item">
                                        <div className={`type-icon ${item.donationType}`}>
                                            {item.donationType === 'money' ? <DollarSign size={18} /> : item.donationType === 'food' ? <Coffee size={18} /> : <Package size={18} />}
                                        </div>
                                        <div className="item-info">
                                            <h4>{item.organizationId?.name || 'Organization'}</h4>
                                            <p>
                                                {item.donationType === 'money' ? `Donated ₹${item.amount}` : `Donated ${item.quantity} ${item.itemDescription}`}
                                            </p>
                                            <span className="date">{new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="item-status">
                                            <span className={`status-badge ${item.status}`}>{item.status}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-history">
                                    <Heart size={40} color="#dfe6e9" />
                                    <p>No donations yet. Start your journey of kindness today!</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default DonationPage;

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { 
    LayoutDashboard, PlusCircle, Calendar, 
    Users, IndianRupee, TrendingUp, 
    ChevronRight, CheckCircle2, Clock,
    Loader, ExternalLink, Briefcase, 
    ArrowUpRight, Wallet, UserCheck,
    MapPin, AlignLeft, Info, Search, Mail
} from 'lucide-react';

const NgoDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalFunds: 0, totalVolunteers: 0, activeEvents: 0, totalEvents: 0 });
    const [events, setEvents] = useState([]);
    const [donations, setDonations] = useState([]);
    const [emergencyNote, setEmergencyNote] = useState('');
    const [updatingNote, setUpdatingNote] = useState(false);
    const [updatingDonation, setUpdatingDonation] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState({ status: '', message: '' });
    
    const [activeTab, setActiveTab] = useState('overview');
    const [showPostModal, setShowPostModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', location: '', date: '', time: '', maxVolunteers: 1, requiredSkills: '' });
    
    const [withdrawalData, setWithdrawalData] = useState({ amount: '', reason: '' });
    const [withdrawalLoading, setWithdrawalLoading] = useState(false);
    
    const [viewingVolunteers, setViewingVolunteers] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [volunteers, setVolunteers] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, eventsRes, donationsRes, orgRes] = await Promise.all([
                    API.get('/api/events/ngo/stats'),
                    API.get('/api/events/ngo-events'),
                    API.get('/api/donations/org'),
                    API.get('/api/orgs/my-org')
                ]);
                setStats(statsRes.data.data);
                setEvents(eventsRes.data.data);
                setDonations(donationsRes.data.data);
                setEmergencyNote(orgRes.data?.data?.emergencyNote || '');
            } catch (err) {
                console.error("Failed to fetch NGO dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleUpdateNote = async () => {
        setUpdatingNote(true);
        try {
            await API.put('/api/orgs/urgent-note', { emergencyNote });
            alert("Emergency note updated successfully. It will now appear on the homepage banner.");
        } catch (err) {
            alert("Failed to update note");
        } finally {
            setUpdatingNote(false);
        }
    };

    const handleUpdateDonationStatus = async (donationId) => {
        try {
            await API.put(`/api/donations/${donationId}/status`, statusUpdate);
            const donationsRes = await API.get('/api/donations/org');
            setDonations(donationsRes.data.data);
            setUpdatingDonation(null);
            setStatusUpdate({ status: '', message: '' });
            alert("Status updated and donor notified via email.");
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleWithdrawalRequest = async (e) => {
        e.preventDefault();
        setWithdrawalLoading(true);
        try {
            await API.post('/api/withdrawals', { amount: Number(withdrawalData.amount), reason: withdrawalData.reason });
            alert("Withdrawal requested successfully!");
            setWithdrawalData({ amount: '', reason: '' });
        } catch (err) {
            alert("Withdrawal request failed: " + (err.response?.data?.message || err.message));
        } finally {
            setWithdrawalLoading(false);
        }
    };

    const handleViewVolunteers = async (eventId) => {
        const event = events.find(e => e._id === eventId);
        setSelectedEvent(event);
        try {
            const res = await API.get(`/api/events/${eventId}/volunteers`);
            setVolunteers(res.data.data || []);
            setViewingVolunteers(true);
        } catch (err) {
            alert("Failed to load volunteers");
        }
    };

    const handlePostEvent = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newEvent,
                requiredSkills: newEvent.requiredSkills.split(',').map(s => s.trim()).filter(s => s)
            };
            await API.post('/api/events', payload);
            alert("Mission deployed successfully!");
            setShowPostModal(false);
            setNewEvent({ title: '', description: '', location: '', date: '', time: '', maxVolunteers: 1, requiredSkills: '' });
            const eventsRes = await API.get('/api/events/ngo-events');
            setEvents(eventsRes.data.data);
            const statsRes = await API.get('/api/events/ngo/stats');
            setStats(statsRes.data.data);
        } catch (err) {
            alert("Failed to deploy mission: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <Loader className="spin" size={48} color="var(--primary)" />
                <p>Establishing secure connection...</p>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar />
            
            <main className="main-content-v2">
                <header className="welcome-section-v2 animate-up">
                    <div className="welcome-text">
                        <span>Partnership Portal</span>
                        <h1>NGO Command Center</h1>
                        <p>Managing your organization's social impact and volunteer network.</p>
                    </div>
                    <button className="btn-glass" onClick={() => setShowPostModal(true)}>
                        <PlusCircle size={20} /> Launch New Mission
                    </button>
                </header>

                <div className="tab-nav-v2 animate-up">
                    <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
                    <button className={activeTab === 'missions' ? 'active' : ''} onClick={() => setActiveTab('missions')}>Missions</button>
                    <button className={activeTab === 'support' ? 'active' : ''} onClick={() => setActiveTab('support')}>Support & Logistics</button>
                    <button className={activeTab === 'funds' ? 'active' : ''} onClick={() => setActiveTab('funds')}>Financials</button>
                </div>

                {activeTab === 'overview' && (
                    <div className="animate-fade">
                        <div className="stats-row-v2">
                            <div className="stat-card-v2">
                                <div className="stat-content">
                                    <div className="stat-icon-v2"><IndianRupee size={24} /></div>
                                    <label>Direct Funds</label>
                                    <h2>₹{stats.totalFunds.toLocaleString()}</h2>
                                </div>
                            </div>
                            <div className="stat-card-v2">
                                <div className="stat-content">
                                    <div className="stat-icon-v2" style={{ background: '#e0f2fe', color: '#0369a1' }}><Users size={24} /></div>
                                    <label>Active Volunteers</label>
                                    <h2>{stats.totalVolunteers}</h2>
                                </div>
                            </div>
                            <div className="stat-card-v2">
                                <div className="stat-content">
                                    <div className="stat-icon-v2" style={{ background: '#fef2f2', color: '#dc2626' }}><Briefcase size={24} /></div>
                                    <label>Active Campaigns</label>
                                    <h2>{stats.activeEvents}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-main-grid-v2">
                            <section className="chart-container-v2">
                                <div className="container-header">
                                    <h3>Emergency Broadcast</h3>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '1rem 0' }}>Update this note to show an urgent relief banner on the homepage. Leave empty to disable.</p>
                                <textarea 
                                    className="form-control"
                                    placeholder="e.g. Urgent need for medical supplies in Sector 62..."
                                    value={emergencyNote}
                                    onChange={(e) => setEmergencyNote(e.target.value)}
                                    style={{ minHeight: '80px', marginBottom: '1rem' }}
                                />
                                <button className="btn-glass" onClick={handleUpdateNote} disabled={updatingNote}>
                                    {updatingNote ? "Syncing..." : "Update Emergency Status"}
                                </button>
                            </section>

                            <section className="chart-container-v2">
                                <div className="container-header">
                                    <h3>Operations Summary</h3>
                                </div>
                                <div className="activity-list">
                                    {events.slice(0, 3).map(event => (
                                        <div key={event._id} className="action-item-v2" onClick={() => setActiveTab('missions')} style={{ cursor: 'pointer' }}>
                                            <div className="action-icon"><Calendar size={18} /></div>
                                            <div className="action-info">
                                                <strong>{event.title}</strong>
                                                <span>{event.location} • {new Date(event.date).toLocaleDateString()}</span>
                                            </div>
                                            <ChevronRight size={16} />
                                        </div>
                                    ))}
                                    {events.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No active missions.</p>}
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {activeTab === 'missions' && (
                    <div className="animate-fade">
                        <div className="grid-v2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                            {events.map(event => (
                                <div key={event._id} className="stat-card-v2">
                                    <div className="stat-content">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{event.title}</h3>
                                            <span className="trending" style={{ background: new Date(event.date) >= new Date() ? 'var(--primary-light)' : '#f1f5f9', color: new Date(event.date) >= new Date() ? 'var(--primary)' : '#64748b' }}>
                                                {new Date(event.date) >= new Date() ? 'Active' : 'Past'}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{event.description.substring(0, 120)}...</p>
                                        <button className="btn-glass" style={{ width: '100%' }} onClick={() => handleViewVolunteers(event._id)}>
                                            <ExternalLink size={16} /> Mission Analytics
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'support' && (
                    <div className="animate-fade">
                        <section className="chart-container-v2">
                            <div className="container-header">
                                <h3>Donation Logistics & Tracking</h3>
                            </div>
                            <div className="ledger-table-container" style={{ marginTop: '1.5rem' }}>
                                <table className="ledger-table" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th>Donor</th>
                                            <th>Contribution</th>
                                            <th>Current Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donations.map(don => (
                                            <React.Fragment key={don._id}>
                                                <tr>
                                                    <td><strong>{don.donorId?.fullName || "Anonymous"}</strong></td>
                                                    <td>{don.donationType === 'money' ? `₹${don.amount}` : don.itemDescription}</td>
                                                    <td>
                                                        <span className="trending" style={{ 
                                                            background: don.status === 'completed' ? '#f0fdf4' : (don.status === 'pending' ? '#fffbeb' : '#eff6ff'),
                                                            color: don.status === 'completed' ? '#16a34a' : (don.status === 'pending' ? '#ca8a04' : '#2563eb')
                                                        }}>
                                                            {don.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="btn-glass" 
                                                            style={{ padding: '5px 12px', fontSize: '0.7rem' }}
                                                            onClick={() => setUpdatingDonation(updatingDonation === don._id ? null : don._id)}
                                                        >
                                                            Update Tracking
                                                        </button>
                                                    </td>
                                                </tr>
                                                {updatingDonation === don._id && (
                                                    <tr>
                                                        <td colSpan="4" style={{ padding: '0 1rem 1rem' }}>
                                                            <div className="animate-up" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '15px', border: '1px solid #e2e8f0', display: 'flex', gap: '1.5rem', alignItems: 'flex-end' }}>
                                                                <div style={{ flex: 1 }}>
                                                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>NEW STATUS</label>
                                                                    <select 
                                                                        className="form-control" 
                                                                        value={statusUpdate.status}
                                                                        onChange={e => setStatusUpdate({...statusUpdate, status: e.target.value})}
                                                                    >
                                                                        <option value="">Select Status</option>
                                                                        <option value="received">Received</option>
                                                                        <option value="dispatched">Dispatched</option>
                                                                        <option value="delivered">Delivered</option>
                                                                        <option value="completed">Completed/Verified</option>
                                                                        <option value="cancelled">Cancelled</option>
                                                                    </select>
                                                                </div>
                                                                <div style={{ flex: 2 }}>
                                                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>TRACKING MESSAGE (TO DONOR)</label>
                                                                    <input 
                                                                        className="form-control" 
                                                                        type="text" 
                                                                        placeholder="e.g. Items received at Delhi warehouse" 
                                                                        value={statusUpdate.message}
                                                                        onChange={e => setStatusUpdate({...statusUpdate, message: e.target.value})}
                                                                    />
                                                                </div>
                                                                <button 
                                                                    className="stat-card-v2" 
                                                                    style={{ background: 'var(--primary)', color: 'white', padding: '10px 20px', fontSize: '0.85rem' }}
                                                                    onClick={() => handleUpdateDonationStatus(don._id)}
                                                                >
                                                                    Push Update
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'funds' && (
                    <div className="animate-fade">
                         <div className="dashboard-main-grid-v2">
                            <div className="chart-container-v2">
                                <h3>Withdrawal Terminal</h3>
                                <div style={{ background: 'var(--bg-main)', padding: '2rem', borderRadius: '20px', marginBottom: '2rem' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>LIQUIDITY AVAILABLE</label>
                                    <h1 style={{ fontSize: '3rem', margin: '0.5rem 0' }}>₹{stats.totalFunds.toLocaleString()}</h1>
                                    <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Locked in secure cloud escrow</p>
                                </div>
                                <form onSubmit={handleWithdrawalRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="form-group">
                                        <input 
                                            type="number" 
                                            placeholder="Amount to Liquidate" 
                                            className="form-control"
                                            value={withdrawalData.amount}
                                            onChange={(e) => setWithdrawalData({...withdrawalData, amount: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <textarea 
                                            placeholder="Operational Justification" 
                                            className="form-control"
                                            value={withdrawalData.reason}
                                            onChange={(e) => setWithdrawalData({...withdrawalData, reason: e.target.value})}
                                            required
                                        ></textarea>
                                    </div>
                                    <button className="btn-glass" type="submit" disabled={withdrawalLoading}>
                                        {withdrawalLoading ? "Processing..." : "Deploy Fund Request"}
                                    </button>
                                </form>
                            </div>
                            <div className="quick-actions-v2">
                                <h3>Recent Support</h3>
                                {donations.slice(0, 5).map(don => (
                                    <div key={don._id} className="action-item-v2">
                                        <div className="action-icon"><IndianRupee size={16} /></div>
                                        <div className="action-info">
                                            <strong>{don.donorId?.fullName || "Donor"}</strong>
                                            <span>₹{don.amount || 'Item'} • {new Date(don.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>
                    </div>
                )}
            </main>

            {/* Mission Analytics Modal */}
            {viewingVolunteers && (
                <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div className="modal-content animate-up" style={{ background: 'white', width: '90%', maxWidth: '1000px', borderRadius: '32px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                         <div style={{ padding: '2rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontWeight: 800 }}>Mission Analytics: {selectedEvent?.title}</h3>
                            <button onClick={() => setViewingVolunteers(false)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                         </div>
                         <div style={{ padding: '2rem', overflowY: 'auto' }}>
                             <table className="ledger-table" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th>Participant</th>
                                        <th>Contact</th>
                                        <th>Status</th>
                                        <th>Verification</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {volunteers.map(v => (
                                        <tr key={v._id}>
                                            <td><strong>{v.user?.fullName || v.userId?.fullName}</strong></td>
                                            <td>{v.user?.email || v.userId?.email}</td>
                                            <td><span className="trending" style={{ background: v.participationStatus === 'completed' ? '#f0fdf4' : '#fef2f2', color: v.participationStatus === 'completed' ? '#16a34a' : '#dc2626' }}>{v.participationStatus}</span></td>
                                            <td>
                                                {v.participationStatus !== 'completed' && (
                                                    <button 
                                                        onClick={async () => {
                                                            try {
                                                                await API.put(`/api/events/bookings/${v._id}/complete`);
                                                                alert("Completion verified! Certificate issued successfully to the Volunteer.");
                                                                handleViewVolunteers(selectedEvent._id);
                                                            } catch(err) { alert("Action failed"); }
                                                        }}
                                                        className="btn-glass"
                                                        style={{ padding: '5px 12px', fontSize: '0.7rem' }}
                                                    >
                                                        Verify Completion
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                         </div>
                    </div>
                </div>
            )}

            {/* Post Event Modal */}
            {showPostModal && (
                <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-content animate-up" style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '32px', overflow: 'hidden' }}>
                        <div style={{ padding: '2rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontWeight: 800 }}>Launch New Mission</h2>
                            <button onClick={() => setShowPostModal(false)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <form onSubmit={handlePostEvent} style={{ padding: '2rem', display: 'grid', gap: '1.2rem' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '5px', display: 'block' }}>MISSION TITLE</label>
                                <input className="form-control" type="text" placeholder="e.g. Community Education Program" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '5px', display: 'block' }}>DATE</label>
                                    <input className="form-control" type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '5px', display: 'block' }}>TIME</label>
                                    <input className="form-control" type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '5px', display: 'block' }}>LOCATION</label>
                                <input className="form-control" type="text" placeholder="Physical location or Remote" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '5px', display: 'block' }}>MISSION BRIEFING</label>
                                <textarea className="form-control" placeholder="Describe the objectives..." value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} required style={{ minHeight: '100px' }}></textarea>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '5px', display: 'block' }}>MAX VOLUNTEERS</label>
                                    <input className="form-control" type="number" placeholder="Capacity" value={newEvent.maxVolunteers} onChange={e => setNewEvent({...newEvent, maxVolunteers: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '5px', display: 'block' }}>KEY SKILLS</label>
                                    <input className="form-control" type="text" placeholder="e.g. Teaching, Coding" value={newEvent.requiredSkills} onChange={e => setNewEvent({...newEvent, requiredSkills: e.target.value})} />
                                </div>
                            </div>
                            <button className="btn-glass" type="submit" style={{ marginTop: '1rem', width: '100%' }}>Deploy Initiative</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NgoDashboard;

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { 
    LayoutDashboard, PlusCircle, Calendar, 
    Users, IndianRupee, TrendingUp, 
    ChevronRight, CheckCircle2, Clock,
    Loader, ExternalLink, Briefcase, 
    ArrowUpRight, Wallet, UserCheck
} from 'lucide-react';
import '../assets/styles/index.css';

const NgoDashboard = () => {
    const [stats, setStats] = useState({
        totalFunds: 0,
        totalVolunteers: 0,
        activeEvents: 0,
        totalEvents: 0
    });
    const [events, setEvents] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    
    // For Post Event Modal
    const [showPostModal, setShowPostModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        requiredSkills: '',
        maxVolunteers: ''
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, eventsRes, donationsRes] = await Promise.all([
                    API.get('/api/events/ngo/stats'),
                    API.get('/api/events/ngo-events'),
                    API.get('/api/donations/org')
                ]);
                setStats(statsRes.data.data);
                setEvents(eventsRes.data.data);
                setDonations(donationsRes.data.data);
            } catch (err) {
                console.error("Failed to fetch NGO dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handlePostEvent = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                ...newEvent,
                requiredSkills: newEvent.requiredSkills.split(',').map(s => s.trim())
            };
            await API.post('/api/events', formData);
            setShowPostModal(false);
            // Refresh data
            const eventsRes = await API.get('/api/events/ngo-events');
            setEvents(eventsRes.data.data);
            alert("Event posted successfully!");
        } catch (err) {
            alert("Failed to post event");
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <Loader className="spin" size={48} color="var(--primary)" />
                <p>Loading NGO Command Center...</p>
            </div>
        );
    }

    return (
        <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
            <Navbar />
            
            <div className="ngo-dashboard-container">
                <aside className="ngo-sidebar">
                    <div className="sidebar-header">
                        <div className="ngo-avatar">NGO</div>
                        <h3>Organization Hub</h3>
                    </div>
                    <nav className="sidebar-nav">
                        <button 
                            className={activeTab === 'overview' ? 'active' : ''}
                            onClick={() => setActiveTab('overview')}
                        >
                            <LayoutDashboard size={20} /> Overview
                        </button>
                        <button 
                            className={activeTab === 'events' ? 'active' : ''}
                            onClick={() => setActiveTab('events')}
                        >
                            <Calendar size={20} /> Managed Events
                        </button>
                        <button 
                            className={activeTab === 'donations' ? 'active' : ''}
                            onClick={() => setActiveTab('donations')}
                        >
                            <IndianRupee size={20} /> Contributions
                        </button>
                        <button 
                            className={activeTab === 'withdraw' ? 'active' : ''}
                            onClick={() => setActiveTab('withdraw')}
                        >
                            <Wallet size={20} /> Withdrawal
                        </button>
                    </nav>
                </aside>

                <main className="ngo-main-content">
                    {activeTab === 'overview' && (
                        <div className="dashboard-view">
                            <header className="view-header">
                                <h1>Dashboard Overview</h1>
                                <button className="btn-quick-post" onClick={() => setShowPostModal(true)}>
                                    <PlusCircle size={20} /> New Event
                                </button>
                            </header>

                            <div className="stats-grid-dashboard">
                                <div className="stat-card impact">
                                    <div className="stat-icon"><IndianRupee size={24} /></div>
                                    <div className="stat-info">
                                        <label>Total Funds Raised</label>
                                        <h2>₹{stats.totalFunds.toLocaleString()}</h2>
                                    </div>
                                    <TrendingUp className="trend-icon" size={20} />
                                </div>
                                <div className="stat-card volunteers">
                                    <div className="stat-icon"><Users size={24} /></div>
                                    <div className="stat-info">
                                        <label>Volunteer Impact</label>
                                        <h2>{stats.totalVolunteers}</h2>
                                    </div>
                                    <UserCheck className="trend-icon" size={20} />
                                </div>
                                <div className="stat-card active-opps">
                                    <div className="stat-icon"><Briefcase size={24} /></div>
                                    <div className="stat-info">
                                        <label>Active Opportunities</label>
                                        <h2>{stats.activeEvents}</h2>
                                    </div>
                                    <ArrowUpRight className="trend-icon" size={20} />
                                </div>
                            </div>

                            <section className="recent-activity">
                                <div className="section-title">
                                    <h3>Upcoming Events</h3>
                                    <button onClick={() => setActiveTab('events')}>View All <ChevronRight size={16} /></button>
                                </div>
                                <div className="activity-list">
                                    {events.slice(0, 3).map(event => (
                                        <div key={event._id} className="activity-item">
                                            <div className="activity-indicator active"></div>
                                            <div className="item-details">
                                                <h4>{event.title}</h4>
                                                <p>{new Date(event.date).toDateString()} • {event.location}</p>
                                            </div>
                                            <span className="badge-pill">{event.maxVolunteers} required</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className="dashboard-view">
                            <header className="view-header">
                                <h1>Managed Events</h1>
                                <button className="btn-quick-post" onClick={() => setShowPostModal(true)}>
                                    <PlusCircle size={20} /> Add New
                                </button>
                            </header>
                            
                            <div className="events-manage-list">
                                {events.map(event => (
                                    <div key={event._id} className="manage-event-card">
                                        <div className="card-top">
                                            <h3>{event.title}</h3>
                                            <span className={new Date(event.date) >= new Date() ? 'status-active' : 'status-past'}>
                                                {new Date(event.date) >= new Date() ? 'Upcoming' : 'Completed'}
                                            </span>
                                        </div>
                                        <p className="desc">{event.description.substring(0, 100)}...</p>
                                        <div className="card-footer-manage">
                                            <div className="meta">
                                                <span><Users size={14} /> 12 Registered</span>
                                                <span><Clock size={14} /> {event.time}</span>
                                            </div>
                                            <button className="btn-manage-volunteers">
                                                Manage Volunteers <ExternalLink size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'donations' && (
                        <div className="dashboard-view">
                            <header className="view-header">
                                <h1>Donations Received</h1>
                            </header>
                            <div className="donations-ledger">
                                <table className="ledger-table">
                                    <thead>
                                        <tr>
                                            <th>Donor</th>
                                            <th>Type</th>
                                            <th>Detail / Amount</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donations.map(donation => (
                                            <tr key={donation._id}>
                                                <td>
                                                    <div className="donor-cell">
                                                        <strong>{donation.donorId?.fullName || "Anonymous"}</strong>
                                                        <span>{donation.donorId?.email}</span>
                                                    </div>
                                                </td>
                                                <td><span className={`type-tag ${donation.donationType}`}>{donation.donationType}</span></td>
                                                <td>
                                                    {donation.donationType === 'money' 
                                                        ? <strong className="amount-text">₹{donation.amount}</strong>
                                                        : <span>{donation.quantity} {donation.itemDescription}</span>
                                                    }
                                                </td>
                                                <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                                                <td><span className="status-confirmed">Received</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'withdraw' && (
                        <div className="dashboard-view">
                            <header className="view-header">
                                <h1>Withdraw Funds</h1>
                            </header>
                            <div className="withdrawal-box">
                                <div className="balance-area">
                                    <label>Available for Withdrawal</label>
                                    <h1>₹{stats.totalFunds.toLocaleString()}</h1>
                                    <p>Funds are usually settled within 3-5 business days.</p>
                                </div>
                                <div className="withdraw-form">
                                    <div className="input-with-label">
                                        <label>Withdrawal Amount</label>
                                        <div className="input-group">
                                            <span>₹</span>
                                            <input type="number" placeholder="Enter amount" />
                                        </div>
                                    </div>
                                    <button className="btn-withdraw-action" disabled={stats.totalFunds <= 0}>
                                        Request Payout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Post Event Modal */}
            {showPostModal && (
                <div className="modal-overlay">
                    <div className="modal-content post-event-modal">
                        <div className="modal-header">
                            <h2>Post New Volunteer Opportunity</h2>
                            <button onClick={() => setShowPostModal(false)}>×</button>
                        </div>
                        <form onSubmit={handlePostEvent}>
                            <div className="form-grid">
                                <div className="input-wrapper full">
                                    <label>Event Title</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                    />
                                </div>
                                <div className="input-wrapper">
                                    <label>Date</label>
                                    <input 
                                        type="date" 
                                        required 
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                                    />
                                </div>
                                <div className="input-wrapper">
                                    <label>Time</label>
                                    <input 
                                        type="time" 
                                        required 
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                                    />
                                </div>
                                <div className="input-wrapper full">
                                    <label>Location</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                                    />
                                </div>
                                <div className="input-wrapper full">
                                    <label>Description</label>
                                    <textarea 
                                        rows="3" 
                                        required
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                                    ></textarea>
                                </div>
                                <div className="input-wrapper">
                                    <label>Required Skills (comma separated)</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Teaching, Cooking" 
                                        value={newEvent.requiredSkills}
                                        onChange={(e) => setNewEvent({...newEvent, requiredSkills: e.target.value})}
                                    />
                                </div>
                                <div className="input-wrapper">
                                    <label>Max Volunteers</label>
                                    <input 
                                        type="number" 
                                        required 
                                        value={newEvent.maxVolunteers}
                                        onChange={(e) => setNewEvent({...newEvent, maxVolunteers: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-modal-submit">Post Event</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NgoDashboard;

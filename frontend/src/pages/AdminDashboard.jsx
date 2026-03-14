import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { 
    ShieldCheck, Users, LandPlot, 
    HeartHandshake, TrendingUp, AlertCircle,
    CheckCircle2, XCircle, Search, 
    Filter, MoreVertical, Loader,
    ChevronRight, ArrowUpRight, MessageSquare
} from 'lucide-react';
import '../assets/styles/index.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalNGOs: 0,
        totalDonations: 0,
        totalEvents: 0,
        totalFundsRaised: 0,
        recentDonations: []
    });
    const [organizations, setOrganizations] = useState([]);
    const [users, setUsers] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stats');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [statsRes, orgsRes, usersRes, complaintsRes] = await Promise.all([
                    API.get('/api/admin/stats'),
                    API.get('/api/admin/organizations'),
                    API.get('/api/admin/users'),
                    API.get('/api/complaints/admin')
                ]);
                setStats(statsRes.data.data);
                setOrganizations(orgsRes.data.data);
                setUsers(usersRes.data.data);
                setComplaints(complaintsRes.data.data);
            } catch (err) {
                console.error("Platform management data fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const handleOrgAction = async (id, verified) => {
        try {
            await API.put(`/api/admin/orgs/${id}/status`, { verified });
            setOrganizations(orgs => orgs.map(o => o._id === id ? { ...o, verified } : o));
            alert(`Organization ${verified ? 'Approved' : 'Rejected'} successfully`);
        } catch (err) {
            alert("Action failed");
        }
    };

    const handleComplaintStatus = async (id, status) => {
        try {
            await API.put(`/api/complaints/${id}/status`, { status });
            setComplaints(prev => prev.map(c => c._id === id ? { ...c, status } : c));
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <Loader className="spin" size={48} color="var(--primary)" />
                <p>Establishing Platform Authority...</p>
            </div>
        );
    }

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            
            <div className="admin-layout">
                <aside className="admin-nav-rail">
                    <div className="admin-brand">
                        <ShieldCheck size={32} color="var(--primary)" />
                        <span>PLATFORM CORE</span>
                    </div>
                    <nav>
                        <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>
                            <TrendingUp size={20} /> Impact Analytics
                        </button>
                        <button className={activeTab === 'verification' ? 'active' : ''} onClick={() => setActiveTab('verification')}>
                            <AlertCircle size={20} /> NGO Verifications
                        </button>
                        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                            <Users size={20} /> User Directory
                        </button>
                        <button className={activeTab === 'ngos' ? 'active' : ''} onClick={() => setActiveTab('ngos')}>
                            <LandPlot size={20} /> NGO Ledger
                        </button>
                        <button className={activeTab === 'complaints' ? 'active' : ''} onClick={() => setActiveTab('complaints')}>
                            <MessageSquare size={20} /> User Complaints {complaints.filter(c => c.status === 'pending').length > 0 && <span>({complaints.filter(c => c.status === 'pending').length})</span>}
                        </button>
                    </nav>
// ... (rest of the component structure)
                    <div className="admin-profile-pill">
                        <div className="admin-avatar">AD</div>
                        <div className="admin-info">
                            <strong>Global Admin</strong>
                            <span>Systems Control</span>
                        </div>
                    </div>
                </aside>

                <main className="admin-board">
                    {activeTab === 'stats' && (
                        <div className="admin-view animate-fade">
                            <header className="board-header">
                                <h1>Platform Oversight</h1>
                                <p>Monitoring Seva Sangat's global impact and ecosystem health.</p>
                            </header>

                            <div className="global-stats-grid">
                                <div className="platform-stat-card">
                                    <div className="card-top">
                                        <div className="icon-wrap bg-blue"><Users size={24} /></div>
                                        <span className="trend positive">+12%</span>
                                    </div>
                                    <h3>{stats.totalUsers}</h3>
                                    <label>Active Volunteers</label>
                                </div>
                                <div className="platform-stat-card">
                                    <div className="card-top">
                                        <div className="icon-wrap bg-orange"><LandPlot size={24} /></div>
                                        <span className="trend positive">+5%</span>
                                    </div>
                                    <h3>{stats.totalNGOs}</h3>
                                    <label>Verified Organizations</label>
                                </div>
                                <div className="platform-stat-card">
                                    <div className="card-top">
                                        <div className="icon-wrap bg-green"><HeartHandshake size={24} /></div>
                                        <span className="trend positive">+₹2.4k</span>
                                    </div>
                                    <h3>₹{stats.totalFundsRaised.toLocaleString()}</h3>
                                    <label>Capital Mobilized</label>
                                </div>
                                <div className="platform-stat-card">
                                    <div className="card-top">
                                        <div className="icon-wrap bg-purple"><TrendingUp size={24} /></div>
                                        <span className="trend">Growth</span>
                                    </div>
                                    <h3>{stats.totalEvents}</h3>
                                    <label>Events Hosted</label>
                                </div>
                            </div>

                            <div className="admin-dual-grid">
                                <section className="platform-ledger">
                                    <div className="section-title-wrap">
                                        <h3>Recent Global Donations</h3>
                                        <button>View Ledger</button>
                                    </div>
                                    <div className="ledger-rows">
                                        {stats.recentDonations.map(don => (
                                            <div key={don._id} className="ledger-item">
                                                <div className="item-meta">
                                                    <strong>{don.donorId?.fullName || "Anonymous"}</strong>
                                                    <span>to {don.organizationId?.name || "NGO"}</span>
                                                </div>
                                                <div className="item-value">
                                                    {don.donationType === 'money' ? `₹${don.amount}` : don.donationType}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="system-health">
                                    <div className="section-title-wrap">
                                        <h3>System Status</h3>
                                    </div>
                                    <div className="health-metrics">
                                        <div className="health-row">
                                            <span>API Gateway</span>
                                            <span className="health-tag online">Healthy</span>
                                        </div>
                                        <div className="health-row">
                                            <span>Database (MongoDB)</span>
                                            <span className="health-tag online">Connected</span>
                                        </div>
                                        <div className="health-row">
                                            <span>PDF Generation Service</span>
                                            <span className="health-tag online">Ready</span>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}

                    {activeTab === 'verification' && (
                        <div className="admin-view animate-fade">
                            <header className="board-header">
                                <h1>NGO Verification Queue</h1>
                                <p>Reviewing credentials for new organization registrations.</p>
                            </header>

                            <div className="verification-list">
                                {organizations.filter(o => !o.verified).length > 0 ? (
                                    organizations.filter(o => !o.verified).map(org => (
                                        <div key={org._id} className="org-request-card">
                                            <div className="req-header">
                                                <div className="org-initials">{org.name.substring(0,2)}</div>
                                                <div className="req-info">
                                                    <h3>{org.name}</h3>
                                                    <span>{org.category} • {org.city}</span>
                                                </div>
                                            </div>
                                            <div className="req-actions">
                                                <button className="btn-approve" onClick={() => handleOrgAction(org._id, true)}>
                                                    <CheckCircle2 size={18} /> Approve NGO
                                                </button>
                                                <button className="btn-reject" onClick={() => handleOrgAction(org._id, false)}>
                                                    <XCircle size={18} /> Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-verification">
                                        <CheckCircle2 size={48} color="#43a047" />
                                        <h3>Queue Cleared</h3>
                                        <p>No pending organization registrations at this time.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="admin-view animate-fade">
                            <header className="board-header">
                                <h1>User Directory</h1>
                                <div className="directory-controls">
                                    <div className="search-bar">
                                        <Search size={18} />
                                        <input 
                                            type="text" 
                                            placeholder="Search volunteers by name, email or skills..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </header>

                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Volunteer</th>
                                        <th>Contact</th>
                                        <th>Join Date</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="user-cell">
                                                    <strong>{user.fullName}</strong>
                                                    <span>{user.location || "Location not set"}</span>
                                                </div>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td><span className="status-tag active">Active</span></td>
                                            <td><button className="btn-row-more"><MoreVertical size={16} /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {(activeTab === 'ngos' || activeTab === 'ngos_ledger') && (
                        <div className="admin-view animate-fade">
                            <header className="board-header">
                                <h1>NGO Ledger</h1>
                                <p>Comprehensive listing of all registered organizations.</p>
                            </header>

                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Organization</th>
                                        <th>Category</th>
                                        <th>Location</th>
                                        <th>Verification</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {organizations.map(org => (
                                        <tr key={org._id}>
                                            <td><strong>{org.name}</strong></td>
                                            <td>{org.category}</td>
                                            <td>{org.city}</td>
                                            <td>
                                                <span className={org.verified ? 'verif-tag valid' : 'verif-tag pending'}>
                                                    {org.verified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                            <td><span className="status-tag active">Active</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'complaints' && (
                        <div className="admin-view animate-fade">
                            <header className="board-header">
                                <h1>User Complaints</h1>
                                <p>Grievance redressal and safety monitoring.</p>
                            </header>
                            
                            <div className="complaints-grid">
                                {complaints.length > 0 ? (
                                    complaints.map(complaint => (
                                        <div key={complaint._id} className={`complaint-card-admin ${complaint.status}`}>
                                            <div className="comp-head">
                                                <span className={`status-dot ${complaint.status}`}></span>
                                                <h3>{complaint.subject}</h3>
                                                <span className="comp-date">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="comp-desc">{complaint.description}</p>
                                            <div className="comp-user">
                                                <strong>From: {complaint.user?.fullName}</strong>
                                                <span>{complaint.user?.email}</span>
                                            </div>
                                            {complaint.status === 'pending' && (
                                                <div className="comp-actions">
                                                    <button className="btn-resolve" onClick={() => handleComplaintStatus(complaint._id, 'resolved')}>
                                                        Mark Resolved
                                                    </button>
                                                    <button className="btn-dismiss" onClick={() => handleComplaintStatus(complaint._id, 'dismissed')}>
                                                        Dismiss
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-complaints">
                                        <MessageSquare size={48} color="#dfe6e9" />
                                        <h3>Operational Safety</h3>
                                        <p>No active user complaints or safety reports filed.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;

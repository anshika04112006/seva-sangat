import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { 
    ShieldCheck, Users, LandPlot, 
    HeartHandshake, TrendingUp, AlertCircle,
    CheckCircle2, XCircle, Search, 
    Filter, MoreVertical, Loader,
    ChevronRight, ArrowUpRight, MessageSquare, Wallet, Banknote,
    Activity, Eye
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer 
} from 'recharts';

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
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [withdrawals, setWithdrawals] = useState([]);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [statsRes, orgsRes, usersRes, complaintsRes, withdrawalsRes] = await Promise.all([
                    API.get('/api/admin/stats'),
                    API.get('/api/admin/organizations'),
                    API.get('/api/admin/users'),
                    API.get('/api/complaints/admin'),
                    API.get('/api/withdrawals')
                ]);
                setStats(statsRes.data.data);
                setOrganizations(orgsRes.data.data);
                setUsers(usersRes.data.data);
                setComplaints(complaintsRes.data.data);
                setWithdrawals(withdrawalsRes.data.data);
            } catch (err) {
                console.error("Platform management data fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const handleWithdrawalAction = async (id, status) => {
        const adminNote = prompt(`Reason for ${status} (Optional):`);
        try {
            await API.put(`/api/withdrawals/${id}`, { status, adminNote });
            setWithdrawals(prev => prev.map(w => w._id === id ? { ...w, status, adminNote } : w));
            alert(`Withdrawal request ${status} successfully`);
        } catch (err) {
            alert("Action failed");
        }
    };

    const handleOrgAction = async (id, verified) => {
        try {
            await API.put(`/api/admin/orgs/${id}/verify`, { verified });
            setOrganizations(orgs => orgs.map(o => o._id === id ? { ...o, verified, status: verified ? 'approved' : 'rejected' } : o));
            alert(`Organization ${verified ? 'Approved' : 'Rejected'} successfully`);
        } catch (err) {
            alert("Action failed: " + (err.response?.data?.message || err.message));
        }
    };

    const handleFeatureAction = async (id, isFeatured) => {
        try {
            await API.put(`/api/admin/orgs/${id}/featured`, { isFeatured });
            setOrganizations(orgs => orgs.map(o => o._id === id ? { ...o, isFeatured } : o));
            alert(`Organization ${isFeatured ? 'featured' : 'unfeatured'} successfully`);
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

    const chartData = [
        { name: 'Volunteers', count: stats.totalUsers },
        { name: 'NGOs', count: stats.totalNGOs },
        { name: 'Events', count: stats.totalEvents },
    ];

    if (loading) {
        return (
            <div className="loading-screen">
                <Loader className="spin" size={48} color="var(--primary)" />
                <p>Establishing Platform Authority...</p>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar />
            
            <main className="main-content-v2">
                <header className="welcome-section-v2 animate-up">
                    <div className="welcome-text">
                        <span>Systems Administration</span>
                        <h1>Platform Oversight</h1>
                        <p>Monitoring Seva Sangat's global impact and ecosystem health.</p>
                    </div>
                </header>

                <div className="tab-nav-v2 animate-up">
                    <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
                    <button className={activeTab === 'verification' ? 'active' : ''} onClick={() => setActiveTab('verification')}>Verifications</button>
                    <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</button>
                    <button className={activeTab === 'withdrawals' ? 'active' : ''} onClick={() => setActiveTab('withdrawals')}>Finances</button>
                    <button className={activeTab === 'complaints' ? 'active' : ''} onClick={() => setActiveTab('complaints')}>Complaints</button>
                </div>

                {activeTab === 'overview' && (
                    <div className="animate-fade">
                        <div className="stats-row-v2">
                            <div className="stat-card-v2">
                                <div className="stat-content">
                                    <div className="stat-icon-v2"><Users size={24} /></div>
                                    <label>Total Volunteers</label>
                                    <h2>{stats.totalUsers}</h2>
                                    <span className="trending">+12% this month</span>
                                </div>
                            </div>
                            <div className="stat-card-v2">
                                <div className="stat-content">
                                    <div className="stat-icon-v2" style={{ background: '#e0f2fe', color: '#0369a1' }}><LandPlot size={24} /></div>
                                    <label>Verified NGOs</label>
                                    <h2>{stats.totalNGOs}</h2>
                                </div>
                            </div>
                            <div className="stat-card-v2">
                                <div className="stat-content">
                                    <div className="stat-icon-v2" style={{ background: '#fef2f2', color: '#dc2626' }}><HeartHandshake size={24} /></div>
                                    <label>Funds Mobilized</label>
                                    <h2>₹{stats.totalFundsRaised.toLocaleString()}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-main-grid-v2">
                            <section className="chart-container-v2">
                                <div className="container-header">
                                    <h3>Ecosystem Distribution</h3>
                                </div>
                                <div style={{ height: '300px', width: '100%' }}>
                                    <ResponsiveContainer>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    borderRadius: '12px', 
                                                    border: 'none', 
                                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                                                }} 
                                            />
                                            <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </section>

                            <section className="quick-actions-v2">
                                <h3>Health Metrics</h3>
                                <div className="action-item-v2">
                                    <div className="action-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}><Activity size={18} /></div>
                                    <div className="action-info">
                                        <strong>API Gateway</strong>
                                        <span style={{ color: '#16a34a' }}>99.9% Uptime</span>
                                    </div>
                                </div>
                                <div className="action-item-v2">
                                    <div className="action-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}><ShieldCheck size={18} /></div>
                                    <div className="action-info">
                                        <strong>Database</strong>
                                        <span style={{ color: '#16a34a' }}>Synchronized</span>
                                    </div>
                                </div>
                                <div className="action-item-v2">
                                    <div className="action-icon" style={{ background: '#fef2f2', color: '#dc2626' }}><AlertCircle size={18} /></div>
                                    <div className="action-info">
                                        <strong>Pending Reports</strong>
                                        <span style={{ color: '#dc2626' }}>{complaints.filter(c => c.status === 'pending').length} unaddressed</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {activeTab === 'verification' && (
                    <div className="animate-fade">
                        <div className="chart-container-v2">
                            <div className="container-header">
                                <h3>Approval & Spotlight Queue</h3>
                            </div>
                            <div className="activity-list">
                                {organizations.map(org => (
                                    <div key={org._id} className="action-item-v2" style={{ borderLeft: org.verified ? '4px solid #16a34a' : '4px solid #f97316' }}>
                                        <div className="action-icon">
                                            {org.verified ? <ShieldCheck size={18} color="#16a34a" /> : <AlertCircle size={18} color="#f97316" />}
                                        </div>
                                        <div className="action-info" style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <strong>{org.name}</strong>
                                                {org.isFeatured && <span style={{ background: '#fefce8', color: '#ca8a04', padding: '2px 8px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 700 }}>FEATURED</span>}
                                            </div>
                                            <span>{org.category} • {org.city || 'N/A'}</span>
                                            {org.registrationCertificate && (
                                                <a href={org.registrationCertificate} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'underline', marginTop: '8px' }}>
                                                    <ShieldCheck size={12} /> Inspect Registration Proof
                                                </a>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {!org.verified ? (
                                                <>
                                                    <button className="btn-glass" style={{ background: '#f0fdf4', color: '#16a34a' }} onClick={() => handleOrgAction(org._id, true)}>
                                                        Approve
                                                    </button>
                                                    <button className="btn-glass" style={{ color: '#dc2626' }} onClick={() => handleOrgAction(org._id, false)}>
                                                        Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        className="btn-glass" 
                                                        style={{ background: org.isFeatured ? '#fffbeb' : '#f1f5f9', color: org.isFeatured ? '#ca8a04' : '#64748b' }} 
                                                        onClick={() => handleFeatureAction(org._id, !org.isFeatured)}
                                                    >
                                                        {org.isFeatured ? 'Unfeature' : 'Feature'}
                                                    </button>
                                                    <button className="btn-glass" style={{ color: '#dc2626' }} onClick={() => handleOrgAction(org._id, false)}>
                                                        Suspect/Revoke
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {organizations.length === 0 && (
                                    <p style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No organizations found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="animate-fade">
                        <div className="chart-container-v2">
                            <div className="container-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3>User Directory</h3>
                                <div className="search-bar-v2" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f1f5f9', padding: '5px 15px', borderRadius: '10px' }}>
                                    <Search size={16} color="#64748b" />
                                    <input 
                                        type="text" 
                                        placeholder="Search..." 
                                        style={{ border: 'none', background: 'transparent', outline: 'none', padding: '5px' }}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                                <table className="ledger-table" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Join Date</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                                            <tr key={user._id}>
                                                <td><strong>{user.fullName}</strong></td>
                                                <td>{user.email}</td>
                                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                <td><span className="trending" style={{ background: '#f1f5f9', color: '#64748b' }}>{user.role}</span></td>
                                                <td><span className="trending" style={{ background: '#f0fdf4', color: '#16a34a' }}>Active</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'withdrawals' && (
                    <div className="animate-fade">
                        <div className="chart-container-v2">
                            <div className="container-header">
                                <h3>Fund Liquidation Requests</h3>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="ledger-table" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th>Organization</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {withdrawals.map(w => (
                                            <tr key={w._id}>
                                                <td><strong>{w.ngoId?.fullName || 'Unknown'}</strong></td>
                                                <td><strong style={{ color: 'var(--primary)' }}>₹{w.amount.toLocaleString()}</strong></td>
                                                <td>
                                                    <span className="trending" style={{ 
                                                        background: w.status === 'pending' ? '#fff7ed' : w.status === 'approved' ? '#f0fdf4' : '#fef2f2',
                                                        color: w.status === 'pending' ? '#c2410c' : w.status === 'approved' ? '#16a34a' : '#dc2626'
                                                    }}>
                                                        {w.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {w.status === 'pending' && (
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button onClick={() => handleWithdrawalAction(w._id, 'approved')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#16a34a' }}><CheckCircle2 size={18} /></button>
                                                            <button onClick={() => handleWithdrawalAction(w._id, 'rejected')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626' }}><XCircle size={18} /></button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {withdrawals.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No pending financial requests.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'complaints' && (
                    <div className="animate-fade">
                         <div className="grid-v2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                            {complaints.map(complaint => (
                                <div key={complaint._id} className="stat-card-v2">
                                    <div className="stat-content">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <span className="trending" style={{ background: complaint.status === 'pending' ? '#fef2f2' : '#f0fdf4', color: complaint.status === 'pending' ? '#dc2626' : '#16a34a' }}>
                                                {complaint.status}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '5px' }}>{complaint.subject}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{complaint.description}</p>
                                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '10px' }}>
                                            <p style={{ fontSize: '0.8rem' }}><strong>From:</strong> {complaint.user?.fullName}</p>
                                        </div>
                                        {complaint.status === 'pending' && (
                                            <button className="btn-glass" style={{ width: '100%', marginTop: '1rem' }} onClick={() => handleComplaintStatus(complaint._id, 'resolved')}>
                                                Mark Resolved
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;

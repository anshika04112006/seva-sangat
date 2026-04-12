import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { 
    Award, Download, ExternalLink, 
    Calendar, Building, User, Signature,
    Loader, CheckCircle2, ChevronRight, X,
    Heart, Gift, Sparkles, Filter
} from 'lucide-react';
import { generateCertificate } from '../utils/certificateUtils';

const Certificates = () => {
    const [attendedEvents, setAttendedEvents] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('volunteering'); 
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await API.get('/api/auth/profile');
                setUserData(userRes.data?.data || null);

                const [eventsRes, donationsRes] = await Promise.all([
                    API.get('/api/events/my-bookings'),
                    API.get('/api/donations/my-donations')
                ]);

                const attended = (eventsRes.data?.data || []).filter(b => 
                    b.participationStatus === 'attended' || b.participationStatus === 'completed'
                );
                setAttendedEvents(attended);

                const completedDonations = (donationsRes.data?.data || []).filter(d => d.status === 'completed');
                setDonations(completedDonations);
            } catch (err) {
                console.error("Failed to fetch certificate data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDownload = (item, type) => {
        if (!userData) {
            alert("User profile not loaded");
            return;
        }

        if (type === 'volunteering') {
            generateCertificate(userData, {
                title: item.event?.title || "Social Event",
                ngoName: item.event?.ngoName || "Seva Sangat NGO",
                date: item.event?.date || new Date(),
                certificateId: item.certificateId
            });
        } else {
            generateCertificate(userData, {
                title: `Donation to ${item.organizationId?.name || "NGO"}`,
                ngoName: item.organizationId?.name || "Seva Sangat Partner",
                date: item.createdAt,
                certificateId: `DON-${item._id.substring(0,8)}`
            });
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <Loader className="spin" size={48} color="var(--primary)" />
                <p>Retrieving your achievements...</p>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar />
            
            <main className="main-content-v2">
                <header className="welcome-section-v2 animate-up">
                    <div className="welcome-text">
                        <div className="badge-ai" style={{ width: 'fit-content', background: '#fef3c7', color: '#d97706' }}>
                            <Award size={14} /> HONOR ROLL
                        </div>
                        <h1>Your Achievements</h1>
                        <p>A collection of your contributions towards a better society.</p>
                    </div>
                </header>

                <div className="tab-nav-v2 animate-up">
                    <button className={activeTab === 'volunteering' ? 'active' : ''} onClick={() => setActiveTab('volunteering')}>
                        Service Records ({attendedEvents.length})
                    </button>
                    <button className={activeTab === 'donations' ? 'active' : ''} onClick={() => setActiveTab('donations')}>
                        Donation Honors ({donations.length})
                    </button>
                </div>

                <div className="grid-v2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                    {activeTab === 'volunteering' ? (
                        attendedEvents.map(booking => (
                            <div key={booking._id} className="stat-card-v2 animate-fade">
                                <div className="card-decoration"></div>
                                <div className="stat-content">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div className="stat-icon-v2" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                                            <Award size={24} />
                                        </div>
                                        <span className="trending">OFFICIAL</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{booking.event?.title || 'Social Event'}</h3>
                                    <div style={{ margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Building size={14} /> {booking.event?.ngoName || 'Seva Sangat'}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}><Calendar size={14} /> {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : 'N/A'}</div>
                                    </div>
                                    <button 
                                        className="btn-glass" 
                                        style={{ width: '100%', marginTop: '0.5rem' }}
                                        onClick={() => handleDownload(booking, 'volunteering')}
                                    >
                                        <Download size={16} /> Download PDF
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        donations.map(donation => (
                            <div key={donation._id} className="stat-card-v2 animate-fade">
                                <div className="card-decoration" style={{ background: 'linear-gradient(45deg, #ef4444, #f87171)' }}></div>
                                <div className="stat-content">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div className="stat-icon-v2" style={{ background: '#fef2f2', color: '#ef4444' }}>
                                            <Heart size={24} />
                                        </div>
                                        <span className="trending" style={{ background: '#fef2f2', color: '#ef4444' }}>GRATITUDE</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>NGO Support</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>{donation.organizationId?.name}</p>
                                    <div style={{ margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={14} /> {donation.donationType === 'money' ? `₹${donation.amount}` : donation.itemDescription}</div>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}><Calendar size={14} /> {new Date(donation.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <button 
                                        className="btn-glass" 
                                        style={{ width: '100%', marginTop: '0.5rem' }}
                                        onClick={() => handleDownload(donation, 'donations')}
                                    >
                                        <Download size={16} /> Get Certificate
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {((activeTab === 'volunteering' && attendedEvents.length === 0) || (activeTab === 'donations' && donations.length === 0)) && (
                    <div className="empty-state-v2" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
                        <Award size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                        <h3>Records Not Found</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0.5rem auto 2rem' }}>
                            Your contributions stay with us forever. Start making an impact to earn your first certificate.
                        </p>
                        <Link to={activeTab === 'volunteering' ? "/events" : "/donate"} className="btn-glass" style={{ textDecoration: 'none' }}>
                            {activeTab === 'volunteering' ? "Explore Events" : "Donate Now"}
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Certificates;

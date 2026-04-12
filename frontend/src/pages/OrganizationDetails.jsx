import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import ReviewSystem from '../components/ReviewSystem';
import { 
    MapPin, Phone, Mail, Globe, Calendar, 
    Heart, Users, ArrowLeft, Loader, Info,
    ExternalLink, CheckCircle, Sparkles, Building2, AlertTriangle
} from 'lucide-react';

const OrganizationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [org, setOrg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [orgEvents, setOrgEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(false);

    useEffect(() => {
        const fetchOrgDetails = async () => {
            setLoading(true);
            try {
                const { data } = await API.get(`/api/orgs/${id}`);
                if (data.data) {
                    setOrg(data.data);
                } else {
                    setError('Organization not found.');
                }
            } catch (err) {
                console.error("error in fetch", err);
                setError('Failed to load organization details. It might have been removed or the ID is invalid.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrgDetails();
    }, [id]);

    useEffect(() => {
        if (!id) return;
        const fetchOrgEvents = async () => {
            setEventsLoading(true);
            try {
                const { data } = await API.get(`/api/events/by-org/${id}`);
                setOrgEvents(data.data || []);
            } catch (err) {
                console.error('Could not load org events', err);
            } finally {
                setEventsLoading(false);
            }
        };
        fetchOrgEvents();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-screen">
                <Loader className="spin" size={48} color="var(--primary)" />
                <p>Establishing secure connection...</p>
            </div>
        );
    }

    if (error || !org) {
        return (
            <div className="app-layout">
                <Sidebar />
                <main className="main-content-v2">
                    <div className="error-container">
                        <Info size={48} color="var(--error)" />
                        <h2>Profile Not Available</h2>
                        <p>{error || "We couldn't find the organization you're looking for."}</p>
                        <Link to="/ngos" className="stat-card-v2" style={{ maxWidth: '250px', marginTop: '1rem', background: 'var(--primary)', color: 'white', justifyContent: 'center' }}>
                            Back to NGO Finder
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar />
            
            <main className="main-content-v2">
                <header className="welcome-section-v2 animate-up">
                    <div className="welcome-text">
                        <Link to="/ngos" className="badge-ai" style={{ width: 'fit-content', textDecoration: 'none', marginBottom: '1.5rem', display: 'flex' }}>
                            <ArrowLeft size={14} /> BACK TO FINDER
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div className="stat-icon-v2" style={{ background: 'white', color: 'var(--primary)', width: '70px', height: '70px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                                {org.image ? <img src={org.image} alt="" style={{ width: '100%', height: '100%', borderRadius: '15px', objectFit: 'cover' }} /> : <Building2 size={32} />}
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <h1 style={{ margin: 0 }}>{org.name}</h1>
                                    {org.isFeatured && (
                                        <span style={{ background: '#fefce8', color: '#ca8a04', padding: '4px 12px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, border: '1px solid #fef08a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Sparkles size={12} fill="#ca8a04" /> FEATURED
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px', opacity: 0.8 }}>
                                    <MapPin size={16} />
                                    <span>{org.city}, {org.state}</span>
                                    {org.verified && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f0fdf4', color: '#16a34a', padding: '2px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, border: '1px solid #bbf7d0' }}>
                                            <CheckCircle size={12} /> VERIFIED NGO
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {org.emergencyNote && (
                    <div className="animate-fade" style={{ background: '#fef2f2', border: '2px solid #fee2e2', borderRadius: '20px', padding: '1.5rem', margin: '0 2rem 2rem', display: 'flex', alignItems: 'center', gap: '20px', color: '#dc2626' }}>
                        <div style={{ background: '#ef4444', color: 'white', padding: '12px', borderRadius: '15px' }}>
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '2px' }}>URGENT RELIEF NEEDED</strong>
                            <p style={{ margin: 0, opacity: 0.9 }}>{org.emergencyNote}</p>
                        </div>
                    </div>
                )}

                <div className="dashboard-main-grid-v2">
                    <div className="donation-form-column animate-fade">
                        <section className="chart-container-v2" style={{ padding: '2.5rem' }}>
                            <div className="container-header">
                                <h3>Mission & Impact</h3>
                            </div>
                            <p style={{ lineHeight: 1.8, color: '#475569', marginTop: '1.5rem', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>{org.description}</p>
                            
                            <div style={{ marginTop: '3rem' }}>
                                <h4 style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)', paddingLeft: '15px' }}>Contact Presence</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="action-item-v2" style={{ padding: '1.25rem' }}>
                                        <div className="action-icon"><MapPin size={18} /></div>
                                        <div className="action-info">
                                            <strong>Office Location</strong>
                                            <span style={{ fontSize: '0.8rem' }}>{org.address}, {org.city}</span>
                                        </div>
                                    </div>
                                    <div className="action-item-v2" style={{ padding: '1.25rem' }}>
                                        <div className="action-icon"><Phone size={18} /></div>
                                        <div className="action-info">
                                            <strong>Phone Number</strong>
                                            <span style={{ fontSize: '0.8rem' }}>{org.phone}</span>
                                        </div>
                                    </div>
                                    <div className="action-item-v2" style={{ padding: '1.25rem' }}>
                                        <div className="action-icon"><Mail size={18} /></div>
                                        <div className="action-info">
                                            <strong>Official Email</strong>
                                            <span style={{ fontSize: '0.8rem' }}>{org.email}</span>
                                        </div>
                                    </div>
                                    <div className="action-item-v2" style={{ padding: '1.25rem' }}>
                                        <div className="action-icon"><Globe size={18} /></div>
                                        <div className="action-info">
                                            <strong>Website</strong>
                                            <span style={{ fontSize: '0.8rem' }}>Visit official site</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div style={{ marginTop: '2rem' }}>
                            <ReviewSystem targetId={org._id} targetType="Organization" />
                        </div>
                    </div>

                    <div className="donation-stats-column animate-fade">
                        <section className="chart-container-v2" style={{ padding: '1.5rem' }}>
                            <div className="container-header">
                                <h3>Take Action</h3>
                            </div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7, margin: '1rem 0 1.5rem' }}>Supporting this organization helps them reach more people in need.</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button 
                                    className="stat-card-v2" 
                                    style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', padding: '1.2rem', justifyContent: 'center' }}
                                    onClick={() => navigate(`/donate?orgId=${org._id}`)}
                                >
                                    <Heart size={20} /> Donate Now
                                </button>
                                <button 
                                    className="stat-card-v2" 
                                    style={{ background: 'white', color: 'var(--primary)', border: '1px solid var(--primary)', cursor: 'pointer', padding: '1.2rem', justifyContent: 'center' }}
                                    onClick={() => navigate(`/events?orgId=${org._id}`)}
                                >
                                    <Users size={20} /> Join as Volunteer
                                </button>
                            </div>

                            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '15px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '10px' }}>Spread Awareness</p>
                                <button className="btn-glass" style={{ width: '100%', fontSize: '0.8rem' }}>Copy Public Profile URL</button>
                            </div>
                        </section>

                        <section className="chart-container-v2" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                            <div className="container-header">
                                <h3>Upcoming Events</h3>
                            </div>
                            {eventsLoading ? (
                                <div style={{ textAlign: 'center', padding: '1.5rem', opacity: 0.5 }}>
                                    <Loader className="spin" size={24} />
                                </div>
                            ) : orgEvents.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                                    {orgEvents.map(event => (
                                        <div key={event._id} className="action-item-v2" style={{ padding: '1rem' }}>
                                            <div className="action-info">
                                                <strong>{event.title}</strong>
                                                <span style={{ fontSize: '0.8rem' }}>
                                                    {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    {event.location ? ` • ${event.location}` : ''}
                                                </span>
                                            </div>
                                            <button
                                                className="btn-glass"
                                                style={{ padding: '6px 14px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                                                onClick={() => navigate(`/events`)}
                                            >
                                                <Calendar size={13} /> Book
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem 0', opacity: 0.5 }}>
                                    <Calendar size={40} style={{ marginBottom: '1rem' }} />
                                    <p style={{ fontSize: '0.85rem' }}>No upcoming events scheduled at the moment.</p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrganizationDetails;

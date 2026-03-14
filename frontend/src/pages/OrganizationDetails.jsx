import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { dummyNGOs } from '../data/dummyNGOs';
import { 
    MapPin, Phone, Mail, Globe, Calendar, 
    Heart, Users, ArrowLeft, Loader, Info,
    ExternalLink, CheckCircle
} from 'lucide-react';
import '../assets/styles/index.css';

const OrganizationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [org, setOrg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrgDetails = async () => {
            setLoading(true);
            try {
                // Try backend first if it looks like a MongoDB ObjectId
                if (id && id.length === 24) {
                    try {
                        const { data } = await API.get(`/api/orgs/${id}`);
                        if (data.data) {
                            setOrg(data.data);
                            setLoading(false);
                            return;
                        }
                    } catch (apiErr) {
                        console.error("Backend fetch failed, checking dummy data...");
                    }
                }

                // Fallback to dummy data
                const dummy = dummyNGOs.find(n => n.id.toString() === id.toString());
                if (dummy) {
                    // Normalize dummy data fields to match backend expected by UI
                    setOrg({
                        ...dummy,
                        city: dummy.location, // dummy uses location, UI expects city
                        state: 'Maharashtra', // placeholder
                        phone: dummy.contact, // dummy uses contact, UI expects phone
                        email: 'contact@ngo.org', // placeholder
                        verified: true
                    });
                } else {
                    setError('Organization not found in our records.');
                }
            } catch (err) {
                console.error("error in fetch", err);
                setError('Failed to load organization details.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrgDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-screen">
                <Loader className="spin" size={48} color="var(--primary)" />
                <p>Loading details...</p>
            </div>
        );
    }

    if (error || !org) {
        return (
            <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
                <Navbar />
                <div className="error-container">
                    <Info size={48} color="var(--error)" />
                    <h2>Oops! Organization details not available.</h2>
                    <p>{error || "We couldn't find the organization you're looking for."}</p>
                    <Link to="/ngos" className="btn-primary" style={{ maxWidth: '200px', marginTop: '1rem' }}>
                        Back to Finder
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            
            <div className="details-header-bg">
                <div className="details-header-content">
                    <Link to="/ngos" className="back-link">
                        <ArrowLeft size={18} /> Back to Finder
                    </Link>
                    <div className="header-org-info">
                        <span className={`category-badge-large ${org.category?.replace(/\s+/g, '-').toLowerCase()}`}>
                            {org.category}
                        </span>
                        <h1>{org.name}</h1>
                        <div className="header-location">
                            <MapPin size={18} />
                            <span>{org.city}, {org.state}</span>
                            {org.verified && (
                                <span className="verified-tag">
                                    <CheckCircle size={14} /> Verified Org
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <main className="details-container">
                <div className="details-layout">
                    {/* Main Content Area */}
                    <div className="details-main">
                        <section className="details-section">
                            <h2>About Organization</h2>
                            <p className="description-text">{org.description}</p>
                        </section>

                        <section className="details-section">
                            <h2>Contact Information</h2>
                            <div className="contact-grid">
                                <div className="contact-card">
                                    <MapPin className="contact-icon" />
                                    <div>
                                        <h4>Address</h4>
                                        <p>{org.address}</p>
                                        <p>{org.city}, {org.state}</p>
                                    </div>
                                </div>
                                <div className="contact-card">
                                    <Phone className="contact-icon" />
                                    <div>
                                        <h4>Phone</h4>
                                        <p>{org.phone}</p>
                                    </div>
                                </div>
                                <div className="contact-card">
                                    <Mail className="contact-icon" />
                                    <div>
                                        <h4>Email</h4>
                                        <p>{org.email}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="details-section">
                            <h2>Upcoming Events</h2>
                            <div className="events-placeholder">
                                <Calendar size={40} color="#dfe6e9" />
                                <p>No upcoming events scheduled at the moment. Stay tuned!</p>
                            </div>
                        </section>
                    </div>

                    {/* Sticky Sidebar Actions */}
                    <aside className="details-sidebar">
                        <div className="action-card">
                            <h3>Support the Cause</h3>
                            <p>Your contribution can make a significant difference in the lives of many.</p>
                            
                            <button className="btn-donate-full">
                                <Heart size={18} /> Donate Now
                            </button>
                            
                            <button className="btn-volunteer-full">
                                <Users size={18} /> Volunteer Now
                            </button>

                            <div className="share-box">
                                <p>Help us spread the word</p>
                                <div className="share-links">
                                    <button title="Share">Share Link <ExternalLink size={14} /></button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default OrganizationDetails;

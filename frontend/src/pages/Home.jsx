import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { 
    Heart, Users, Zap, Award, 
    ArrowRight, Globe, ShieldCheck, 
    TrendingUp, ExternalLink, Sparkles, CheckCircle2,
    AlertTriangle, Megaphone, Star, MapPin
} from 'lucide-react';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [featuredOrgs, setFeaturedOrgs] = useState([]);
    const [emergencyOrgs, setEmergencyOrgs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [featuredRes, orgsRes] = await Promise.all([
                    API.get('/api/orgs/featured'),
                    API.get('/api/orgs')
                ]);
                setFeaturedOrgs(featuredRes.data?.data || []);
                
                // Filter orgs with emergency notes for the banner
                const emergency = (orgsRes.data?.data || []).filter(org => org.emergencyNote);
                setEmergencyOrgs(emergency);
            } catch (err) {
                console.error("Home data fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    return (
        <div className="home-container" style={{ background: '#fff' }}>
            <Navbar />
            
            {/* Emergency Banner */}
            {emergencyOrgs.length > 0 && (
                <div className="emergency-ticker" style={{ background: '#ef4444', color: 'white', padding: '12px 0', overflow: 'hidden', position: 'relative', zIndex: 100 }}>
                    <div className="ticker-content" style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 30s linear infinite' }}>
                        {emergencyOrgs.map((org, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginRight: '50px', fontSize: '0.95rem', fontWeight: 600 }}>
                                <AlertTriangle size={18} /> 
                                <span style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Urgent Appeal:</span>
                                <span>{org.name}: {org.emergencyNote}</span>
                                <Link to={`/orgs/${org._id}`} style={{ color: 'white', textDecoration: 'underline', fontSize: '0.85rem' }}>Help Now</Link>
                                <div style={{ width: '40px' }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="hero-section" style={{ padding: '6rem 2rem 4rem', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
                <div className="hero-content animate-up">
                    <div className="badge-ai" style={{ width: 'fit-content', marginBottom: '1.5rem', background: '#f0fdf4', color: '#16a34a' }}>
                        <Sparkles size={14} /> <span>Trusted by 150+ Organizations</span>
                    </div>
                    <h1 style={{ fontSize: '4.5rem', lineHeight: 1.1, fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>
                        Empowering <span className="text-highlight">Kindness</span> Through Technology
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#64748b', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '600px' }}>
                        Seva Sangat is the unified platform connecting passionate volunteers with organizations 
                        making a real difference. Join the movement today and start your journey of impact.
                    </p>
                    <div className="hero-btns" style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
                        {user ? (
                            <Link to={user.role === 'organization' ? '/ngo-dashboard' : (user.role === 'admin' ? '/admin-dashboard' : '/dashboard')} className="stat-card-v2" style={{ background: 'var(--primary)', color: 'white', padding: '1.2rem 2.5rem', textDecoration: 'none', borderRadius: '15px' }}>
                                Go to Dashboard <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="stat-card-v2" style={{ background: 'var(--primary)', color: 'white', padding: '1.2rem 2.5rem', textDecoration: 'none', borderRadius: '15px' }}>
                                    Start Volunteering <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                                </Link>
                                <Link to="/register" className="btn-glass" style={{ padding: '1.2rem 2.5rem', textDecoration: 'none', borderRadius: '15px', display: 'flex', alignItems: 'center', fontWeight: 700, border: '1px solid #e2e8f0' }}>
                                    Register NGO <ExternalLink size={18} style={{ marginLeft: '10px' }} />
                                </Link>
                            </>
                        )}
                    </div>
                    
                    <div className="hero-stats" style={{ display: 'flex', gap: '3rem', borderTop: '1px solid #f1f5f9', paddingTop: '2.5rem' }}>
                        <div className="stat-mini">
                            <strong style={{ fontSize: '1.5rem', color: '#1e293b', display: 'block' }}>₹12L+</strong>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Funds Raised</span>
                        </div>
                        <div className="stat-mini">
                            <strong style={{ fontSize: '1.5rem', color: '#1e293b', display: 'block' }}>5K+</strong>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Volunteers</span>
                        </div>
                        <div className="stat-mini">
                            <strong style={{ fontSize: '1.5rem', color: '#1e293b', display: 'block' }}>150+</strong>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Live Events</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual-v2 animate-fade" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'var(--primary)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, zIndex: 0 }}></div>
                    <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="stat-card-v2" style={{ padding: '2.5rem', flexDirection: 'column', alignItems: 'flex-start', background: 'linear-gradient(135deg, #16a34a 0%, #2ecc71 100%)', color: 'white', transform: 'translateY(40px)' }}>
                            <Heart size={40} />
                            <h3 style={{ margin: '20px 0 10px' }}>Direct Impact</h3>
                            <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Your contributions directly support verified causes.</p>
                        </div>
                        <div className="stat-card-v2" style={{ padding: '2.5rem', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <div className="stat-icon-v2" style={{ background: '#f0fdf4', color: '#16a34a' }}><TrendingUp size={24} /></div>
                            <h3 style={{ margin: '20px 0 10px' }}>Tracking</h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Monitor your social footprint in real-time with AI.</p>
                        </div>
                        <div className="stat-card-v2" style={{ padding: '2.5rem', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <div className="stat-icon-v2" style={{ background: '#eff6ff', color: '#2563eb' }}><ShieldCheck size={24} /></div>
                            <h3 style={{ margin: '20px 0 10px' }}>Verified</h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>100% vetted organizations for total transparency.</p>
                        </div>
                        <div className="stat-card-v2" style={{ padding: '2.5rem', flexDirection: 'column', alignItems: 'flex-start', background: '#1e293b', color: 'white', transform: 'translateY(-40px)' }}>
                            <Users size={32} />
                            <h3 style={{ margin: '20px 0 10px' }}>Network</h3>
                            <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Join 5000+ like-minded changemakers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            {featuredOrgs.length > 0 && (
                <section style={{ padding: '6rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                        <div>
                            <div className="badge-ai" style={{ width: 'fit-content', marginBottom: '1rem' }}>FEATURED CAUSES</div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b' }}>Join Forces with <span className="text-highlight">Top NGOs</span></h2>
                        </div>
                        <Link to="/ngos" style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                            View all Organizations <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        {featuredOrgs.map((org) => (
                            <div key={org._id} className="chart-container-v2 animate-fade" style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', padding: 0 }}>
                                <div style={{ height: '200px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                                    <img src={org.image} alt={org.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', padding: '5px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Star size={12} fill="var(--primary)" /> FEATURED
                                    </div>
                                </div>
                                <div style={{ padding: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{org.category}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308' }}>
                                            <Star size={14} fill="#eab308" />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{org.averageRating || '5.0'}</span>
                                        </div>
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', color: '#1e293b', marginBottom: '0.8rem' }}>{org.name}</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1.5rem' }}>{org.description}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> {org.city}</div>
                                        {org.verified && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#16a34a' }}><ShieldCheck size={14} /> Verified</div>}
                                    </div>
                                    <Link to={`/orgs/${org._id}`} className="stat-card-v2" style={{ background: '#f8fafc', width: '100%', padding: '12px', justifyContent: 'center', fontWeight: 700, transition: 'all 0.2s' }}>
                                        Explore Mission
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Features Area */}
            <section style={{ padding: '8rem 2rem', background: '#f8fafc' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <div className="badge-ai" style={{ width: 'fit-content', margin: '0 auto 1.5rem' }}>ECOSYSTEM</div>
                        <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#1e293b' }}>One Platform, <span className="text-highlight">Every Solution</span></h2>
                        <p style={{ color: '#64748b', fontSize: '1.2rem' }}>Comprehensive tools for maximizing your social contribution.</p>
                    </div>
                    
                    <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        {[
                            { icon: <Award />, title: 'Certified Success', desc: 'Receive verified digital certificates for every single accomplishment.' },
                            { icon: <Globe />, title: 'Smart Matching', desc: 'AI-driven engine matches your skills with the most relevant social needs.' },
                            { icon: <CheckCircle2 />, title: 'Verified trust', desc: 'Transparent tracking of funds and impact across all organizations.' }
                        ].map((f, i) => (
                            <div key={i} className="chart-container-v2" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div className="stat-icon-v2" style={{ width: '70px', height: '70px', background: i === 1 ? 'var(--primary-light)' : '#f1f5f9', color: i === 1 ? 'var(--primary)' : '#475569', marginBottom: '2rem' }}>{f.icon}</div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{f.title}</h3>
                                <p style={{ color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-home" style={{ padding: '8rem 2rem' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'linear-gradient(135deg, #16a34a 0%, #2ecc71 100%)', padding: '5rem', borderRadius: '40px', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'white', opacity: 0.1, borderRadius: '50%' }}></div>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Ready to Create Change?</h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }}>Whether you're an individual looking to help or an NGO looking for support, we're here for you.</p>
                    <div className="cta-btns" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <Link to="/register" className="stat-card-v2" style={{ background: 'white', color: 'var(--primary)', padding: '1.2rem 3rem', textDecoration: 'none', borderRadius: '15px' }}>Join the Community</Link>
                        <Link to="/ngos" className="btn-glass" style={{ border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '1.2rem 3rem', textDecoration: 'none', borderRadius: '15px' }}>Explore NGOs</Link>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
};

export default Home;

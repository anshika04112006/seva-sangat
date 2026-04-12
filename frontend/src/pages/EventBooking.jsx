import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { 
    Calendar, MapPin, Users, Info, 
    CheckCircle2, Clock, MapPinned, 
    CalendarCheck, Loader, AlertCircle, ArrowRight, Sparkles
} from 'lucide-react';

const EventBooking = () => {
    const [events, setEvents] = useState([]);
    const [userBookings, setUserBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsRes, bookingsRes] = await Promise.all([
                    API.get('/api/events'),
                    API.get('/api/events/my-bookings')
                ]);
                setEvents(eventsRes.data?.data || []);
                setUserBookings((bookingsRes.data?.data || []).map(b => b.event?._id).filter(id => id));
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleBook = async (eventId) => {
        setBookingLoading(eventId);
        setMessage({ type: '', text: '' });
        try {
            await API.post(`/api/events/${eventId}/book`);
            setMessage({ type: 'success', text: 'Enrolled successfully! See you there.' });
            setUserBookings([...userBookings, eventId]);
        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.message || 'Failed to enroll. Please try again.' 
            });
        } finally {
            setBookingLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <Loader className="spin" size={48} color="var(--primary)" />
                <p>Loading upcoming missions...</p>
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
                            <Sparkles size={14} /> COMMUNITY DRIVEN
                        </div>
                        <h1>Social Impact <span className="text-highlight">Events</span></h1>
                        <p>Join meaningful initiatives and translate your compassion into action.</p>
                    </div>
                </header>

                {message.text && (
                    <div className="animate-fade" style={{ marginBottom: '2rem', padding: '15px', borderRadius: '12px', background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', color: message.type === 'success' ? '#16a34a' : '#dc2626', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="grid-v2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
                    {events.length > 0 ? (
                        events.map(event => (
                            <div key={event._id} className="stat-card-v2 animate-fade" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '8px', background: 'var(--primary)', width: '100%' }}></div>
                                <div style={{ padding: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div style={{ background: 'var(--bg-main)', padding: '10px 15px', borderRadius: '12px', textAlign: 'center', minWidth: '60px' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 900, display: 'block', color: 'var(--primary)' }}>{new Date(event.date).getDate()}</span>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                        </div>
                                        <span className="trending" style={{ background: '#f1f5f9', color: '#64748b' }}>{event.ngoName}</span>
                                    </div>

                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '1rem' }}>{event.title}</h3>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            <Clock size={16} />
                                            {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            <MapPinned size={16} />
                                            {event.location}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', gridColumn: 'span 2' }}>
                                            <Users size={16} />
                                            {event.volunteersNeeded} Volunteers Needed
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                                        {event.description}
                                    </p>
                                    
                                    <div style={{ marginTop: 'auto' }}>
                                        {userBookings.includes(event._id) ? (
                                            <div className="btn-glass" style={{ width: '100%', pointerEvents: 'none', background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', opacity: 1, display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                <CheckCircle2 size={18} /> Registered
                                            </div>
                                        ) : (
                                            <button 
                                                className="btn-glass"
                                                onClick={() => handleBook(event._id)}
                                                disabled={bookingLoading === event._id}
                                                style={{ width: '100%', background: 'var(--primary)', color: 'white', border: 'none', display: 'flex', justifyContent: 'center', gap: '8px' }}
                                            >
                                                {bookingLoading === event._id ? (
                                                    <Loader className="spin" size={18} />
                                                ) : (
                                                    <>Volunteer Now <ArrowRight size={18} /></>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 2rem' }}>
                            <Info size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                            <h3>No upcoming events</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Check back later for new opportunities to volunteer!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EventBooking;

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { 
    Calendar, MapPin, Users, Info, 
    CheckCircle2, Clock, MapPinned, 
    CalendarCheck, Loader, AlertCircle
} from 'lucide-react';
import '../assets/styles/index.css';

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
            setMessage({ type: 'success', text: 'Event booked successfully!' });
            setUserBookings([...userBookings, eventId]);
        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.message || 'Failed to book event. Please try again.' 
            });
        } finally {
            setBookingLoading(null);
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <Loader className="spin" size={48} color="var(--primary)" />
                <p>Loading upcoming events...</p>
            </div>
        );
    }

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            
            <main className="booking-page-container">
                <header className="page-header">
                    <div className="header-icon-bg">
                        <CalendarCheck size={32} color="var(--primary)" />
                    </div>
                    <h1>Social Work Events</h1>
                    <p>Join meaningful initiatives and make a difference in your community.</p>
                </header>

                {message.text && (
                    <div className={`booking-alert ${message.type === 'success' ? 'success' : 'error'}`}>
                        {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="events-grid">
                    {events.length > 0 ? (
                        events.map(event => (
                            <div key={event._id} className="event-booking-card">
                                <div className="event-card-banner">
                                    <span className="ngo-name-tag">{event.ngoName}</span>
                                    <div className="event-date-badge">
                                        <span className="day">{new Date(event.date).getDate()}</span>
                                        <span className="month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                    </div>
                                </div>
                                <div className="event-card-body">
                                    <h3>{event.title}</h3>
                                    <div className="event-meta-info">
                                        <div className="meta-item">
                                            <Clock size={14} />
                                            <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="meta-item">
                                            <MapPinned size={14} />
                                            <span>{event.location}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Users size={14} />
                                            <span>{event.volunteersNeeded} Volunteers Required</span>
                                        </div>
                                    </div>
                                    <p className="event-description">{event.description}</p>
                                    
                                    <div className="event-footer">
                                        {userBookings.includes(event._id) ? (
                                            <div className="already-booked">
                                                <CheckCircle2 size={18} />
                                                <span>Registered</span>
                                            </div>
                                        ) : (
                                            <button 
                                                className="btn-book-now"
                                                onClick={() => handleBook(event._id)}
                                                disabled={bookingLoading === event._id}
                                            >
                                                {bookingLoading === event._id ? (
                                                    <Loader className="spin" size={18} />
                                                ) : (
                                                    'Book Spot'
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-events-view">
                            <Info size={48} color="#dfe6e9" />
                            <h3>No upcoming events</h3>
                            <p>Check back later for new opportunities to volunteer!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EventBooking;

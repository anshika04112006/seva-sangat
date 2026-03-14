import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { 
    Award, Download, ExternalLink, 
    Calendar, Building, User, Signature,
    Loader, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import '../assets/styles/index.css';

const Certificates = () => {
    const [attendedEvents, setAttendedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCert, setSelectedCert] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user data for the certificate
                const userRes = await API.get('/api/auth/profile');
                setUserData(userRes.data?.data || null);

                // Fetch attended events
                const eventsRes = await API.get('/api/events/my-bookings');
                const attended = (eventsRes.data?.data || []).filter(b => b.participationStatus === 'attended');
                setAttendedEvents(attended);
            } catch (err) {
                console.error("Failed to fetch certificate data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async (booking) => {
        try {
            const response = await API.get(`/api/certificates/download/${booking._id}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Certificate_${booking.eventId.title.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Download failed", err);
            alert("Failed to download certificate. Please try again.");
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
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            
            <main className="certificates-container">
                <header className="certificates-header">
                    <div className="achievement-badge">
                        <Award size={40} color="var(--primary)" />
                    </div>
                    <h1>Your Participation Certificates</h1>
                    <p>Recognizing your dedication and impact in making the world a better place.</p>
                </header>

                <div className="certificates-grid">
                    {attendedEvents.length > 0 ? (
                        attendedEvents.map(booking => (
                            <div key={booking._id} className="cert-card">
                                <div className="cert-card-preview">
                                    <Award size={48} color="var(--primary)" opacity={0.2} />
                                    <div className="cert-overlay-text">Official Certificate</div>
                                </div>
                                <div className="cert-card-info">
                                    <h3>{booking.eventId?.title || 'Social Work Event'}</h3>
                                    <div className="org-tag">
                                        <Building size={14} /> 
                                        {booking.eventId?.ngoId?.name || 'Seva Foundation'}
                                    </div>
                                    <div className="date-tag">
                                        <Calendar size={14} /> 
                                        {new Date(booking.eventId?.date).toLocaleDateString()}
                                    </div>
                                    
                                    <div className="cert-card-actions">
                                        <button 
                                            className="btn-view-cert"
                                            onClick={() => setSelectedCert(booking)}
                                        >
                                            <ExternalLink size={16} /> View
                                        </button>
                                        <button 
                                            className="btn-download-direct"
                                            onClick={() => handleDownload(booking)}
                                        >
                                            <Download size={16} /> PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-achievements">
                            <Award size={64} color="#dfe6e9" />
                            <h3>No Certificates Found</h3>
                            <p>Once you attend an event and the organization verifies your participation, your certificate will appear here.</p>
                            <Link to="/events" className="btn-browse-events">Find Events to Attend</Link>
                        </div>
                    )}
                </div>
            </main>

            {/* Certificate Modal */}
            {selectedCert && (
                <div className="cert-modal-overlay">
                    <div className="cert-modal-content">
                        <button className="close-modal" onClick={() => setSelectedCert(null)}>
                            <X size={24} />
                        </button>
                        
                        <div className="certificate-paper" id="certificate-printable">
                            <div className="cert-border-outer">
                                <div className="cert-border-inner">
                                    <div className="cert-content">
                                        <div className="cert-header">
                                            <div className="cert-logo">SS</div>
                                            <h2>SEVA SANGAT</h2>
                                            <p className="subtitle">Certificate of Participation</p>
                                        </div>

                                        <div className="cert-body">
                                            <p className="presented-to">This certificate is proudly presented to</p>
                                            <h1 className="volunteer-name">{userData?.fullName || 'Volunteer Name'}</h1>
                                            <p className="recognition-text">
                                                For their valuable contribution and active participation as a volunteer in the event
                                            </p>
                                            <h3 className="event-name-cert">"{selectedCert.eventId?.title}"</h3>
                                            <p className="organized-by">
                                                Organized by <strong>{selectedCert.eventId?.ngoId?.name}</strong>
                                            </p>
                                            <p className="cert-date-text">
                                                on {new Date(selectedCert.eventId?.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>

                                        <div className="cert-footer">
                                            <div className="signature-box">
                                                <div className="sig-line"></div>
                                                <p>Authorized Signature</p>
                                                <span>{selectedCert.eventId?.ngoId?.name}</span>
                                            </div>
                                            <div className="cert-seal">
                                                <div className="seal-inner">
                                                    <Award size={32} />
                                                </div>
                                            </div>
                                            <div className="signature-box">
                                                <div className="sig-line"></div>
                                                <p>Director</p>
                                                <span>Seva Sangat Foundation</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="cert-actions-bar">
                            <button className="btn-print" onClick={() => handleDownload(selectedCert)}>
                                <Download size={20} /> Download Official PDF
                            </button>
                            <button className="btn-secondary-print" onClick={handlePrint}>
                                Print Canvas
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificates;

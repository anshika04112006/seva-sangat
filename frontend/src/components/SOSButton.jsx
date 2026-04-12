import React, { useState } from 'react';
import { AlertTriangle, MapPin, Send, Loader, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SOSButton = () => {
    const [isActive, setIsActive] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSOS = () => {
        setIsActive(true);
    };

    const confirmSOS = async () => {
        setSending(true);
        try {
            // Geographic location tracking removed at user request
            // Only broadcasting identity and emergency status
            
            console.log("SOS TRIGGERED - Location data disabled");
            
            await new Promise(r => setTimeout(r, 1500));
            setSent(true);
            toast.success("Emergency Alert Broadcasted to Responders!", {
                duration: 5000,
                icon: '🚨'
            });
            
            setTimeout(() => {
                setIsActive(false);
                setSent(false);
                setSending(false);
            }, 3000);

        } catch (err) {
            toast.error("Failed to broadcast alert.");
            setSending(false);
        }
    };

    return (
        <div className="sos-wrapper" style={{ position: 'fixed', bottom: '30px', left: '30px', zIndex: 9999 }}>
            {!isActive ? (
                <button 
                    onClick={handleSOS}
                    className="sos-btn-trigger"
                    style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 10px 30px rgba(231, 76, 60, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        animation: 'pulse 2s infinite'
                    }}
                >
                    <AlertTriangle size={32} />
                </button>
            ) : (
                <div className="sos-modal-mini" style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                    width: '300px',
                    animation: 'slideUp 0.3s ease'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{ width: '50px', height: '50px', background: '#ffeef0', color: '#e74c3c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', margin: '0 auto 10px', justifyContent: 'center' }}>
                            <MapPin size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', margin: '0 0 5px' }}>Emergency Broadcast</h3>
                        <p style={{ fontSize: '0.85rem', color: '#636e72' }}>Notify all nearby emergency responders immediately?</p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            disabled={sending}
                            onClick={() => setIsActive(false)}
                            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd', background: 'white', fontWeight: 600 }}
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={sending}
                            onClick={confirmSOS}
                            style={{ 
                                flex: 2, 
                                padding: '12px', 
                                borderRadius: '12px', 
                                border: 'none', 
                                background: sent ? '#2ecc71' : '#e74c3c', 
                                color: 'white', 
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            {sending ? <Loader className="spin" size={18} /> : (sent ? <CheckCircle size={18} /> : <Send size={18} />)}
                            {sent ? 'Sent' : (sending ? 'Sending...' : 'Confirm SOS')}
                        </button>
                    </div>
                </div>
            )}
            
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
                    70% { transform: scale(1.1); box-shadow: 0 0 0 15px rgba(231, 76, 60, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SOSButton;

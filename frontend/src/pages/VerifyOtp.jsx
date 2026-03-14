import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';
import API from '../services/api';
import '../assets/styles/index.css';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await API.post('/api/auth/verify-otp', { email, otp });
            setSuccess(true);
            
            // Redirect to reset password after verification
            setTimeout(() => {
                navigate('/reset-password', { state: { email, otp } });
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        setResendMessage('');
        setError('');

        try {
            await API.post('/api/auth/forgot-password', { email });
            setResendMessage('OTP resent successfully!');
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Verify OTP</h1>
                    <p>We've sent a 6-digit code to <strong>{email}</strong></p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">OTP verified! Redirecting to reset password...</div>}
                {resendMessage && <div className="alert alert-success">{resendMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Enter 6-Digit Code</label>
                        <div style={{ position: 'relative' }}>
                            <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#636e72' }} />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="123456"
                                maxLength="6"
                                style={{ paddingLeft: '40px', letterSpacing: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e.target.value.replace(/\D/g, ''));
                                    if (error) setError('');
                                }}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary"
                        disabled={loading || success}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <p style={{ fontSize: '0.9rem', color: '#636e72' }}>
                            Didn't receive the code?{' '}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resendLoading || success}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', padding: 0, display: 'inline-flex', alignItems: 'center' }}
                            >
                                {resendLoading ? <RefreshCw size={14} className="spin" style={{ marginRight: '4px' }} /> : null}
                                Resend OTP
                            </button>
                        </p>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                            <ArrowLeft size={16} style={{ marginRight: '8px' }} />
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;

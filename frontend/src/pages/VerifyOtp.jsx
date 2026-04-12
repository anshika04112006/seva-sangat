import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { ShieldCheck, Loader, ArrowRight } from 'lucide-react';

const VerifyOtp = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error("Invalid access");
            navigate('/register');
        }
    }, [email, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            toast.error("Please enter 6-digit OTP");
            return;
        }

        setLoading(true);
        try {
            const res = await API.post('/api/auth/verify-otp', { email, otp: otpCode });
            toast.success("Account verified successfully!");
            // Store token if needed or redirect to login
            localStorage.setItem('token', res.data.token);
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f8f9fb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '450px', background: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ width: '70px', height: '70px', background: 'rgba(255, 107, 107, 0.1)', color: 'var(--primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <ShieldCheck size={32} />
                </div>
                
                <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Verify your email</h2>
                <p style={{ color: '#7f8c8d', fontSize: '0.95rem', marginBottom: '2rem' }}>We've sent a 6-digit code to <br /><strong>{email}</strong></p>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '2rem' }}>
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onFocus={e => e.target.select()}
                                style={{
                                    width: '50px',
                                    height: '60px',
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    borderRadius: '12px',
                                    border: '2px solid #eee',
                                    outline: 'none',
                                    transition: '0.3s'
                                }}
                            />
                        ))}
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ width: '100%', height: '55px', fontSize: '1.1rem', borderRadius: '15px' }}
                        disabled={loading}
                    >
                        {loading ? <Loader className="spin" size={22} /> : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                Verify Account <ArrowRight size={20} />
                            </div>
                        )}
                    </button>
                </form>

                <p style={{ marginTop: '2rem', color: '#7f8c8d', fontSize: '0.9rem' }}>
                    Didn't receive the code? <span style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Resend</span>
                </p>
            </div>
            
            <style>{`
                input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.1); }
            `}</style>
        </div>
    );
};

export default VerifyOtp;

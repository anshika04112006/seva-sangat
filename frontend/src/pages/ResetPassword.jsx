import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import API from '../services/api';
import '../assets/styles/index.css';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    
    const email = location.state?.email;
    const otp = location.state?.otp;

    useEffect(() => {
        if (!email || !otp) {
            navigate('/forgot-password');
        }
    }, [email, otp, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.newPassword || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            await API.post('/api/auth/reset-password', {
                email,
                otp,
                newPassword: formData.newPassword
            });
            
            setSuccess(true);
            
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Reset Password</h1>
                    <p>Enter your new password below to regain access.</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && (
                    <div className="alert alert-success">
                        <CheckCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Password reset successful! Redirecting to login...
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#636e72' }} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                className="form-control"
                                placeholder="••••••••"
                                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                                value={formData.newPassword}
                                onChange={handleChange}
                                disabled={success}
                            />
                            <div 
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#636e72' }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>
                        <div className="password-rules">
                            Password must be at least 6 characters. Use a mix of letters and numbers for better security.
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#636e72' }} />
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                placeholder="••••••••"
                                style={{ paddingLeft: '40px' }}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={success}
                            />
                        </div>
                    </div>

                    {!success && (
                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Updating Password...' : 'Reset Password'}
                        </button>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <Link to="/login" style={{ fontSize: '0.9rem' }}>
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;

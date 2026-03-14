import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, MapPin, Briefcase, Eye, EyeOff } from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../assets/styles/index.css';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        location: '',
        skills: ''
    });

    const [step, setStep] = useState(1); // 1: Register, 2: Verify OTP
    const [otp, setOtp] = useState('');
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleRoleChange = (role) => {
        setFormData({ ...formData, role });
    };

    const validateForm = () => {
        if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.location) {
            setError('Please fill in all required fields');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (formData.phone.length < 10) {
          setError('Please enter a valid phone number');
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
            // Transform skills from comma-separated string to array
            const payload = {
                ...formData,
                skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : []
            };

            const response = await API.post('/api/auth/register', payload);
            
            setStep(2);
            setSuccess(false); // Reset success to show OTP sent message if needed
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            setError('Please enter the OTP');
            return;
        }

        setVerifyLoading(true);
        setError('');

        try {
            const response = await API.post('/api/auth/register-verify', {
                email: formData.email,
                otp
            });
            
            setSuccess(true);
            login(response.data, response.data.token);
            
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setVerifyLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Join Seva Sangat</h1>
                    <p>Empowering Social Impact Through Community</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">Registration successful! Redirecting...</div>}
                {step === 2 && !success && <div className="alert alert-info">OTP sent to {formData.email}. Please enter it below.</div>}

                {step === 1 ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Register As</label>
                            <div className="role-selector">
                                <div 
                                    className={`role-option ${formData.role === 'user' ? 'active' : ''}`}
                                    onClick={() => handleRoleChange('user')}
                                >
                                    Volunteer
                                </div>
                                <div 
                                    className={`role-option ${formData.role === 'ngo' ? 'active' : ''}`}
                                    onClick={() => handleRoleChange('ngo')}
                                >
                                    NGO
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#636e72' }} />
                                <input
                                    type="text"
                                    name="fullName"
                                    className="form-control"
                                    placeholder="John Doe"
                                    style={{ paddingLeft: '40px' }}
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#636e72' }} />
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="john@example.com"
                                    style={{ paddingLeft: '40px' }}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#636e72' }} />
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-control"
                                    placeholder="1234567890"
                                    style={{ paddingLeft: '40px' }}
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#636e72' }} />
                                <input
                                    type="text"
                                    name="location"
                                    className="form-control"
                                    placeholder="City, State"
                                    style={{ paddingLeft: '40px' }}
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Skills / Focus Areas (Comma separated)</label>
                            <div style={{ position: 'relative' }}>
                                <Briefcase size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#636e72' }} />
                                <input
                                    type="text"
                                    name="skills"
                                    className="form-control"
                                    placeholder="Teaching, Cooking, Management"
                                    style={{ paddingLeft: '40px' }}
                                    value={formData.skills}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#636e72' }} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="form-control"
                                    placeholder="••••••••"
                                    style={{ paddingLeft: '40px', paddingRight: '40px' }}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <div 
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#636e72' }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            </div>
                            <div className="password-rules">
                                <strong>Password Rules:</strong> Must be at least 6 characters long with uppercase, lowercase, and symbols for better security.
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
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Sending OTP...' : 'Next'}
                        </button>

                        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#636e72' }}>
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="form-group">
                            <label>Enter 6-Digit OTP</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#636e72' }} />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="123456"
                                    style={{ paddingLeft: '40px', letterSpacing: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#636e72', marginTop: '0.5rem' }}>
                                We've sent a code to your email. Check your inbox and spam folder.
                            </p>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={verifyLoading || success}
                        >
                            {verifyLoading ? 'Verifying...' : 'Verify & Register'}
                        </button>

                        <button 
                            type="button" 
                            className="btn-secondary"
                            style={{ marginTop: '1rem', width: '100%' }}
                            onClick={() => setStep(1)}
                            disabled={verifyLoading || success}
                        >
                            Back to Details
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;

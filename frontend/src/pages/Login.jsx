import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, Heart } from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await API.post('/api/auth/login', formData);
            setSuccess(true);
            login(response.data, response.data.token);
            
            setTimeout(() => {
                const role = response.data.role;
                if (role === 'ngo' || role === 'organization') navigate('/ngo-dashboard');
                else if (role === 'admin') navigate('/admin-dashboard');
                else if (role === 'beneficiary') navigate('/beneficiary-dashboard');
                else navigate('/dashboard');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="auth-card animate-up" style={{ width: '100%', maxWidth: '450px', background: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'linear-gradient(90deg, #16a34a, #2ecc71)' }}></div>
                
                <div className="auth-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '60px', height: '60px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Heart size={32} fill="currentColor" />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>Welcome Back</h1>
                    <p style={{ color: '#64748b' }}>Enter your credentials to continue</p>
                </div>

                {error && <div className="animate-fade" style={{ marginBottom: '1.5rem', padding: '12px', background: '#fef2f2', color: '#dc2626', borderRadius: '12px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>{error}</div>}
                {success && <div className="animate-fade" style={{ marginBottom: '1.5rem', padding: '12px', background: '#f0fdf4', color: '#16a34a', borderRadius: '12px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>Login successful! Redirecting...</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '14px 45px 14px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <div 
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8' }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="stat-card-v2"
                        style={{ width: '100%', padding: '1.1rem', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', justifyContent: 'center', transition: 'all 0.3s' }}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Create One</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

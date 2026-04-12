import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, MapPin, Briefcase, Eye, EyeOff, Sparkles, Building2, Heart } from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'volunteer',
        skills: '',
        age: '',
        gender: '',
        income: '',
        householdSize: '',
        needs: '',
        category: '',
        address: '',
        city: '',
        state: '',
        description: '',
        registrationCertificate: ''
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

    const handleRoleChange = (role) => {
        setFormData({ ...formData, role });
    };

    const validateForm = () => {
        if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
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
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
                demographicData: formData.role === 'beneficiary' ? {
                    age: parseInt(formData.age),
                    gender: formData.gender,
                    income: parseInt(formData.income),
                    householdSize: parseInt(formData.householdSize)
                } : null,
                needs: formData.needs ? formData.needs.split(',').map(n => n.trim()) : [],
                orgData: formData.role === 'organization' ? {
                    category: formData.category,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    description: formData.description,
                    registrationCertificate: formData.registrationCertificate
                } : null
            };

            const response = await API.post('/api/auth/register', payload);
            setSuccess(true);
            login(response.data, response.data.token);
            
            setTimeout(() => {
                navigate(formData.role === 'ngo' ? '/ngo-dashboard' : (formData.role === 'beneficiary' ? '/beneficiary-dashboard' : '/dashboard'));
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            <div className="auth-card animate-up" style={{ width: '100%', maxWidth: '650px', background: 'white', padding: '3rem', borderRadius: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'linear-gradient(90deg, #16a34a, #2ecc71)' }}></div>
                
                <div className="auth-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div className="badge-ai" style={{ width: 'fit-content', margin: '0 auto 1rem' }}>
                        <Sparkles size={14} /> <span>Social Welfare v2.0</span>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b' }}>Join Seva Sangat</h1>
                    <p style={{ color: '#64748b' }}>Experience the future of AI-powered social welfare</p>
                </div>

                {error && <div className="animate-fade" style={{ marginBottom: '1.5rem', padding: '12px', background: '#fef2f2', color: '#dc2626', borderRadius: '12px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>{error}</div>}
                {success && <div className="animate-fade" style={{ marginBottom: '1.5rem', padding: '12px', background: '#f0fdf4', color: '#16a34a', borderRadius: '12px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>Welcome to the community! Redirecting...</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px', color: '#1e293b' }}>I am joining as a:</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            {[
                                { id: 'volunteer', label: 'Volunteer', icon: <Heart size={16} /> },
                                { id: 'beneficiary', label: 'Beneficiary', icon: <Sparkles size={16} /> },
                                { id: 'organization', label: 'NGO', icon: <Building2 size={16} /> }
                            ].map((role) => (
                                <div 
                                    key={role.id}
                                    onClick={() => handleRoleChange(role.id)}
                                    style={{ 
                                        padding: '12px', 
                                        borderRadius: '12px', 
                                        border: '1px solid', 
                                        borderColor: formData.role === role.id ? 'var(--primary)' : '#e2e8f0',
                                        background: formData.role === role.id ? 'var(--primary-light)' : 'white',
                                        color: formData.role === role.id ? 'var(--primary)' : '#64748b',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {role.icon} {role.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="John Doe"
                                    style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
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
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="1234567890"
                                style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {formData.role === 'beneficiary' && (
                        <div className="animate-fade" style={{ background: 'var(--primary-light)', padding: '2rem', borderRadius: '20px', marginBottom: '2rem', border: '1px dashed var(--primary)' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                                <Sparkles size={18} /> AI Service Matching Profile
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Age</label>
                                    <input type="number" name="age" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} value={formData.age} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Gender</label>
                                    <select name="gender" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} value={formData.gender} onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Income (₹)</label>
                                    <input type="number" name="income" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} value={formData.income} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Household Size</label>
                                    <input type="number" name="householdSize" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} value={formData.householdSize} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.role === 'volunteer' && (
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>Skills (Comma separated)</label>
                            <div style={{ position: 'relative' }}>
                                <Briefcase size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    name="skills"
                                    placeholder="Teaching, Medical, Management"
                                    style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                                    value={formData.skills}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}

                    {formData.role === 'organization' && (
                        <div className="animate-fade" style={{ background: '#f8fafc', padding: '2rem', borderRadius: '20px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', marginBottom: '1.5rem' }}>
                                <Building2 size={18} color="var(--primary)" /> Organization Details
                            </h4>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Category</label>
                                <select name="category" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} value={formData.category} onChange={handleChange} required>
                                    <option value="">Select Category</option>
                                    <option value="NGO">NGO</option>
                                    <option value="Orphanage">Orphanage</option>
                                    <option value="Old Age Home">Old Age Home</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>City</label>
                                    <input type="text" name="city" placeholder="e.g. New Delhi" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} value={formData.city} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>State</label>
                                    <input type="text" name="state" placeholder="e.g. Delhi" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} value={formData.state} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Address Line 1</label>
                                <input type="text" name="address" placeholder="Physical location of the organization" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} value={formData.address} onChange={handleChange} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Organization Mission</label>
                                <textarea name="description" placeholder="Briefly describe what your organization does..." style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', minHeight: '80px' }} value={formData.description} onChange={handleChange} required></textarea>
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Link to Registration Proof (Certificate URL)</label>
                                <input type="text" name="registrationCertificate" placeholder="https://drive.google.com/..." style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} value={formData.registrationCertificate} onChange={handleChange} />
                                <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '4px', display: 'block' }}>Admin will inspect this document to approve your profile.</span>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '2rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                                value={formData.password}
                                onChange={handleChange}
                                minLength="6"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>Confirm</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                minLength="6"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="stat-card-v2"
                        style={{ width: '100%', padding: '1.1rem', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', justifyContent: 'center', transition: 'all 0.3s' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Initialize AI Profile'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Log In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;

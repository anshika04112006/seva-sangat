import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Heart, LogOut, Menu, X, User, Shield, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/', roles: ['guest', 'volunteer', 'organization', 'admin', 'beneficiary'] },
        { name: 'Impact', path: '/impact', roles: ['volunteer'] },
        { name: 'Skill Hub', path: '/skills', roles: ['volunteer', 'beneficiary'] },
        { name: 'Find NGOs', path: '/ngos', roles: ['volunteer', 'admin'] },
        { name: 'Beneficiary Hub', path: '/beneficiary-dashboard', roles: ['beneficiary'] },
        { name: 'Events', path: '/events', roles: ['volunteer', 'organization', 'admin', 'beneficiary'] },
        { name: 'Donate', path: '/donate', roles: ['volunteer'] },
        { name: 'Certificates', path: '/certificates', roles: ['volunteer'] },
        { name: 'NGO Dashboard', path: '/ngo-dashboard', roles: ['organization'] },
        { name: 'Admin Control', path: '/admin-dashboard', roles: ['admin'] },
    ];

    const filteredLinks = navLinks.filter(link => 
        !user ? link.roles.includes('guest') : link.roles.includes(user.role)
    );

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="nav-logo">
                    <Heart fill="var(--primary)" color="var(--primary)" size={32} />
                    <span>SevaSangat</span>
                </Link>

                <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                    {filteredLinks.map(link => (
                        <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}>
                            {link.name}
                        </Link>
                    ))}
                    
                    {user ? (
                        <div className="nav-user-actions">
                            <span className="user-role-badge">
                                {user.role === 'admin' && <Shield size={14} />}
                                {user.role === 'organization' && <Building2 size={14} />}
                                {user.role === 'beneficiary' && <Star size={14} />}
                                {user.role === 'volunteer' && <User size={14} />}
                                {user.role}
                            </span>
                            <button onClick={handleLogout} className="btn-logout">
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="nav-auth-btns">
                            <Link to="/login" className="btn-login-text">Login</Link>
                            <Link to="/register" className="btn btn-primary">Join Now</Link>
                        </div>
                    )}
                </div>

                <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

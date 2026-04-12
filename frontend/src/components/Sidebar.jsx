import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, Users, Calendar, 
    Heart, Award, ShieldCheck, 
    LogOut, Settings, MessageSquare, 
    BarChart3, UserCircle
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getLinks = () => {
        if (user?.role === 'admin') {
            return [
                { path: '/admin-dashboard', icon: <BarChart3 size={20} />, label: 'Analytics' },
                { path: '/ngos', icon: <Users size={20} />, label: 'NGO Ledger' },
                { path: '/submit-complaint', icon: <MessageSquare size={20} />, label: 'Complaints' }
            ];
        } else if (user?.role === 'ngo' || user?.role === 'organization') {
            return [
                { path: '/ngo-dashboard', icon: <LayoutDashboard size={20} />, label: 'Command Center' },
                { path: '/events', icon: <Calendar size={20} />, label: 'Operations' },
                { path: '/donate', icon: <Heart size={20} />, label: 'Contributions' }
            ];
        } else {
            return [
                { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
                { path: '/ngos', icon: <Users size={20} />, label: 'Find NGOs' },
                { path: '/recommendations', icon: <Award size={20} />, label: 'Missions' },
                { path: '/donate', icon: <Heart size={20} />, label: 'Donate' },
                { path: '/certificates', icon: <ShieldCheck size={20} />, label: 'Honors' }
            ];
        }
    };

    const links = getLinks();

    return (
        <aside className="app-sidebar">
            <div className="sidebar-brand">
                <div className="brand-logo">S</div>
                <span>Seva Sangat</span>
            </div>

            <div className="sidebar-profile">
                <div className="profile-avatar">
                   {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="profile-info">
                    <strong>{user?.fullName}</strong>
                    <span>{user?.role?.toUpperCase()}</span>
                </div>
            </div>

            <nav className="sidebar-nav-v2">
                <div className="nav-group">
                    <label>MAIN MENU</label>
                    {links.map((link, index) => (
                        <NavLink 
                            key={index} 
                            to={link.path} 
                            className={({ isActive }) => `nav-item-v2 ${isActive ? 'active' : ''}`}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="nav-group secondary">
                    <label>ACCOUNT</label>
                    <NavLink to="/profile" className="nav-item-v2">
                        <UserCircle size={20} />
                        <span>Profile Settings</span>
                    </NavLink>
                    <button onClick={handleLogout} className="nav-item-v2 logout">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </nav>

            <div className="sidebar-footer">
                <p>© 2026 Seva Sangat</p>
                <span>v2.0.4 - Cloud Enabled</span>
            </div>
        </aside>
    );
};

export default Sidebar;

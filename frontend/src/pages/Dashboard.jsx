import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Search, Users, Calendar, Heart, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../assets/styles/index.css';

const Dashboard = () => {
    const { user } = useAuth();

    const features = [
        {
            title: 'Find NGOs',
            description: 'Discover and connect with registered NGOs, orphanages, and old age homes in your area.',
            icon: <Search size={32} />,
            link: '/ngos',
            className: 'ngo'
        },
        {
            title: 'Volunteer Opportunities',
            description: 'Find AI-recommended volunteer tasks based on your skills and location.',
            icon: <Users size={32} />,
            link: '/recommendations',
            className: 'volunteer'
        },
        {
            title: 'Social Work Events',
            description: 'Browse and book slots for upcoming social work events and community drives.',
            icon: <Calendar size={32} />,
            link: '/events',
            className: 'events'
        },
        {
            title: 'Donate Now',
            description: 'Support causes you care about by donating money, food, or clothes securely.',
            icon: <Heart size={32} />,
            link: '/donate',
            className: 'donate'
        },
        {
            title: 'Certificates',
            description: 'Download certificates for your participation and contributions to social work.',
            icon: <Award size={32} />,
            link: '/certificates',
            className: 'certificates'
        }
    ];

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            
            <main className="dashboard-container">
                <header className="welcome-section">
                    <h1>Welcome, {user?.fullName}! 👋</h1>
                    <p>What would you like to contribute to today?</p>
                </header>

                <div className="dashboard-grid">
                    {features.map((feature, index) => (
                        <Link to={feature.link} key={index} className={`feature-card ${feature.className}`}>
                            <div className="card-icon">
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

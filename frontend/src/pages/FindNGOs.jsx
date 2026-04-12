import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { Search, MapPin, Filter, Phone, Info, ChevronRight, Loader, Heart } from 'lucide-react';

const FindNGOs = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [location, setLocation] = useState('All');
    const [organizations, setOrganizations] = useState([]);
    const [filteredNGOs, setFilteredNGOs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categories = ['All', 'NGO', 'Orphanage', 'Old Age Home'];
    const locations = ['All', 'Delhi', 'New Delhi', 'Gurgaon', 'Noida'];

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                setLoading(true);
                const response = await API.get('/api/orgs');
                setOrganizations(response.data.data);
                setFilteredNGOs(response.data.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching organizations:', err);
                setError('Failed to load organizations. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    useEffect(() => {
        let results = organizations.filter(ngo => {
            const matchesSearch = ngo.name.toLowerCase().includes(search.toLowerCase()) || 
                                 ngo.description.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = category === 'All' || ngo.category === category;
            const matchesLocation = location === 'All' || ngo.city === location || ngo.state === location;
            
            return matchesSearch && matchesCategory && matchesLocation;
        });
        setFilteredNGOs(results);
    }, [search, category, location, organizations]);

    if (loading) {
        return (
            <div className="loading-screen">
                <Loader className="spin" size={48} color="var(--primary)" />
                <p>Locating humanitarian missions...</p>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar />
            
            <main className="main-content-v2">
                <header className="welcome-section-v2 animate-up">
                    <div className="welcome-text">
                        <span>Directory</span>
                        <h1>Organization Finder</h1>
                        <p>Discover NGO's, Orphanages, and Old Age Homes around you.</p>
                    </div>
                </header>

                <div className="chart-container-v2 animate-up" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="search-bar-v2" style={{ flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-main)', padding: '10px 20px', borderRadius: '15px' }}>
                        <Search size={20} color="var(--primary)" />
                        <input 
                            type="text" 
                            placeholder="Search by name or keyword..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            style={{ padding: '10px 20px', borderRadius: '15px', border: '1px solid #e2e8f0', background: 'white' }}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <select 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)}
                            style={{ padding: '10px 20px', borderRadius: '15px', border: '1px solid #e2e8f0', background: 'white' }}
                        >
                            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid-v2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {filteredNGOs.map(ngo => (
                        <div key={ngo.id || ngo._id} className="stat-card-v2 animate-fade" style={{ padding: '0', overflow: 'hidden' }}>
                            <img src={ngo.image} alt={ngo.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <span className="trending" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>{ngo.category}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MapPin size={12} /> {ngo.city || 'Local'}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>{ngo.name}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineClamp: '2', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', marginBottom: '1.5rem' }}>
                                    {ngo.description}
                                </p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Link to={`/orgs/${ngo.id || ngo._id}`} className="btn-glass" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
                                        View Mission
                                    </Link>
                                    <Link to={`/donate?orgId=${ngo._id}`} className="stat-card-v2" style={{ padding: '8px 12px', background: 'var(--primary)', color: 'white', border: 'none', margin: '0', textDecoration: 'none' }}>
                                        <Heart size={16} fill="white" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredNGOs.length === 0 && !loading && (
                    <div className="empty-state-v2" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
                        <Info size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                        <h3>No Missions Found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters to discover other amazing organizations.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FindNGOs;

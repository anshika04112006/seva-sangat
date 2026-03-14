import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { dummyNGOs } from '../data/dummyNGOs';
import { Search, MapPin, Filter, Phone, Info, ChevronRight } from 'lucide-react';
import '../assets/styles/index.css';

const FindNGOs = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [location, setLocation] = useState('All');
    const [filteredNGOs, setFilteredNGOs] = useState(dummyNGOs);

    const categories = ['All', 'NGO', 'Orphanage', 'Old Age Home'];
    const locations = ['All', ...new Set(dummyNGOs.map(ngo => ngo.location))];

    useEffect(() => {
        let results = dummyNGOs.filter(ngo => {
            const matchesSearch = ngo.name.toLowerCase().includes(search.toLowerCase()) || 
                                 ngo.description.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = category === 'All' || ngo.category === category;
            const matchesLocation = location === 'All' || ngo.location === location;
            
            return matchesSearch && matchesCategory && matchesLocation;
        });
        setFilteredNGOs(results);
    }, [search, category, location]);

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            
            <main className="finder-container">
                <header className="finder-header">
                    <h1>Organization Finder</h1>
                    <p>Discover NGO's, Orphanages, and Old Age Homes around you</p>
                </header>

                <div className="filter-bar">
                    <div className="search-input-wrapper">
                        <Search size={20} className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search by name or keyword..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-selects">
                        <div className="filter-item">
                            <Filter size={18} className="filter-icon" />
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div className="filter-item">
                            <MapPin size={18} className="filter-icon" />
                            <select value={location} onChange={(e) => setLocation(e.target.value)}>
                                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="results-count">
                    Found <strong>{filteredNGOs.length}</strong> organizations
                </div>

                <div className="ngo-grid">
                    {filteredNGOs.length > 0 ? (
                        filteredNGOs.map(ngo => (
                            <div key={ngo.id} className="ngo-card">
                                <div className="ngo-image">
                                    <img src={ngo.image} alt={ngo.name} />
                                    <span className={`category-badge ${ngo.category.replace(/\s+/g, '-').toLowerCase()}`}>
                                        {ngo.category}
                                    </span>
                                </div>
                                <div className="ngo-content">
                                    <h3>{ngo.name}</h3>
                                    <div className="ngo-info">
                                        <div className="info-item">
                                            <MapPin size={14} />
                                            <span>{ngo.address}</span>
                                        </div>
                                        <div className="info-item">
                                            <Phone size={14} />
                                            <span>{ngo.contact}</span>
                                        </div>
                                    </div>
                                    <p className="ngo-desc">{ngo.description}</p>
                                    <Link to={`/orgs/${ngo.id || ngo._id}`} className="view-details-btn">
                                        View Details <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <Info size={48} />
                            <h3>No organizations found</h3>
                            <p>Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FindNGOs;

import React from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <div className="logo">
                        <Heart color="var(--primary)" fill="var(--primary)" />
                        <span>SevaSangat</span>
                    </div>
                    <p>Connecting compassionate hearts with meaningful causes. Join our community to drive social change through volunteering and donations.</p>
                </div>

                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/dashboard">Dashboard</a></li>
                        <li><a href="/ngos">Find NGOs</a></li>
                        <li><a href="/recommendations">Volunteer</a></li>
                        <li><a href="/donate">Donate</a></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h3>Contact Us</h3>
                    <ul>
                        <li><Mail size={18} /> anshikaaaa0411@gmail.com</li>
                        <li><Phone size={18} /> +91 8384043242</li>
                        <li><MapPin size={18} /> Faridabad, Haryana</li>
                    </ul>
                </div>

                <div className="footer-social">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="#"><Facebook size={20} /></a>
                        <a href="#"><Twitter size={20} /></a>
                        <a href="#"><Instagram size={20} /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} SevaSangat. Built with <Heart size={14} fill="var(--primary)" color="var(--primary)" /> for a better tomorrow.</p>
            </div>
        </footer>
    );
};

export default Footer;

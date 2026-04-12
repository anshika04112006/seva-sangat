import React, { useState, useEffect } from 'react';
import { Star, Send, MessageSquare, User, Loader } from 'lucide-react';
import API from '../services/api';

const ReviewSystem = ({ targetId, targetType }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [hover, setHover] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await API.get(`/api/reviews/${targetId}`);
                setReviews(data.data || []);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [targetId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data } = await API.post('/api/reviews', {
                targetId,
                targetType,
                rating,
                comment
            });
            setReviews([data.data, ...reviews]);
            setComment('');
            setRating(5);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-system animate-fade">
            <div className="container-header" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={20} color="var(--primary)" />
                <h3>Community Feedback</h3>
            </div>

            <form onSubmit={handleSubmit} className="chart-container-v2" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#f8fafc' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>Rate your experience</p>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '1.5rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                            <Star 
                                size={24} 
                                fill={(hover || rating) >= star ? "#eab308" : "none"} 
                                color={(hover || rating) >= star ? "#eab308" : "#94a3b8"} 
                                transition="all 0.2s"
                            />
                        </button>
                    ))}
                </div>

                <textarea
                    placeholder="Share your feedback with the community..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '100px', marginBottom: '1rem', background: 'white', resize: 'vertical' }}
                />

                <button 
                    type="submit" 
                    className="stat-card-v2" 
                    disabled={submitting}
                    style={{ background: 'var(--primary)', color: 'white', width: '100%', justifyContent: 'center', padding: '12px' }}
                >
                    {submitting ? <Loader className="spin" size={20} /> : <><Send size={18} /> Submit Review</>}
                </button>
            </form>

            <div className="reviews-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}><Loader className="spin" /></div>
                ) : reviews.length > 0 ? (
                    reviews.map((rev) => (
                        <div key={rev._id} className="chart-container-v2" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div className="stat-icon-v2" style={{ width: '32px', height: '32px', background: '#f1f5f9' }}><User size={16} /></div>
                                    <strong style={{ fontSize: '0.9rem' }}>{rev.user?.fullName || 'Anonymous'}</strong>
                                </div>
                                <div style={{ display: 'flex', gap: '2px', color: '#eab308' }}>
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={14} fill={rev.rating >= s ? "#eab308" : "none"} strokeWidth={3} />
                                    ))}
                                </div>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>{rev.comment}</p>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '10px', display: 'block' }}>
                                {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewSystem;

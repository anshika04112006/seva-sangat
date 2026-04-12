import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, User, Bot, X, Loader } from 'lucide-react';
import API from '../services/api';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Namaste! I am your AI Sahayak. How can I help you today with government schemes or safety?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // In a real scenario, this would call the Flask API for intent classification
            // and then fetch relevant scheme data from Node.js backend
            
            // Simulating a minor delay for AI processing
            await new Promise(r => setTimeout(r, 1000));
            
            let botResponse = "I am processing your query about government support. Let me check the latest schemes for you.";
            
            if (input.toLowerCase().includes('scheme') || input.toLowerCase().includes('yojana')) {
                botResponse = "Based on your interest in schemes, you might be eligible for the 'Mahila Shakti' support. Would you like me to find the nearest application center?";
            } else if (input.toLowerCase().includes('sos') || input.toLowerCase().includes('unsafe')) {
                botResponse = "I have detected an emergency intent. Please use the red SOS button on your screen for immediate help!";
            }

            setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting to my AI core. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
            {!isOpen ? (
                <button 
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <MessageCircle size={28} />
                </button>
            ) : (
                <div style={{
                    width: '350px',
                    height: '500px',
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'slideIn 0.3s ease'
                }}>
                    <header style={{ background: 'var(--primary)', padding: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Bot size={24} />
                            <span style={{ fontWeight: 700 }}>AI Sahayak</span>
                        </div>
                        <X size={20} onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }} />
                    </header>

                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                alignSelf: msg.role === 'bot' ? 'flex-start' : 'flex-end',
                                background: msg.role === 'bot' ? '#f0f2f5' : 'var(--primary)',
                                color: msg.role === 'bot' ? 'var(--text-main)' : 'white',
                                padding: '12px 16px',
                                borderRadius: msg.role === 'bot' ? '0 18px 18px 18px' : '18px 18px 0 18px',
                                maxWidth: '85%',
                                fontSize: '0.9rem',
                                lineHeight: 1.4
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', background: '#f0f2f5', padding: '12px 16px', borderRadius: '0 18px 18px 18px' }}>
                                <Loader className="spin" size={16} />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} style={{ padding: '20px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            placeholder="Ask about schemes..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            style={{ flex: 1, border: '1px solid #ddd', borderRadius: '50px', padding: '10px 20px', outline: 'none' }}
                        />
                        <button 
                            type="submit"
                            style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            <style>{`
                @keyframes slideIn {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Chatbot;

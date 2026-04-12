import React from 'react';
import { 
    CheckCircle2, Clock, Truck, 
    Award, Package, AlertCircle 
} from 'lucide-react';

const DonationTracker = ({ status, history = [] }) => {
    const steps = [
        { key: 'pending', label: 'Initiated', icon: <Clock size={16} /> },
        { key: 'received', label: 'Received', icon: <Package size={16} /> },
        { key: 'dispatched', label: 'In Transit', icon: <Truck size={16} /> },
        { key: 'delivered', label: 'Arrived', icon: <Award size={16} /> },
        { key: 'completed', label: 'Verified', icon: <CheckCircle2 size={16} /> }
    ];

    const currentStepIndex = steps.findIndex(step => step.key === status);

    return (
        <div className="donation-tracker" style={{ padding: '1rem' }}>
            <div className="stepper-vertical" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isActive = index === currentStepIndex;
                    const historyItem = history.find(h => h.status === step.key);

                    return (
                        <div key={step.key} className="step-item" style={{ display: 'flex', gap: '15px' }}>
                            <div className="step-indicator" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div className={`step-dot ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`} style={{ 
                                    width: '32px', 
                                    height: '32px', 
                                    borderRadius: '50%', 
                                    background: isCompleted ? 'var(--primary)' : '#f1f5f9',
                                    color: isCompleted ? 'white' : '#94a3b8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1,
                                    border: isActive ? '4px solid var(--primary-light)' : 'none'
                                }}>
                                    {isCompleted ? <CheckCircle2 size={18} /> : step.icon}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="step-line" style={{ 
                                        width: '2px', 
                                        height: '40px', 
                                        background: index < currentStepIndex ? 'var(--primary)' : '#e2e8f0',
                                        margin: '4px 0'
                                    }}></div>
                                )}
                            </div>
                            <div className="step-content" style={{ paddingTop: '5px' }}>
                                <strong style={{ 
                                    fontSize: '0.9rem', 
                                    color: isCompleted ? '#1e293b' : '#94a3b8',
                                    display: 'block'
                                }}>
                                    {step.label}
                                </strong>
                                {historyItem && (
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0' }}>
                                        {historyItem.message}
                                    </p>
                                )}
                                {historyItem && (
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                        {new Date(historyItem.timestamp).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {status === 'cancelled' && (
                <div style={{ marginTop: '20px', padding: '12px', background: '#fef2f2', borderRadius: '10px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                    <AlertCircle size={18} /> This donation was cancelled.
                </div>
            )}
        </div>
    );
};

export default DonationTracker;

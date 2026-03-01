import React from 'react';
import { Shield, Calendar, Share2, Bell } from 'lucide-react';
import '../index.css';

const features = [
    {
        icon: <Shield size={28} />,
        title: "Secure Medical Record Storage",
        desc: "Store your prescriptions, lab results, and history in a bank-grade encrypted vault only you control."
    },
    {
        icon: <Calendar size={28} />,
        title: "Appointment Booking",
        desc: "Seamlessly book appointments with top doctors and specialists directly through the platform."
    },
    {
        icon: <Share2 size={28} />,
        title: "Consent-Based Sharing",
        desc: "Share your health records securely with doctors for a limited time. You decide who sees what."
    },
    {
        icon: <Bell size={28} />,
        title: "Health Notifications",
        desc: "Get timely reminders for medication, upcoming appointments, and routine check-ups."
    }
];

const Features = () => {
    return (
        <section id="features" className="section" style={{ backgroundColor: 'white' }}>
            <div className="container">
                <div className="text-center" style={{ marginBottom: '4rem' }}>
                    <span style={{
                        color: 'var(--primary)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '0.85rem',
                        letterSpacing: '0.1em'
                    }}>Features</span>
                    <h2 style={{ marginTop: '0.5rem' }}>Everything you need for better health</h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2.5rem'
                }}>
                    {features.map((feature, index) => (
                        <div key={index} style={{
                            background: 'white',
                            padding: '2.5rem 2rem',
                            borderRadius: '16px',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all 0.3s ease',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                e.currentTarget.style.borderColor = 'transparent';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '16px',
                                background: 'var(--bg-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                color: 'var(--primary)'
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>{feature.title}</h3>
                            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;

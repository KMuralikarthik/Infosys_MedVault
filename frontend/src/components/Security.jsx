import React from 'react';
import { Lock, CheckCircle, Shield } from 'lucide-react';
import '../index.css';

const Security = () => {
    return (
        <section id="security" className="section" style={{
            background: 'linear-gradient(135deg, white 0%, #f0f9ff 100%)',
        }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

                {/* Visual Side (Left now for balance) */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '500px',
                        padding: '2rem',
                        background: 'white',
                        borderRadius: '24px',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--border-color)',
                    }}>
                        <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield color="var(--primary)" size={18} />
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>MedVault Security Protocol</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['Data Encryption', 'Access Control', 'Audit Logs'].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-subtle)', borderRadius: '12px' }}>
                                    <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{item}</span>
                                    <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 700, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>ACTIVE</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <Lock size={48} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>AES-256 Bit Encryption</div>
                        </div>
                    </div>
                </div>

                {/* Text Side */}
                <div>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        borderRadius: '99px',
                        background: 'rgba(14, 165, 233, 0.1)',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        marginBottom: '1.5rem'
                    }}>
                        Privacy First
                    </div>
                    <h2>Uncompromised <span style={{ color: 'var(--primary)' }}>Security</span></h2>
                    <p>
                        Your health data is sensitive. That's why we don't just store it; we vault it.
                        With end-to-end encryption, you are the only one who holds the key to your records.
                    </p>

                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                        {[
                            "HIPAA & GDPR Compliant Storage",
                            "Military-grade AES-256 Encryption",
                            "Two-Factor Authentication (2FA) for all accounts",
                            "Granular Consent Management"
                        ].map((item, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.05rem', color: 'var(--text-main)' }}>
                                <CheckCircle size={20} color="var(--success)" strokeWidth={3} />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
            <style>{`
        @media (max-width: 968px) {
          .container { grid-template-columns: 1fr !important; }
          div[style*="order: 2"] { order: 0 !important; }
        }
      `}</style>
        </section>
    );
};

export default Security;

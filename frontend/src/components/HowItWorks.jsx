import React from 'react';
import { UserPlus, UploadCloud, Stethoscope } from 'lucide-react';
import '../index.css';

const steps = [
    {
        icon: <UserPlus size={32} />,
        title: "1. Create Account",
        desc: "Sign up for free and verify your identity to create a secure Personal Health ID."
    },
    {
        icon: <UploadCloud size={32} />,
        title: "2. Upload Records",
        desc: "Snap photos or upload PDFs of your prescriptions, lab reports, and medical history."
    },
    {
        icon: <Stethoscope size={32} />,
        title: "3. Share & Book",
        desc: "Securely share records with doctors via a link and book appointments instantly."
    }
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="section" style={{ backgroundColor: 'var(--bg-subtle)' }}>
            <div className="container">
                <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem' }}>How MedVault Works</h2>
                    <p>Get started in minutes three simple steps.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '3rem',
                    position: 'relative'
                }}>
                    {steps.map((step, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            position: 'relative',
                            zIndex: 2
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'white',
                                border: '4px solid var(--bg-subtle)',
                                boxShadow: '0 0 0 4px var(--primary)', /* Double border effect */
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                color: 'var(--primary)'
                            }}>
                                {step.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{step.title}</h3>
                            <p style={{ maxWidth: '300px' }}>{step.desc}</p>
                        </div>
                    ))}

                    {/* Connector Line (Desktop Only) */}
                    <div className="connector-line" style={{
                        position: 'absolute',
                        top: '40px',
                        left: '15%',
                        right: '15%',
                        height: '4px',
                        background: 'var(--border-color)',
                        zIndex: 1,
                        display: 'block'
                    }} />
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) {
          .connector-line { display: none !important; }
        }
      `}</style>
        </section>
    );
};

export default HowItWorks;

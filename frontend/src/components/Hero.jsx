import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Activity, Database, Lock } from 'lucide-react';
import '../index.css';

const Hero = () => {
    const navigate = useNavigate();

    const scrollToFeatures = () => {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section style={{
            paddingTop: 'calc(var(--header-height) + 4rem)',
            paddingBottom: '6rem',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-subtle)'
        }} className="fade-in">

            {/* Abstract Background Shapes */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.05) 0%, rgba(56, 189, 248, 0.1) 100%)',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                left: '-5%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'rgba(14, 165, 233, 0.05)',
                zIndex: 0
            }} />

            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>

                {/* Text Content */}
                <div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 1rem',
                        borderRadius: '99px',
                        background: 'white',
                        border: '1px solid var(--border-color)',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem',
                        color: 'var(--primary)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <ShieldCheck size={16} />
                        <span style={{ fontWeight: 600 }}> Secure Health Platform</span>
                    </div>

                    <h1 style={{ marginBottom: '1.5rem' }}>
                        Secure Your Medical Records <br />
                        <span style={{ color: 'var(--secondary)' }}>Anytime, Anywhere</span>
                    </h1>
                    <p style={{ maxWidth: '540px' }}>
                        MedVault helps patients store, manage, and share medical records securely with doctors.
                        Experience peace of mind with our consent-based medical data protection.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/register')}>
                            Get Started <ArrowRight size={18} />
                        </button>
                        <button
                            className="btn btn-outline"
                            style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
                            onClick={scrollToFeatures}
                        >
                            Learn more ↓
                        </button>
                    </div>
                </div>

                {/* Visual Content - Medical Illustrations/Cards */}
                <div className="hero-visual" style={{ position: 'relative' }}>
                    {/* Main Interface Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '2rem',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--border-color)',
                        position: 'relative'
                    }}>
                        {/* Header Mock */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-subtle)' }} />
                                <div>
                                    <div style={{ width: '120px', height: '14px', background: 'var(--bg-subtle)', borderRadius: '4px', marginBottom: '6px' }} />
                                    <div style={{ width: '80px', height: '10px', background: 'var(--bg-subtle)', borderRadius: '4px' }} />
                                </div>
                            </div>
                            <Activity color="var(--primary)" />
                        </div>

                        {/* Content Mock - Records List */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                marginBottom: '0.75rem'
                            }}>
                                <div style={{ padding: '0.5rem', background: '#f0f9ff', borderRadius: '8px' }}>
                                    <Database size={20} color="var(--primary)" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ width: '60%', height: '10px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '6px' }} />
                                    <div style={{ width: '40%', height: '8px', background: '#f1f5f9', borderRadius: '4px' }} />
                                </div>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Lock size={12} color="var(--primary)" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Floating Element 1 - Doctor */}
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        background: 'white',
                        padding: '1rem',
                        borderRadius: '16px',
                        boxShadow: 'var(--shadow-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }} className="float-anim">
                        <div style={{ width: '10px', height: '10px', background: 'var(--success)', borderRadius: '50%' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Dr. HARI Approved</span>
                    </div>

                </div>
            </div>

            <style>{`
        .float-anim { animation: float 6s ease-in-out infinite; }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @media (max-width: 968px) {
          .container { grid-template-columns: 1fr !important; text-align: center; }
          .hero-visual { display: none; }
          p { margin-left: auto; margin-right: auto; }
          .btn { width: 100%; justify-content: center; }
          div[style*="display: flex; gap: 1rem"] { flex-direction: column; }
        }
      `}</style>
        </section>
    );
};

export default Hero;

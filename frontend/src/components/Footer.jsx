import React from 'react';
import { Shield, Twitter, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import '../index.css';

const Footer = () => {
    return (
        <footer style={{ background: '#f8fafc', padding: '5rem 0 2rem', borderTop: '1px solid var(--border-color)' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>

                    {/* About MedVault */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={24} color="var(--primary)" fill="var(--primary)" />
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>MedVault</span>
                        </div>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                            MedVault is a secure Personal Electronic Health Record (EHR) system designed to empower patients with control over their medical data.
                        </p>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h4 style={{ marginBottom: '1.2rem', color: 'var(--text-main)' }}>Contact Us</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Mail size={18} /> support@medvault.com
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Phone size={18} /> +91 9876543210
                            </li>
                            <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                                <MapPin size={18} style={{ flexShrink: 0 }} />
                                101 TBM ,<br /> CHENNAI, TAMIL NADU 600001
                            </li>
                        </ul>
                    </div>

                    {/* Legal / Policy */}
                    <div>
                        <h4 style={{ marginBottom: '1.2rem', color: 'var(--text-main)' }}>Legal</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            <li><a href="#" className="hover-underline">Privacy Policy</a></li>
                            <li><a href="#" className="hover-underline">Terms and Conditions</a></li>
                            <li><a href="#" className="hover-underline">Cookie Policy</a></li>
                            <li><a href="#" className="hover-underline">HIPAA Compliance</a></li>
                        </ul>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '2rem',
                    borderTop: '1px solid #e2e8f0',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>© 2026 MedVault. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)' }}>
                        <Twitter size={20} style={{ cursor: 'pointer' }} />
                        <Facebook size={20} style={{ cursor: 'pointer' }} />
                        <Linkedin size={20} style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            </div>
            <style>{`
        .hover-underline:hover { text-decoration: underline; color: var(--primary); }
      `}</style>
        </footer>
    );
};

export default Footer;

import React, { useState, useEffect } from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../index.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: 'white',
            borderBottom: isScrolled ? '1px solid var(--border-color)' : 'none',
            boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.3s ease',
            height: 'var(--header-height)'
        }}>
            <div className="container" style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Shield size={32} color="var(--primary)" fill="var(--bg-subtle)" />
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--primary-dark)' }}>
                        MedVault
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <a href="/#features" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Features</a>
                    <a href="/#how-it-works" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>How it Works</a>
                    <a href="/#security" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Security</a>
                </div>

                {/* Auth Buttons */}
                <div className="desktop-menu" style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/login" className="btn btn-outline" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                        Login
                    </Link>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                        Register
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-main)', display: 'none' }}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'var(--header-height)',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <a href="/#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
                    <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
                    <a href="/#security" onClick={() => setMobileMenuOpen(false)}>Security</a>
                    <div style={{ height: '1px', background: 'var(--border-color)' }} />
                    <Link to="/login" className="btn btn-outline" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;


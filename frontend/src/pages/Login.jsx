import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'patient'
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, role } = formData;
        const result = await login(email, password, role);
        if (result.success) {
            // Redirect based on selected role
            if (role === 'doctor') {
                navigate('/doctor/dashboard');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container" style={{ maxWidth: '400px' }}>
                <div style={{
                    backgroundColor: 'var(--bg-card)',
                    padding: '2.5rem',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-color)'
                }}>
                    <h2 className="text-center" style={{ marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>Welcome Back</h2>
                    <p className="text-center" style={{ marginBottom: '2rem' }}>Login to access your records</p>

                    {/* Role Selection */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', backgroundColor: '#f1f5f9', padding: '0.25rem', borderRadius: '12px' }}>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'patient' })}
                            style={{
                                flex: 1,
                                padding: '0.6rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: formData.role === 'patient' ? 'white' : 'transparent',
                                color: formData.role === 'patient' ? 'var(--primary)' : '#64748b',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: formData.role === 'patient' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Patient
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'doctor' })}
                            style={{
                                flex: 1,
                                padding: '0.6rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: formData.role === 'doctor' ? 'white' : 'transparent',
                                color: formData.role === 'doctor' ? 'var(--primary)' : '#64748b',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: formData.role === 'doctor' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Doctor
                        </button>
                    </div>



                    {error && (
                        <div style={{
                            backgroundColor: '#fee2e2',
                            color: '#ef4444',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="email" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '1rem',
                                    width: '100%'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="password" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '1rem',
                                    width: '100%'
                                }}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                            Login as {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                        </button>
                    </form>

                    <div className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

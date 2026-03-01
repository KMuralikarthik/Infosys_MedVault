import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        otp: '',
        role: 'patient'
    });
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otpSent) {
            // Initial Registration Step
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {
                // Call backend to send OTP
                const res = await api.post('/auth/send-otp', { email: formData.email });
                if (res.data.success) {
                    setOtpSent(true);
                }
            } catch (err) {
                alert(err.response?.data?.message || "Failed to send OTP. Please check your email.");
            }

        } else {
            // OTP Verification Step
            if (formData.otp.trim() === '') {
                alert("Please enter the OTP");
                return;
            }

            const result = await register(formData.name, formData.email, formData.password, formData.role, formData.otp);
            if (result.success) {
                if (formData.role === 'doctor') {
                    navigate('/doctor/dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                alert(result.message);
            }
        }
    };

    return (
        <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container" style={{ maxWidth: '450px' }}>
                <div style={{
                    backgroundColor: 'var(--bg-card)',
                    padding: '2.5rem',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-color)'
                }}>
                    <h2 className="text-center" style={{ marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>Create Account</h2>
                    <p className="text-center" style={{ marginBottom: '2rem' }}>Join MedVault to secure your health data</p>

                    {/* Role Selection */}
                    {!otpSent && (
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
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="name" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="confirmPassword" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
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

                        {otpSent && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label htmlFor="otp" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Enter OTP</label>
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    required
                                    value={formData.otp}
                                    onChange={handleChange}
                                    placeholder="Enter OTP (1234)"
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-color)',
                                        fontSize: '1rem',
                                        width: '100%'
                                    }}
                                />
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                            {otpSent ? 'Verify & Register' : `Register as ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}`}
                        </button>
                    </form>

                    <div className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

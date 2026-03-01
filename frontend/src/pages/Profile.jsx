import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Camera, Moon, Shield, LogOut } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || 'HARI PRASATH MANI',
        email: user?.email || 'hariprasathmani102@gmail.com',
        phone: '9344437357',
        address: '123 Medical Drive, tambaram, chennai 90210'
    });

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setIsEditing(false);
        // Save logic to backend/context
        alert("Profile updated successfully!");
    };

    return (
        <div>
            <div className="mb-8">
                <h1>Profile Settings</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your personal account information.</p>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

                {/* Profile Card */}
                <div className="card">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '4px solid white', boxShadow: 'var(--shadow-md)' }}>
                                <img src={user?.avatar} alt={user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <button style={{
                                position: 'absolute',
                                bottom: '0',
                                right: '0',
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}>
                                <Camera size={18} />
                            </button>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{profileData.name}</h2>
                        <p style={{ color: 'var(--text-muted)' }}>{user?.role === 'patient' ? 'Patient ID: #883920' : 'Doctor ID: #DOC-112'}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Moon size={20} />
                                <span>Dark Mode</span>
                            </div>
                            <div style={{
                                width: '44px',
                                height: '24px',
                                backgroundColor: isDarkMode ? 'var(--primary)' : '#cbd5e1',
                                borderRadius: '99px',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }} onClick={() => {
                                const newMode = !isDarkMode;
                                setIsDarkMode(newMode);
                                document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
                            }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    top: '2px',
                                    left: isDarkMode ? '22px' : '2px',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="card">
                    <div className="card-header">
                        <h2>Personal Information</h2>
                        <button
                            className={`btn ${isEditing ? 'btn-primary' : 'btn-outline'}`}
                            onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        >
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                    </div>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    name="name"
                                    disabled={!isEditing}
                                    value={profileData.name}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    name="email"
                                    disabled={!isEditing}
                                    value={profileData.email}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                                <input
                                    type="tel"
                                    name="phone"
                                    disabled={!isEditing}
                                    value={profileData.phone}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>Address</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    name="address"
                                    disabled={!isEditing}
                                    value={profileData.address}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;

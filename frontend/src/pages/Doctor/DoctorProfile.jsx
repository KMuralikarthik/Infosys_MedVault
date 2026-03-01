import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Award, BookOpen, Clock, Settings, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DoctorProfile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || 'Doctor',
        specialty: user?.specialty || 'General Practitioner',
        bio: user?.bio || 'Professional medical practitioner at MedVault.',
        email: user?.email || '',
        phone: user?.phone || '+1 (555) 000-0000',
        location: user?.location || 'Main Clinic'
    });

    const handleSave = () => {
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSettingClick = (feature) => {
        alert(`${feature} feature coming soon!`);
    };

    return (
        <div className="doctor-profile">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Doctor Profile</h1>
                <p style={{ color: '#64748b' }}>Manage your professional information and settings.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Left: Basic Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            margin: '0 auto 1.5rem',
                            padding: '4px',
                            border: '4px solid #e0f2fe'
                        }}>
                            <img
                                src={user?.avatar}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                style={{ fontSize: '1.5rem', fontWeight: 700, width: '100%', textAlign: 'center', marginBottom: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                            />
                        ) : (
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{profileData.name}</h2>
                        )}

                        {isEditing ? (
                            <input
                                type="text"
                                value={profileData.specialty}
                                onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
                                style={{ color: '#0ea5e9', fontWeight: 600, fontSize: '1rem', width: '100%', textAlign: 'center', marginBottom: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                            />
                        ) : (
                            <p style={{ color: '#0ea5e9', fontWeight: 600, fontSize: '1rem', marginBottom: '1.5rem' }}>{profileData.specialty}</p>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.9rem' }}>
                                <Mail size={18} color="#94a3b8" />
                                {isEditing ? (
                                    <input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} style={{ border: '1px solid #e2e8f0', borderRadius: '4px', flex: 1 }} />
                                ) : profileData.email}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.9rem' }}>
                                <Phone size={18} color="#94a3b8" />
                                {isEditing ? (
                                    <input type="text" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} style={{ border: '1px solid #e2e8f0', borderRadius: '4px', flex: 1 }} />
                                ) : profileData.phone}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.9rem' }}>
                                <MapPin size={18} color="#94a3b8" />
                                {isEditing ? (
                                    <input type="text" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} style={{ border: '1px solid #e2e8f0', borderRadius: '4px', flex: 1 }} />
                                ) : profileData.location}
                            </div>
                        </div>

                        {isEditing ? (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
                                <button className="btn btn-primary" onClick={handleSave} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <Save size={18} /> Save
                                </button>
                                <button className="btn btn-outline" onClick={handleCancel} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <X size={18} /> Cancel
                                </button>
                            </div>
                        ) : (
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)} style={{ width: '100%', marginTop: '2rem' }}>Edit Profile</button>
                        )}
                    </div>

                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Settings size={18} color="#0ea5e9" />
                            Account Settings
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button onClick={() => handleSettingClick('Change Password')} className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', border: '1px solid #e2e8f0', background: 'none' }}>Change Password</button>
                            <button onClick={() => handleSettingClick('Notification Preferences')} className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', border: '1px solid #e2e8f0', background: 'none' }}>Notification Preferences</button>
                            <button onClick={() => handleSettingClick('Two-Factor Auth')} className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', border: '1px solid #e2e8f0', background: 'none' }}>Two-Factor Auth</button>
                        </div>
                    </div>
                </div>

                {/* Right: Credentials & Bio */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Professional Overview</h3>
                        <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '2rem' }}>
                            {isEditing ? (
                                <textarea
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    style={{ width: '100%', minHeight: '100px', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.5rem' }}
                                />
                            ) : profileData.bio}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem' }}>Education</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {(user?.education || []).map((edu, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '0.75rem' }}>
                                            <BookOpen size={20} color="#0ea5e9" style={{ flexShrink: 0 }} />
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{edu.school}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{edu.degree}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!user?.education || user.education.length === 0) && (
                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No education details added.</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem' }}>Certifications</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {(user?.certifications || []).map((cert, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '0.75rem' }}>
                                            <Award size={20} color="#0ea5e9" style={{ flexShrink: 0 }} />
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cert.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{cert.year}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!user?.certifications || user.certifications.length === 0) && (
                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No certifications added.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Platform Stats</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0ea5e9' }}>{user?.rating || '0.0'}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Rating</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0ea5e9' }}>{user?.patientsTreated || '0'}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Patients Treated</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0ea5e9' }}>{user?.experience || '0'}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Experience</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;

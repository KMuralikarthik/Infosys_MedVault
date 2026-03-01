import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import DoctorSidebar from '../components/Doctor/DoctorSidebar';
import { Menu, Search, User as UserIcon, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const DoctorLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="dashboard-layout doctor-theme">
            <DoctorSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="main-content">
                <header className="topbar" style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0' }}>
                    <button
                        className="menu-toggle"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="topbar-search" style={{ backgroundColor: '#f1f5f9' }}>
                        <Search size={20} className="text-muted" />
                        <input type="text" placeholder="Search patients, records..." style={{ background: 'transparent' }} />
                    </div>

                    <div className="topbar-actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <Link to="/doctor/notifications" style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Bell size={22} />
                            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>
                        </Link>

                        <Link to="/doctor/profile" className="topbar-user" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                            <div className="doctor-info-text" style={{ textAlign: 'right', marginRight: '0.75rem' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Primary Physician</div>
                            </div>
                            <div className="user-avatar" style={{ border: '2px solid #38bdf8' }}>
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Doctor" />
                                ) : (
                                    <UserIcon size={24} />
                                )}
                            </div>
                        </Link>
                    </div>
                </header>

                <div className="content-area" style={{ backgroundColor: '#f8fafc' }}>
                    <Outlet />
                </div>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
                .doctor-theme {
                    --primary: #0ea5e9;
                    --primary-dark: #0284c7;
                    --primary-light: #e0f2fe;
                }
                .doctor-theme .btn-primary {
                    background-color: var(--primary);
                }
                .doctor-theme .btn-primary:hover {
                    background-color: var(--primary-dark);
                }
                @media (max-width: 640px) {
                    .doctor-info-text {
                        display: none;
                    }
                }
            `}} />
        </div>
    );
};

export default DoctorLayout;

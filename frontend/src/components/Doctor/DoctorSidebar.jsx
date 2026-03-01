import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    CalendarCheck,
    Users,
    Clock,
    MessageSquare,
    Bell,
    User,
    LogOut,
    X,
    Stethoscope
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DoctorSidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/doctor/dashboard' },
        { icon: <ClipboardList size={20} />, label: 'Appointment Requests', path: '/doctor/requests' },
        { icon: <CalendarCheck size={20} />, label: "Today's Appointments", path: '/doctor/appointments' },
        { icon: <Users size={20} />, label: 'Patients', path: '/doctor/patients' },
        { icon: <Clock size={20} />, label: 'Availability', path: '/doctor/availability' },
        { icon: <MessageSquare size={20} />, label: 'Consultations', path: '/doctor/consultations' },
        { icon: <Bell size={20} />, label: 'Notifications', path: '/doctor/notifications' },
        { icon: <User size={20} />, label: 'Profile', path: '/doctor/profile' },
    ];

    return (
        <>
            {/* Mobile Overlay matching Patient Sidebar */}
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{ backgroundColor: '#1e293b', zIndex: 100 }}>
                <div className="sidebar-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="logo" style={{ color: 'white' }}>
                        <Stethoscope size={24} color="#38bdf8" />
                        <span>MedVault <small style={{ fontSize: '0.6rem', color: '#38bdf8' }}>Doctor</small></span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                            style={({ isActive }) => ({
                                color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                                backgroundColor: isActive ? '#38bdf8' : 'transparent',
                                margin: '4px 12px',
                                borderRadius: '8px'
                            })}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button className="nav-link logout" onClick={logout} style={{ color: '#f87171', margin: '4px 12px', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default DoctorSidebar;

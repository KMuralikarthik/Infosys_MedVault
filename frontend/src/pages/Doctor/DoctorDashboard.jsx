import React from 'react';
import { Link } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Users, Clock, ClipboardCheck, ArrowUpRight, User } from 'lucide-react';

const DoctorDashboard = () => {
    const { appointments, doctors } = useAppointments();
    const { user } = useAuth();

    // Use user ID from AuthContext
    const doctorId = user?.id;
    if (!doctorId) return <div>Please log in to view dashboard.</div>;

    const today = new Date().toISOString().split('T')[0];
    const todayApps = appointments.filter(app => {
        const appDoctorId = app.doctor?.id || app.doctorId;
        const appDate = app.appointmentDate || app.date;
        return appDoctorId === doctorId && appDate === today && app.status?.toLowerCase() !== 'rejected';
    });
    const pendingApps = appointments.filter(app => {
        const appDoctorId = app.doctor?.id || app.doctorId;
        return appDoctorId === doctorId && app.status?.toLowerCase() === 'pending';
    });
    const completedApps = appointments.filter(app => {
        const appDoctorId = app.doctor?.id || app.doctorId;
        return appDoctorId === doctorId && (app.status?.toLowerCase() === 'completed' || app.status?.toLowerCase() === 'done');
    });

    // Calculate unique active patients
    const activePatientIds = new Set();
    appointments.forEach(app => {
        const appDoctorId = app.doctor?.id || app.doctorId;
        if (appDoctorId === doctorId && (app.status?.toLowerCase() === 'completed' || app.status?.toLowerCase() === 'approved')) {
            const tempPatientId = app.patient?.id || app.patientId;
            if (tempPatientId) activePatientIds.add(tempPatientId);
        }
    });

    const stats = [
        { title: "Today's Appointments", value: todayApps.length.toString(), icon: "Calendar", color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Pending Requests", value: pendingApps.length.toString(), icon: "Clock", color: "text-amber-600", bg: "bg-amber-100" },
        { title: "Active Patients", value: activePatientIds.size.toString(), icon: "Users", color: "text-emerald-600", bg: "bg-emerald-100" },
        { title: "Completed (Total)", value: completedApps.length.toString(), icon: "ClipboardCheck", color: "text-rose-600", bg: "bg-rose-100" }
    ];

    const getIcon = (name) => {
        switch (name) {
            case 'Calendar': return <Calendar size={24} />;
            case 'Clock': return <Clock size={24} />;
            case 'Users': return <Users size={24} />;
            case 'ClipboardCheck': return <ClipboardCheck size={24} />;
            default: return <Calendar size={24} />;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'In Progress': return { color: '#0ea5e9', backgroundColor: '#e0f2fe' };
            case 'Upcoming': return { color: '#6366f1', backgroundColor: '#e0e7ff' };
            case 'Approved': return { color: '#15803d', backgroundColor: '#f0fdf4' };
            case 'Completed': return { color: '#64748b', backgroundColor: '#f1f5f9' };
            default: return { color: '#64748b', backgroundColor: '#f1f5f9' };
        }
    };

    return (
        <div className="doctor-dashboard">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>Doctor Dashboard</h1>
                <p style={{ color: '#64748b' }}>Welcome back, {user?.name}. Here is what's happening today.</p>
            </header>

            {/* Stats Grid */}
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {stats.map((stat, index) => (
                    <div key={index} className="card stat-card" style={{
                        display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'pointer'
                    }}>
                        <div className={`stat-icon ${stat.bg} ${stat.color}`} style={{
                            padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {getIcon(stat.icon)}
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{stat.value}</div>
                            <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>{stat.title}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Today's Schedule */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Today's Schedule</h2>
                        <Link to="/doctor/appointments" style={{ color: '#0ea5e9', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}>View All</Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {todayApps.length === 0 ? (
                            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem', fontStyle: 'italic' }}>No appointments scheduled for today.</p>
                        ) : (
                            todayApps.map((app) => (
                                <div key={app.id} style={{
                                    display: 'flex', alignItems: 'center', padding: '1rem',
                                    backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'
                                }}>
                                    <div style={{
                                        width: '12px', height: '12px', borderRadius: '50%',
                                        backgroundColor: app.status === 'Approved' ? '#15803d' : '#e2e8f0',
                                        marginRight: '1rem'
                                    }}></div>
                                    <div style={{ width: '85px', fontWeight: 600, fontSize: '0.85rem' }}>{app.timeSlot || app.time}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>{app.patient?.name || app.patientName || app.patient}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{app.consultationType || 'Standard'}</div>
                                    </div>
                                    <div style={{
                                        padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem',
                                        fontWeight: 600, ...getStatusStyle(app.status)
                                    }}>
                                        {app.status}
                                    </div>
                                    <Link to={`/doctor/consultations/${app.id}`} style={{ marginLeft: '1rem', color: '#64748b' }}>
                                        <ArrowUpRight size={18} />
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Patient Activity */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Activity</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {appointments.slice(-3).reverse().map((app, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                                    <User size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem' }}><span style={{ fontWeight: 600 }}>{app.patient?.name || app.patientName || app.patient}</span></div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                        {app.status === 'Pending' ? 'New Request Received' : `Status updated to ${app.status}`}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                                        {new Date(app.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
};

export default DoctorDashboard;

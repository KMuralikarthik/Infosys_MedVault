import React from 'react';
import { Link } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, User, Phone, Video, MapPin, Check } from 'lucide-react';

const DoctorAppointments = () => {
    const { appointments } = useAppointments();
    const { user } = useAuth();

    // Use user ID from AuthContext
    const doctorId = user?.id;
    if (!doctorId) return <div>Please log in to view appointments.</div>;

    const docApps = appointments.filter(app => {
        const appDoctorId = app.doctor?.id || app.doctorId;
        const status = app.status?.toUpperCase();
        return appDoctorId === doctorId && (status === 'APPROVED' || status === 'COMPLETED');
    }).sort((a, b) => new Date(a.appointmentDate || a.date) - new Date(b.appointmentDate || b.date));

    return (
        <div className="doctor-appointments">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Confirmed Appointments</h1>
                <p style={{ color: '#64748b' }}>Manage your daily schedule and consultations.</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {docApps.length === 0 ? (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                        No confirmed appointments scheduled.
                    </div>
                ) : (
                    docApps.map((app) => (
                        <div key={app.id} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <div style={{
                                padding: '1rem',
                                backgroundColor: '#f1f5f9',
                                borderRadius: '12px',
                                textAlign: 'center',
                                minWidth: '100px'
                            }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0ea5e9' }}>{app.timeSlot || app.time}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>{app.date}</div>
                            </div>

                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                    <User size={28} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>{app.patient?.name || app.patientName || app.patient}</h3>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Calendar size={14} />
                                            Patient ID: #{app.patient?.id || app.patientId}
                                        </span>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Clock size={14} />
                                            {app.consultationType || 'Standard'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Status</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', fontWeight: 600, color: app.status === 'Completed' ? '#15803d' : '#0ea5e9' }}>
                                        {app.status === 'Completed' && <Check size={16} />}
                                        {app.status}
                                    </div>
                                </div>
                                {app.status !== 'Completed' ? (
                                    <Link to={`/doctor/consultations/${app.id}`} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', textDecoration: 'none' }}>
                                        Start Consultation
                                    </Link>
                                ) : (
                                    <button disabled className="btn" style={{ padding: '0.6rem 1.25rem', backgroundColor: '#e2e8f0', color: '#94a3b8', cursor: 'default' }}>
                                        Consulted
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DoctorAppointments;

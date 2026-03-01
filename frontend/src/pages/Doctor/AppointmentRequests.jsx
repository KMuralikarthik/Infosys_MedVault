import React, { useState } from 'react';
import { useAppointments } from '../../context/AppointmentContext';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Calendar, Clock, User, AlertCircle } from 'lucide-react';

const AppointmentRequests = () => {
    const { appointments, updateAppointmentStatus } = useAppointments();
    const { user } = useAuth();
    const [rejectionModal, setRejectionModal] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    // Use user ID from AuthContext
    const doctorId = user?.id;
    if (!doctorId) return <div>Please log in to view appointment requests.</div>;

    const requests = appointments.filter(app => {
        // Handle both flat doctorId and nested doctor.id from backend
        const appDoctorId = app.doctor?.id || app.doctorId;
        return appDoctorId === doctorId &&
            (app.status?.toLowerCase() === 'pending' ||
                app.status?.toLowerCase() === 'approved' ||
                app.status?.toLowerCase() === 'rejected');
    }).sort((a, b) => new Date(b.appointmentDate || b.date) - new Date(a.appointmentDate || a.date));

    const handleApprove = (id) => {
        updateAppointmentStatus(id, 'Approved');
    };

    const handleReject = (e) => {
        e.preventDefault();
        updateAppointmentStatus(rejectionModal.id, 'Rejected', rejectionReason);
        setRejectionModal(null);
        setRejectionReason('');
    };

    return (
        <div className="appointment-requests">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Appointment Requests</h1>
                <p style={{ color: '#64748b' }}>Review and manage incoming consultation requests.</p>
            </header>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Patient</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Schedule</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Type</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Status</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                    No appointment requests found.
                                </td>
                            </tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                                                <User size={16} />
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{req.patient?.name || req.patientName || req.patient}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Calendar size={14} className="text-muted" />
                                                {req.date}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Clock size={14} className="text-muted" />
                                                {req.timeSlot || req.time}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: '#475569' }}>
                                        {req.consultationType || 'In-person'}
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            backgroundColor: req.status?.toLowerCase() === 'pending' ? '#fff7ed' : req.status?.toLowerCase() === 'approved' ? '#f0fdf4' : '#fef2f2',
                                            color: req.status?.toLowerCase() === 'pending' ? '#c2410c' : req.status?.toLowerCase() === 'approved' ? '#15803d' : '#b91c1c'
                                        }}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                        {req.status?.toLowerCase() === 'pending' ? (
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => handleApprove(req.id)}
                                                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #15803d', color: '#15803d', background: 'none', cursor: 'pointer' }}
                                                    title="Approve"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setRejectionModal(req)}
                                                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #b91c1c', color: '#b91c1c', background: 'none', cursor: 'pointer' }}
                                                    title="Reject"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                                {req.status?.toLowerCase() === 'rejected' && req.rejectionReason ? `Rejected: ${req.rejectionReason}` : 'Resolved'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Rejection Modal */}
            {rejectionModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={20} color="#b91c1c" />
                            Reject Appointment
                        </h3>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Please provide a reason for rejecting the appointment with <strong>{rejectionModal.patientName || rejectionModal.patient}</strong>.
                        </p>
                        <form onSubmit={handleReject}>
                            <textarea
                                required
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="e.g., Doctor unavailable, Please book another time slot..."
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '100px', marginBottom: '1.5rem', fontSize: '0.9rem' }}
                            />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={() => setRejectionModal(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-danger" style={{ flex: 1, backgroundColor: '#ef4444', color: 'white' }}>Confirm Rejection</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentRequests;

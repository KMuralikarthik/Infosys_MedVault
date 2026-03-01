import React, { useState } from 'react';
import { useAppointments } from '../context/AppointmentContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, XCircle, FileText, Star, MessageSquare } from 'lucide-react';

const MyAppointments = () => {
    const { user } = useAuth();
    const { appointments, updateAppointmentStatus, submitFeedback, feedback } = useAppointments();

    const [selectedFeedbackApp, setSelectedFeedbackApp] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [summaryModal, setSummaryModal] = useState(null);

    const myApps = appointments.filter(app => {
        const appPatientId = app.patient?.id || app.patientId;
        return appPatientId === user?.id;
    }).sort((a, b) => new Date(b.appointmentDate || b.date) - new Date(a.appointmentDate || a.date));

    const handleCancel = (id) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            updateAppointmentStatus(id, 'REJECTED'); // Cancelled maps to Rejected in backend
        }
    };

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating.');
            return;
        }

        submitFeedback({
            appointmentId: selectedFeedbackApp.id,
            doctorId: selectedFeedbackApp.doctor?.id || selectedFeedbackApp.doctorId,
            patientId: user?.id,
            patientName: user?.name || 'User',
            rating,
            comment,
            date: new Date().toISOString().split('T')[0]
        });

        alert('Thank you for your feedback!');
        setSelectedFeedbackApp(null);
        setRating(0);
        setComment('');
    };

    const hasFeedback = (appId) => feedback.some(f => f.appointmentId === appId);

    return (
        <div>
            <div className="mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>My Appointments</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your scheduled visits and provide feedback.</p>
                </div>
                <button
                    onClick={() => { if (window.confirm("This will reset all your mock data including bookings and ratings. Continue?")) { localStorage.clear(); window.location.reload(); } }}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#64748b' }}
                >
                    Reset Demo Data
                </button>
            </div>

            <div className="card">
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Doctor</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Date & Time</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Type</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myApps.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                        No appointments found.
                                    </td>
                                </tr>
                            ) : (
                                myApps.map(app => (
                                    <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1.25rem 1rem' }}>
                                            <div style={{ fontWeight: 600 }}>{app.doctor?.name || app.doctorName || app.doctor}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{app.doctor?.specialty || app.specialty}</div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.9rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Calendar size={14} className="text-muted" />
                                                    {app.appointmentDate || app.date}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Clock size={14} className="text-muted" />
                                                    {app.timeSlot || app.time}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem' }}>{app.consultationType || 'Standard'}</td>
                                        <td style={{ padding: '1.25rem 1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                                                backgroundColor: app.status?.toLowerCase() === 'approved' ? '#f0fdf4' : app.status?.toLowerCase() === 'pending' ? '#fff7ed' : app.status?.toLowerCase() === 'rejected' ? '#fef2f2' : '#f1f5f9',
                                                color: app.status?.toLowerCase() === 'approved' ? '#15803d' : app.status?.toLowerCase() === 'pending' ? '#c2410c' : app.status?.toLowerCase() === 'rejected' ? '#b91c1c' : '#475569'
                                            }}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                                                {['upcoming', 'pending', 'approved'].includes(app.status?.toLowerCase()) && (
                                                    <button
                                                        onClick={() => handleCancel(app.id)}
                                                        className="btn btn-outline"
                                                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: '#ef4444', borderColor: '#ef4444' }}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                {app.status?.toLowerCase() === 'completed' && (
                                                    <>
                                                        <button
                                                            onClick={() => setSelectedFeedbackApp(app)}
                                                            className="btn btn-primary"
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                fontSize: '0.85rem',
                                                                backgroundColor: '#f59e0b',
                                                                borderColor: '#d97706',
                                                                color: 'white',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.4rem'
                                                            }}
                                                        >
                                                            <Star size={14} fill="currentColor" />
                                                            {hasFeedback(app.id) ? 'Update Rating' : 'Rate Visit'}
                                                        </button>
                                                        <button
                                                            onClick={() => setSummaryModal(app)}
                                                            className="btn btn-outline"
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                fontSize: '0.85rem',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.4rem'
                                                            }}
                                                        >
                                                            <FileText size={14} />
                                                            Summary
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Feedback Modal */}
            {selectedFeedbackApp && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Rate your consultation</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>How was your visit with <strong>{selectedFeedbackApp.doctorName}</strong>?</p>

                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    <Star size={32} fill={rating >= star ? '#f59e0b' : 'none'} color={rating >= star ? '#f59e0b' : '#cbd5e1'} />
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleFeedbackSubmit}>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience (optional)..."
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '100px', marginBottom: '1.5rem', fontSize: '0.9rem' }}
                            />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={() => setSelectedFeedbackApp(null)} className="btn btn-outline" style={{ flex: 1 }}>Not now</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: '#0ea5e9' }}>Submit Rating</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Summary Modal */}
            {summaryModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 100
                }} onClick={() => setSummaryModal(null)}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Consultation Summary</h2>
                            <button onClick={() => setSummaryModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={24} color="#94a3b8" /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Doctor</p>
                                    <p style={{ fontWeight: 600 }}>{summaryModal.doctorName}</p>
                                </div>
                                <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Date</p>
                                    <p style={{ fontWeight: 600 }}>{summaryModal.date}</p>
                                </div>
                            </div>

                            <div>
                                <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <FileText size={16} color="#0ea5e9" /> Diagnosis
                                </p>
                                <p style={{ fontSize: '0.95rem', color: '#1e293b' }}>{summaryModal.consultationData?.diagnosis || 'Routine checkup and general evaluation.'}</p>
                            </div>

                            <div>
                                <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <MessageSquare size={16} color="#0ea5e9" /> Clinical Notes
                                </p>
                                <p style={{ fontSize: '0.9rem', color: '#475569', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                                    {summaryModal.consultationData?.notes || 'No specific clinical notes provided.'}
                                </p>
                            </div>

                            {summaryModal.consultationData?.prescriptions && summaryModal.consultationData.prescriptions.length > 0 && (
                                <div>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Star size={16} color="#0ea5e9" fill="#0ea5e9" /> Prescribed Medicines
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {summaryModal.consultationData.prescriptions.map((p, idx) => (
                                            <div key={idx} style={{ padding: '0.5rem 0.75rem', backgroundColor: '#f0f9ff', borderRadius: '6px', fontSize: '0.85rem' }}>
                                                <strong>{p.medicine}</strong> - {p.dosage} ({p.frequency}) for {p.duration}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button onClick={() => setSummaryModal(null)} className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Close Summary</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAppointments;

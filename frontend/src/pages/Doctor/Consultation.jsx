import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Clipboard, Pill, Save, History, FileText, Plus, Trash2 } from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';

const Consultation = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const { appointments, completeConsultation } = useAppointments();

    const [notes, setNotes] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [prescriptions, setPrescriptions] = useState([{ id: Date.now(), medicine: '', dosage: '', frequency: '', duration: '' }]);

    const appointment = appointments.find(app => app.id === parseInt(appointmentId));

    useEffect(() => {
        if (appointment && appointment.status?.toUpperCase() === 'COMPLETED') {
            // If already completed, maybe redirect or show read-only
            // For now, let's just let them see it if they manually navigate
        }
    }, [appointment]);

    if (!appointment) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Appointment not found.</div>;
    }

    const addPrescription = () => {
        setPrescriptions([...prescriptions, { id: Date.now(), medicine: '', dosage: '', frequency: '', duration: '' }]);
    };

    const removePrescription = (id) => {
        if (prescriptions.length > 1) {
            setPrescriptions(prescriptions.filter(p => p.id !== id));
        }
    };

    const updatePrescription = (id, field, value) => {
        setPrescriptions(prescriptions.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleComplete = () => {
        if (!diagnosis || !notes) {
            alert('Please provide diagnosis and clinical notes.');
            return;
        }

        const validPrescriptions = prescriptions.filter(p => p.medicine.trim() !== '');

        completeConsultation(appointment.id, {
            diagnosis,
            notes,
            prescriptions: validPrescriptions
        });

        alert(`Consultation for ${appointment.patient?.name || appointment.patientName} completed successfully.`);
        navigate('/doctor/appointments');
    };

    return (
        <div className="consultation">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Patient Consultation</h1>
                    <p style={{ color: '#64748b' }}>Currently consulting: <span style={{ fontWeight: 600, color: '#0f172a' }}>{appointment.patient?.name || appointment.patientName}</span></p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleComplete}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                >
                    <Save size={18} />
                    Complete Consultation
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Left: Patient Profile */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                                <User size={32} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>{appointment.patient?.name || appointment.patientName}</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Patient ID: #{appointment.patient?.id || appointment.patientId}</p>
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                            <div style={{ marginBottom: '0.75rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Visit Context</label>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{appointment.consultationType} • {appointment.timeSlot}</div>
                            </div>
                            <div style={{ marginBottom: '0.75rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Vitals (Simulated)</label>
                                <div style={{ fontSize: '0.9rem', color: '#475569' }}>BP: 120/80 mmHg | Temp: 98.6°F</div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <History size={18} color="#0ea5e9" />
                            Clinical Record
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #e2e8f0', textAlign: 'center' }}>
                            History will populate from past completed consultations.
                        </div>
                    </div>
                </div>

                {/* Right: Notes & Prescription */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clipboard size={18} color="#0ea5e9" />
                            Diagnosis & Clinical Notes
                        </h4>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem' }}>Primary Diagnosis</label>
                        <input
                            type="text"
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            placeholder="e.g., Acute Pharyngitis"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}
                        />
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem' }}>Detailed Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Observations, patient symptoms, physical exam findings..."
                            style={{ width: '100%', minHeight: '120px', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', resize: 'vertical' }}
                        />
                    </div>

                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Pill size={18} color="#0ea5e9" />
                                Prescriptions (e-Prescription)
                            </h4>
                            <button
                                onClick={addPrescription}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none', background: '#e0f2fe', color: '#0369a1', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                                <Plus size={14} />
                                Add Medicine
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {prescriptions.map((p, i) => (
                                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr auto', gap: '0.5rem', alignItems: 'center', padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                                    <input
                                        type="text"
                                        placeholder="Medicine"
                                        value={p.medicine}
                                        onChange={(e) => updatePrescription(p.id, 'medicine', e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Dose"
                                        value={p.dosage}
                                        onChange={(e) => updatePrescription(p.id, 'dosage', e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Freq (e.g. 1-0-1)"
                                        value={p.frequency}
                                        onChange={(e) => updatePrescription(p.id, 'frequency', e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Dur"
                                        value={p.duration}
                                        onChange={(e) => updatePrescription(p.id, 'duration', e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                                    />
                                    <button
                                        onClick={() => removePrescription(p.id)}
                                        style={{ padding: '0.4rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                        title="Remove"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .btn-primary:active { transform: scale(0.98); }
            `}</style>
        </div>
    );
};

export default Consultation;

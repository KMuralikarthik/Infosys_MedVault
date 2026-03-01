import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, User, Calendar, ExternalLink } from 'lucide-react';

const PatientsList = () => {
    const { appointments } = useAppointments();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Derive unique patients from doctor's appointments
    const doctorId = user?.id;
    const myPatientsSet = new Set();
    const myPatients = appointments
        .filter(app => {
            const appDoctorId = app.doctor?.id || app.doctorId;
            return appDoctorId === doctorId;
        })
        .reduce((acc, app) => {
            const patient = app.patient || { id: app.patientId || app.userId, name: app.patientName };
            const patientId = patient.id;

            if (patientId && !myPatientsSet.has(patientId)) {
                myPatientsSet.add(patientId);
                acc.push({
                    id: patientId,
                    name: patient.name || "Patient " + patientId,
                    age: app.patientAge || "--",
                    gender: app.patientGender || "Other",
                    lastVisit: app.appointmentDate || app.date,
                    condition: app.reason || "Consultation"
                });
            }
            return acc;
        }, []);

    const filteredPatients = myPatients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="patients-list">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>My Patients</h1>
                    <p style={{ color: '#64748b' }}>View and manage your patient records.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '0.6rem 1rem 0.6rem 2.5rem',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                width: '280px'
                            }}
                        />
                    </div>
                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={18} />
                        Filter
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {filteredPatients.map((patient) => (
                    <div key={patient.id} className="card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => setSelectedPatient(patient)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.1rem' }}>{patient.name}</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>{patient.age} yrs • {patient.gender}</p>
                                </div>
                            </div>
                            <ExternalLink size={18} color="#94a3b8" />
                        </div>

                        <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.025em', marginBottom: '0.25rem' }}>Primary Condition</div>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{patient.condition}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                            <Calendar size={16} />
                            <span>Last Visit: {patient.lastVisit}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Patient Detail Modal (Simple UI Simulation) */}
            {selectedPatient && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }} onClick={() => setSelectedPatient(null)}>
                    <div style={{
                        backgroundColor: 'white', borderHorizontal: '12px shadow-xl', borderRadius: '16px',
                        width: '100%', maxWidth: '600px', padding: '2rem'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                                    <User size={32} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{selectedPatient.name}</h2>
                                    <p style={{ color: '#64748b' }}>Patient ID: MED-{selectedPatient.id}0429</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedPatient(null)} style={{ background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>Close</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div className="card" style={{ padding: '1rem', border: '1px solid #e2e8f0', background: 'none' }}>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Medical History Summary</div>
                                <p style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>Diagnosed with {selectedPatient.condition} in 2022. No known allergies. Current lifestyle: Moderate activity.</p>
                            </div>
                            <div className="card" style={{ padding: '1rem', border: '1px solid #e2e8f0', background: 'none' }}>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Active Prescriptions</div>
                                <ul style={{ fontSize: '0.9rem', paddingLeft: '1.2rem', margin: 0 }}>
                                    <li>Lisinopril 10mg</li>
                                    <li>Amlodipine 5mg</li>
                                </ul>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to={`/doctor/consultations/${selectedPatient.id}`} className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>Start Consultation</Link>
                            <button className="btn btn-outline" style={{ flex: 1 }}>View All Records</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientsList;

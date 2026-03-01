import React from 'react';
import { Star, Clock } from 'lucide-react';

const DoctorCard = ({ doctor, onBook }) => {
    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                <img
                    src={doctor.image}
                    alt={doctor.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'white',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    {doctor.rating}
                </div>
            </div>

            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{doctor.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{doctor.specialty}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--success)' }}>
                    <Clock size={16} />
                    <span>Available Today</span>
                </div>

                <button
                    className="btn btn-outline"
                    onClick={() => onBook(doctor)}
                    style={{ marginTop: 'auto', width: '100%' }}
                >
                    Book Appointment
                </button>
            </div>
        </div>
    );
};

export default DoctorCard;

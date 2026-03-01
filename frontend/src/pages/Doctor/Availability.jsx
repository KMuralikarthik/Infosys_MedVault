import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';

const AvailabilityManagement = () => {
    const { user } = useAuth();
    const { availability, updateDoctorAvailability } = useAppointments();

    // Use user ID from AuthContext
    const defaultAvailability = {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        duration: 30,
        blockedDates: []
    };

    const doctorId = user?.id;
    const currentAvailability = (doctorId && availability[doctorId]) ? {
        ...defaultAvailability,
        ...availability[doctorId],
        workingDays: availability[doctorId].workingDays || defaultAvailability.workingDays,
        blockedDates: availability[doctorId].blockedDates || defaultAvailability.blockedDates
    } : defaultAvailability;

    const [localSchedule, setLocalSchedule] = useState(currentAvailability);
    const [newBlockedDate, setNewBlockedDate] = useState('');

    useEffect(() => {
        if (doctorId && availability[doctorId]) {
            setLocalSchedule({
                ...defaultAvailability,
                ...availability[doctorId],
                workingDays: availability[doctorId].workingDays || defaultAvailability.workingDays,
                blockedDates: availability[doctorId].blockedDates || defaultAvailability.blockedDates
            });
        }
    }, [availability, doctorId]);

    const toggleDay = (day) => {
        const newDays = localSchedule.workingDays.includes(day)
            ? localSchedule.workingDays.filter(d => d !== day)
            : [...localSchedule.workingDays, day];
        setLocalSchedule({ ...localSchedule, workingDays: newDays });
    };

    const handleSave = async () => {
        if (!doctorId) {
            alert('Error: Doctor ID not found. Please log in again.');
            return;
        }
        try {
            await updateDoctorAvailability(doctorId, localSchedule);
            alert('Availability settings saved successfully!');
        } catch (error) {
            alert('Failed to save settings: ' + (error.response?.data?.message || error.message));
        }
    };

    const addBlockedDate = () => {
        if (newBlockedDate && !localSchedule.blockedDates.includes(newBlockedDate)) {
            setLocalSchedule({
                ...localSchedule,
                blockedDates: [...localSchedule.blockedDates, newBlockedDate]
            });
            setNewBlockedDate('');
        }
    };

    const removeBlockedDate = (date) => {
        setLocalSchedule({
            ...localSchedule,
            blockedDates: localSchedule.blockedDates.filter(d => d !== date)
        });
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="availability-management">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Schedule Management</h1>
                    <p style={{ color: '#64748b' }}>Configure your working hours and consultation rules.</p>
                </div>
                <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Save size={18} />
                    Save Changes
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Working Days & Hours */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={20} className="text-primary" />
                        Working Schedule
                    </h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500 }}>Working Days</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {daysOfWeek.map(day => (
                                <button
                                    key={day}
                                    onClick={() => toggleDay(day)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        border: '1px solid',
                                        borderColor: localSchedule.workingDays.includes(day) ? '#0ea5e9' : '#e2e8f0',
                                        backgroundColor: localSchedule.workingDays.includes(day) ? '#e0f2fe' : 'transparent',
                                        color: localSchedule.workingDays.includes(day) ? '#0369a1' : '#64748b',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Start Time</label>
                            <input
                                type="time"
                                className="form-input"
                                value={convertToInputTime(localSchedule.startTime)}
                                onChange={(e) => setLocalSchedule({ ...localSchedule, startTime: convertTo12Hour(e.target.value) })}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>End Time</label>
                            <input
                                type="time"
                                className="form-input"
                                value={convertToInputTime(localSchedule.endTime)}
                                onChange={(e) => setLocalSchedule({ ...localSchedule, endTime: convertTo12Hour(e.target.value) })}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Consultation Duration</label>
                        <select
                            className="form-input"
                            value={localSchedule.duration}
                            onChange={(e) => setLocalSchedule({ ...localSchedule, duration: parseInt(e.target.value) })}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        >
                            <option value={15}>15 Minutes</option>
                            <option value={30}>30 Minutes</option>
                            <option value={60}>60 Minutes</option>
                        </select>
                    </div>
                </div>

                {/* Blocked Dates (Leave Mode) */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={20} className="text-rose-600" />
                        Blocked Dates (Leave Mode)
                    </h3>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <input
                            type="date"
                            className="form-input"
                            value={newBlockedDate}
                            onChange={(e) => setNewBlockedDate(e.target.value)}
                            style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <button
                            className="btn"
                            onClick={addBlockedDate}
                            style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                            <Plus size={18} />
                            Block
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {localSchedule.blockedDates.length === 0 ? (
                            <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>No blocked dates scheduled.</p>
                        ) : (
                            localSchedule.blockedDates.map(date => (
                                <div key={date} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.75rem 1rem',
                                    backgroundColor: '#fff1f2',
                                    border: '1px solid #fecdd3',
                                    borderRadius: '8px',
                                    color: '#be123c'
                                }}>
                                    <span style={{ fontWeight: 500 }}>{new Date(date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                    <button
                                        onClick={() => removeBlockedDate(date)}
                                        style={{ border: 'none', background: 'none', color: '#be123c', cursor: 'pointer', display: 'flex' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper functions for time conversion
const convertToInputTime = (time12h) => {
    if (!time12h) return '';
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

const convertTo12Hour = (time24h) => {
    if (!time24h) return '';
    let [hours, minutes] = time24h.split(':');
    const modifier = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${modifier}`;
};

export default AvailabilityManagement;

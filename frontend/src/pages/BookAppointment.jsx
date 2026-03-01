import React, { useState, useEffect } from 'react';
import DoctorCard from '../components/Dashboard/DoctorCard';
import { Search, Filter, Calendar as CalendarIcon, Clock, Video, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '../context/AppointmentContext';
import { useAuth } from '../context/AuthContext';

const BookAppointment = () => {
    const { user } = useAuth();
    const { doctors, availability, appointments, bookAppointment, fetchDoctorSlots } = useAppointments();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [consultationType, setConsultationType] = useState('In-person');
    const [activeSpecialty, setActiveSpecialty] = useState('All');
    const [availableSlots, setAvailableSlots] = useState([]);
    const navigate = useNavigate();

    const specialties = ['All', ...new Set(doctors.map(doc => doc.specialty))];

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = activeSpecialty === 'All' || doc.specialty === activeSpecialty;
        return matchesSearch && matchesSpecialty;
    });

    useEffect(() => {
        const fetchSlotsForDate = async () => {
            if (selectedDoctor && bookingDate) {
                const slots = await fetchDoctorSlots(selectedDoctor.id, bookingDate);
                setAvailableSlots(slots);
            }
        };

        fetchSlotsForDate();
    }, [selectedDoctor, bookingDate, fetchDoctorSlots]);

    const handleBookClick = (doctor) => {
        setSelectedDoctor(doctor);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setBookingDate(tomorrow.toISOString().split('T')[0]);
        setBookingTime('');
    };

    const confirmBooking = async (e) => {
        e.preventDefault();
        if (!bookingTime) {
            alert('Please select a time slot.');
            return;
        }

        try {
            await bookAppointment({
                doctorId: selectedDoctor.id,
                doctorName: selectedDoctor.name,
                specialty: selectedDoctor.specialty,
                patientId: user?.id || 'patient-1',
                patientName: user?.name || 'User',
                date: bookingDate,
                timeSlot: bookingTime,
                consultationType,
                status: 'Pending'
            });

            alert(`Appointment request sent to ${selectedDoctor.name}. Status: Pending`);
            navigate('/appointments');
        } catch (error) {
            alert('Failed to book appointment. Please try again.');
        }
    };

    return (
        <div>
            <div className="card-header" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1>Book Appointment</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Find the best doctors and book instantly.</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search doctors, specialties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 2.5rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: '100%', marginTop: '0.5rem' }}>
                        {specialties.map(spec => (
                            <button
                                key={spec}
                                onClick={() => setActiveSpecialty(spec)}
                                style={{
                                    padding: '0.4rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    border: '1px solid',
                                    borderColor: activeSpecialty === spec ? '#0ea5e9' : '#e2e8f0',
                                    backgroundColor: activeSpecialty === spec ? '#0ea5e9' : 'transparent',
                                    color: activeSpecialty === spec ? 'white' : '#64748b',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {spec}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Doctors Grid */}
            <div className="dashboard-grid">
                {filteredDoctors.map(doctor => (
                    <DoctorCard key={doctor.id} doctor={doctor} onBook={handleBookClick} />
                ))}
            </div>

            {/* Booking Modal Overlay */}
            {selectedDoctor && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
                }} onClick={() => setSelectedDoctor(null)}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '16px', padding: '2rem',
                        width: '100%', maxWidth: '550px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <img src={selectedDoctor.image} alt={selectedDoctor.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedDoctor.name}</h2>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{selectedDoctor.specialty}</p>
                            </div>
                        </div>

                        <form onSubmit={confirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Select Date</label>
                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Consultation Type</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setConsultationType('In-person')}
                                            style={{
                                                flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid',
                                                borderColor: consultationType === 'In-person' ? '#0ea5e9' : '#e2e8f0',
                                                backgroundColor: consultationType === 'In-person' ? '#e0f2fe' : 'white',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                                            }}
                                        >
                                            <User size={16} /> In-person
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setConsultationType('Video')}
                                            style={{
                                                flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid',
                                                borderColor: consultationType === 'Video' ? '#0ea5e9' : '#e2e8f0',
                                                backgroundColor: consultationType === 'Video' ? '#e0f2fe' : 'white',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                                            }}
                                        >
                                            <Video size={16} /> Video
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Available Time Slots</label>
                                {availableSlots.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                        {availableSlots.map(slot => (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => setBookingTime(slot)}
                                                style={{
                                                    padding: '0.6rem 0.4rem', borderRadius: '6px', border: '1px solid',
                                                    borderColor: bookingTime === slot ? '#0ea5e9' : '#e2e8f0',
                                                    backgroundColor: bookingTime === slot ? '#0ea5e9' : 'white',
                                                    color: bookingTime === slot ? 'white' : '#1e293b',
                                                    fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'
                                                }}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: '#e11d48', fontSize: '0.875rem', padding: '1rem', textAlign: 'center', backgroundColor: '#fff1f2', borderRadius: '8px' }}>
                                        No slots available for this date.
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    style={{ flex: 1 }}
                                    onClick={() => setSelectedDoctor(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!bookingTime}
                                    style={{ flex: 1, backgroundColor: !bookingTime ? '#94a3b8' : '#0ea5e9' }}
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookAppointment;

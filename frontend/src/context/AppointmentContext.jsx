import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const AppointmentContext = createContext(null);

export const AppointmentProvider = ({ children }) => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [availability, setAvailability] = useState({});
    const [feedback, setFeedback] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    const fetchData = useCallback(async () => {
        if (!user) {
            setAppointments([]);
            setDoctors([]);
            return;
        }

        setLoadingData(true);
        try {
            // Everyone needs the doctor list
            const docsRes = await api.get('/doctors');
            if (docsRes.data.success) {
                setDoctors(docsRes.data.data);
            }

            // Fetch role-specific appointments
            if (user.role === 'patient') {
                const appsRes = await api.get(`/patients/${user.id}/appointments`);
                if (appsRes.data.success) {
                    setAppointments(appsRes.data.data);
                }
            } else if (user.role === 'doctor') {
                // Fetch stats and all appointments
                const appsRes = await api.get(`/doctor/appointments/${user.id}`);
                // You could also fetch stats here if needed by the context

                if (appsRes.data.success) {
                    setAppointments(appsRes.data.data);
                }

                // Fetch availability
                try {
                    const availRes = await api.get(`/doctor/availability/${user.id}`);
                    if (availRes.data.success) {
                        setAvailability(prev => ({
                            ...prev,
                            [user.id]: availRes.data.data
                        }));
                    }
                } catch (e) { console.error("Could not fetch availability"); }
            }
        } catch (error) {
            console.error("Error fetching context data:", error);
        } finally {
            setLoadingData(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const fetchDoctorSlots = async (doctorId, date) => {
        try {
            const response = await api.get(`/doctors/${doctorId}/slots?date=${date}`);
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error("Error fetching doctor slots", error);
            return [];
        }
    };

    const bookAppointment = async (data) => {
        try {
            const response = await api.post('/appointments', data);
            if (response.data.success) {
                setAppointments(prev => [...prev, response.data.data]);
                return response.data.data;
            }
        } catch (error) {
            console.error("Error booking appointment", error);
            throw error;
        }
    };

    const updateAppointmentStatus = async (appId, status, reason = '') => {
        try {
            const upperStatus = status.toUpperCase();
            const response = await api.put(`/doctor/requests/${appId}`, { status: upperStatus, reason });
            if (response.data.success) {
                setAppointments(prev => prev.map(app =>
                    app.id === appId ? { ...app, status: upperStatus, rejectionReason: reason } : app
                ));
            }
        } catch (error) {
            console.error("Error updating appointment status", error);
        }
    };

    const completeConsultation = async (appId, consultationData) => {
        try {
            const consultJson = JSON.stringify(consultationData);
            const response = await api.post(`/doctor/consultation/${appId}`, consultJson, {
                headers: { 'Content-Type': 'text/plain' }
            });

            if (response.data.success) {
                setAppointments(prev => prev.map(app =>
                    app.id === appId ? { ...app, status: 'COMPLETED', consultationDataJson: consultJson } : app
                ));
            }
        } catch (error) {
            console.error("Error completing consultation", error);
        }
    };

    const updateDoctorAvailability = async (doctorId, data) => {
        try {
            const response = await api.put(`/doctor/availability/${doctorId}`, data);
            if (response.data.success) {
                setAvailability(prev => ({
                    ...prev,
                    [doctorId]: response.data.data
                }));
            }
        } catch (error) {
            console.error("Error updating availability", error);
        }
    };

    const submitFeedback = async (feedbackData) => {
        try {
            const response = await api.post('/feedback', feedbackData);
            if (response.data.success) {
                const newFeedback = response.data.data;
                setFeedback(prev => {
                    const updatedFeedback = [...prev, newFeedback];
                    updateDoctorRating(feedbackData.doctorId, updatedFeedback);
                    return updatedFeedback;
                });

                // Update appointment in local state
                setAppointments(prev => prev.map(app =>
                    app.id === feedbackData.appointmentId ? { ...app, feedbackSubmitted: true } : app
                ));
            }
        } catch (error) {
            console.error("Error submitting feedback", error);
        }
    };

    const updateDoctorRating = (doctorId, currentFeedback) => {
        const doctorFeedbacks = currentFeedback.filter(f => f.doctorId === doctorId);
        if (doctorFeedbacks.length === 0) return;

        const avgRating = doctorFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / doctorFeedbacks.length;
        setDoctors(prev => prev.map(doc =>
            doc.id === doctorId ? { ...doc, rating: parseFloat(avgRating.toFixed(1)) } : doc
        ));
    };

    return (
        <AppointmentContext.Provider value={{
            appointments,
            doctors,
            availability,
            feedback,
            bookAppointment,
            updateAppointmentStatus,
            completeConsultation,
            updateDoctorAvailability,
            submitFeedback,
            fetchDoctorSlots
        }}>
            {children}
        </AppointmentContext.Provider>
    );
};

export const useAppointments = () => useContext(AppointmentContext);

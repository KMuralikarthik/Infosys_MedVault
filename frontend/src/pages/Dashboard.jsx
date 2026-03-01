import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Bell, Pill } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import api from '../utils/api';

// Icon mapping helper
const iconMap = {
    Calendar: Calendar,
    FileText: FileText,
    Bell: Bell,
    Pill: Pill
};

const Dashboard = () => {
    const { user } = useAuth();
    const { appointments } = useAppointments();

    const [recordsCount, setRecordsCount] = useState(0);
    const [notificationsCount, setNotificationsCount] = useState(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                const [recordsRes, notifRes] = await Promise.all([
                    api.get('/records/my'),
                    api.get(`/notifications/${user.id}`)
                ]);

                if (recordsRes.data.success) {
                    setRecordsCount(recordsRes.data.data.length);
                }

                if (notifRes.data.success) {
                    const unread = notifRes.data.data.filter(n => !n.read).length;
                    setNotificationsCount(unread);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };

        if (user?.role === 'patient') {
            fetchDashboardData();
        }
    }, [user]);

    const upcomingCount = appointments.filter(app => {
        const appPatientId = app.patient?.id || app.patientId;
        const status = app.status?.toLowerCase();
        return appPatientId === user?.id && (status === 'upcoming' || status === 'approved' || status === 'pending');
    }).length;

    // Calculate active prescriptions
    const activePrescriptionsCount = appointments.reduce((total, app) => {
        const appPatientId = app.patient?.id || app.patientId;
        if (appPatientId === user?.id && app.status?.toLowerCase() === 'completed' && app.consultationDataJson) {
            try {
                const data = JSON.parse(app.consultationDataJson);
                if (data.prescriptions && Array.isArray(data.prescriptions)) {
                    return total + data.prescriptions.length;
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
        return total;
    }, 0);

    const stats = [
        { title: "Upcoming Appointments", value: upcomingCount.toString(), icon: "Calendar", color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Total Medical Records", value: recordsCount.toString(), icon: "FileText", color: "text-emerald-600", bg: "bg-emerald-100" },
        { title: "Pending Notifications", value: notificationsCount.toString(), icon: "Bell", color: "text-amber-600", bg: "bg-amber-100" },
        { title: "Active Prescriptions", value: activePrescriptionsCount.toString(), icon: "Pill", color: "text-rose-600", bg: "bg-rose-100" }
    ];

    return (
        <div>
            <div className="mb-8">
                <h1>Welcome Back, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
                <p>Here's what's happening with your health today.</p>
            </div>

            <div className="dashboard-grid">
                {stats.map((stat, index) => {
                    const Icon = iconMap[stat.icon];
                    return (
                        <div key={index} className="stat-card">
                            <div className="stat-info">
                                <h3>{stat.value}</h3>
                                <p>{stat.title}</p>
                            </div>
                            <div className={`stat-icon ${stat.bg} ${stat.color}`}>
                                <Icon size={24} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Recent Activity</h2>
                </div>
                <p className="text-muted">No recent activity to show.</p>
            </div>
        </div>
    );
};

export default Dashboard;

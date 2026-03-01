import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const DoctorNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user?.id) return;
            try {
                const response = await api.get(`/notifications/${user.id}`);
                if (response.data.success) {
                    setNotifications(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching notifications", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user?.id]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    };

    const markAllRead = async () => {
        try {
            const unread = notifications.filter(n => !n.read);
            await Promise.all(unread.map(n => api.put(`/notifications/${n.id}/read`)));
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Error marking all as read", error);
        }
    };

    return (
        <div className="doctor-notifications">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Notifications</h1>
                    <p style={{ color: '#64748b' }}>Stay updated with new appointment requests and system alerts.</p>
                </div>
                {notifications.some(n => !n.read) && (
                    <button onClick={markAllRead} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={18} />
                        Mark All as Read
                    </button>
                )}
            </header>

            {loading ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    Loading alerts...
                </div>
            ) : notifications.length === 0 ? (
                <div className="card" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                    <Bell size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.1rem' }}>No new notifications.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`card ${!notif.read ? 'unread' : ''}`}
                            style={{
                                padding: '1.25rem',
                                display: 'flex',
                                gap: '1.25rem',
                                borderLeft: !notif.read ? '4px solid #0ea5e9' : 'none',
                                backgroundColor: !notif.read ? '#f0f9ff' : 'white'
                            }}
                        >
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: '12px',
                                backgroundColor: notif.type === 'SUCCESS' ? '#f0fdf4' : notif.type === 'WARNING' ? '#fff7ed' : '#f1f5f9',
                                color: notif.type === 'SUCCESS' ? '#15803d' : notif.type === 'WARNING' ? '#c2410c' : '#0ea5e9'
                            }}>
                                {notif.type === 'SUCCESS' ? <CheckCircle size={24} /> : notif.type === 'WARNING' ? <AlertCircle size={24} /> : <Bell size={24} />}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: !notif.read ? 600 : 400, color: '#1e293b' }}>
                                        {notif.message}
                                    </p>
                                    {!notif.read && (
                                        <button
                                            onClick={() => markAsRead(notif.id)}
                                            style={{ background: 'none', border: 'none', color: '#0ea5e9', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                                    <Clock size={14} />
                                    {new Date(notif.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorNotifications;

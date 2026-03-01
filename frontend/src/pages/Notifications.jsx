import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Notifications = () => {
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
        <div>
            <div className="mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Notifications</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Stay updated with your latest alerts.</p>
                </div>
                {notifications.some(n => !n.read) && (
                    <button onClick={markAllRead} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                        Mark all as read
                    </button>
                )}
            </div>

            {loading ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    Loading notifications...
                </div>
            ) : notifications.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#94a3b8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                    }}>
                        <Bell size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>No new notifications</h3>
                    <p style={{ color: '#64748b' }}>We'll notify you when there's an update regarding your health or appointments.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {notifications.map(n => (
                        <div key={n.id} className="card" style={{
                            padding: '1.25rem',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'flex-start',
                            backgroundColor: n.read ? 'white' : '#f0f9ff',
                            borderLeft: n.read ? 'none' : '4px solid #0ea5e9'
                        }}>
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: '10px',
                                backgroundColor: n.type === 'SUCCESS' ? '#f0fdf4' : n.type === 'WARNING' ? '#fff7ed' : '#f1f5f9',
                                color: n.type === 'SUCCESS' ? '#15803d' : n.type === 'WARNING' ? '#c2410c' : '#64748b'
                            }}>
                                {n.type === 'SUCCESS' ? <CheckCircle size={20} /> : n.type === 'WARNING' ? <AlertCircle size={20} /> : <Info size={20} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, color: '#1e293b', fontSize: '0.95rem' }}>{n.message}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                                    <Clock size={12} />
                                    {new Date(n.createdAt).toLocaleString()}
                                </div>
                            </div>
                            {!n.read && (
                                <button
                                    onClick={() => markAsRead(n.id)}
                                    style={{ background: 'none', border: 'none', color: '#0ea5e9', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Mark as read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;

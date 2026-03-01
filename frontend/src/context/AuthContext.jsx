/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            const storedUser = localStorage.getItem('medvault_user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser); // optimistic UI

                    // Verify with backend
                    const response = await api.get('/auth/me');
                    if (response.data.success) {
                        const backendUser = response.data.data;
                        const userObj = {
                            id: backendUser.id,
                            name: backendUser.name,
                            role: backendUser.role === 'ROLE_DOCTOR' ? 'doctor' : 'patient',
                            email: backendUser.email,
                            avatar: backendUser.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200',
                            token: parsedUser.token
                        };
                        setUser(userObj);
                        localStorage.setItem('medvault_user', JSON.stringify(userObj));
                    }
                } catch (e) {
                    console.error("Failed to verify user session:", e);
                    localStorage.removeItem('medvault_user');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        verifySession();
    }, []);

    const login = async (email, password, role) => {
        try {
            // Role is handled by backend validation and JWT, but we can pass it if we had a multi-role login
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                const userData = response.data.data;
                // Backend returns: id, email, name, role, avatar, token
                const userObj = {
                    id: userData.id,
                    name: userData.name,
                    role: userData.role === 'ROLE_DOCTOR' ? 'doctor' : 'patient',
                    email: userData.email,
                    avatar: userData.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200',
                    token: userData.token
                };

                // Verify the user is logging into the correct portal (optional safety check)
                if (role && userObj.role !== role && role !== 'admin') {
                    return { success: false, message: `Access denied. Please use the ${userObj.role} login portal.` };
                }

                setUser(userObj);
                localStorage.setItem('medvault_user', JSON.stringify(userObj));
                return { success: true };
            }
        } catch (error) {
            console.error("Login failed:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Invalid credentials or server error. Please try again.'
            };
        }
    };

    const register = async (name, email, password, role, otp) => {
        try {
            const roleStr = role === 'doctor' ? 'ROLE_DOCTOR' : 'ROLE_PATIENT';
            const response = await api.post('/auth/register', { name, email, password, role: roleStr, otp });

            if (response.data.success) {
                const userData = response.data.data;
                const userObj = {
                    id: userData.id,
                    name: userData.name,
                    role: userData.role === 'ROLE_DOCTOR' ? 'doctor' : 'patient',
                    email: userData.email,
                    avatar: userData.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200',
                    token: userData.token
                };

                setUser(userObj);
                localStorage.setItem('medvault_user', JSON.stringify(userObj));
                return { success: true };
            }
        } catch (error) {
            console.error("Registration failed:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed. Email might already be in use.'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('medvault_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading Application...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

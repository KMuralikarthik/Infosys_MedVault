import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem('medvault_user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user && user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (error) {
                console.error("Error parsing user from localStorage", error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            console.warn("Unauthorized API call. Attempting to clear session.");
            // You might want to trigger a logout action here if you had a global event bus
            // Or simply clear the malformed session so the UI reacts to `user === null`
            localStorage.removeItem('medvault_user');
            // Depending on the router setup, you might force a reload here: window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

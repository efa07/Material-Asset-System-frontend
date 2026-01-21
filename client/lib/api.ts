import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach Authorization header from auth store token for every request
api.interceptors.request.use((config) => {
    try {
        const token = useAuthStore.getState().token;
        if (token) {
            if (!config.headers) config.headers = {} as any;
            (config.headers as any).Authorization = `Bearer ${token}`;
        }
    } catch (err) {
        // ignore in SSR or if store unavailable
    }
    return config;
});

export default api;

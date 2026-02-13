import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useAuthStore } from '@/store/auth.store';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach Authorization header from NextAuth session for every request
api.interceptors.request.use(async (config) => {
    try {
        const session = await getSession();
        const fallbackToken = useAuthStore.getState().token;
        const token = session?.accessToken || fallbackToken;
        if (token) {
            if (!config.headers) config.headers = {} as any;
            (config.headers as any).Authorization = `Bearer ${token}`;
        }
    } catch (err) {
        console.log('Error fetching session for API request:', err);
    }
    return config;
});


export default api;

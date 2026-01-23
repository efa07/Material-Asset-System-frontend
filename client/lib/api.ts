import axios from 'axios';
import { getSession } from 'next-auth/react';

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
        if (session?.accessToken) {
            if (!config.headers) config.headers = {} as any;
            (config.headers as any).Authorization = `Bearer ${session.accessToken}`;
        }
    } catch (err) {
        // ignore in SSR or if session unavailable
    }
    return config;
});


export default api;

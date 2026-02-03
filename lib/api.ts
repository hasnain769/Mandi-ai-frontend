const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
    auth: {
        login: async (phoneNumber: string) => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: phoneNumber }),
            });
            return res.json();
        },
        register: async (phoneNumber: string, businessName: string = "My Mandi Shop") => {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: phoneNumber, business_name: businessName }),
            });
            return res.json();
        }
    },
    dashboard: {
        get: async (phoneNumber: string) => {
            const res = await fetch(`${API_URL}/api/dashboard`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Phone-Number': phoneNumber // Simple Auth for MVP
                },
            });
            if (!res.ok) throw new Error("Failed to fetch dashboard");
            return res.json();
        }
    }
};

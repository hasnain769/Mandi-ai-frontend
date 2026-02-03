'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { api } from '@/lib/api';

interface InventoryItem {
    id: number;
    item_name: string;
    quantity: number;
    unit: string;
    last_updated: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const router = useRouter();

    const fetchInventory = async (phoneNumber: string) => {
        try {
            const data = await api.dashboard.get(phoneNumber);
            if (data.inventory) {
                setInventory(data.inventory);
            }
        } catch (error) {
            console.error("Failed to fetch inventory", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                if (user.phoneNumber) {
                    fetchInventory(user.phoneNumber);
                }
            } else {
                router.push('/');
            }
        });

        return () => unsubscribe();
    }, [router, fetchInventory]);

    const handleSignOut = async () => {
        await signOut(auth);
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Mandi Dashboard</h1>
                    {user && (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">{user.phoneNumber}</span>
                            <button
                                onClick={handleSignOut}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Item Name</th>
                                <th className="p-4 font-semibold text-gray-600">Quantity</th>
                                <th className="p-4 font-semibold text-gray-600">Unit</th>
                                <th className="p-4 font-semibold text-gray-600">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.length > 0 ? (
                                inventory.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="p-4">{item.item_name}</td>
                                        <td className="p-4">{item.quantity}</td>
                                        <td className="p-4">{item.unit}</td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {new Date(item.last_updated).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="border-t">
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No items found. Send a voice note to add stock!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="p-4 text-center text-gray-500 italic">
                        Voice updates will appear here in real-time.
                    </div>
                </div>
            </div>
        </div>
    );
}

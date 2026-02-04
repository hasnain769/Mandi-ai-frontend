'use client';

import { useEffect, useState, useCallback } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { InventoryCard } from '@/components/InventoryCard';
import { SalesRegister } from '@/components/SalesRegister';

interface InventoryItem {
    id: number;
    item_name: string;
    quantity: number;
    unit: string;
    last_updated: string;
}

interface Transaction {
    id: string;
    transaction_type: 'SALE' | 'PURCHASE' | 'ADJUSTMENT';
    item_name: string;
    quantity: number;
    unit: string;
    rate?: number;
    total_amount?: number;
    buyer_name?: string;
    created_at: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const fetchDashboardData = useCallback(async (phoneNumber: string) => {
        try {
            setLoading(true);
            const data = await api.dashboard.get(phoneNumber);
            if (data.inventory) setInventory(data.inventory);
            if (data.transactions) setTransactions(data.transactions);
        } catch (error) {
            console.error("Failed to fetch dashboard", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                if (user.phoneNumber) {
                    fetchDashboardData(user.phoneNumber);
                }
            } else {
                router.push('/');
            }
        });

        return () => unsubscribe();
    }, [router, fetchDashboardData]);

    const handleSignOut = async () => {
        await signOut(auth);
        router.push('/');
    };

    // Calculate Cash in Hand (Simulated from transactions)
    const cashInHand = transactions
        .filter(t => t.transaction_type === 'SALE' && t.total_amount)
        .reduce((sum, t) => sum + (t.total_amount || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Mandi Ledger</h1>
                        {user && <p className="text-xs text-gray-500">{user.phoneNumber}</p>}
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="text-sm text-red-600 font-medium hover:underline"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 space-y-8">

                {/* 1. Cash Summary */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                    <p className="text-green-100 text-sm font-medium mb-1">Today's Sales (Estimated)</p>
                    <h2 className="text-4xl font-extrabold tracking-tight">
                        Rs {cashInHand.toLocaleString()}
                    </h2>
                </div>

                {/* 2. Inventory Grid (Visual) */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        📦 Current Stock
                    </h2>

                    {loading ? (
                        <div className="text-center py-10 text-gray-400">Loading stock...</div>
                    ) : inventory.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {inventory.map((item) => (
                                <InventoryCard
                                    key={item.id}
                                    item_name={item.item_name}
                                    quantity={item.quantity}
                                    unit={item.unit}
                                    last_updated={item.last_updated}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-xl border-dashed border-2 border-gray-200 text-center text-gray-400">
                            No stock items found.
                        </div>
                    )}
                </div>

                {/* 3. Sales Register (Ledger) */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        📜 Recent Transactions
                    </h2>
                    <SalesRegister transactions={transactions} />
                </div>

            </div>
        </div>
    );
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { InventoryCard } from '@/components/InventoryCard';
import { SalesRegister } from '@/components/SalesRegister';
import { LanguageToggle } from '@/components/LanguageToggle';

// Interfaces (re-defined here to be safe, or import if shared)
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
    const [user, setUser] = useState<any>(null); // simple user obj
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'inventory' | 'sales'>('inventory');
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
        // Google Translate Init
        // @ts-ignore
        window.googleTranslateElementInit = () => {
            // @ts-ignore
            new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,ur',
                autoDisplay: false
            }, 'google_translate_element');
        };

        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);

        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                // We create a simple user object or use the authUser directly
                // For this component we need phoneNumber
                const u = { phoneNumber: authUser.phoneNumber };
                setUser(u);
                if (u.phoneNumber) {
                    fetchDashboardData(u.phoneNumber);
                }
            } else {
                router.push('/');
            }
        });

        return () => {
            unsubscribe();
        };
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
            <div id="google_translate_element" className="hidden"></div>

            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20 transition-colors">
                <div className="p-4 max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {/* Logo */}
                        <img src="/mandibook-logo.png" alt="Mandibook" className="h-8 w-auto object-contain glint-effect" />

                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold text-gray-900 notranslate leading-none">Mandibook</h1>
                            {user && <p className="text-[10px] text-gray-400">{user.phoneNumber}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageToggle />
                        <button
                            onClick={handleSignOut}
                            className="text-sm text-red-600 font-medium hover:underline"
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Tab Bar */}
                <div className="flex max-w-4xl mx-auto px-4 gap-6">
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'inventory'
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        📦 Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab('sales')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'sales'
                                ? 'border-blue-600 text-blue-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        📜 Sales Register
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 space-y-6">

                {/* 1. Cash Summary (Always Visible) */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-md">
                    <p className="text-green-100 text-sm font-medium mb-1">Cash in Hand</p>
                    <h2 className="text-4xl font-extrabold tracking-tight">
                        Rs {cashInHand.toLocaleString()}
                    </h2>
                </div>

                {/* 2. Content Area */}
                {activeTab === 'inventory' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Inventory Grid (Visual) */}
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                📦 Current Stock
                            </h2>
                        </div>

                        {loading ? (
                            <div className="text-center py-10 text-gray-400">Loading...</div>
                        ) : inventory.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {inventory.map((item) => (
                                    <InventoryCard
                                        key={item.id}
                                        id={item.id}
                                        item_name={item.item_name}
                                        quantity={item.quantity}
                                        unit={item.unit}
                                        last_updated={item.last_updated}
                                        phoneNumber={user?.phoneNumber || ''}
                                        onUpdate={() => user?.phoneNumber && fetchDashboardData(user.phoneNumber)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-xl border-dashed border-2 border-gray-200 text-center text-gray-400">
                                No stock items yet. Speak to start!
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Sales Register (Ledger) */}
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                📜 Sales Ledger
                            </h2>
                        </div>
                        <SalesRegister
                            transactions={transactions}
                            phoneNumber={user?.phoneNumber || ''}
                            onUpdate={() => user?.phoneNumber && fetchDashboardData(user.phoneNumber)}
                        />
                    </div>
                )}

            </div>
        </div>
    );
}

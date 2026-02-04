import React from 'react';
import { getVeggieIcon } from '@/lib/veggieIcons';

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

interface SalesRegisterProps {
    transactions: Transaction[];
}

export const SalesRegister: React.FC<SalesRegisterProps> = ({ transactions }) => {
    if (transactions.length === 0) {
        return <div className="text-gray-400 text-center py-8">No transactions yet.</div>;
    }

    return (
        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="uppercase tracking-wider border-b-2 border-gray-100 bg-gray-50 text-gray-500 font-semibold">
                        <tr>
                            <th scope="col" className="px-6 py-4">Time</th>
                            <th scope="col" className="px-6 py-4">Action</th>
                            <th scope="col" className="px-6 py-4">Item</th>
                            <th scope="col" className="px-6 py-4 text-right">Qty</th>
                            <th scope="col" className="px-6 py-4 text-right">Rate</th>
                            <th scope="col" className="px-6 py-4 text-right bg-blue-50/50">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {transactions.map((tx) => {
                            const isSale = tx.transaction_type === "SALE";
                            const icon = getVeggieIcon(tx.item_name);

                            return (
                                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(tx.created_at).toLocaleDateString()} <br />
                                        <span className="text-xs">{new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </td>

                                    <td className="px-6 py-4">
                                        {isSale ? (
                                            <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                                ⬇️ SOLD to <span className="font-bold">{tx.buyer_name || 'Counter'}</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                                ⬆️ STOCK IN
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {icon} {tx.item_name}
                                    </td>

                                    <td className="px-6 py-4 text-right font-mono text-gray-700">
                                        {tx.quantity} {tx.unit}
                                    </td>

                                    <td className="px-6 py-4 text-right font-mono text-gray-500">
                                        {tx.rate ? `Rs ${tx.rate}` : '-'}
                                    </td>

                                    <td className="px-6 py-4 text-right font-mono font-bold text-gray-900 bg-blue-50/30">
                                        {tx.total_amount ? `Rs ${tx.total_amount.toLocaleString()}` : '-'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

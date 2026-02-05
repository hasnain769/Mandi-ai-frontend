import React, { useState } from 'react';
import { getVeggieIcon } from '@/lib/veggieIcons';
import { EditModal } from '@/components/EditModal';
import { api } from '@/lib/api';

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
    phoneNumber: string;
    onUpdate: () => void;
}

export const SalesRegister: React.FC<SalesRegisterProps> = ({ transactions, phoneNumber, onUpdate }) => {
    const [editTx, setEditTx] = useState<Transaction | null>(null);

    const handleSave = async (data: any) => {
        if (!editTx) return;
        try {
            await api.transactions.update(editTx.id, {
                buyer_name: data.buyer_name,
                quantity: parseFloat(data.quantity),
                rate: parseFloat(data.rate),
                // Recalculate total
                total_amount: parseFloat(data.quantity) * parseFloat(data.rate || 0)
            }, phoneNumber);
            onUpdate();
            setEditTx(null);
        } catch (e) {
            console.error(e);
            alert("Failed to update transaction");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this?")) {
            try {
                await api.transactions.delete(id, phoneNumber);
                onUpdate();
            } catch (e) {
                console.error(e);
                alert("Failed to delete");
            }
        }
    };

    if (transactions.length === 0) {
        return <div className="text-gray-400 text-center py-8">No transactions yet.</div>;
    }

    return (
        <>
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
                                <th scope="col" className="px-6 py-4 text-right bg-blue-50/50">Total</th>
                                <th scope="col" className="px-6 py-4 text-right">⚙️</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((tx) => {
                                const isSale = tx.transaction_type === "SALE";
                                const icon = getVeggieIcon(tx.item_name);

                                return (
                                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(tx.created_at).toLocaleDateString()} <br />
                                            <span className="text-xs">{new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>

                                        <td className="px-6 py-4">
                                            {isSale ? (
                                                <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                                    ⬇️ Sold to <span className="font-bold ml-1">{tx.buyer_name || 'Counter'}</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                                    ⬆️ Stock In
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

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setEditTx(tx)} className="text-blue-500 hover:text-blue-700" title="Edit">✏️</button>
                                                <button onClick={() => handleDelete(tx.id)} className="text-red-500 hover:text-red-700" title="Delete">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Transaction Modal */}
            {editTx && (
                <EditModal
                    isOpen={true}
                    title="Edit Transaction"
                    onClose={() => setEditTx(null)}
                    onSave={handleSave}
                    fields={[
                        { name: 'buyer_name', label: 'Buyer Name', type: 'text', value: editTx.buyer_name || '' },
                        { name: 'quantity', label: 'Quantity', type: 'number', value: editTx.quantity },
                        { name: 'rate', label: 'Rate', type: 'number', value: editTx.rate || 0 },
                    ]}
                />
            )}
        </>
    );
};

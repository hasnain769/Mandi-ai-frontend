import React, { useState } from 'react';
import { getVeggieIcon } from '@/lib/veggieIcons';
import { EditModal } from '@/components/EditModal';
import { api } from '@/lib/api';
import { useTranslation, Locale } from '@/lib/i18n';

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
    locale: Locale;
    onUpdate: () => void;
}

export const SalesRegister: React.FC<SalesRegisterProps> = ({ transactions, phoneNumber, locale, onUpdate }) => {
    const t = useTranslation(locale);
    const [editTx, setEditTx] = useState<Transaction | null>(null);

    const handleSave = async (data: any) => {
        if (!editTx) return;
        try {
            await api.transactions.update(editTx.id, {
                buyer_name: data.buyer_name,
                quantity: parseFloat(data.quantity),
                rate: parseFloat(data.rate),
                // Recalculate total on server OR client. Sending scalar values, server should re-calc total if logic exists, 
                // but our simple DB update just saves values. Ideally total_amount should be calc here too.
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
        if (confirm(t.confirmDelete)) {
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
        return <div className="text-gray-400 text-center py-8">{t.noTransactions}</div>;
    }

    return (
        <>
            <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b-2 border-gray-100 bg-gray-50 text-gray-500 font-semibold">
                            <tr>
                                <th scope="col" className="px-6 py-4">{t.time}</th>
                                <th scope="col" className="px-6 py-4">{t.action}</th>
                                <th scope="col" className="px-6 py-4">{t.item}</th>
                                <th scope="col" className="px-6 py-4 text-right">{t.qty}</th>
                                <th scope="col" className="px-6 py-4 text-right">{t.rate}</th>
                                <th scope="col" className="px-6 py-4 text-right bg-blue-50/50">{t.total}</th>
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
                                                    ⬇️ {t.soldTo} <span className="font-bold ml-1">{tx.buyer_name || 'Counter'}</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                                    ⬆️ {t.stockIn}
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
                                                <button onClick={() => setEditTx(tx)} className="text-blue-500 hover:text-blue-700" title={t.edit}>✏️</button>
                                                <button onClick={() => handleDelete(tx.id)} className="text-red-500 hover:text-red-700" title={t.delete}>🗑️</button>
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
                    title={`${t.edit} ${t.action}`}
                    onClose={() => setEditTx(null)}
                    onSave={handleSave}
                    fields={[
                        { name: 'buyer_name', label: 'Buyer Name', type: 'text', value: editTx.buyer_name || '' },
                        { name: 'quantity', label: t.qty, type: 'number', value: editTx.quantity },
                        { name: 'rate', label: t.rate, type: 'number', value: editTx.rate || 0 },
                    ]}
                />
            )}
        </>
    );
};

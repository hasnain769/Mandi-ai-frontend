import React, { useState } from 'react';
import { getVeggieIcon } from '@/lib/veggieIcons';
import { EditModal } from '@/components/EditModal';
import { api } from '@/lib/api';

interface InventoryCardProps {
    id: number;
    item_name: string;
    quantity: number;
    unit: string;
    last_updated: string;
    phoneNumber: string;
    onUpdate: () => void;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ id, item_name, quantity, unit, last_updated, phoneNumber, onUpdate }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Determine low stock (simple logic: < 10)
    const isLowStock = quantity < 10;
    const icon = getVeggieIcon(item_name);

    const handleSave = async (data: any) => {
        try {
            await api.inventory.update(id, {
                item_name: data.item_name,
                quantity: parseFloat(data.quantity),
                unit: data.unit
            }, phoneNumber);
            onUpdate();
        } catch (e) {
            console.error(e);
            alert("Failed to update");
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this?")) {
            try {
                await api.inventory.delete(id, phoneNumber);
                onUpdate();
            } catch (e) {
                console.error(e);
                alert("Failed to delete");
            }
        }
    };

    return (
        <>
            <div className={`
                relative flex flex-col items-center justify-center p-6 rounded-2xl shadow-sm border-2 transition-all group
                ${isLowStock ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}
            `}>
                {/* Actions (Hidden by default, visible on hover/focus) */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setIsEditOpen(true)} className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200" title="Edit">
                        ✏️
                    </button>
                    <button onClick={handleDelete} className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200" title="Delete">
                        🗑️
                    </button>
                </div>

                <div className="text-6xl mb-4 select-none" role="img" aria-label={item_name}>
                    {icon}
                </div>

                <h3 className="text-xl font-bold text-gray-800 capitalize mb-1">{item_name}</h3>

                <div className={`text-3xl font-extrabold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                    {quantity} <span className="text-lg text-gray-500 font-medium">{unit}</span>
                </div>

                <p className="text-xs text-gray-400 mt-4">
                    Updated: {new Date(last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>

            <EditModal
                isOpen={isEditOpen}
                title={`Edit ${item_name}`}
                onClose={() => setIsEditOpen(false)}
                onSave={handleSave}
                fields={[
                    { name: 'item_name', label: "Item", type: 'text', value: item_name },
                    { name: 'quantity', label: "Quantity", type: 'number', value: quantity },
                    { name: 'unit', label: 'Unit', type: 'text', value: unit },
                ]}
            />
        </>
    );
};

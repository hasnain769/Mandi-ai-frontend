import React from 'react';
import { getVeggieIcon } from '@/lib/veggieIcons';

interface InventoryCardProps {
    item_name: string;
    quantity: number;
    unit: string;
    last_updated: string;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ item_name, quantity, unit, last_updated }) => {
    // Determine low stock (simple logic: < 10)
    const isLowStock = quantity < 10;
    const icon = getVeggieIcon(item_name);

    return (
        <div className={`
            flex flex-col items-center justify-center p-6 rounded-2xl shadow-sm border-2 transition-all
            ${isLowStock ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}
        `}>
            <div className="text-6xl mb-4" role="img" aria-label={item_name}>
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
    );
};

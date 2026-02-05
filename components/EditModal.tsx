import React, { useState, useEffect } from 'react';

interface Field {
    name: string;
    label: string;
    type: 'text' | 'number';
    value: any;
}

interface EditModalProps {
    isOpen: boolean;
    title: string;
    fields: Field[];
    onClose: () => void;
    onSave: (data: any) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ isOpen, title, fields, onClose, onSave }) => {
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        const initial: any = {};
        fields.forEach(f => initial[f.name] = f.value);
        setFormData(initial);
    }, [fields, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        setFormData({ ...formData, [name]: e.target.value });
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>

                <div className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(e, field.name)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 shadow-md transition-all active:scale-95"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

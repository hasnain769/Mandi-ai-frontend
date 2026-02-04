import React from 'react';
import { Locale } from '@/lib/i18n';

interface LanguageToggleProps {
    currentLocale: Locale;
    onToggle: (locale: Locale) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ currentLocale, onToggle }) => {
    return (
        <div className="flex bg-gray-200 rounded-lg p-1">
            <button
                onClick={() => onToggle('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${currentLocale === 'en'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => onToggle('ur')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${currentLocale === 'ur'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                UR
            </button>
        </div>
    );
};

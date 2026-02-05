import React, { useEffect, useState } from 'react';

export const LanguageToggle: React.FC = () => {
    const [lang, setLang] = useState('en');

    useEffect(() => {
        // simple check for cookie
        const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
        if (match && match[1]) {
            setLang(match[1]);
        }
    }, []);

    const switchLanguage = (targetLang: string) => {
        // Set Google Translate Cookie
        document.cookie = `googtrans=/en/${targetLang}; path=/; domain=${window.location.hostname}`;
        // Fallback for localhost or different domain structures
        document.cookie = `googtrans=/en/${targetLang}; path=/;`;

        // Reload to trigger translation
        window.location.reload();
    };

    return (
        <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
            <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${lang === 'en'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
            >
                ENG
            </button>
            <button
                onClick={() => switchLanguage('ur')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${lang === 'ur'
                        ? 'bg-white text-green-700 shadow-sm'
                        : 'text-gray-500 hover:text-green-700'
                    }`}
            >
                اردو
            </button>
        </div>
    );
};

// Helper to return an emoji icon for a vegetable name
export const getVeggieIcon = (name: string): string => {
    const lowerName = name.toLowerCase().trim();

    const iconMap: Record<string, string> = {
        // Core Veggies
        'tomato': '🍅',
        'tamatar': '🍅',
        'potato': '🥔',
        'aalu': '🥔',
        'aloo': '🥔',
        'onion': '🧅',
        'pyaz': '🧅',
        'garlic': '🧄',
        'lehsan': '🧄',
        'ginger': '🫚', // New ginger emoji, fallback to root
        'adrak': '🫚',
        'carrot': '🥕',
        'gajar': '🥕',
        'corn': '🌽',
        'makai': '🌽',
        'cucumber': '🥒',
        'kheera': '🥒',
        'eggplant': '🍆',
        'baingan': '🍆',
        'chili': '🌶️',
        'mirch': '🌶️',
        'capsicum': '🫑',
        'shimla': '🫑',
        'mushroom': '🍄',
        'broccoli': '🥦',
        'leafy': '🥬',
        'saag': '🥬',
        'palak': '🥬',

        // Fruits (just in case)
        'apple': '🍎',
        'banana': '🍌',
        'grapes': '🍇',
        'mango': '🥭',
        'lemon': '🍋',
        'nimbu': '🍋',

        // Staples
        'rice': '🍚',
        'chawal': '🍚',
        'wheat': '🌾',
        'gandum': '🌾',
    };

    // Direct match
    if (iconMap[lowerName]) return iconMap[lowerName];

    // Partial match (e.g. "red tomato")
    for (const key of Object.keys(iconMap)) {
        if (lowerName.includes(key)) return iconMap[key];
    }

    // Fallback for unknown items
    return '📦';
};

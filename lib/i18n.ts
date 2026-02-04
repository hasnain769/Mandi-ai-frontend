export type Locale = 'en' | 'ur';

export const dictionary = {
    en: {
        title: "Mandi Ledger",
        signOut: "Sign Out",
        cashInHand: "Estimated Cash (Today)",
        stockHeader: "Current Stock",
        loading: "Loading stock...",
        noStock: "No stock items found.",
        transactionsHeader: "Recent Transactions",
        noTransactions: "No transactions yet.",
        unit: "kg",
        updated: "Updated",
        soldTo: "SOLD to",
        stockIn: "STOCK IN",
        item: "Item",
        qty: "Qty",
        rate: "Rate",
        total: "Total",
        action: "Action",
        time: "Time"
    },
    ur: {
        title: "Mandi Khata",
        signOut: "Log Out",
        cashInHand: "Aaj Ki Kamai (Andazan)",
        stockHeader: "Maujooda Maal",
        loading: "Maal check ho raha hai...",
        noStock: "Koi maal nahi mila.",
        transactionsHeader: "Haaliya Len-Den",
        noTransactions: "Abhi koi soda nahi hua.",
        unit: "kilo",
        updated: "Update hua",
        soldTo: "BECHA",
        stockIn: "AAYA",
        item: "Cheez",
        qty: "Miqdaar",
        rate: "Rate",
        total: "Total",
        action: "Amal",
        time: "Waqt"
    }
};

export const useTranslation = (locale: Locale) => {
    return dictionary[locale];
};

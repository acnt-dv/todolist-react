export const CATEGORIES = {
    DAILY_LIST: 0,
    SHOP_LIST: 1,
    TARGET_LIST: 2,
    BOOK_LIST: 3,
    ARCHIVE_LIST: 4,
    getCategoryName: (input) => {
        for (let [key, value] of Object.entries(CATEGORIES))
            if (input === value)
                return key;
        return false;
    }
}

export const FA_CATEGORIES = {
    DAILY_LIST: 'لیست روزانه',
    SHOP_LIST: 'لیست خرید',
    TARGET_LIST: 'لیست اهداف',
    BOOK_LIST: 'لیست کتب',
    ARCHIVE_LIST: 'آرشیو',
    getFaCategoryName: (input) => {
        for (let [key, value] of Object.entries(FA_CATEGORIES))
            if (input === key)
                return value;
        return false;
    }
}
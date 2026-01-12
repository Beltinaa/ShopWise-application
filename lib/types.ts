export type Product = {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category: string; // p.sh. "featured", "bars", "groceries", etj.
    description?: string;
    retailer?: string;
    distance?: number;
    originalPrice?: number;
    inStock?: boolean;
    location?: string;
    market?: string;
    marketSlug?: string;
};

// Tipi i produktit
export type Product = {
    id: number;
    name: string;
    price: number;       // Çmimi si number
    imageUrl: string;    // URL imazhi
    category: string; // p.sh. "featured", "bars", "groceries", etj.
};

// Tipi për renditje me "lowest" | "highest"
export type SortKey = "lowest" | "highest";

/**
 * Rendit produktet sipas order "asc" | "desc"
 * Përdoret për faqet që kërkojnë këtë format
 */
export function sortProducts(
    products: Product[],
    order: "asc" | "desc" = "asc"
): Product[] {
    return [...products].sort((a, b) =>
        order === "asc" ? a.price - b.price : b.price - a.price
    );
}

/**
 * Rendit produktet sipas SortKey "lowest" | "highest"
 * Përdoret për faqet që kanë state SortKey
 */
export function sortProductsByKey(
    products: Product[],
    sortKey: SortKey = "lowest"
): Product[] {
    return [...products].sort((a, b) =>
        sortKey === "lowest" ? a.price - b.price : b.price - a.price
    );
}

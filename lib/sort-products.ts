import type { Product } from "@/lib/types";
export type { Product } from "@/lib/types";

// Tipi për renditje me "lowest" | "highest"
export type SortKey = "lowest" | "highest" | "location";

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
    return [...products].sort((a, b) => {
        if (sortKey === "location") {
            const aLocation = (a.location || "").toLowerCase();
            const bLocation = (b.location || "").toLowerCase();
            const byLocation = aLocation.localeCompare(bLocation);
            if (byLocation !== 0) return byLocation;
        }
        return sortKey === "lowest" ? a.price - b.price : b.price - a.price;
    });
}

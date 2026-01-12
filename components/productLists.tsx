"use client";

import { useState } from "react";
import { Product, sortProducts } from "@/lib/sort-products";

type Props = {
    products: Product[];
};

export default function ProductsList({ products }: Props) {
    const [order, setOrder] = useState<"asc" | "desc">("asc");

    const sortedProducts = sortProducts(products, order);

    return (
        <div>
            <div className="mb-4">
                <label>Sort by price: </label>
                <select
                    value={order}
                    onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
                    className="border p-2 rounded"
                >
                    <option value="asc">Lowest to Highest</option>
                    <option value="desc">Highest to Lowest</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sortedProducts.map((product) => (
                    <div key={product.id} className="border p-4 rounded shadow">
                        <img src={product.imageUrl} alt={product.name} className="mb-2" />
                        <h3 className="font-bold">{product.name}</h3>
                        <p>${product.price}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

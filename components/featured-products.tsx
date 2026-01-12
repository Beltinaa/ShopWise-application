'use client'

import Image from "next/image"
import { ShoppingCart, Heart } from "lucide-react"
import { useShop } from "@/components/shop-provider"
import type { Product } from "@/lib/types"
import { useMemo, useState } from "react"

export function FeaturedProducts() {
    const { toggleWishlist, addToCart, wishlist, cart } = useShop()
    const [order, setOrder] = useState<"asc" | "desc">("asc")

    const products: Product[] = [
        { id: 1, name: "Ariel Detergjent Rrobash", price: 13.99, imageUrl: "/images/Ariel.jpeg", category: "Groceries" },
        { id: 2, name: "Ujë i madh Lajthiza", price: 1.29, imageUrl: "/images/uje.jpeg", category: "Groceries" },
        { id: 3, name: "Pizza nga Piceria Era", price: 7.99, imageUrl: "/images/pizza.jpeg", category: "Restaurants" },
        { id: 4, name: "Vodka Sour", price: 6.50, imageUrl: "/images/vodka.jpeg", category: "Bars" },
        { id: 5, name: "Coffee + Briosh + Ujë (Ofertë)", price: 2.99, imageUrl: "/images/offer.jpeg", category: "Bars" },
        { id: 6, name: "Fresh tea", price: 1.50, imageUrl: "/images/tea.jpeg", category: "Groceries" },
        { id: 7, name: "Cocktail Mojito", price: 5.50, imageUrl: "/images/mojito.jpeg", category: "Bars" },
        { id: 8, name: "Sushi ", price: 12.99, imageUrl: "/images/sushi.jpeg", category: "Restaurants" },
    ]

    const isWishlisted = (id: number) => wishlist.some((p) => p.id === id)
    const isInCart = (id: number) => cart.some((p) => p.id === id)

    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) =>
            order === "asc" ? a.price - b.price : b.price - a.price
        )
    }, [order])

    return (
        <section className="mt-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-2xl font-semibold mb-4 md:mb-0">
                    Featured Products
                </h2>

                <div className="flex items-center gap-2">
                    <label className="font-medium text-sm">Sort by price:</label>
                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
                        className="border text-sm p-1 rounded"
                    >
                        <option value="asc">Lowest to Highest</option>
                        <option value="desc">Highest to Lowest</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sortedProducts.map((product) => (
                    <div
                        key={product.id}
                        className="border rounded-lg p-2 hover:shadow-md transition text-sm"
                    >
                        <div className="relative w-full h-32 mb-2">
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover rounded"
                            />
                        </div>

                        <h3 className="text-sm font-medium">{product.name}</h3>
                        <p className="text-gray-500 mb-2">${product.price.toFixed(2)}</p>

                        <div className="flex gap-1">
                            <button
                                onClick={() => addToCart(product)}
                                className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                    isInCart(product.id)
                                        ? "bg-gray-400 text-white"
                                        : "bg-black text-white"
                                }`}
                            >
                                <ShoppingCart size={14} />
                                {isInCart(product.id) ? "Added" : "Add"}
                            </button>

                            <button
                                onClick={() => toggleWishlist(product)}
                                className="p-1 border rounded text-xs"
                            >
                                <Heart
                                    size={14}
                                    className={
                                        isWishlisted(product.id)
                                            ? "fill-red-500 text-red-500"
                                            : "text-gray-500"
                                    }
                                />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

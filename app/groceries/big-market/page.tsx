'use client'

import Image from "next/image"
import { ShoppingCart, Heart } from "lucide-react"
import { useShop } from "@/components/shop-provider"
import type { Product } from "@/lib/types"

export default function BigMarketPage() {
    const { addToCart, toggleWishlist, wishlist, cart } = useShop()

    // PRODUCTS ONLY FOR BIG MARKET
    const products: Product[] = [
        {
            id: 301,
            name: "Fanta Exotic 500ml",
            price: 135, // Big Market price
            imageUrl: "/images/fanta-exotic.jpg",
            category: "drinks",
        },
    ]

    const isWishlisted = (id: number) =>
        wishlist.some((p) => p.id === id)

    const isInCart = (id: number) =>
        cart.some((p) => p.id === id)

    return (
        <div className="min-h-screen bg-background container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-2">Big Market</h1>
            <p className="text-muted-foreground mb-8">
                Products available in Big Market
            </p>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="border rounded-2xl p-4 hover:shadow-lg transition bg-card"
                    >
                        {/* IMAGE */}
                        <div className="relative w-full h-48 mb-4">
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover rounded-lg"
                            />
                        </div>

                        {/* NAME */}
                        <h3 className="text-lg font-semibold">
                            {product.name}
                        </h3>

                        {/* PRICE */}
                        <p className="text-lg font-bold mb-4">
                            {product.price} ALL
                        </p>

                        {/* ACTIONS */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => addToCart(product)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                                    isInCart(product.id)
                                        ? "bg-gray-400 text-white"
                                        : "bg-black text-white"
                                }`}
                            >
                                <ShoppingCart size={16} />
                                {isInCart(product.id) ? "Added" : "Add to cart"}
                            </button>

                            <button
                                onClick={() => toggleWishlist(product)}
                                className="p-2 border rounded-lg"
                            >
                                <Heart
                                    size={16}
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
        </div>
    )
}

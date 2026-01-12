'use client'

import Image from "next/image"
import { ShoppingCart, Heart } from "lucide-react"
import { useShop } from "@/components/shop-provider"
import type { Product } from "@/lib/types"
import { useEffect, useMemo, useState } from "react"

export function FeaturedProducts() {
    const { toggleWishlist, addToCart, wishlist, cart } = useShop()
    const [order, setOrder] = useState<"asc" | "desc">("asc")
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        let mounted = true

        async function load() {
            try {
                setLoading(true)
                const res = await fetch("/api/products?category=featured&sort=lowest", {
                    signal: controller.signal,
                })
                const data = await res.json()
                if (!mounted) return
                setProducts(data.products || [])
            } catch (err: any) {
                // Ignore aborts when unmounting or re-rendering
                if (err?.name !== "AbortError") {
                    console.error("Failed to load featured products", err)
                }
            } finally {
                if (mounted) setLoading(false)
            }
        }

        load()
        return () => {
            mounted = false
            if (!controller.signal.aborted) controller.abort()
        }
    }, [])

    // Kontrollon nëse produkti është në wishlist dhe cart
    const isWishlisted = (id: number) => wishlist.some((p) => p.id === id)
    const isInCart = (id: number) => cart.some((p) => p.id === id)

    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) =>
            order === "asc" ? a.price - b.price : b.price - a.price
        )
    }, [products, order])

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

            {loading && (
                <div className="text-sm text-muted-foreground">Loading featured products…</div>
            )}

            {!loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sortedProducts.map((product) => (
                        <div
                            key={product.id}
                            className="border rounded-xl p-4 hover:shadow-lg transition"
                        >
                            {/* FOTO */}
                            <div className="relative w-full h-48 mb-4">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>

                            {/* EMRI + ÇMIMI */}
                            <h3 className="text-lg font-medium">{product.name}</h3>
                            <p className="text-gray-500 mb-4">${product.price.toFixed(2)}</p>

                            {/* BUTONAT */}
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
            )}
        </section>
    )
}

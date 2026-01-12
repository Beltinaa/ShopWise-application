"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"

import { useShop } from "@/components/shop-provider"
import type { Product } from "@/lib/types"

type Props = {
  marketName: string
  marketSlug: string
  subtitle?: string
}

export function MarketProductsPage({ marketName, marketSlug, subtitle }: Props) {
  const { addToCart, toggleWishlist, wishlist, cart } = useShop()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        setLoading(true)
        setError("")
        // Use /api/search as the single source of truth (works reliably on Vercel).
        const res = await fetch(`/api/search?marketSlug=${marketSlug}`, {
          signal: controller.signal,
        })
        const data = await res.json()
        setProducts(data.results || [])
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          setError("Failed to load products for this market.")
        }
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [marketSlug])

  const isWishlisted = (id: number) => wishlist.some((p) => p.id === id)
  const isInCart = (id: number) => cart.some((p) => p.id === id)

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{marketName}</h1>
      <p className="text-muted-foreground mb-8">
        {subtitle || "Products available in this market"}
      </p>

      {loading && <div className="text-sm text-muted-foreground">Loading products…</div>}
      {error && <div className="text-sm text-destructive mb-4">{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div className="text-sm text-muted-foreground">No products available.</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-2xl p-4 bg-card hover:shadow-lg transition">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-lg font-bold mb-4">{product.price} ALL</p>

              <div className="flex gap-3">
                <button
                  onClick={() => addToCart(product)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                    isInCart(product.id) ? "bg-gray-400 text-white" : "bg-black text-white"
                  }`}
                >
                  <ShoppingCart size={16} />
                  {isInCart(product.id) ? "Added" : "Add to cart"}
                </button>

                <button onClick={() => toggleWishlist(product)} className="p-2 border rounded-lg">
                  <Heart
                    size={16}
                    className={
                      isWishlisted(product.id) ? "fill-red-500 text-red-500" : "text-gray-500"
                    }
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

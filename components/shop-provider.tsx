"use client"

import { createContext, useContext, useState } from "react"
import type { Product } from "@/lib/types"

type ShopContextType = {
    cart: Product[]
    wishlist: Product[]
    addToCart: (product: Product) => void
    toggleWishlist: (product: Product) => void

    // 🔽 FUNKSIONE TË REJA
    isWishlisted: (id: number) => boolean
    removeFromWishlist: (id: number) => void
}

const ShopContext = createContext<ShopContextType | null>(null)

export function ShopProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Product[]>([])
    const [wishlist, setWishlist] = useState<Product[]>([])

    // shton produkt në cart
    const addToCart = (product: Product) => {
        setCart((prev) => {
            const exists = prev.find((p) => p.id === product.id)
            if (exists) return prev // ose mund ta menaxhosh quantity këtu
            return [...prev, product]
        })
    }


    // toggle për wishlist
    const toggleWishlist = (product: Product) => {
        setWishlist((prev) => {
            const exists = prev.find((p) => p.id === product.id)
            return exists
                ? prev.filter((p) => p.id !== product.id)
                : [...prev, product]
        })
    }

    // kontrollon nëse produkti është në wishlist
    const isWishlisted = (id: number) => wishlist.some((p) => p.id === id)

    // heq produkt nga wishlist
    const removeFromWishlist = (id: number) => {
        setWishlist((prev) => prev.filter((p) => p.id !== id))
    }

    return (
        <ShopContext.Provider
            value={{
                cart,
                wishlist,
                addToCart,
                toggleWishlist,
                isWishlisted,
                removeFromWishlist,
            }}
        >
            {children}
        </ShopContext.Provider>
    )
}

export function useShop() {
    const context = useContext(ShopContext)
    if (!context) {
        throw new Error("useShop must be used inside ShopProvider")
    }
    return context
}

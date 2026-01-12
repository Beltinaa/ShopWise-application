import { useState } from "react"
import type { Product } from "@/lib/types"

export function useShop() {
    const [cart, setCart] = useState<Product[]>([])
    const [wishlist, setWishlist] = useState<Product[]>([])

    const addToCart = (product: Product) => setCart([...cart, product])
    const toggleWishlist = (product: Product) => {
        if (wishlist.some((p) => p.id === product.id)) {
            setWishlist(wishlist.filter((p) => p.id !== product.id))
        } else {
            setWishlist([...wishlist, product])
        }
    }

    return { cart, wishlist, addToCart, toggleWishlist }
}

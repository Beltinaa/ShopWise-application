"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { CartItem, Product } from "@/lib/types"

type ShopContextValue = {
  cart: CartItem[]
  wishlist: Product[]
  addToCart: (product: Product) => void
  removeFromCart: (itemId: string) => void
  updateCartQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  toggleWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  isWishlisted: (productId: number) => boolean
  moveWishlistToCart: (product: Product) => void
}

const ShopContext = createContext<ShopContextValue | undefined>(undefined)

const CART_KEY = "shopwise_cart"
const WISHLIST_KEY = "shopwise_wishlist"

function normalizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const product = (item as CartItem).product
      if (!product || typeof product !== "object") return null
      const id = String((item as CartItem).id)
      const quantity = Number((item as CartItem).quantity)
      if (!id || !Number.isFinite(quantity)) return null
      return { id, quantity: Math.max(1, quantity), product }
    })
    .filter((item): item is CartItem => Boolean(item))
}

function normalizeWishlistItems(raw: unknown): Product[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const id = Number((item as Product).id)
      if (!Number.isFinite(id)) return null
      return { ...(item as Product), id }
    })
    .filter((item): item is Product => Boolean(item))
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const cartData = normalizeCartItems(readStorage<unknown>(CART_KEY, []))
    const wishlistData = normalizeWishlistItems(readStorage<unknown>(WISHLIST_KEY, []))
    setCart(cartData)
    setWishlist(wishlistData)
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) return
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  }, [cart, isReady, wishlist])

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === CART_KEY) {
        setCart(normalizeCartItems(readStorage<unknown>(CART_KEY, [])))
      }
      if (event.key === WISHLIST_KEY) {
        setWishlist(normalizeWishlistItems(readStorage<unknown>(WISHLIST_KEY, [])))
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const next = [...prev]
      const existing = next.find((item) => item.product.id === product.id)
      if (existing) {
        existing.quantity += 1
        return next
      }
      return [...next, { id: `${product.id}-${Date.now()}`, quantity: 1, product }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId))
  }

  const updateCartQuantity = (itemId: string, quantity: number) => {
    const safeQuantity = Math.max(1, quantity)
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: safeQuantity } : item)),
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id)
      if (exists) {
        return prev.filter((item) => item.id !== product.id)
      }
      return [product, ...prev]
    })
  }

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId))
  }

  const moveWishlistToCart = (product: Product) => {
    addToCart(product)
    removeFromWishlist(product.id)
  }

  const isWishlisted = (productId: number) => wishlist.some((item) => item.id === productId)

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      removeFromWishlist,
      isWishlisted,
      moveWishlistToCart,
    }),
    [cart, wishlist],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error("useShop must be used within ShopProvider")
  }
  return context
}

'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'shopwise_wishlist'
const CART_KEY = 'shopwise_cart'

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setItems(JSON.parse(raw))
      } catch {
        setItems([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function removeItem(id: number) {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }

  function moveToCart(product: any) {
    const raw = localStorage.getItem(CART_KEY)
    let cart = []
    try {
      cart = raw ? JSON.parse(raw) : []
    } catch {
      cart = []
    }
    const newItem = { id: Date.now(), quantity: 1, product }
    cart.push(newItem)
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
    // remove from wishlist
    removeItem(product.id)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>

      {items.length === 0 && <div className="text-muted-foreground">Your wishlist is empty.</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((p) => (
          <div key={p.id} className="bg-card rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20">
                <img src={p.imageUrl || '/placeholder.svg'} alt={p.name} className="w-full object-cover rounded" />
              </div>
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.retailer}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => moveToCart(p)} className="px-3 py-1 bg-primary text-primary-foreground rounded">Add to cart</button>
              <button onClick={() => removeItem(p.id)} className="px-3 py-1 bg-destructive text-destructive-foreground rounded">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

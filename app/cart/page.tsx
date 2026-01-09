'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/product-card'

type CartItem = {
  id: number
  quantity: number
  product: any
}

const STORAGE_KEY = 'shopwise_cart'

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])

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
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateQuantity(id: number, q: number) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: q } : it)))
  }

  const total = items.reduce((sum, it) => sum + (it.product.price || 0) * it.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {items.length === 0 && <div className="text-muted-foreground">Your cart is empty.</div>}

      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.id} className="bg-card rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20">
                <img src={it.product.imageUrl || '/placeholder.svg'} alt={it.product.name} className="w-full object-cover rounded" />
              </div>
              <div>
                <div className="font-semibold">{it.product.name}</div>
                <div className="text-sm text-muted-foreground">{it.product.retailer}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input type="number" value={it.quantity} min={1} onChange={(e) => updateQuantity(it.id, Math.max(1, Number(e.target.value || 1)))} className="w-20 px-2 py-1 border rounded" />
              <div className="font-bold">{((it.product.price || 0) * it.quantity).toLocaleString()} ALL</div>
              <button onClick={() => removeItem(it.id)} className="px-3 py-1 bg-destructive text-destructive-foreground rounded">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-6 p-4 border border-border bg-card rounded-lg flex items-center justify-between">
          <div className="text-lg font-semibold">Total</div>
          <div className="text-2xl font-bold">{total.toLocaleString()} ALL</div>
        </div>
      )}
    </div>
  )
}

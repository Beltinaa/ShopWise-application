'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useShop } from '@/components/shop-provider'
import type { Product } from '@/lib/types'

export default function CartPage() {
    const router = useRouter()
    const { cart } = useShop() // marrim cart nga ShopProvider
    const [items, setItems] = useState<(Product & { quantity: number })[]>([])

    // inicializojmë quantity për secilin produkt
    useEffect(() => {
        setItems(cart.map((p) => ({ ...p, quantity: 1 })))
    }, [cart])

    const updateQuantity = (id: number, q: number) => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: q } : it)))
    }

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((it) => it.id !== id))
    }

    const total = items.reduce(
        (sum, it) => sum + (Number(it.price) || 0) * it.quantity,
        0
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    aria-label="Go back"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted/60 text-foreground transition hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <h1 className="text-2xl font-bold">Your Cart</h1>
            </div>

            {items.length === 0 && (
                <div className="text-muted-foreground">Your cart is empty.</div>
            )}

            <div className="space-y-4">
                {items.map((it) => (
                    <div key={it.id} className="bg-card rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-20">
                                <img
                                    src={it.imageUrl || '/placeholder.svg'}
                                    alt={it.name}
                                    className="w-full object-cover rounded"
                                />
                            </div>
                            <div>
                                <div className="font-semibold">{it.name}</div>
                                <div className="text-sm text-muted-foreground">{it.category}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={it.quantity}
                                min={1}
                                onChange={(e) =>
                                    updateQuantity(it.id, Math.max(1, Number(e.target.value || 1)))
                                }
                                className="w-20 px-2 py-1 border rounded"
                            />
                            <div className="font-bold">
                                {((Number(it.price) || 0) * it.quantity).toLocaleString()} ALL
                            </div>
                            <button
                                onClick={() => removeItem(it.id)}
                                className="px-3 py-1 bg-destructive text-destructive-foreground rounded"
                            >
                                Remove
                            </button>
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

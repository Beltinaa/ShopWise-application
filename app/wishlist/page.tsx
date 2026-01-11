'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useShop } from '@/components/shop-provider'
import type { Product } from '@/lib/types'

export default function WishlistPage() {
  const router = useRouter()
  const { wishlist, moveWishlistToCart, removeFromWishlist } = useShop()

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
        <h1 className="text-2xl font-bold">Your Wishlist</h1>
      </div>

      {wishlist.length === 0 && <div className="text-muted-foreground">Your wishlist is empty.</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wishlist.map((p: Product) => (
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
              <button onClick={() => moveWishlistToCart(p)} className="px-3 py-1 bg-primary text-primary-foreground rounded">Add to cart</button>
              <button onClick={() => removeFromWishlist(p.id)} className="px-3 py-1 bg-destructive text-destructive-foreground rounded">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

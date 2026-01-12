'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useShop } from '@/components/shop-provider'

export default function WishlistPage() {
    const router = useRouter()
    const { wishlist, toggleWishlist } = useShop()

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => router.back()}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <h1 className="text-2xl font-bold">Your Wishlist</h1>
            </div>

            {wishlist.length === 0 && (
                <div className="text-muted-foreground">Your wishlist is empty.</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlist.map((p) => (
                    <div
                        key={p.id}
                        className="bg-card p-4 rounded-lg flex justify-between"
                    >
                        <div className="flex gap-4">
                            <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-20 h-20 object-cover rounded"
                            />
                            <div>
                                <div className="font-semibold">{p.name}</div>
                                <div className="text-sm">${p.price}</div>
                                <div className="text-xs text-muted-foreground">
                                    {p.category}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleWishlist(p)}
                            className="px-3 py-1 bg-destructive text-white rounded"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

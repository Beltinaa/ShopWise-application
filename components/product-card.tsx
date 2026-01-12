'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Heart } from 'lucide-react'
import type { Product } from '@/lib/types'
import { useShop } from '@/components/shop-provider'

type ProductCardProps = {
    product: Product
    isWishlisted?: (id: number) => boolean
    onAddToWishlist?: (product: Product) => void
    onAddToCart?: (product: Product) => void
}

export function ProductCard({
                                product,
                                isWishlisted,
                                onAddToWishlist,
                                onAddToCart,
                            }: ProductCardProps) {
    const shop = useShop()

    const [isAddingWishlist, setIsAddingWishlist] = useState(false)
    const [isAddingCart, setIsAddingCart] = useState(false)

    // përdor props nëse ekzistojnë, përndryshe ShopContext
    const resolvedIsWishlisted = isWishlisted ?? shop.isWishlisted
    const resolvedAddToWishlist = onAddToWishlist ?? shop.toggleWishlist
    const resolvedAddToCart = onAddToCart ?? shop.addToCart

    const wishlisted = useMemo(
        () => resolvedIsWishlisted(product.id),
        [resolvedIsWishlisted, product.id]
    )

    const handleAddToCart = () => {
        setIsAddingCart(true)
        resolvedAddToCart(product)
        setTimeout(() => setIsAddingCart(false), 500)
    }

    const handleToggleWishlist = () => {
        setIsAddingWishlist(true)
        resolvedAddToWishlist(product)
        setTimeout(() => setIsAddingWishlist(false), 500)
    }

    return (
        <div className="border rounded-xl p-4 hover:shadow-lg transition">
            {/* Image */}
            <div className="relative w-full h-48 mb-4">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                />
            </div>

            {/* Emri dhe cmimi */}
            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="text-gray-500 mb-4">${product.price.toFixed(2)}</p>

            {/* Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={handleAddToCart}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                        isAddingCart ? 'bg-gray-400 text-white' : 'bg-black text-white'
                    }`}
                >
                    <ShoppingCart size={16} />
                    {isAddingCart ? 'Added' : 'Add to cart'}
                </button>

                <button
                    onClick={handleToggleWishlist}
                    className={`p-2 border rounded-lg ${
                        wishlisted ? 'bg-red-100' : 'bg-white'
                    }`}
                >
                    <Heart
                        size={16}
                        className={
                            wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'
                        }
                    />
                </button>
            </div>
        </div>
    )
}

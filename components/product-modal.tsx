"use client"

import { X, MapPin, Store, TrendingDown } from "lucide-react"
import Image from "next/image"
import type { Product } from "@/lib/types"

interface PriceComparison {
  retailer: string
  price: number
  distance: number
  inStock: boolean
}

const demoPriceComparisons: PriceComparison[] = [
  { retailer: "Tech Store Tirana", price: 89900, distance: 2.5, inStock: true },
  { retailer: "Mobile World", price: 91500, distance: 3.8, inStock: true },
  { retailer: "Computer Center", price: 92900, distance: 1.2, inStock: false },
  { retailer: "iStore Albania", price: 90500, distance: 2.1, inStock: true },
]

export function ProductModal({
  product,
  isOpen,
  onClose,
}: {
  product: Product
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen) return null

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border"
      >
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              {discount > 0 && (
                <div className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  {discount}% OFF
                </div>
              )}
              <Image src={product.imageUrl || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-foreground">{product.description}</p>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Store className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{product.retailer}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{product.distance} km away</span>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="text-3xl font-bold text-foreground">{product.price.toLocaleString()} ALL</div>
                {product.originalPrice && (
                  <div className="text-lg text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString()} ALL
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Price Comparison</h3>
            <div className="space-y-3">
              {demoPriceComparisons.map((comparison, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{comparison.retailer}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3" />
                      {comparison.distance} km
                      {!comparison.inStock && <span className="text-destructive ml-2">Out of Stock</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-foreground">{comparison.price.toLocaleString()} ALL</div>
                    {index === 0 && <div className="text-xs text-primary font-medium">Lowest Price</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

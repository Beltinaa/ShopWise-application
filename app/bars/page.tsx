'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/product-card'

type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export default function BarsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/search?category=Bars')
        if (!res.ok) throw new Error('Failed to fetch bars')

        const data = await res.json()
        setProducts(data.results || [])
      } catch (e) {
        setError('Could not load bars.')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Bars in Tirana</h1>

      {loading && <div className="text-sm text-muted-foreground">Loading…</div>}

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div className="text-muted-foreground">No bars found.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}

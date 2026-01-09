'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SearchBar } from '@/components/search-bar'
import { ProductCard } from '@/components/product-card'
import { ProductModal } from '@/components/product-modal'

type Product = {
  id: number
  name: string
  price: number
  imageUrl: string
  description: string
  retailer: string
  distance: number
  originalPrice?: number
  category?: string
  inStock?: boolean
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const q = searchParams.get('q') || ''
  const [query, setQuery] = useState(q)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Product | null>(null)

  useEffect(() => {
    setQuery(q)
    fetchResults(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  async function fetchResults(qParam: string) {
    setLoading(true)
    try {
      const url = `/api/search?q=${encodeURIComponent(qParam)}`
      const res = await fetch(url)
      const data = await res.json()
      setProducts(data.results || [])
    } catch (e) {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  function onSearch(newQuery: string) {
    // update URL to /search?q=...
    router.push(`/search?q=${encodeURIComponent(newQuery)}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <SearchBar />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Search results{query ? ` for "${query}"` : ''}</h2>

          {loading && <div className="text-sm text-muted-foreground">Loading results…</div>}

          {!loading && products.length === 0 && <div className="text-sm text-muted-foreground">No results found.</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {products.map((p) => (
              <div key={p.id} onClick={() => setSelected(p)}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected && <ProductModal product={selected} isOpen={!!selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SearchBar } from '@/components/search-bar'
import { ProductCard } from '@/components/product-card'
import { ProductModal } from '@/components/product-modal'
import type { Product } from '@/lib/types'
import { SortDropdown } from '@/components/sort-dropdown'
import { sortProductsByKey, type SortKey } from '@/lib/sort-products'

export default function SearchPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const q = searchParams.get('q') || ''
    const [query, setQuery] = useState(q)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState<Product | null>(null)
    const [sortKey, setSortKey] = useState<SortKey>('lowest')
    const [locationFilter, setLocationFilter] = useState<string>("")
    const [availableLocations, setAvailableLocations] = useState<string[]>([])

    // Rendit produktet sipas sortKey
    const sortedProducts = useMemo(
        () => sortProductsByKey(products, sortKey),
        [products, sortKey]
    )

    useEffect(() => {
        setQuery(q)
    }, [q])

    useEffect(() => {
        fetchResults(q, sortKey, locationFilter)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q, sortKey, locationFilter])

    // Funksioni për search global
    async function fetchResults(qParam: string, sort: SortKey, location?: string) {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (qParam) params.set('q', qParam)
            if (location) params.set('location', location)
            params.set('sort', sort)

            const res = await fetch(`/api/search?${params.toString()}`)
            const data = await res.json()
            const nextProducts: Product[] = data.results || []
            setProducts(nextProducts)

            const distinctLocations = Array.from(
                new Set(
                    nextProducts
                        .map((p) => p.location)
                        .filter((loc): loc is string => Boolean(loc && loc.trim()))
                )
            ).sort((a, b) => a.localeCompare(b))
            setAvailableLocations(distinctLocations)
        } finally {
            setLoading(false)
        }
    }

    function onSearch(newQuery: string) {
        router.push(`/search?q=${encodeURIComponent(newQuery)}`)
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Search bar */}
                <div className="max-w-3xl mx-auto">
                    <SearchBar onSearch={onSearch} initialQuery={query} />
                </div>

                {/* Rezultatet */}
                <div className="mt-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                        <h2 className="text-2xl font-bold">
                            Search results{query ? ` for "${query}"` : ''}
                        </h2>

                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                            <SortDropdown value={sortKey} onChange={setSortKey} />

                            <select
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="border p-2 rounded"
                            >
                                <option value="">All locations</option>
                                {availableLocations.map((loc) => (
                                    <option key={loc} value={loc}>
                                        {loc}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading && (
                        <div className="text-sm text-muted-foreground">
                            Loading results…
                        </div>
                    )}

                    {!loading && products.length === 0 && (
                        <div className="text-sm text-muted-foreground">No results found.</div>
                    )}

                    {/* Grid i produkteve */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {sortedProducts.map((p) => (
                            <div key={p.id} onClick={() => setSelected(p)}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal për produktin e zgjedhur */}
            {selected && (
                <ProductModal
                    product={selected}
                    isOpen={!!selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    )
}

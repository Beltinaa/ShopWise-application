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
    const [sortKey, setSortKey] = useState<SortKey>('lowest') // "lowest" | "highest"

    // Lista e të gjitha produkteve (featured + groceries + bars + ...)
    const allProducts: Product[] = [
        { id: 1, name: 'Product One', price: 29.99, imageUrl: '/images/Komiteti.jpeg', category: 'featured' },
        { id: 2, name: 'Product Two', price: 39.99, imageUrl: '/images/Kino.jpeg', category: 'featured' },
        { id: 3, name: 'Product Three', price: 49.99, imageUrl: '/images/Mugo.jpeg', category: 'featured' },
        { id: 4, name: 'Apple', price: 5.99, imageUrl: '/images/apple.jpeg', category: 'groceries' },
        { id: 5, name: 'Banana', price: 3.99, imageUrl: '/images/banana.jpeg', category: 'bigmarket' },
        { id: 6, name: 'Beer', price: 2.99, imageUrl: '/images/beer.jpeg', category: 'bars' },
        { id: 7, name: 'Pizza', price: 12.99, imageUrl: '/images/pizza.jpeg', category: 'restaurants' },
        { id: 8, name: 'Burger', price: 9.99, imageUrl: '/images/burger.jpeg', category: 'restaurants' },
        // shto këtu të gjitha produktet që ke
    ]

    // Rendit produktet sipas sortKey
    const sortedProducts = useMemo(
        () => sortProductsByKey(products, sortKey),
        [products, sortKey]
    )

    useEffect(() => {
        setQuery(q)
        fetchResults(q)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q])

    // Funksioni për search global
    function fetchResults(qParam: string) {
        setLoading(true)
        // Filtrimi bazohet vetëm në emrin e produktit, pa marrë parasysh kategorinë
        const filtered = allProducts.filter((p) =>
            p.name.toLowerCase().includes(qParam.toLowerCase())
        )
        setProducts(filtered)
        setLoading(false)
    }

    function onSearch(newQuery: string) {
        router.push(`/search?q=${encodeURIComponent(newQuery)}`)
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Search bar */}
                <div className="max-w-3xl mx-auto">
                    <SearchBar onSearch={onSearch} />
                </div>

                {/* Rezultatet */}
                <div className="mt-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                        <h2 className="text-2xl font-bold">
                            Search results{query ? ` for "${query}"` : ''}
                        </h2>

                        {/* Dropdown për renditje */}
                        <SortDropdown value={sortKey} onChange={setSortKey} />
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

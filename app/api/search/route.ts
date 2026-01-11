// src/app/api/search/route.ts
'use server'

import { NextResponse } from 'next/server'
import { demoProducts } from '@/lib/demo-products'
import type { Product } from '@/lib/types'

function parseBool(v: string | null) {
    if (!v) return undefined
    return v === '1' || v.toLowerCase() === 'true'
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url)

        const q = (url.searchParams.get('q') || '').trim().toLowerCase()
        const category = url.searchParams.get('category') || ''
        const seller = url.searchParams.get('seller') || ''
        const priceMin = url.searchParams.get('priceMin')
        const priceMax = url.searchParams.get('priceMax')
        const inStock = parseBool(url.searchParams.get('inStock'))
        const sort = url.searchParams.get('sort') || 'relevance' // lowest, highest, name, newest, distance, relevance

        let results: Product[] = demoProducts.slice()

        // --- FILTERING ---
        if (q) {
            results = results.filter(p =>
                ((p.name ?? '') + ' ' + (p.description ?? '') + ' ' + (p.retailer ?? ''))
                    .toLowerCase()
                    .includes(q)
            )
        }

        if (category) {
            results = results.filter(p => (p.category ?? '').toLowerCase() === category.toLowerCase())
        }

        if (seller) {
            results = results.filter(p => (p.retailer ?? '').toLowerCase().includes(seller.toLowerCase()))
        }

        if (priceMin) {
            const v = Number(priceMin)
            if (!Number.isNaN(v)) results = results.filter(p => (p.price ?? 0) >= v)
        }

        if (priceMax) {
            const v = Number(priceMax)
            if (!Number.isNaN(v)) results = results.filter(p => (p.price ?? 0) <= v)
        }

        if (typeof inStock === 'boolean') {
            results = results.filter(p => !!p.inStock === inStock)
        }

        // --- SORTING ---
        results.sort((a, b) => {
            const aPrice = a.price ?? 0
            const bPrice = b.price ?? 0
            const aDistance = a.distance ?? 0
            const bDistance = b.distance ?? 0

            switch (sort) {
                case 'lowest':
                    return aPrice - bPrice
                case 'highest':
                    return bPrice - aPrice
                case 'name':
                    return (a.name ?? '').localeCompare(b.name ?? '')
                case 'newest':
                    return b.id - a.id
                case 'distance':
                    return aDistance - bDistance
                default: // relevance
                    return aPrice - bPrice
            }
        })

        return NextResponse.json({ results }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

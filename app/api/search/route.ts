// Simple Next.js route handler for search
import { NextResponse } from 'next/server'
import { demoProducts } from '@/lib/demo-products'

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

    let results = demoProducts.slice()

    if (q) {
      results = results.filter(p =>
        (p.name + ' ' + p.description + ' ' + (p.retailer || '')).toLowerCase().includes(q)
      )
    }
    if (category) {
      results = results.filter(p => (p.category || '').toLowerCase() === category.toLowerCase())
    }
    if (seller) {
      results = results.filter(p => (p.retailer || '').toLowerCase().includes(seller.toLowerCase()))
    }
    if (priceMin) {
      const v = Number(priceMin)
      if (!Number.isNaN(v)) results = results.filter(p => p.price >= v)
    }
    if (priceMax) {
      const v = Number(priceMax)
      if (!Number.isNaN(v)) results = results.filter(p => p.price <= v)
    }
    if (typeof inStock === 'boolean') {
      results = results.filter(p => !!p.inStock === inStock)
    }

    // Sorting
    if (sort === 'lowest') {
      results.sort((a, b) => a.price - b.price)
    } else if (sort === 'highest') {
      results.sort((a, b) => b.price - a.price)
    } else if (sort === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'newest') {
      results.sort((a, b) => b.id - a.id)
    } else if (sort === 'distance') {
      results.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    } else {
      // relevance (default)
      results.sort((a, b) => a.price - b.price)
    }

    return NextResponse.json({ results }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

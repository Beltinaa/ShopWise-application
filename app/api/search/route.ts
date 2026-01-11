// Simple Next.js route handler for search
import { NextResponse } from 'next/server'

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
  location?: string
}

const demoProducts: Product[] = [
  // Electronics / Tech
  { id: 1, name: 'iPhone 14', price: 89900, imageUrl: '/iphone-14.png', description: 'Apple smartphone 128GB', retailer: 'Tech Store Tirana', distance: 2.5, originalPrice: 95000, category: 'Electronics', inStock: true, location: 'Tirana' },
  { id: 2, name: 'Samsung Galaxy S23', price: 79900, imageUrl: '/samsung-galaxy-s23.png', description: 'Samsung smartphone 256GB', retailer: 'Mobile World', distance: 3.8, originalPrice: 85000, category: 'Electronics', inStock: true, location: 'Tirana' },
  { id: 3, name: 'MacBook Air M2', price: 119900, imageUrl: '/macbook-air-m2.png', description: 'Apple laptop M2 chip', retailer: 'Computer Center', distance: 1.2, category: 'Computers', inStock: false, location: 'Tirana' },
  { id: 4, name: 'Sony WH-1000XM5', price: 35900, imageUrl: '/wireless-headphones.png', description: 'Noise-cancelling headphones', retailer: 'Audio Pro', distance: 4.5, originalPrice: 39900, category: 'Audio', inStock: true, location: 'Durres' },
  { id: 5, name: 'iPad Air', price: 59900, imageUrl: '/ipad-air.png', description: 'Apple tablet 64GB', retailer: 'iStore Albania', distance: 2.1, category: 'Tablets', inStock: true, location: 'Tirana' },
  { id: 6, name: 'Dell XPS 15', price: 149900, imageUrl: '/dell-laptop.png', description: 'Professional laptop i7', retailer: 'Tech Hub', distance: 5.3, originalPrice: 159900, category: 'Computers', inStock: true, location: 'Shkoder' },

  // 🍸 Bars in Tirana
  { id: 101, name: 'Radio Bar Tirana', price: 900, imageUrl: '/bars/radio-bar.jpg', description: 'Trendy cocktail bar in the heart of Tirana.', retailer: 'Radio Bar', distance: 0.8, category: 'Bars', inStock: true, location: 'Tirana' },
  { id: 102, name: 'Nouvelle Vague', price: 1000, imageUrl: '/bars/nouvelle-vague.jpg', description: 'Stylish lounge bar with great music and drinks.', retailer: 'Nouvelle Vague', distance: 1.2, category: 'Bars', inStock: true, location: 'Tirana' },
  { id: 103, name: 'Hemingway Bar', price: 850, imageUrl: '/bars/hemingway.jpg', description: 'Cozy bar inspired by classic cocktails and literature.', retailer: 'Hemingway Bar', distance: 1.6, category: 'Bars', inStock: true, location: 'Tirana' },
  { id: 104, name: 'Komiteti Bar', price: 700, imageUrl: '/bars/komiteti.jpg', description: 'Traditional Albanian raki and local drinks.', retailer: 'Komiteti', distance: 0.5, category: 'Bars', inStock: true, location: 'Tirana' },
]

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
    const sort = url.searchParams.get('sort') || 'relevance' // lowest, highest, distance, relevance

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

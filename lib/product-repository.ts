import type { Product } from "@/lib/types"
import { db } from "@/lib/db"

export type SortOption = "lowest" | "highest" | "distance" | "location" | "relevance"

type SearchOptions = {
  q?: string
  category?: string
  seller?: string
  marketSlug?: string
  location?: string
  sort?: SortOption
}

const baseSelect = `
  SELECT
    id,
    name,
    price,
    imageUrl,
    category,
    description,
    retailer,
    distance,
    originalPrice,
    inStock,
    location,
    market,
    marketSlug
  FROM products
`

function mapRow(row: any): Product {
  return {
    ...row,
    inStock: row.inStock === 1,
  }
}

function buildWhereClause(options: SearchOptions) {
  const conditions: string[] = []
  const params: Record<string, unknown> = {}

  if (options.q) {
    conditions.push(
      `(LOWER(name) LIKE @q OR LOWER(description) LIKE @q OR LOWER(retailer) LIKE @q OR LOWER(market) LIKE @q)`
    )
    params.q = `%${options.q.toLowerCase()}%`
  }

  if (options.category) {
    conditions.push(`LOWER(category) = @category`)
    params.category = options.category.toLowerCase()
  }

  if (options.seller) {
    conditions.push(`LOWER(retailer) LIKE @seller`)
    params.seller = `%${options.seller.toLowerCase()}%`
  }

  if (options.marketSlug) {
    conditions.push(`LOWER(marketSlug) = @marketSlug`)
    params.marketSlug = options.marketSlug.toLowerCase()
  }

  if (options.location) {
    conditions.push(`LOWER(location) = @location`)
    params.location = options.location.toLowerCase()
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""
  return { whereClause, params }
}

function buildOrderClause(sort: SortOption = "relevance") {
  switch (sort) {
    case "lowest":
      return "ORDER BY price ASC"
    case "highest":
      return "ORDER BY price DESC"
    case "distance":
      return "ORDER BY COALESCE(distance, 1e9) ASC, price ASC"
    case "location":
      return "ORDER BY location COLLATE NOCASE ASC, price ASC"
    case "relevance":
    default:
      return "ORDER BY name COLLATE NOCASE ASC"
  }
}

export function searchProducts(options: SearchOptions = {}): Product[] {
  const { whereClause, params } = buildWhereClause(options)
  const orderClause = buildOrderClause(options.sort)

  const stmt = db.prepare(`${baseSelect} ${whereClause} ${orderClause}`)
  const rows = stmt.all(params)
  return rows.map(mapRow)
}

export function getProductsByCategory(category: string, sort: SortOption = "lowest"): Product[] {
  return searchProducts({ category, sort })
}

export function getProductsByMarketSlug(marketSlug: string, sort: SortOption = "lowest"): Product[] {
  return searchProducts({ marketSlug, sort })
}

export function getAllProducts(sort: SortOption = "lowest"): Product[] {
  return searchProducts({ sort })
}

export function getDistinctLocations(): string[] {
  const rows = db.prepare("SELECT DISTINCT location FROM products WHERE location IS NOT NULL").all()
  return rows
    .map((row: any) => row.location as string)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
}

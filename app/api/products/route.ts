import { NextResponse } from "next/server"

export const runtime = "nodejs"

const SORTS = ["lowest", "highest", "distance", "location", "relevance"] as const
type SortOption = (typeof SORTS)[number]

function toSortOption(v: string | null): SortOption {
  if (!v) return "lowest"
  const lower = v.toLowerCase()
  return (SORTS as readonly string[]).includes(lower) ? (lower as SortOption) : "lowest"
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const category = url.searchParams.get("category") || ""
  const marketSlug = url.searchParams.get("marketSlug") || ""
  const location = url.searchParams.get("location") || ""
  const sort = toSortOption(url.searchParams.get("sort"))

  try {
    // Lazy-load SQLite-backed repository to avoid build-time native binding evaluation.
    const { getProductsByCategory, getProductsByMarketSlug, searchProducts } = await import(
      "@/lib/product-repository"
    )

    if (category) {
      const products = getProductsByCategory(category, sort)
      return NextResponse.json({ products }, { status: 200 })
    }

    if (marketSlug) {
      const products = getProductsByMarketSlug(marketSlug, sort)
      return NextResponse.json({ products }, { status: 200 })
    }

    const products = searchProducts({ location, sort })
    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Unable to load products" }, { status: 500 })
  }
}

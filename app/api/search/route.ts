import { NextResponse } from "next/server"

export const runtime = "nodejs"

const SORTS = ["lowest", "highest", "distance", "location", "relevance"] as const
type SortOption = (typeof SORTS)[number]

function toSortOption(v: string | null): SortOption {
  if (!v) return "relevance"
  const lower = v.toLowerCase()
  return (SORTS as readonly string[]).includes(lower) ? (lower as SortOption) : "relevance"
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const q = (url.searchParams.get("q") || "").trim()
    const category = url.searchParams.get("category") || ""
    const seller = url.searchParams.get("seller") || ""
    const location = url.searchParams.get("location") || ""
    const marketSlug = url.searchParams.get("marketSlug") || url.searchParams.get("market") || ""
    const sort = toSortOption(url.searchParams.get("sort"))

    // Lazy-load SQLite-backed repository to avoid build-time native binding evaluation.
    const { searchProducts } = await import("@/lib/product-repository")
    const results = searchProducts({
      q,
      category,
      seller,
      location,
      marketSlug,
      sort,
    })

    return NextResponse.json({ results }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

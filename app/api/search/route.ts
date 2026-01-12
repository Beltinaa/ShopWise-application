import { NextResponse } from "next/server"

import { searchProducts, type SortOption } from "@/lib/product-repository"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const q = (url.searchParams.get("q") || "").trim()
    const category = url.searchParams.get("category") || ""
    const seller = url.searchParams.get("seller") || ""
    const location = url.searchParams.get("location") || ""
    const marketSlug = url.searchParams.get("marketSlug") || url.searchParams.get("market") || ""
    const sort = (url.searchParams.get("sort") || "relevance") as SortOption

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

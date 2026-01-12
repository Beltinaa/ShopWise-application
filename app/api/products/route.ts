"use server";

import { NextResponse } from "next/server"

import {
  getProductsByCategory,
  getProductsByMarketSlug,
  searchProducts,
  type SortOption,
} from "@/lib/product-repository"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const category = url.searchParams.get("category") || ""
  const marketSlug = url.searchParams.get("marketSlug") || ""
  const location = url.searchParams.get("location") || ""
  const sort = (url.searchParams.get("sort") || "lowest") as SortOption

  try {
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

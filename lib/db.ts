import Database from "better-sqlite3"
import fs from "fs"
import path from "path"

import { seedProducts } from "@/lib/products"
import type { Product } from "@/lib/types"

// Use /tmp in Vercel (writable), otherwise local data dir for dev.
const runtimeDir = process.env.VERCEL ? "/tmp/shopwise" : path.join(process.cwd(), "data")
const dbPath = path.join(runtimeDir, "shopwise.db")

// Ensure database directory exists
fs.mkdirSync(runtimeDir, { recursive: true })

// Single SQLite connection for the app
const db = new Database(dbPath)
db.pragma("journal_mode = WAL")

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    imageUrl TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    retailer TEXT,
    distance REAL,
    originalPrice REAL,
    inStock INTEGER,
    location TEXT,
    market TEXT,
    marketSlug TEXT
  )
`)

const countRow = db.prepare("SELECT COUNT(1) as count FROM products").get() as {
  count: number
}

if (countRow.count === 0) {
  const insert = db.prepare(`
    INSERT INTO products (
      id, name, price, imageUrl, category, description, retailer, distance,
      originalPrice, inStock, location, market, marketSlug
    ) VALUES (
      @id, @name, @price, @imageUrl, @category, @description, @retailer,
      @distance, @originalPrice, @inStock, @location, @market, @marketSlug
    )
  `)

  const insertMany = db.transaction((rows: Product[]) => {
    for (const row of rows) {
      insert.run({
        id: row.id,
        name: row.name,
        price: row.price,
        imageUrl: row.imageUrl,
        category: row.category,
        description: row.description ?? null,
        retailer: row.retailer ?? null,
        distance: row.distance ?? null,
        originalPrice: row.originalPrice ?? null,
        inStock: row.inStock ? 1 : 0,
        location: row.location ?? null,
        market: row.market ?? null,
        marketSlug: row.marketSlug ?? null,
      })
    }
  })

  insertMany(seedProducts)
}

export { db, dbPath }

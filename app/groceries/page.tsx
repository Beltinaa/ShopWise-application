// pages/groceries.tsx
import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"
import React from "react"

interface Market {
    name: string
    link: string
    desc: string
    image: string
    nearby: number
}

const markets: Market[] = [
    { name: "Big Market", link: "/groceries/big-market", desc: "All kinds of groceries", image: "/images/BigMarket.jpeg", nearby: 5 },
    { name: "Spar", link: "/groceries/spar", desc: "International supermarket chain", image: "/images/Spar.jpeg", nearby: 3 },
    { name: "Conad", link: "/groceries/conad", desc: "Italian supermarket chain", image: "/images/Conad.jpeg", nearby: 4 },
    { name: "AlbMarket", link: "/groceries/albmarket", desc: "Local Albanian supermarket", image: "/images/AlbMarket.jpeg", nearby: 2 },
    { name: "ProNatyra", link: "/groceries/pronatyra", desc: "Organic & fresh products", image: "/images/ProNatyra.jpeg", nearby: 3 },
    { name: "Well", link: "/groceries/well", desc: "Health & wellness products", image: "/images/Well.jpeg", nearby: 1 },
    { name: "Rossman", link: "/groceries/rossman", desc: "Personal care & groceries", image: "/images/Rossman.jpeg", nearby: 2 },
]

export default function GroceriesPage() {
    return (
        <div className="min-h-screen bg-background px-4 py-12 container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Groceries</h1>
            <p className="text-muted-foreground mb-8">
                Choose a market to see the products available:
            </p>

            {/* GRID ME KARTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {markets.map((market) => (
                    <Link
                        key={market.name}
                        href={market.link}
                        className="relative group rounded-2xl overflow-hidden border bg-card hover:shadow-lg transition"
                    >
                        {/* FOTO QE ZEN TE GJITH HAPSIREN */}
                        <Image
                            src={market.image}
                            alt={market.name}
                            width={400}
                            height={300}
                            className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* OVERLAY GRADIENT ME TEKST */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col justify-end p-4">
                            <h3 className="text-xl font-bold text-white">{market.name}</h3>
                            <p className="text-sm text-white/90">{market.desc}</p>

                            {/* IKONA E LOKACIONIT + NUMRI I MARKEVE */}
                            <div className="mt-2 flex items-center gap-2 text-white text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>{market.nearby} markets near You</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

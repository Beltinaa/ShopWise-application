// pages/restaurants/page.tsx
'use client'

import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"
import React from "react"

interface Restaurant {
    name: string
    link: string
    desc: string
    image: string
    nearby: number
}

const restaurants: Restaurant[] = [
    { name: "Bati", link: "/restaurants/bati", desc: "Cozy spot for local cuisine", image: "/images/Bati.jpeg", nearby: 3 },
    { name: "Kapelet", link: "/restaurants/kapelet", desc: "Trendy restaurant with cocktails", image: "/images/Kapelet.jpeg", nearby: 1 },
    { name: "Kazerma e Cerenit", link: "/restaurants/kazerma-e-cerenit", desc: "Historic restaurant with a unique vibe", image: "/images/Kazerma.jpeg", nearby: 4 },
    { name: "2 Luanet", link: "/restaurants/2-luanet", desc: "Casual dining and drinks", image: "/images/2Luanet.jpeg", nearby: 1 },
    { name: "Illuminatium", link: "/restaurants/illuminatium", desc: "Modern and elegant restaurant", image: "/images/Illuminatium.jpeg", nearby: 1 },
    { name: "Fish Time", link: "/restaurants/fish-time", desc: "Seafood specialties", image: "/images/FishTime.jpeg", nearby: 5 },
    { name: "Era Restaurants&Pizzeria", link: "/restaurants/era", desc: "Pizza and international dishes", image: "/images/Era.jpeg", nearby: 3 },
    { name: "Mystic", link: "/restaurants/mystic", desc: "Chic place for dinner & drinks", image: "/images/Mystic.jpeg", nearby: 2 },
]

export default function RestaurantsPage() {
    return (
        <div className="min-h-screen bg-background px-4 py-12 container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Restaurants in Tirana</h1>
            <p className="text-muted-foreground mb-8">
                Discover the best restaurants in town:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                    <Link
                        key={restaurant.name}
                        href={restaurant.link}
                        className="relative group rounded-2xl overflow-hidden border bg-card hover:shadow-lg transition"
                    >
                        <Image
                            src={restaurant.image}
                            alt={restaurant.name}
                            width={400}
                            height={300}
                            className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col justify-end p-4">
                            <h3 className="text-xl font-bold text-white">{restaurant.name}</h3>
                            <p className="text-sm text-white/90">{restaurant.desc}</p>
                            <div className="mt-2 flex items-center gap-2 text-white text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>{restaurant.nearby} locations near you</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

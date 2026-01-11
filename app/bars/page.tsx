// pages/bars/page.tsx
import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"
import React from "react"

interface Bar {
    name: string
    link: string
    desc: string
    image: string
    nearby: number
}

const bars: Bar[] = [
    { name: "Komiteti", link: "/bars/komiteti", desc: "Cozy place with local drinks", image: "/images/Komiteti.jpeg", nearby: 2 },
    { name: "Colonial", link: "/bars/colonial", desc: "Trendy bar with cocktails", image: "/images/Colonial.jpeg", nearby: 1 },
    { name: "Mugo", link: "/bars/mugo", desc: "Modern bar with live music", image: "/images/Mugo.jpeg", nearby: 1 },
    { name: "SkyTower", link: "/bars/skytower", desc: "Rooftop bar with city view", image: "/images/SkyTower.jpeg", nearby: 1 },
    { name: "Mulliri", link: "/bars/mulliri", desc: "Casual drinks and snacks", image: "/images/Mulliri.jpeg", nearby: 23 },
    { name: "Mon Cheri", link: "/bars/moncheri", desc: "Romantic atmosphere", image: "/images/Moncheri.jpeg", nearby: 17 },
    { name: "Sophie Caffe", link: "/bars/sophie-caffe", desc: "Coffee & cocktails", image: "/images/Sophie.jpeg", nearby: 11 },
    { name: "Kino", link: "/bars/kino", desc: "Bar with cinema vibes", image: "/images/Kino.jpeg", nearby: 1 },
]

export default function BarsPage() {
    return (
        <div className="min-h-screen bg-background px-4 py-12 container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Bars in Tirana</h1>
            <p className="text-muted-foreground mb-8">
                Discover the best bars in town:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {bars.map((bar) => (
                    <Link
                        key={bar.name}
                        href={bar.link}
                        className="relative group rounded-2xl overflow-hidden border bg-card hover:shadow-lg transition"
                    >
                        <Image
                            src={bar.image}
                            alt={bar.name}
                            width={400}
                            height={300}
                            className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col justify-end p-4">
                            <h3 className="text-xl font-bold text-white">{bar.name}</h3>
                            <p className="text-sm text-white/90">{bar.desc}</p>
                            <div className="mt-2 flex items-center gap-2 text-white text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>{bar.nearby} locations near you</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

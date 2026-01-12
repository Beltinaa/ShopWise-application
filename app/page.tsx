import Link from "next/link"
import Image from "next/image"
import { SearchBar } from "@/components/search-bar"
import { FeaturedProducts } from "@/components/featured-products"
import { ShoppingCart, Heart, MapPin } from "lucide-react"

export default function HomePage() {
    const categories = [
        {
            name: "Groceries",
            image: "/images/groceries.jpeg",
            desc: "Supermarkets & food stores",
            link: "/groceries",
            bg: "from-green-200 to-green-400",
        },
        {
            name: "Bars",
            image: "/images/bars.jpeg",
            desc: "Drink & hang out near you",
            link: "/bars",
            bg: "from-pink-200 to-pink-400",
        },
        {
            name: "Restaurants",
            image: "/images/restaurants.jpeg",
            desc: "Dine at the best places",
            link: "/restaurants",
            bg: "from-yellow-200 to-yellow-400",
        },
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* HEADER */}
            <header className="border-b bg-card sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">S</span>
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">ShopWise</h1>
                        </Link>

                        <nav className="flex items-center gap-6">
                            <Link href="/" className="text-foreground hover:text-primary font-medium">
                                Home
                            </Link>

                            <Link href="/wishlist" className="flex items-center gap-2 hover:text-primary">
                                <Heart className="w-5 h-5" />
                                <span className="hidden sm:inline">Wishlist</span>
                            </Link>

                            <Link href="/cart" className="flex items-center gap-2 hover:text-primary">
                                <ShoppingCart className="w-5 h-5" />
                                <span className="hidden sm:inline">Cart</span>
                            </Link>

                            <Link
                                href="/login"
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
                            >
                                Login
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main>
                {/* SEARCH */}
                <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
                    <div className="container mx-auto px-4 text-center space-y-6 max-w-3xl">
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Find the Best Prices Instantly
                        </h2>

                        <p className="text-lg text-muted-foreground">
                            Compare prices from local Albanian markets and save money on every purchase
                        </p>

                        <SearchBar />

                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>Showing results near Tirana, Albania</span>
                        </div>
                    </div>
                </section>

                {/* CATEGORIES */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {categories.map((cat) => (
                                <Link key={cat.name} href={cat.link} className="relative group rounded-2xl overflow-hidden">
                                    {/* FOTO */}
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {/* OVERLAY ME GRADIENT */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col justify-end p-6">
                                        <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
                                        <p className="text-sm text-white/90">{cat.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <FeaturedProducts />
            </main>

            {/* FOOTER */}
            <footer className="bg-card border-t mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-bold mb-3">ShopWise</h3><p className="text-sm text-muted-foreground">
                            Save money by comparing prices across Albanian markets
                        </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-3">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/about">About Us</Link></li>
                                <li><Link href="/markets">Markets</Link></li>
                                <li><Link href="/contact">Contact</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-3">Support</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/help">Help Center</Link></li>
                                <li><Link href="/privacy">Privacy Policy</Link></li>
                                <li><Link href="/terms">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
                        © 2025 ShopWise. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}

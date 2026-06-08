"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(8));
        const snapshot = await getDocs(q);
        const products: Product[] = [];
        snapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() } as Product);
        });
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching featured products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] md:h-[85vh] bg-zafira-slate flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-b from-black/40 to-black/60 absolute inset-0 z-10" />
          {/* Placeholder for actual hero image */}
          <div className="w-full h-full bg-zafira-slate flex items-center justify-center text-zafira-white/10 text-9xl font-serif">
            Z
          </div>
        </div>
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-sm md:text-base tracking-[0.3em] uppercase text-zafira-gold mb-6">
            The New Standard of Luxury
          </h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-zafira-white mb-8 leading-tight">
            Elegance Defined.
          </h1>
          <Link
            href="/category/womens"
            className="px-8 py-4 bg-zafira-white text-zafira-slate uppercase tracking-widest text-sm hover:bg-zafira-gold hover:text-white transition-colors duration-300"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-20 md:py-32 px-4 md:px-8 container mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-serif text-zafira-slate mb-4">New Arrivals</h3>
          <div className="w-12 h-0.5 bg-zafira-gold" />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-zafira-slate/10 aspect-[4/5] mb-4" />
                <div className="h-4 bg-zafira-slate/10 w-3/4 mb-2" />
                <div className="h-4 bg-zafira-slate/10 w-1/4" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-zafira-slate/50">
            No products available at the moment.
          </div>
        )}
      </section>
    </div>
  );
}

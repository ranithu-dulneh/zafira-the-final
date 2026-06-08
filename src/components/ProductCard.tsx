"use client";

import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const defaultImage = product.images?.[0] || "/placeholder-jewelry.jpg";

  return (
    <Link href={`/product/${product.id}`} className="group flex flex-col">
      <div className="relative aspect-[4/5] bg-zafira-cream overflow-hidden border border-zafira-slate/5 mb-4">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-zafira-slate/5 flex items-center justify-center">
            <span className="text-zafira-slate/30 text-sm uppercase tracking-widest">No Image</span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-medium text-zafira-slate uppercase tracking-wide mb-1 group-hover:text-zafira-gold transition-colors line-clamp-1">
          {product.title}
        </h3>
        <div className="flex items-center space-x-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.round(product.ratingsAverage || 0)
                  ? "fill-zafira-gold text-zafira-gold"
                  : "text-zafira-slate/20"
              }`}
            />
          ))}
          <span className="text-xs text-zafira-slate/50 ml-1">
            ({product.ratingsAverage || 0})
          </span>
        </div>
        <p className="text-zafira-slate font-serif mt-auto">
          LKR {product.basePrice.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { useSearchParams } from "next/navigation";

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const subCategory = searchParams.get("sub");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q = query(
          collection(db, "products"),
          where("primaryCategory", "==", params.category)
        );

        if (subCategory) {
          q = query(q, where("subCategory", "==", subCategory));
        }

        const snapshot = await getDocs(q);
        const fetchedProducts: Product[] = [];
        snapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [params.category, subCategory]);

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-serif text-zafira-slate uppercase tracking-wide mb-4">
          {params.category} {subCategory ? `- ${subCategory}` : ""}
        </h1>
        <div className="w-16 h-0.5 bg-zafira-gold" />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-zafira-slate/10 aspect-[4/5] mb-4" />
              <div className="h-4 bg-zafira-slate/10 w-3/4 mb-2" />
              <div className="h-4 bg-zafira-slate/10 w-1/4" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-zafira-slate/50 py-20">
          No products found in this category.
        </div>
      )}
    </div>
  );
}

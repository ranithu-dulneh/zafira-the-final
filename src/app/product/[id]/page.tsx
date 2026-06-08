"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, Review } from "@/types";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Star, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("description");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const docRef = doc(db, "products", params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }

        const reviewsQuery = query(
          collection(db, "reviews"),
          where("productId", "==", params.id),
          where("isApproved", "==", true)
        );
        const reviewsSnap = await getDocs(reviewsQuery);
        const fetchedReviews: Review[] = [];
        reviewsSnap.forEach((rDoc) => {
          fetchedReviews.push({ id: rDoc.id, ...rDoc.data() } as Review);
        });
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndReviews();
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.basePrice,
      quantity: 1,
      imageUrl: product.images?.[0],
    });
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-16">
      <div className="flex flex-col md:flex-row md:space-x-12 lg:space-x-24">
        {/* Media Gallery (Left) */}
        <div className="md:w-1/2 flex flex-col-reverse md:flex-row mb-8 md:mb-0">
          {/* Thumbnails */}
          <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-4 mt-4 md:mt-0 md:mr-4 overflow-x-auto md:overflow-visible py-2 md:py-0">
            {product.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={cn(
                  "relative w-20 h-24 flex-shrink-0 border transition-colors",
                  activeImageIndex === idx ? "border-zafira-gold" : "border-transparent"
                )}
              >
                <Image src={img} alt={`${product.title} ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
          {/* Main Image */}
          <div className="relative aspect-[4/5] flex-1 bg-zafira-cream">
            {product.images?.[activeImageIndex] ? (
              <Image
                src={product.images[activeImageIndex]}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zafira-slate/30">No Image</div>
            )}
          </div>
        </div>

        {/* Product Info (Right) */}
        <div className="md:w-1/2 flex flex-col pt-4 md:pt-10">
          <h1 className="text-2xl md:text-4xl font-serif text-zafira-slate uppercase tracking-wide mb-4">
            {product.title}
          </h1>

          <div className="flex items-center space-x-2 mb-6">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(product.ratingsAverage || 0)
                      ? "fill-zafira-gold text-zafira-gold"
                      : "text-zafira-slate/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-zafira-slate/60">
              ({reviews.length} reviews)
            </span>
          </div>

          <p className="text-2xl font-serif text-zafira-slate mb-8">
            LKR {product.basePrice.toLocaleString()}
          </p>

          <div className="flex items-center space-x-2 mb-8 text-sm">
            {product.stockCount > 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium">In Stock</span>
              </>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Sticky Mobile Add to Cart & Desktop Add to Cart */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-zafira-slate/10 z-40 md:relative md:p-0 md:bg-transparent md:border-none md:mb-12">
            <button
              onClick={handleAddToCart}
              disabled={product.stockCount <= 0}
              className={cn(
                "w-full py-4 text-sm tracking-widest uppercase transition-colors",
                product.stockCount > 0
                  ? "bg-zafira-slate text-white hover:bg-zafira-gold"
                  : "bg-zafira-slate/20 text-zafira-slate/50 cursor-not-allowed"
              )}
            >
              {product.stockCount > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          {/* Accordions */}
          <div className="border-t border-zafira-slate/10 divide-y divide-zafira-slate/10">
            <div className="py-4">
              <button
                onClick={() => toggleAccordion("description")}
                className="flex items-center justify-between w-full text-left font-medium text-sm tracking-widest uppercase text-zafira-slate"
              >
                Product Description
                {activeAccordion === "description" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {activeAccordion === "description" && (
                <div className="mt-4 text-sm text-zafira-slate/70 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              )}
            </div>
            <div className="py-4">
              <button
                onClick={() => toggleAccordion("material")}
                className="flex items-center justify-between w-full text-left font-medium text-sm tracking-widest uppercase text-zafira-slate"
              >
                Material & Care
                {activeAccordion === "material" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {activeAccordion === "material" && (
                <div className="mt-4 text-sm text-zafira-slate/70 leading-relaxed">
                  Crafted with premium materials designed for longevity. To maintain the brilliance of your Zafira jewelry, avoid prolonged exposure to water, perfumes, and harsh chemicals. Store in the provided pouch when not in use.
                </div>
              )}
            </div>
            <div className="py-4">
              <button
                onClick={() => toggleAccordion("shipping")}
                className="flex items-center justify-between w-full text-left font-medium text-sm tracking-widest uppercase text-zafira-slate"
              >
                Shipping & Returns
                {activeAccordion === "shipping" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {activeAccordion === "shipping" && (
                <div className="mt-4 text-sm text-zafira-slate/70 leading-relaxed">
                  We offer nationwide delivery. Standard shipping takes 3-5 business days. Free returns are available within 14 days of purchase for items in unworn condition with original tags.
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          {reviews.length > 0 && (
             <div className="mt-12 pt-8 border-t border-zafira-slate/10">
                <h3 className="text-xl font-serif text-zafira-slate uppercase mb-6">Customer Reviews</h3>
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-zafira-cream p-4 rounded-sm">
                       <div className="flex items-center space-x-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? "fill-zafira-gold text-zafira-gold"
                                : "text-zafira-slate/20"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-medium mb-1">{review.customerName}</p>
                      <p className="text-sm text-zafira-slate/70">{review.comment}</p>
                    </div>
                  ))}
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
